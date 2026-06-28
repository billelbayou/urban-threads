import { Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    label: "Total Products",
    value: "1,525",
    icon: Package,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    arrow: null,
  },
  {
    label: "Total Sales",
    value: "10,892",
    icon: DollarSign,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    arrow: null,
  },
  {
    label: "Total Income",
    value: "$157,342",
    icon: TrendingDown,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    arrow: "down",
  },
  {
    label: "Total Expenses",
    value: "$12,453",
    icon: TrendingUp,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    arrow: "up",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
            <stat.icon size={20} className={stat.iconColor} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
