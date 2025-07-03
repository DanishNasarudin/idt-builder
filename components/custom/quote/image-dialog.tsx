import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";

import Link from "next/link";

export default function ImageDialog({
  image,
  invoice,
}: {
  image: string;
  invoice: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          data-loaded="false"
          onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "true")}
          src={image || ""}
          alt={`${invoice}`}
          width={322}
          height={215}
          className={cn(
            "data-[loaded=false]:bg-foreground/30 data-[loaded=false]:animate-pulse w-full h-auto object-cover rounded-lg border-transparent hover:border-foreground/60 border-[1px] transition-all cursor-pointer"
          )}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Example Build</DialogTitle>
          <DialogDescription>
            Disclaimer: This might not be 100% of the final look of your build.
          </DialogDescription>
          <Link
            href={invoice}
            target="_blank"
            className="text-sm text-accent hover:text-accent/60 transition-all underline"
          >
            View Specs
          </Link>
          <img src={image} alt="Preview" className="rounded-md" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
