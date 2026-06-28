import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

const products = [
  {
    name: "iPhone 15 Pro",
    emoji: "📱",
    stocks: "6,200",
    price: "$999.00",
    sales: "4,800",
    earnings: "$4,795,200",
  },
  {
    name: "MacBook Air M2",
    emoji: "💻",
    stocks: "1,020",
    price: "$1,299",
    sales: "3,200",
    earnings: "$4,156,800",
  },
  {
    name: "Google Pixel 8",
    emoji: "📱",
    stocks: "1,500",
    price: "$699.00",
    sales: "800",
    earnings: "$559,200",
  },
  {
    name: "Nike Air Max 90",
    emoji: "👟",
    stocks: "2,400",
    price: "$130.00",
    sales: "1,800",
    earnings: "$234,000",
  },
  {
    name: "Galaxy Buds Pro",
    emoji: "🎧",
    stocks: "850",
    price: "$199.00",
    sales: "1,000",
    earnings: "$199,000",
  },
];

export default function TopProducts() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 13l4-8 3 5 2-3 3 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Top Products
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <ArrowUpDown size={13} />
            Sort
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Product", "Stocks", "Price", "Sales", "Earnings"].map((h) => (
                <th key={h} className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">
                  <div className="flex items-center gap-1">
                    {h}
                    <ArrowUpDown size={10} className="text-gray-300" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.name} className={i < products.length - 1 ? "border-b border-gray-50" : ""}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-600">{p.stocks}</td>
                <td className="py-3 pr-4 text-sm text-gray-600">{p.price}</td>
                <td className="py-3 pr-4 text-sm text-gray-600">{p.sales}</td>
                <td className="py-3 text-sm font-semibold text-gray-900">{p.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
