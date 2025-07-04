import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full border border-gray-200 bg-white p-0">
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden m-0">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <Skeleton className="h-6 w-24" />

        <Skeleton className="h-5 w-20 rounded-full" />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
