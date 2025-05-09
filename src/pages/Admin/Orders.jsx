import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import axios from "../../Utils/axios";

const paginationModel = { page: 0, pageSize: 5 };

export default function OrderList() {
  const [orders, setOrders] = useState([]);

 const fetchOrders = async () => {
  try {
    const res = await axios.get("/orders");
    const orderData = res.data?.orders || res.data || []; 

    const formattedOrders = [];

    for (const order of orderData) {
      formattedOrders.push({
        id: order._id,
        customerId: order.user,
        productDetails: order.item?.map((i) => `${i.title || i.productName || 'Product'} (x${i.quantity || 1})`).join(", ") || "N/A",
        totalAmount: order.total,
        paymentMode: order.paymentMode,
        address: order.address?.[0]
          ? `${order.address[0].street || ""}, ${order.address[0].city || ""}, ${order.address[0].country || ""}`
          : "N/A",
        status: order.status,
      });
    }

    setOrders(formattedOrders);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch orders.");
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.7, headerClassName: "super-app-theme--header" },
    { field: "customerId", headerName: "Customer ID", flex: 0.7, headerClassName: "super-app-theme--header" },
    { field: "productDetails", headerName: "Products", flex: 1.2, headerClassName: "super-app-theme--header" },
    { field: "totalAmount", headerName: "Total (Rs)", flex: 0.8, headerClassName: "super-app-theme--header" },
    { field: "paymentMode", headerName: "Payment", flex: 0.8, headerClassName: "super-app-theme--header" },
    { field: "address", headerName: "Address", flex: 1.8, headerClassName: "super-app-theme--header" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Dispatched"
              ? "success"
              : params.value === "Pending"
              ? "warning"
              : params.value === "Out for delivery"
              ? "info"
              : params.value === "Cancelled"
              ? "error"
              : "default"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const { status, id } = params.row;

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {status === "Pending" && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => updateOrderStatus(id, "Dispatched")}
              >
                <LocalShippingIcon sx={{ color: "white" }} />
              </Button>
            )}
            {status === "Dispatched" && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => updateOrderStatus(id, "Out for delivery")}
              >
                <TaskAltIcon />
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Box component="main" className="flex-1 p-6 overflow-auto bg-gray-50">
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              Order List
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <DataGrid
              rows={orders}
              columns={columns}
              getRowId={(row) => row.id}
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
