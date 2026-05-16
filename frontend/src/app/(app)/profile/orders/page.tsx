import { notFound } from "next/navigation";
import { getCurrentUser } from "@/services/api/auth";
import { fetchMyOrders } from "@/services/api/order";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types/order";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await fetchMyOrders();
  if (!orders) notFound();
  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">My Orders</h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] sm:p-12">
          <p className="mb-4 text-gray-500">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_6px_0_rgba(0,0,0,0.04)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>
                    <p className="font-mono text-sm text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Placed On
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Total
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.product?.images?.[0]?.thumbnail?.url ? (
                          <Image
                            src={item.product.images[0].thumbnail.url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {item.product?.name ?? "Deleted Product"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
