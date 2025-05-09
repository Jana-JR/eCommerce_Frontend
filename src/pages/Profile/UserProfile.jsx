import { useState } from "react";
import Sidebar from "../../components/UserProfile/Sidebar";
import AddressManager from "../../components/UserProfile/AddressManager";
import OrderHistory from "../../components/UserProfile/OrderHistory";
import Navbar from "../../components/Navbar";
import { useMediaQuery } from "@mui/material";
import { FiMenu } from "react-icons/fi";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("addresses");


  const renderContent = () => {
    switch (activeTab) {
      case "addresses":
        return <AddressManager />;
      case "orders":
        return <OrderHistory />;
      default:
        return null;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4">

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
            <div className="w-full md:w-1/4 sticky">
                <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
               <div className="font-bold text-center"> My Profile</div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}