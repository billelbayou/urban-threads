"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Product } from "@/lib/types";

export default function ImageCarousel({ product }: { product: Product }) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div className="keen-slider__slide relative w-full aspect-square md:aspect-auto h-full">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-full overflow-hidden"
      >
        {product.imageUrl.map((img: string, i: number) => (
          <div key={i} className="keen-slider__slide relative w-full h-full">
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={() => slider.current?.next()}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
