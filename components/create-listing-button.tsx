import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateListingButton() {
  return (
    <Link href="/create">
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        Create Listing
      </Button>
    </Link>
  );
}
