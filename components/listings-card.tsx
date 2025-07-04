import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now.getTime() - posted.getTime());

    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? "1 min ago" : `${diffMinutes} mins ago`;
    }
    if (diffHours < 24) {
      return diffHours === 1 ? "1 hr ago" : `${diffHours} hrs ago`;
    }
    if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }
    if (diffWeeks < 4) {
      return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
    }
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  };

  return (
    <Link href={`/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-full border border-gray-200 bg-white group p-0">
        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden m-0">
          <Image
            src={listing.image_url ?? "/placeholder.svg?height=300&width=400"}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-tight group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          <p className="text-xl font-bold text-gray-900">
            ${listing.price.toLocaleString()}
          </p>

          <Badge
            variant="secondary"
            className="text-xs w-fit bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 font-medium capitalize"
          >
            {listing.category}
          </Badge>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
