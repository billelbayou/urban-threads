import { FiBell, FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FiBell className="text-gray-600" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
