import Header from "@/components/header";
import heroImage from "../../public/hero.png";
import Image from "next/image";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { FaArrowRight, FaAsterisk } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Topic from "@/components/topic";
import rightImg from "../../public/streetwear-comfort.jpg";
import topImg from "../../public/chinese-streetwear-1600x900.png";
import bottomImg from "../../public/449ab5f64580a17a08e8b4f0e313796b.jpg";
import { exampleProducts } from "@/lib/data";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="">
        <div className="container mx-auto relative w-full h-72 md:h-96 lg:h-[500px] xl:h-[650px] 2xl:h-[800px] rounded-2xl overflow-hidden">
          <Image src={heroImage} alt="Hero" fill className="object-cover" />

          {/* Main left overlay */}
          <div className="absolute inset-0">
            <div className="flex flex-col text-5xl md:text-7xl font-light h-full pt-8 pl-8 bg-gradient-to-b from-transparent to-black/70">
              <div className="text-white w-auto flex items-center pb-5">
                <p className="pr-4">Fresh Drops</p>
                <FaAsterisk size={50} />
              </div>
              <div className="text-white flex items-center pb-5">
                <AiOutlineDoubleLeft />
                <p className="pl-4">Limited Edition</p>
              </div>
              <div className="text-white flex items-center">
                <p className="pr-4">Act Fast</p>
                <AiOutlineDoubleRight />
              </div>
            </div>
          </div>

          {/* Vertical right text */}
          <div className="absolute top-0 right-0 h-full px-4 flex items-center">
            <p className="vertical-outline-text text-shadow">NEW COLLECTION</p>
          </div>
        </div>
        <div className="overflow-hidden bg-black text-white my-8">
          <div className="marquee flex whitespace-nowrap">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="flex items-center justify-center text-sm md:text-base font-semibold uppercase my-2 mr-8"
              >
                <GoDotFill />
                <p className="ml-2">free shipping on orders above $60</p>
              </span>
            ))}
          </div>
        </div>
        <div className="container mx-auto">
          <Topic title="Best Sellers" products={exampleProducts} />
          <div className="mb-44">
            <h2 className="text-3xl font-medium mb-4">Categories</h2>
            <div className="grid grid-cols-2 gap-x-4 h-[700px]">
              {/* Tall left image */}
              <div className="col-span-1 row-span-2 flex flex-col">
                <div className="flex-1">
                  <Image
                    src={rightImg}
                    alt="Alger"
                    height={400}
                    width={300}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between text-xl mt-2">
                  <p>Shop Men</p>
                  <FaArrowRight />
                </div>
              </div>

              {/* Top right small image */}
              <div className="flex flex-col h-[calc(700px/2-8px)]">
                <div className="flex-1">
                  <Image
                    src={topImg}
                    alt="Alger"
                    height={400}
                    width={300}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between text-xl mt-2">
                  <p>Shop Women</p>
                  <FaArrowRight />
                </div>
              </div>

              {/* Bottom right small image */}
              <div className="flex flex-col h-[calc(700px/2-8px)]">
                <div className="flex-1">
                  <Image
                    src={bottomImg}
                    alt="Alger"
                    height={400}
                    width={300}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between text-xl mt-2">
                  <p>Shop Accessories</p>
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </div>
          <Topic title="New Arrivals" products={exampleProducts} />
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 mx-auto justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                Born in the streets, made for the culture
              </h2>
              <p className="text-gray-700 leading-relaxed">
                More than just clothes, we&apos;re a movement that started in
                2019 from the raw energy of city streets. Our designs blend
                urban attitude with sustainable craftsmanship, creating pieces
                that tell stories. Every drop is a limited canvas of
                self-expression, crafted for those who dare to stand out. We
                don&apos;t just follow trends - we create them alongside our
                community of artists, skaters, and dreamers who inspire each
                collection. From late-night design sessions to ethical
                production methods, we&apos;re building a brand that respects
                both style and substance. Join us in redefining what streetwear
                can be.
              </p>
            </div>

            <Image
              src="https://images.unsplash.com/photo-1592516195984-44d68247d57e"
              alt="Streetwear Culture"
              width={400}
              height={300}
              className="object-cover"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
