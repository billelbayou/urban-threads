import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import Topic from "@/components/Topic";
import CategoriesSection from "@/components/CategoriesSection";
import { fetchProducts } from "@/services/api/product";
import { getCurrentUser } from "@/services/api/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urban Threads | Premium Streetwear Collection",
  description:
    "Explore the latest in urban fashion. Limited edition drops, sustainable craftsmanship, and street culture inspired designs.",
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const [bestSellers, newArrivals] = await Promise.all([
    fetchProducts("bestSelling"),
    fetchProducts("newest"),
  ]);
  if (user?.role == "ADMIN") {
    redirect("/admin");
  }
  return (
    <>
      <main>
        {/* HERO SECTION */}
        <div className="relative w-full">
          <Image
            src={"/hero.jpeg"}
            alt="Hero"
            width={2932}
            height={980}
            className="w-full h-auto"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-l from-black/50 to-transparent" />

          <div className="absolute top-0 right-0 h-full px-2 md:px-4 flex items-center pointer-events-none">
            <p className="vertical-outline-text text-shadow">NEW COLLECTION</p>
          </div>

        </div>
        <div className="overflow-hidden bg-linear-to-r from-zinc-900 via-black to-zinc-900 text-white border-y border-zinc-800 my-8">
          <div className="marquee flex whitespace-nowrap py-2.5">
            <div className="flex shrink-0 items-center">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mx-6"
                >
                  <Truck size={14} className="text-zinc-400" />
                  <span>free shipping on orders above $60</span>
                  <span className="text-zinc-600">✦</span>
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center">
              {[...Array(6)].map((_, i) => (
                <span
                  key={`dup-${i}`}
                  className="flex items-center gap-3 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mx-6"
                >
                  <Truck size={14} className="text-zinc-400" />
                  <span>free shipping on orders above $60</span>
                  <span className="text-zinc-600">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <Topic title="Best Sellers" products={bestSellers} seeAllHref="/products" />

          <CategoriesSection />

          <Topic title="New Arrivals" products={newArrivals} seeAllHref="/products?sort=newest" />

          {/* ABOUT SECTION */}
          <div className="flex flex-col md:flex-row items-center gap-8 py-10 md:py-16 mx-auto justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">Our Story</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                Born in the streets, made for the culture
              </h2>
              <p className="text-sm text-gray-500 mb-6">Est. 2019</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                More than just clothes, we&apos;re a movement that started in
                2019 from the raw energy of city streets. Our designs blend
                urban attitude with sustainable craftsmanship, creating pieces
                that tell stories. Every drop is a limited canvas of
                self-expression, crafted for those who dare to stand out. We
                don&apos;t just follow trends — we create them alongside our
                community of artists, skaters, and dreamers who inspire each
                collection.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                From late-night design sessions to ethical production methods,
                we&apos;re building a brand that respects both style and substance.
              </p>
              <p className="text-lg font-semibold text-gray-900 italic">
                Join us in redefining what streetwear can be.
              </p>
            </div>
            <Image
              src="/about-image.jpeg"
              alt="Streetwear Culture"
              width={3900}
              height={5850}
              className="object-cover h-auto w-100"
            />
          </div>
        </div>
      </main>
    </>
  );
}
