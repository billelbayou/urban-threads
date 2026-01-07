import Footer from "@/components/footer";
import Header from "@/components/header";
import ImageCarousel from "@/components/productImageCarousel";
import ProductDetails from "@/components/productDetails";
import api from "@/lib/axios";
import CartDrawer from "@/components/CartDrawer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = (await params).id;
  const res = await api.get(`/api/products/${productId}`);
  const product = res.data
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
      <CartDrawer />
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
