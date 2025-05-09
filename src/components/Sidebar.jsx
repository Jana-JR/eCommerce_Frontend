import {
  FaChartLine,
  FaTachometerAlt,
  FaUsers
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", path: "/admin/products", icon: <FaChartLine /> },
    { name: "Orders", path: "/admin/orders", icon: <FaUsers /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-4 md:w-1/6 sm:w-1/5">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}
