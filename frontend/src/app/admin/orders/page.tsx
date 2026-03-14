import { getAdminOrdersAction } from "@/services/orderActions";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Management | Urban Threads Admin",
};

async function OrdersList() {
  const result = await getAdminOrdersAction();
  const error = result.error;
  const orders = result.data || [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <OrdersTable initialOrders={orders} />;
}

function OrdersTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-100 rounded mb-4"></div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-50 rounded mb-2"></div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersList />
      </Suspense>
    </>
  );
}
