"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";

interface ImageCarouselProps {
  product: {
    name: string;
    images: { url: string }[];
  };
}

export default function ImageCarousel({ product }: ImageCarouselProps) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Slider */}
      <div
        ref={sliderRef}
        className="keen-slider w-full h-80 md:h-[500px] overflow-hidden rounded-xl shadow-sm"
      >
        {product.images.map((img, i) => (
          <div key={i} className="keen-slider__slide relative w-full h-full">
            <Image
              src={img.url}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={i === 0}
              onLoad={() => setCurrentSlide(i)}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={() => slider.current?.next()}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <FaArrowRight />
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {product.images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => slider.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === idx ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
