import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import SalesChart from "@/components/admin/SalesChart";
import { fetchAdminStats } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";

interface StatsData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export default async function Dashboard() {
  let stats;
  let error = null;

  try {
    const cookies = await getCookies();
    stats = await fetchAdminStats(cookies);
  } catch (err) {
    console.error("Failed to fetch stats:", err);
    error = "Failed to load dashboard stats";
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (error || !stats) {
    return (
      <>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error || "Failed to load stats"}</div>
        </div>
      </>
    );
  }

  const statsData: StatsData[] = [
    {
      title: "Total Sales",
      value: formatCurrency(stats.totalSales),
      change: "+12%",
      trend: "up",
    },
    {
      title: "Orders",
      value: formatNumber(stats.orderCount),
      change: "+5%",
      trend: "up",
    },
    {
      title: "Customers",
      value: formatNumber(stats.customerCount),
      change: "+8%",
      trend: "up",
    },
    {
      title: "Products",
      value: formatNumber(stats.productCount),
      change: stats.productCount > 0 ? "+1" : "0",
      trend: stats.productCount > 0 ? "up" : "down",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
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
          <RecentOrders
            orders={stats.orders
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .slice(0, 5)}
          />
        </div>
      </div>
    </>
  );
}