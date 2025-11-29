import Header from "@/components/header";
import heroImage from "../../public/hero.png";
import Image from "next/image";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { FaAsterisk } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Topic from "@/components/topic";
import Footer from "@/components/footer";
import CategoriesSection from "@/components/CategoriesSection";
import api from "@/lib/axios";

async function getProducts() {
  try {
    const res = await api.get("/api/products", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return error
  }
}

export default async function HomePage() {
  const products = await getProducts();
  
  return (
    <>
      <Header />
      <main>
        {/* HERO SECTION */}
        <div className="container mx-auto relative w-full h-72 md:h-96 lg:h-[500px] xl:h-[650px] 2xl:h-[800px] rounded-2xl overflow-hidden">
          <Image src={heroImage} alt="Hero" fill className="object-cover" />

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

          <div className="absolute top-0 right-0 h-full px-4 flex items-center">
            <p className="vertical-outline-text text-shadow">NEW COLLECTION</p>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="overflow-hidden bg-black text-white my-8">
          <div className="marquee flex whitespace-nowrap">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="flex items-center text-sm md:text-base font-semibold uppercase my-2 mr-8"
              >
                <GoDotFill />
                <p className="ml-2">free shipping on orders above $60</p>
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto">
          <Topic title="Best Sellers" products={products} />

          <CategoriesSection />

          <Topic title="New Arrivals" products={products} />

          {/* ABOUT SECTION */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 mx-auto justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                Born in the streets, made for the culture
              </h2>
              <p className="text-gray-700 leading-relaxed">
                More than just clothes, we&apos;re a movement that started in
                2019...
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
