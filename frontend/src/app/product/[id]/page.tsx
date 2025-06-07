import Footer from "@/components/footer";
import Header from "@/components/header";
import { products } from "@/lib/data";
import ImageCarousel from "@/components/productImageCarousel";
import ProductDetails from "@/components/productDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = (await params).id;
  const product = products.find((product) => product.id === productId);
  if (!product) {
    return (
      <>
        <Header />
        <main className="p-8">
          <p className="text-center text-red-600 font-semibold">
            Product not found
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row gap-4 p-4 md:p-8 min-h-[600px]">
        <div className="w-full md:w-1/2">
          <ImageCarousel product={product} />
        </div>
        <div className="w-full md:w-1/2">
          <ProductDetails product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
