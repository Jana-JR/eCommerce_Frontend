import { useContext, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import useFetch from "../hooks/useFetch";
import axios from "../Utils/axios";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const { data: userData } = useFetch(user ? `/users/${user._id}` : null);
 

  const handleProfile = () => {
    if (!user) return;

    if (user.isAdmin) navigate("/admin/dashboard");
    else navigate("/userProfile");
  };

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white outline-1 rounded shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-bold text-black">JR.</h1>
        </Link>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="hidden sm:block border px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {!userData ? (
            <>
              <Link to="/login">
                <button className="px-4 py-2 rounded bg-black text-white hover:opacity-70">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded bg-black text-white hover:opacity-70">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Cart */}
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-2xl" />
               
              </Link>

              {/* Profile Menu */}
              <div className="relative">
                <FaUserCircle
                  size={32}
                  className="cursor-pointer"
                  onClick={() => setMenuOpen((prev) => !prev)}
                />
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg overflow-hidden animate-fadeIn z-20">
                    <button
                      onClick={handleProfile}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-300"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
