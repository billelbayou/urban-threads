"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const categories = [
  { name: "Electronics", value: 85000, pct: "68%", color: "#4f46e5" },
  { name: "Fashion", value: 25000, pct: "20%", color: "#f59e0b" },
  { name: "Health & Wellness", value: 10000, pct: "8%", color: "#ec4899" },
  { name: "Home & Living", value: 5000, pct: "4%", color: "#10b981" },
];

export default function TopCategories() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" fill="#9ca3af"/>
          </svg>
          Top Categories
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">See All</button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400">Total Sales</p>
            <p className="text-base font-bold text-gray-900">$125,000</p>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: cat.color }} />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-900 font-medium">${cat.value.toLocaleString()}</span>
                <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
