import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ImageType } from "../[id]/page";
import ImageDialog from "./ImageDialog";

type Props = {
  images: ImageType[];
};

export default function CarouselDisplay({ images }: Props) {
  return (
    <Carousel className="pb-4">
      <CarouselContent>
        {images.map((item, index) => (
          <CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
            <ImageDialog image={item.path} invoice={item.invoice} />
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
