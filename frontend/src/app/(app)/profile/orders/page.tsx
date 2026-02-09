import { redirect } from "next/navigation";
import { getCurrentUser, fetchMyOrders } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
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
  const cookie = await getCookies();
  const user = await getCurrentUser(cookie);
  const orders: Order[] = await fetchMyOrders(cookie);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content - Orders */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                My Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Order ID
                            </p>
                            <p className="text-sm font-mono text-gray-900">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Placed On
                            </p>
                            <p className="text-sm text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Total
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              statusColors[order.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                              <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                {item.product ? (
                                  <Image
                                    src={item.product.images[0].url}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ${item.price.toFixed(2)} each
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
