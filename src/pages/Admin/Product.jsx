import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Typography, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import axios from "../../Utils/axios";

const paginationModel = { page: 0, pageSize: 5 };

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to delete product");
    }
  };
  

  const columns = [
    { field: "_id", headerName: "ID", flex: 1, headerClassName: "super-app-theme--header" },
    { field: "title", headerName: "Title", flex: 1, headerClassName: "super-app-theme--header" },
    { field: "description", headerName: "Description", flex: 2, headerClassName: "super-app-theme--header" },
    { field: "price", headerName: "Price", type: "number", flex: 1, headerClassName: "super-app-theme--header" },
    { field: "discountPercentage", headerName: "Discount (%)", type: "number", flex: 1, headerClassName: "super-app-theme--header" },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
      valueGetter: (params) => {
        return params.name || "N/A";
      },
    }
    ,
    { field: "stockQuantity", headerName: "Stock", type: "number", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Link 
            to={`/admin/editproducts/${params.row._id}`} 
            style={{ display: "inline-flex", textDecoration: "none" }}
          >
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              sx={{ minWidth: "36px", padding: "6px" }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ minWidth: "36px", padding: "6px" }}
            onClick={() => deleteProduct(params.row._id)}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ),
    }
    
    
  ];
 
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Box component="main" className="flex-1 p-6 overflow-auto bg-gray-50">
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                Product List
              </Typography>
              <Link to="/admin/addproducts/">
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                  Add Product
                </Button>
              </Link>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row._id}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              slots={{ toolbar: GridToolbar }}
              autoHeight
              
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
}
