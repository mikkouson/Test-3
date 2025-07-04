"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ListingCard } from "./listings-card";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  seller_email: string;
  image_url: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface ListingsGridProps {
  data?: Listing[];
}

export function ListingsGrid({ data = [] }: ListingsGridProps) {
  const searchParams = useSearchParams();

  const filteredAndSortedListings = useMemo(() => {
    // Get filters from URL params
    const search = searchParams.get("search") || "";
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "2000");
    const categoriesParam = searchParams.get("categories");
    const categories = categoriesParam
      ? categoriesParam.split(",").filter(Boolean)
      : [];
    const sortBy = searchParams.get("sortBy") || "recent";

    const filtered = data.filter((listing) => {
      // Search filter
      if (
        search &&
        !listing.title.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (listing.price < minPrice || listing.price > maxPrice) {
        return false;
      }

      // Category filter
      if (categories.length > 0 && !categories.includes(listing.category)) {
        return false;
      }

      return true;
    });

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "recent":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return filtered;
  }, [searchParams, data]);

  if (filteredAndSortedListings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No listings found matching your criteria.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          {filteredAndSortedListings.length}{" "}
          {filteredAndSortedListings.length === 1 ? "item" : "items"} found
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
