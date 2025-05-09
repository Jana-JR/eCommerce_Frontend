import React, { useEffect, useContext, useState } from "react";
import { Button, CircularProgress, Typography, Paper, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import axios from "../../Utils/axios";
import Navbar from "../../components/Navbar";

const Cart = ({ checkout }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`/cart/user/${user._id}`);
        setCartItems(response.data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [user, navigate]);

  const handleRemoveCartItem = async (_id) => {
    try {
      await axios.delete(`/cart/${_id}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
      toast.success("Product removed from cart");
    } catch (err) {
      console.error("Error removing product from cart:", err);
      toast.error("Error removing product from cart");
    }
  };

  const handleUpdateCartItem = async (_id, updatedFields) => {
    try {
      await axios.patch(`/cart/${_id}`, updatedFields);
      setCartItems((prevItems) =>
        prevItems.map((item) => (item._id === _id ? { ...item, ...updatedFields } : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
      toast.error("Error updating cart item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Paper elevation={3} className="p-6">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your Shopping Cart
          </Typography>

          {error ? (
            <Typography color="error" align="center" className="py-8">
              {error}
            </Typography>
          ) : cartItems.length > 0 ? (
            <Box display="flex" flexDirection="column" gap={3} mt={4}>
              {cartItems.map((item) => (
                <Paper
                  key={item._id}
                  className="p-4 flex flex-col md:flex-row justify-between items-center bg-gray-50"
                  elevation={1}
                >
                  <Box mb={2}>
                    <Typography variant="body1" fontWeight="bold">
                      {item.product?.title || "Unnamed Product"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: LKR.{item.product?.price?.toFixed(2) || "N/A"}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleUpdateCartItem(item._id, { quantity: item.quantity + 1 })}
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={item.quantity <= 1}
                      onClick={() => handleUpdateCartItem(item._id, { quantity: item.quantity - 1 })}
                    >
                      -
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveCartItem(item._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Paper>
              ))}

              <Button
                variant="contained"
                sx={{ backgroundColor: "black", mt: 4, "&:hover": { backgroundColor: "gray" } }}
                component={Link}
                to="/checkout"
              >
                Proceed to Checkout
              </Button>
            </Box>
          ) : (
            <Box textAlign="center" py={12}>
              <Typography variant="h6" gutterBottom>
                Your cart is empty
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "gray" } }}
                component={Link}
                to="/"
              >
                Continue Shopping
              </Button>
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Cart;
