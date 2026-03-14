import { ShoppingCart, AlertTriangle, Tag, Monitor } from "lucide-react";

const activities = [
  {
    icon: ShoppingCart,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    title: "Order #2048",
    subtitle: "John Doe",
    date: "12 Jan 25",
    badge: "New Order",
    badgeColor: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    title: "Low Stock Alert",
    subtitle: "MacBook Air M2",
    date: "10 Jan 25",
    badge: "Low Stock",
    badgeColor: "bg-red-50 text-red-500",
  },
  {
    icon: Tag,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    title: 'Promo code "SUMMER20"',
    subtitle: "Applied 52 times",
    date: "8 Jan 25",
    badge: "Campaign",
    badgeColor: "bg-purple-50 text-purple-600",
  },
  {
    icon: Monitor,
    iconBg: "bg-gray-50",
    iconColor: "text-gray-500",
    title: "System Update",
    subtitle: "Version 1.21",
    date: "2 Jan 25",
    badge: "System",
    badgeColor: "bg-gray-100 text-gray-500",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M8 4.5V8l2.5 1.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Recent Activity
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">See All</button>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.title} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                <item.icon size={16} className={item.iconColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400">{item.subtitle} · {item.date}</p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.badgeColor}`}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
