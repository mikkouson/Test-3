import { ListingCardSkeleton } from "./card-skeleton";

interface ListingGridSkeletonProps {
  count?: number;
}

export function ListingGridSkeleton({ count = 8 }: ListingGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
}
