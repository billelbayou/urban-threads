"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { useState } from "react";

const data = [
  { month: "Jan", oneTime: 100000, recurring: 0 },
  { month: "Feb", oneTime: 45000, recurring: 0 },
  { month: "Mar", oneTime: 130000, recurring: 0 },
  { month: "Apr", oneTime: 6000, recurring: 25000 },
  { month: "May", oneTime: 120000, recurring: 0 },
  { month: "Jun", oneTime: 40000, recurring: 0 },
  { month: "Jul", oneTime: 130000, recurring: 0 },
  { month: "Aug", oneTime: 70000, recurring: 0 },
];

interface TooltipPayload {
  value: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length && label === "Apr") {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
          <span className="text-gray-600">One-Time Revenue</span>
        </div>
        <p className="font-bold text-gray-900 ml-4 mb-2">$6,000</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
          <span className="text-gray-600">Recurring Revenue</span>
        </div>
        <p className="font-bold text-gray-900 ml-4">$25,000</p>
      </div>
    );
  }
  return null;
};

export default function SalesChart() {
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
              <rect x="1" y="8" width="3" height="7" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="6" y="4" width="3" height="11" rx="1" fill="currentColor" opacity="0.7"/>
              <rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor"/>
            </svg>
            Sales Revenue
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-200 inline-block" />
              One-Time Revenue
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Recurring Revenue
            </div>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["Monthly", "Quarterly", "Yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickFormatter={(v) => v === 0 ? "0" : `${v / 1000}K`}
            domain={[0, 150000]}
            ticks={[0, 10000, 50000, 100000, 130000, 150000]}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="oneTime" stackId="a" fill="#c7d2fe" radius={[0, 0, 0, 0]} />
          <Bar dataKey="recurring" stackId="a" fill="#4f46e5" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.month === "Apr" ? "#4f46e5" : "#4f46e5"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
