import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Utils/axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputLabel,
} from "@mui/material";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [stockQuantity, setStockQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProductTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setStockQuantity(data.stockQuantity);
        setBrand(data.brand?.name || "");
        setImage(data.image || "");
      } catch (err) {
        console.error("Failed to load product", err);
      }
    }

    fetchProduct();
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await handleImageUpload(file);
    if (url) {
      setImage(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isNaN(price) ||
      price <= 0 ||
      isNaN(stockQuantity) ||
      stockQuantity <= 0 ||
      title.trim() === ""
    ) {
      return toast.error("Please enter valid details");
    }

    const payload = {
      title,
      description,
      price: parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      stockQuantity: parseInt(stockQuantity),
      brand,
      image,
    };

    try {
      await axios.patch(`/products/${id}`, payload);

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Box component="main" className="flex-1 p-6 overflow-auto bg-gray-50">
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                Update Product
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/admin/products")}
              >
                Back to List
              </Button>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 4, maxWidth: "600px", mx: "auto" }} component="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <Input label="Title" value={title} onChange={setProductTitle} />
            <Input label="Brand" value={brand} onChange={setBrand} />
            <Input label="Price" type="number" value={price} onChange={setPrice} />
            <Input label="Discount (%)" type="number" value={discountPercentage} onChange={setDiscountPercentage} />
            <Textarea label="Description" value={description} onChange={setDescription} />
            <Input label="Stock Quantity" type="number" value={stockQuantity} onChange={setStockQuantity} />

            <Box mb={3}>
              <InputLabel>Upload Image</InputLabel>
              <input type="file" onChange={handleSingleImageUpload} />
            </Box>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 1 }}>
              UPDATE
            </Button>
            <Button type="reset" variant="outlined" color="error" fullWidth>
              Reset
            </Button>
          </Paper>
        </Box>
      </div>
    </div>
  );
}

// Reusable Input and Textarea components
const Input = ({ label, type = "text", value, onChange }) => (
  <Box mb={3}>
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)
      }
    />
  </Box>
);

const Textarea = ({ label, value, onChange }) => (
  <Box mb={3}>
    <TextField
      fullWidth
      multiline
      rows={4}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Box>
);
