"use client"

import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import SalesChart from "@/components/admin/SalesChart";

export default function Dashboard() {
  // These would typically come from API calls
  const stats: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
  }[] = [
    { title: "Total Sales", value: "$12,345", change: "+12%", trend: "up" },
    { title: "Orders", value: "245", change: "+5%", trend: "up" },
    { title: "Customers", value: "1,234", change: "+8%", trend: "up" },
    { title: "Products", value: "456", change: "-2%", trend: "down" },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Sales Overview
          </h2>
          <SalesChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Recent Orders
          </h2>
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
