"use client";

import { useState, useEffect, useRef } from "react";
import SidePosterComponent, { type SidePoster } from "./side-poster";

type Props = {
  left: SidePoster[];
  right: SidePoster[];
  children: React.ReactNode;
};

export default function SpreadsheetSidePosters({ left, right, children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [minHeight, setMinHeight] = useState(0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const calculate = () => {
      const leftHeight = leftRef.current?.scrollHeight ?? 0;
      const rightHeight = rightRef.current?.scrollHeight ?? 0;
      const childHeight = childRef.current?.scrollHeight ?? 0;
      const tallestPoster = Math.max(leftHeight, rightHeight);
      setMinHeight(Math.max(tallestPoster, childHeight));
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [mounted]);

  return (
    <div className="relative" style={{ minHeight }}>
      {mounted && (
        <>
          <div ref={leftRef} className="absolute top-0 -left-[380px] hidden 3xl:flex flex-col gap-8">
            {left.map((poster, i) => (
              <div key={i} className="w-[300px] h-[800px]">
                <SidePosterComponent poster={poster} />
              </div>
            ))}
          </div>
          <div ref={rightRef} className="absolute top-0 -right-[380px] hidden 3xl:flex flex-col gap-8">
            {right.map((poster, i) => (
              <div key={i} className="w-[300px] h-[800px]">
                <SidePosterComponent poster={poster} />
              </div>
            ))}
          </div>
        </>
      )}
      <div ref={childRef}>
        {children}
      </div>
    </div>
  );
}