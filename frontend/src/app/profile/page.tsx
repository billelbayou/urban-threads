"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  FiEdit,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, initialized, getCurrentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      getCurrentUser();
    }
  }, [initialized, getCurrentUser]);

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        postalCode: user.postalCode || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading your profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg">Redirecting...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Add your save logic here
    setEditMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b pb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {user.name ? (
                  <span className="text-3xl font-light text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <RiVipCrownLine className="text-3xl text-gray-400" />
                )}
              </div>
              <div className="ml-6">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-light border-b border-gray-300 focus:outline-none focus:border-black"
                  />
                ) : (
                  <h1 className="text-2xl font-light">{user.name}</h1>
                )}
                <p className="text-gray-500 mt-1">{user.email}</p>
                {!editMode && user.role && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                    {user.role.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              className="flex items-center text-sm uppercase tracking-wider hover:underline"
            >
              <FiEdit className="mr-2" />
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wider ${
                  activeTab === "profile"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wider ${
                  activeTab === "orders"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wider ${
                  activeTab === "wishlist"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wider ${
                  activeTab === "addresses"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wider ${
                  activeTab === "payment"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment Methods
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light mb-6">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                          value={formData.name.split(" ")[0] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: `${e.target.value} ${
                                formData.name.split(" ")[1] || ""
                              }`.trim(),
                            })
                          }
                        />
                      ) : (
                        <p>{user.name.split(" ")[0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                          value={formData.name.split(" ")[1] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: `${formData.name.split(" ")[0] || ""} ${
                                e.target.value
                              }`.trim(),
                            })
                          }
                        />
                      ) : (
                        <p>
                          {user.name.split(" ").length > 1
                            ? user.name.split(" ")[1]
                            : "-"}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.email}</p>
                      )}
                    </div>

                    {/* Added Address Fields */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiMapPin className="mr-2" /> Address
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.address || "Not specified"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.city || "Not specified"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.postalCode || "Not specified"}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiGlobe className="mr-2" /> Country
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.country || "Not specified"}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiPhone className="mr-2" /> Phone
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <p>{user.phone || "Not specified"}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-light mb-6">Order History</h2>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-sm rounded-full">
                              {order.status}
                            </span>
                          </div>
                          {/* Add more order details as needed */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-200 p-6 text-center">
                      <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">
                        You haven&apos;t placed any orders yet
                      </p>
                      <a
                        href="/products"
                        className="text-black hover:underline"
                      >
                        Start Shopping
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-light mb-6">Your Wishlist</h2>
                  {user.wishlist && user.wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {user.wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 p-4"
                        >
                          {/* Add wishlist item display */}
                          <p>{item.productId}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-200 p-6 text-center">
                      <FiHeart className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">
                        Your wishlist is empty
                      </p>
                      <a
                        href="/products"
                        className="text-black hover:underline"
                      >
                        Browse Products
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-xl font-light mb-6">Saved Addresses</h2>
                  {user.address ? (
                    <div className="border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Primary Address</h3>
                        <button className="text-sm text-black hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p>{user.address}</p>
                        <p>
                          {user.city}, {user.postalCode}
                        </p>
                        <p>{user.country}</p>
                        {user.phone && <p>Phone: {user.phone}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 p-6 text-center">
                      <FiMapPin className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">
                        You don&apos;t have any saved addresses
                      </p>
                      <button className="text-black hover:underline">
                        Add New Address
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "payment" && (
                <div>
                  <h2 className="text-xl font-light mb-6">Payment Methods</h2>
                  <div className="border border-gray-200 p-6 text-center">
                    <FiCreditCard className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">
                      You haven&apos;t saved any payment methods
                    </p>
                    <button className="text-black hover:underline">
                      Add Payment Method
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6">
                <h3 className="font-medium mb-4">LOYALTY PROGRAM</h3>
                <div className="flex items-center">
                  <RiVipCrownLine className="text-2xl text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm">Urban Threads Member</p>
                    <p className="text-xs text-gray-500">
                      {user.role === "ADMIN" ? "Admin" : "Standard"} tier
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="h-1 bg-gray-200 rounded-full mb-2">
                    <div className="h-1 bg-yellow-600 rounded-full w-1/3"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <h3 className="font-medium mb-4">ACCOUNT DETAILS</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Member since</p>
                    <p className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last updated</p>
                    <p className="text-sm">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account status</p>
                    <p className="text-sm">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
