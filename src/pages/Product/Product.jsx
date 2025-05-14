import { useContext } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { AuthContext } from "../../context/authContext";
import useFetch from "../../hooks/useFetch";
import axios from "../../Utils/axios";
import { toast } from "react-toastify";

const Products = () => {
  const { user } = useContext(AuthContext);
  const { data: products, loading, error } = useFetch("/products");

  const handleAddToCart = async (product) => {
    try {
      if (!user) {
        toast.error("You need to login to add products to your cart");
        return;
      }

      await axios.post(
        "/cart",
        {
          user: user.user._id, 
          product: product._id, 
          quantity: 1,
        },
      
        { withCredentials: true }
      );
      toast.success("Item added to cart.");

    } catch (err) {
      toast.error("Add to cart error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-center text-shadow-black">
          Welcome to JANA's Ecom Site
        </h2>

        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load products.</p>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-red-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
