import { getAdminOrdersAction } from "@/services/orderActions";
import OrdersTable from "@/components/admin/orders/OrdersTable";

export default async function OrdersPage() {
  const result = await getAdminOrdersAction();
  const error = result.error;
  const orders = result.data || [];

  if (error) {
    return (
      <>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>
      <OrdersTable initialOrders={orders} />
    </>
  );
}
