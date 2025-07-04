"use client";

import { CreateListingButton } from "@/components/create-listing-button";
import { ListingsGrid } from "@/components/listings-grid";
import Loader from "@/components/Loader";
import { SearchFilters } from "@/components/search-filters";
import { useListings } from "@/hooks/use-listngs";
import { Suspense } from "react";

function HomePageContent() {
  const { data, isLoading } = useListings();
  if (isLoading) return <Loader />;
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-6">
            <SearchFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground">Browse items for sale</p>
            </div>
            <CreateListingButton />
          </div>

          <ListingsGrid data={data} />
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
