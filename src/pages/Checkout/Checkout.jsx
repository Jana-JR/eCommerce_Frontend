import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/authContext";
import axios from "../../Utils/axios";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";  
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMode, setPaymentMode] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();  
  const buyNowProduct = location.state?.product; 
  const buyNowQuantity = location.state?.quantity || 1;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`/address/user/${user._id}`);
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0]._id);
        }
      } catch (error) {
        toast.error("Failed to fetch addresses.");
      }
    };

    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`/cart/user/${user._id}`);
        setCartItems(res.data);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    if (user?._id) {
      fetchAddresses();

      if (buyNowProduct) {
        // If it's Buy Now, set cartItems manually
        setCartItems([{ product: buyNowProduct, quantity: buyNowQuantity, _id: buyNowProduct._id }]);
      } else {
        fetchCartItems();
      }
    }
  }, [user, buyNowProduct, buyNowQuantity]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.product?.price || 0);
      return acc + item.quantity * price;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Address Required");
      return;
    }

    const isConfirmed = window.confirm("Do you want to place the order?");
    if (isConfirmed) {
      try {
        const orderItems = cartItems.map((item) => ({
          product: item.product?._id, 
          quantity: item.quantity,
          price: item.product?.price,
        }));

        await axios.post("/orders", {
          user: user._id,
          item: orderItems,
          address: addresses.find((address) => address._id === selectedAddressId),
          status: "Pending",
          paymentMode: paymentMode,
          total: calculateTotal(),
        });

        if (!buyNowProduct) {
          // Only clear cart if it's normal checkout
          await axios.delete(`/cart/user/${user._id}`);
        }

        toast.success("Order Placed Successfully!");
        navigate("/cart");
      } catch (err) {
        console.error("Error placing order:", err);
        toast.error("There was an error processing your order. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-5">
            <Typography variant="h6" className="mb-2">Shipping Address</Typography>
            <select
              className="w-full border rounded p-2"
              value={selectedAddressId || ""}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.street}, {addr.city}, {addr.district}, {addr.province}, {addr.zip_code}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <Typography variant="h6" className="mb-2">Payment Mode</Typography>
            <select
              className="w-full border rounded p-2"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Credit/Debit Card</option>
            </select>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <Typography variant="h6" className="mb-4">Order Summary</Typography>

            {cartItems.map((item) => (
              <Card key={item._id} className="mb-3 border border-gray-200 shadow-none">
                <CardContent className="flex justify-between">
                  <div>
                    <Typography variant="subtitle1">{item.product?.title}</Typography>
                    <Typography variant="body2">Qty: {item.quantity}</Typography>
                  </div>
                  <Typography variant="body2">
                    LKR.{(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            <div className="mt-4 flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>LKR.{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCheckout}
            className="rounded p-3 text-white font-semibold"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
