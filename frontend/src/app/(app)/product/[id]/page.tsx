import ImageCarousel from "@/components/product-client/productImageCarousel";
import ProductDetails from "@/components/product-client/productDetails";
import { fetchProductById } from "@/services/api/product";
import { fetchWishlist } from "@/services/api/wishlist";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Urban Threads",
    };
  }

  return {
    title: `${product.name} | Urban Threads`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images?.[0]?.original?.url || product.images?.[0]?.thumbnail?.url || "",
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const productId = (await params).id;
  const product = await fetchProductById(productId);

  if (!product) {
    return (
      <>
        <main className="p-8">
          <p className="text-center text-red-600 font-semibold">
            Product not found
          </p>
        </main>
      </>
    );
  }

  const wishlist = await fetchWishlist();
  const isInWishlist = wishlist?.products?.some((p) => p.id === productId) ?? false;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          <div className="flex flex-col">
            <ImageCarousel product={product} />
          </div>

          <div className="mt-10 px-2 sm:px-0 lg:mt-0">
            <ProductDetails product={product} isInWishlist={isInWishlist} />
          </div>
        </div>
      </div>
    </>
  );
}
