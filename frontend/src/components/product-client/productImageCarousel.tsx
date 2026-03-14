"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";

import { ProductImage } from "@/types/product";

interface ImageCarouselProps {
  product: {
    name: string;
    images: ProductImage[];
  };
}

export default function ImageCarousel({ product }: ImageCarouselProps) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle empty images
  if (!product.images || product.images.length === 0) {
    return (
      <div className="w-full h-80 md:h-125 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Slider */}
      <div
        ref={sliderRef}
        className="keen-slider w-full h-64 sm:h-80 md:h-96 lg:h-125 overflow-hidden rounded-xl shadow-sm bg-gray-50"
      >
        {product.images.map((img, i) => (
          <div key={i} className="keen-slider__slide relative w-full h-full">
            <Image
              src={img.desktop?.url || img.url || ""}
              alt={`${product.name} - Image ${i + 1}`}
              fill
              className="object-contain md:object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {product.images.length > 1 && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition z-10"
            aria-label="Previous image"
          >
            <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition z-10"
            aria-label="Next image"
          >
            <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {product.images.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => slider.current?.moveToIdx(idx)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                currentSlide === idx
                  ? "bg-black w-4 sm:w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
