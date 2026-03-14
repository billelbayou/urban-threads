import RecentActivity from "@/components/admin/RecentActivity";
import SalesChart from "@/components/admin/SalesChart";
import StatsCards from "@/components/admin/StatsCards";
import TopCategories from "@/components/admin/TopCategories";
import TopProducts from "@/components/admin/TopProducts";

export default function Home() {
  return (
    <>
      <StatsCards />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopCategories />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <RecentActivity />
        <TopProducts />
      </div>
    </>
  );
}
