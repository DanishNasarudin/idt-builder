import { cn } from "@/lib/utils";

export type SidePoster = {
  imageSrc: string;
  alt?: string;
};

export const sidePostersConfig: { left: SidePoster[]; right: SidePoster[] } = {
  left: [
    { imageSrc: "../poster/WebBanner_600x1600_Antec.webp", alt: "Antec" },
    { imageSrc: "../poster/WebBanner_600x1600_Jonsbo.webp", alt: "Jonsbo" },
  ],
  right: [
    { imageSrc: "../poster/WebBanner_600x1600_Corsair.webp", alt: "Corsair" },
    { imageSrc: "../poster/WebBanner_600x1600_Samsung.webp", alt: "Samsung" },
  ],
};

type Props = {
  poster: SidePoster;
  className?: string;
};

export default function SidePosterComponent({ poster, className }: Props) {
  const content = (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-zinc-900 shadow-sm">
      <img
        src={poster.imageSrc}
        alt={poster.alt ?? "Poster"}
        className="h-full w-full object-cover"
      />
    </div>
  );

  return (
    <aside
      className={cn("h-full w-full shrink-0", className)}
      aria-label="Poster"
    >
      {poster.imageSrc ? (
        <a href={poster.imageSrc} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
          {content}
        </a>
      ) : (
        content
      )}
    </aside>
  );
}