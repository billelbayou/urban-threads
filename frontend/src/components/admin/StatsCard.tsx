import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const StatsCard = ({ title, value, change, trend }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      <div
        className={`mt-2 flex items-center ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend === "up" ? (
          <FiTrendingUp className="mr-1" />
        ) : (
          <FiTrendingDown className="mr-1" />
        )}
        <span className="text-sm font-medium">{change}</span>
      </div>
    </div>
  );
};

export default StatsCard;
