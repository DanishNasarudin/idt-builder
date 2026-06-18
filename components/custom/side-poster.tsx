import { cn } from "@/lib/utils";
import Image from "next/image";

export type SidePoster = {
  imageSrc: string;
  alt?: string;
};

type Props = {
  poster: SidePoster;
  className?: string;
};

export default function SidePosterComponent({ poster, className }: Props) {
  return (
    <aside
      className={cn("h-full w-full shrink-0", className)}
      aria-label="Poster"
    >
    <div className="relative h-full w-full overflow-hidden rounded-md bg-zinc-900 shadow-sm">
      <Image
        src={poster.imageSrc}
        alt={poster.alt ?? "Poster"}
        fill
        sizes="(max-width: 768px) 100vw, 200px"
        className="object-cover"
      />
    </div>
    </aside>
  );
}