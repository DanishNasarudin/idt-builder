import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        <img
          loading="lazy"
          src={image}
          alt="Preview"
          className="w-full h-auto cursor-pointer rounded-lg border-transparent border-2 hover:border-white/60 transition-all duration-300 ease-in-out"
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
