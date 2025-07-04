"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
const categories = [
  "electronics",
  "vehicles",
  "home & garden",
  "clothing & accessories",
  "sports & recreation",
  "books & media",
  "toys & games",
  "furniture",
];

export interface FilterState {
  search: string;
  priceRange: [number, number];
  categories: string[];
  sortBy: string;
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filters from URL params
  const getCurrentFilters = useCallback((): FilterState => {
    const search = searchParams.get("search") || "";
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "2000");
    const categoriesParam = searchParams.get("categories");
    const categories =
      categoriesParam && categoriesParam.trim()
        ? categoriesParam.split(",").filter(Boolean)
        : [];
    const sortBy = searchParams.get("sortBy") || "recent";

    return {
      search,
      priceRange: [minPrice, maxPrice],
      categories,
      sortBy,
    };
  }, [searchParams]);

  const currentFilters = getCurrentFilters();

  // Local state for price range with immediate updates
  const [priceRange, setPriceRange] = useState<[number, number]>(
    currentFilters.priceRange
  );

  // Debounce only the price range for URL updates
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Initialize local state from URL on mount and when URL changes externally
  useEffect(() => {
    setPriceRange(currentFilters.priceRange);
  }, [currentFilters.priceRange[0], currentFilters.priceRange[1]]);

  // Update URL when debounced price range changes
  useEffect(() => {
    // Only update if the debounced value is different from current URL
    if (
      debouncedPriceRange[0] !== currentFilters.priceRange[0] ||
      debouncedPriceRange[1] !== currentFilters.priceRange[1]
    ) {
      updateFiltersWithPriceRange(debouncedPriceRange);
    }
  }, [debouncedPriceRange]);

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const current = getCurrentFilters();
      const updated = { ...current, ...newFilters };

      const params = new URLSearchParams();

      if (updated.search) params.set("search", updated.search);
      if (updated.priceRange[0] > 0)
        params.set("minPrice", updated.priceRange[0].toString());
      if (updated.priceRange[1] < 2000)
        params.set("maxPrice", updated.priceRange[1].toString());
      if (updated.categories.length > 0)
        params.set("categories", updated.categories.join(","));
      if (updated.sortBy !== "recent") params.set("sortBy", updated.sortBy);

      const queryString = params.toString();
      const newUrl = queryString ? `/?${queryString}` : "/";

      router.replace(newUrl, { scroll: false });
    },
    [getCurrentFilters, router]
  );

  // Separate function for price range updates to avoid conflicts
  const updateFiltersWithPriceRange = useCallback(
    (newPriceRange: [number, number]) => {
      const current = getCurrentFilters();
      const updated = { ...current, priceRange: newPriceRange };

      const params = new URLSearchParams();

      if (updated.search) params.set("search", updated.search);
      if (updated.priceRange[0] > 0)
        params.set("minPrice", updated.priceRange[0].toString());
      if (updated.priceRange[1] < 2000)
        params.set("maxPrice", updated.priceRange[1].toString());
      if (updated.categories.length > 0)
        params.set("categories", updated.categories.join(","));
      if (updated.sortBy !== "recent") params.set("sortBy", updated.sortBy);

      const queryString = params.toString();
      const newUrl = queryString ? `/?${queryString}` : "/";

      router.replace(newUrl, { scroll: false });
    },
    [getCurrentFilters, router]
  );

  const handleSearchChange = (search: string) => {
    updateFilters({ search });
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newRange = value as [number, number];
    setPriceRange(newRange);
    // URL update will happen via debounced effect
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...currentFilters.categories, category]
      : currentFilters.categories.filter((c) => c !== category);

    updateFilters({ categories: newCategories });
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy });
  };

  const clearAllFilters = () => {
    setPriceRange([0, 2000]);
    router.push("/", { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search Marketplace"
              className="pl-10"
              value={currentFilters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={2000}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min" value={priceRange[0]} readOnly />
            <Input placeholder="Max" value={priceRange[1]} readOnly />
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={currentFilters.categories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal capitalize"
              >
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sort By */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select
            value={currentFilters.sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
