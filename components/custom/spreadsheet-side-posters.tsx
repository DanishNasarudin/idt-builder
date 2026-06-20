import SidePosterComponent, { type SidePoster } from "./side-poster";

type Props = {
  children: React.ReactNode;
};

export default function SpreadsheetSidePosters({ children }: Props) {
  const sidePostersConfig: { left: SidePoster[]; right: SidePoster[] } = {
  left: [
    { imageSrc: "/poster/WebBanner_600x1600_Antec.webp", alt: "Antec" },
    { imageSrc: "/poster/WebBanner_600x1600_Jonsbo.webp", alt: "Jonsbo" },
  ],
  right: [
    { imageSrc: "/poster/WebBanner_600x1600_Corsair.webp", alt: "Corsair" },
    { imageSrc: "/poster/WebBanner_600x1600_Samsung.webp", alt: "Samsung" },
  ],
};

  return (
    <div className="relative 3xl:min-h-[1632px]">
      <div className="absolute top-0 -left-[380px] hidden flex-col gap-8 3xl:flex">
        {sidePostersConfig.left.map((poster, i) => (
          <div key={i} className="h-[800px] w-[300px]">
            <SidePosterComponent poster={poster} />
          </div>
        ))}
      </div>
      <div className="absolute top-0 -right-[380px] hidden flex-col gap-8 3xl:flex">
        {sidePostersConfig.right.map((poster, i) => (
          <div key={i} className="h-[800px] w-[300px]">
            <SidePosterComponent poster={poster} />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
