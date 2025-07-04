"use client";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useListings } from "@/hooks/use-listngs";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Share2,
  Shield,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

// Mock data - replace with actual API call

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

export default function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading } = useListings();
  if (isLoading) return <Loader />;

  const listing = data.find(
    (l: { id: number }) => l.id === Number.parseInt(id)
  );

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Listing not found
            </h1>
            <p className="text-gray-600 mb-6">
              The listing you`&apos;`re looking for doesn`&apos;`t exist or has
              been removed.
            </p>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to marketplace
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Marketplace
          </Link>
          <span>/</span>
          <span className="capitalize">{listing.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {listing.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={
                    listing.image_url ?? "/placeholder.svg?height=600&width=800"
                  }
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {!listing.image_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Tag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Item Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium capitalize">
                        {listing.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{listing.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-medium">
                        {timeAgo(listing.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">Used - Good</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-green-600">
                      ${listing.price.toLocaleString()}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-0 font-medium capitalize"
                    >
                      {listing.category}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-600" />
                    Contact Seller
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{listing.seller_email}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => {
                      const subject = `Inquiry about: ${listing.title}`;
                      const body = `Hi,

I'm interested in your listing "${
                        listing.title
                      }" posted for $${listing.price.toLocaleString()}.

Could you please provide more details about the item?

Thank you!`;

                      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
                        listing.seller_email
                      )}&su=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(body)}`;
                      window.open(gmailUrl, "_blank");
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>

                {/* Safety Tips */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">
                        Safety Tips
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Meet in a public place</li>
                        <li>• Inspect item before payment</li>
                        <li>• Use secure payment methods</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
