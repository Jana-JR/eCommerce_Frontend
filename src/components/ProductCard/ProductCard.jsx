import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    try {
      
      navigate("/checkout", { state: { product, quantity: 1 } }); 
    } catch (err) {
      console.error("Error in Buy Now:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl/15 inset-ring p-4 text-center transition-transform transform hover:-translate-y-1 w-48 h-72 flex flex-col justify-between sm:w-56 sm:h-80 md:w-64 md:h-96">
      
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-32 object-cover rounded-md sm:h-40 md:h-48"
      />

      <h3 className="text-lg font-semibold mt-2 truncate">{product.title}</h3>

      {product.brand?.name && (
        <p className="text-gray-500 text-sm">Brand: {product.brand.name}</p>
      )}

      <p className="text-green-600 font-medium">
        Price: ₨ {Number(product.price).toFixed(2)}
      </p>

      {product.discountPercentage > 0 && (
        <p className="text-red-500 text-sm">
          Discount: {product.discountPercentage}%
        </p>
      )}

      <p className="text-gray-500 text-sm">Stock: {product.stockQuantity}</p>

      <div className="flex justify-between mt-auto">
        <button
          onClick={() => onAddToCart(product)}
          className="bg-white outline-1 rounded px-3 py-1 text-sm hover:bg-orange-600 w-1/2 mr-1"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-black text-white rounded px-3 py-1 text-sm hover:outline hover:outline-2 hover:outline-black hover:rounded-md w-1/2 ml-1"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
