import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface TopicProps {
  title: string;
  products: Product[];
}

export default function Topic({ title, products }: TopicProps) {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium">{title}</h2>
        <Link href={`/${title}`} className="text-xl font-medium underline">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            href={"/"}
            key={product.id}
            className="hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-auto object-cover"
            />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <h4 className="text-neutral-500 font-semibold">
                  {product.category?.name}
                </h4>
              </div>
              <p className="text-lg font-semibold mt-1">
                ${product.variants[0].price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
