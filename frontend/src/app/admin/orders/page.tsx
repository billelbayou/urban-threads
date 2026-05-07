import OrdersTable from "@/components/admin/orders/OrdersTable";
import { Suspense } from "react";
import { Metadata } from "next";

import { notFound } from "next/navigation";
import { fetchAdminOrders } from "@/services/api/order";

export const metadata: Metadata = {
  title: "Order Management | Urban Threads Admin",
};

async function OrdersList() {
  const orders = await fetchAdminOrders();
  if (!orders) notFound();
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
    <Suspense fallback={<OrdersTableSkeleton />}>
      <OrdersList />
    </Suspense>
  );
}
