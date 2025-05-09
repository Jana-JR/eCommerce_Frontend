import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "../../Utils/axios";
import useFetch from "../../hooks/useFetch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export default function AddressManager() {
  const { user } = useContext(AuthContext);
  const {
    data: addresses = [],
    loading,
    error,
    setData: setAddresses,
  } = useFetch(user?._id ? `/address/user/${user._id}` : null);

  const [newAddress, setNewAddress] = useState({
    type: "",
    street: "",
    city: "",
    district: "",
    province: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
  });

  const isNewAddressValid = Object.values(newAddress).every(
    (val) => val.trim() !== ""
  );


  const handleAdd = async () => {
    try {
      const res = await axios.post("/address", {
        ...newAddress,
        user: user._id,
      });
      setAddresses((prev) => [...prev, res.data]);
      setNewAddress({
        type: "",
        street: "",
        city: "",
        district: "",
        province: "",
        country: "",
        postalCode: "",
        phoneNumber: "",
      });
      toast.success("Address Added")
    } catch (err) {
      toast.error("Add address error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/address/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (err) {
      toast.error("Failed to delete address", err);
    }
  };


  if (loading) return <div>Loading addresses...</div>;

  if (
    error?.response?.status === 404 &&
    error.response.data?.message === "No addresses found for this user"
  ) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">My Addresses</h2>
        <p className="text-gray-500 mb-4">
          No addresses found. Add your first one below.
        </p>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Add New Address</h3>
          {Object.entries(newAddress).map(([key, value]) => (
            <input
              key={key}
              placeholder={key.replace("_", " ")}
              className="input w-full border p-2 rounded-md"
              value={value}
              onChange={(e) =>
                setNewAddress({ ...newAddress, [key]: e.target.value })
              }
            />
          ))}
          <button
            className={`bg-black text-white px-4 py-2 rounded mt-2 ${
              !isNewAddressValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAdd}
            disabled={!isNewAddressValid}
          >
            Add Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

      {addresses.length === 0 ? (
        <p className="text-gray-500 mb-4">
          No addresses found. Add your first one below.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {addresses.map((addr) => (
            <div key={addr._id} className="border rounded-lg p-4 space-y-2">
                  <p>
                    {addr.type}, {addr.street}, {addr.city}
                  </p>
                  <p>
                    {addr.district}, {addr.province}, {addr.country},{" "}
                    {addr.postalCode}, {addr.phoneNumber}
                  </p>
                  <div className="flex gap-2 mt-2">
                    

                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="flex items-center outline outline-2 outline-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 focus:outline-none"
                    >
                      <DeleteIcon className="mr-2" />
                    </button>
                  </div>     
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Add New Address</h3>
        {Object.entries(newAddress).map(([key, value]) => (
          <input
            key={key}
            placeholder={key.replace("_", " ")}
            className="input w-full border p-2 rounded-md"
            value={value}
            onChange={(e) =>
              setNewAddress({ ...newAddress, [key]: e.target.value })
            }
          />
        ))}
        <button
          className={`bg-black text-white px-4 py-2 rounded mt-2 ${
            !isNewAddressValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAdd}
          disabled={!isNewAddressValid}
        >
          Add Address
        </button>
      </div>
    </div>
  );
}
