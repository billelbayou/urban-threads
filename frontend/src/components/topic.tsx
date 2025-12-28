
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface TopicProps {
  title: string;
  products: any
}

export default function Topic({ title, products }: TopicProps) {
  return (
    <section className="my-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        <Link
          href={`/${encodeURIComponent(title.toLowerCase())}`}
          className="text-base md:text-lg font-medium text-black hover:text-blue-800 underline underline-offset-4 transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product: Product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="group block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-[1.03]"
          >
            {/* Image */}
            <div className="relative w-full aspect-square bg-neutral-100">
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-base md:text-lg font-semibold truncate">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-500">
                {product.category?.name ?? "Uncategorized"}
              </p>

              {/* Price */}
              <p className="text-lg font-semibold text-neutral-800 mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
