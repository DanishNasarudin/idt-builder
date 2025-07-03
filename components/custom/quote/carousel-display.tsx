"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useEffect, useState } from "react";
import { ImageType } from "../../../app/quote/[id]/page";
import ImageDialog from "./image-dialog";

type Props = {
  images: ImageType[];
};

export default function CarouselDisplay({ images }: Props) {
  const [slidesToScroll, setSlidesToScroll] = useState<number>(3);

  useEffect(() => {
    const updateSlides = () => {
      setSlidesToScroll(window.innerWidth < 640 ? 2 : 3);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  return (
    <Carousel className="pb-4" opts={{ slidesToScroll }}>
      <CarouselContent>
        {images.map((item, index) => (
          <CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
            <ImageDialog image={item.path} invoice={item.id} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 3 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
