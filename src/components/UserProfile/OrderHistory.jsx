import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "../../Utils/axios";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        if (!user?._id) return;

        const [orderRes, productRes] = await Promise.all([
          axios.get(`/orders/user/${user._id}`),
          axios.get("/products"),
        ]);

        const productMap = {};
        for (const prod of productRes.data) {
          productMap[prod.id] = prod;
        }

        setProductsMap(productMap);
        setOrders(orderRes.data);
      } catch (err) {
        console.error("Failed to load order history:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, [user]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Failed to load orders.</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            return (
              <div
                key={order._id}
                className="border rounded p-4 bg-white shadow-sm space-y-2"
              >
                <div className="font-semibold text-lg text-gray-800">
                  Order #{order._id} -{" "}
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </div>

                {order.item.length > 0 ? (
                  <div className="text-sm">
                    {order.item.map((prod, index) => {
                      const product = productsMap[prod.productId];

                      return (
                        <div key={index}>
                          {product ? (
                            <div>
                              <strong>Product:</strong> {product.title} <br />
                              <strong>Brand:</strong> {product.brand?.name}{" "}
                              <br />
                              <strong>Qty:</strong> {prod.quantity} <br />
                              <strong>Price per quantity:</strong> LKR.{" "}
                              {parseFloat(product.price).toFixed(2)} <br />
                            </div>
                          ) : (
                            <div className="text-sm text-red-500">
                              Product info not found.
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <br />
                    <strong>Total:</strong> LKR.
                    {parseFloat(order.total).toFixed(2)}
                  </div>
                ) : (
                  <div className="text-sm text-red-500">
                    Order items not found.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
