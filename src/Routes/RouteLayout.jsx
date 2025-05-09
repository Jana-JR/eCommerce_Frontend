import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/authContext";

// Public pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Product from "../pages/Product/Product";
import UserProfile from "../pages/Profile/UserProfile";

// Admin pages
import AddProduct from "../pages/Admin/AddProduct";
import Dashboard from "../pages/Admin/Dashboard";
import EditProduct from "../pages/Admin/EditProduct";
import Orders from "../pages/Admin/Orders";
import ProductList from "../pages/Admin/Product";
import Users from "../pages/Admin/Users";

import Forbidden403 from "../pages/ErrorPages/Forbidden403";

export default function RouteLayout() {

    const { user, loading } = useContext(AuthContext);

const Protected = ({ children, adminOnly = false }) => {
  if (loading) return null; 

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Forbidden403 />;
  }

  return children;
};

 

  return (
    <div className="flex flex-col h-screen flex-1 overflow-hidden">
      
      <main className="p-0.5 overflow-y-auto flex-1 bg-white">
      <ToastContainer position="bottom-right" autoClose={2000} />
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <Protected>
                <Cart />
              </Protected>
            }
          />

          <Route
            path="/checkout"
            element={
              <Protected>
                <Checkout />
              </Protected>
            }
          />
          <Route
            path="/userProfile"
            element={
              <Protected>
                <UserProfile />
              </Protected>
            }
          />

     
          <Route
            path="admin/dashboard"
            element={
              <Protected adminOnly={true}>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="admin/users"
            element={
              <Protected adminOnly={true}>
                <Users />
              </Protected>
            }
          />
          <Route
            path="admin/products"
            element={
              <Protected adminOnly={true}>
                <ProductList />
              </Protected>
            }
          />
          <Route
            path="admin/addproducts"
            element={
              <Protected adminOnly={true}>
                <AddProduct />
              </Protected>
            }
          />
          <Route
            path="admin/editproducts/:id"
            element={
              <Protected adminOnly={true}>
                <EditProduct />
              </Protected>
            }
          />
          <Route
            path="admin/orders"
            element={
              <Protected adminOnly={true}>
                <Orders />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>

  );
}
