"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function AccountOverview() {
  // State for user data
  const [userData, setUserData] = useState({
    firstName: "Pranaya",
    lastName: "Rajbhandari",
    email: "kchabhaiharu@gmail.com",
    phone: "+1234567890",
    dateOfBirth: "2001-06-10",
    gender: "Male",
    country: "United States",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    streetAddress: "123 Main Street",
    apartment: "Apt 4B",
  });

  // State for edit modes (per section)
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    shippingAddress: false,
    password: false,
  });

  // Temporary state for editing
  const [tempData, setTempData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const menuItems = [
    {
      id: 1,
      href: "/profile",
      label: "Personal Information",
      icon: ChevronRight,
    },
    { id: 2, href: "/profile/orders", label: "Orders", icon: ChevronRight },
    { id: 3, href: "/profile/wishlist", label: "Wishlist", icon: ChevronRight },
  ];

  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Toggle edit mode for a section
  const handleEdit = (section: string) => {
    setEditMode({ ...editMode, [section]: true });
    setTempData({ ...userData });
  };

  // Save changes for a section
  const handleSave = (section: string) => {
    if (section === "password") {
      // Add password validation logic here
      if (passwordData.new !== passwordData.confirm) {
        alert("New passwords don't match!");
        return;
      }
      // Call API to update password
      console.log("Updating password...");
      setPasswordData({ current: "", new: "", confirm: "" });
    } else {
      setUserData({ ...tempData });
    }
    setEditMode({ ...editMode, [section]: false });
  };

  // Cancel editing for a section
  const handleCancel = (section: string) => {
    setTempData({ ...userData });
    setPasswordData({ current: "", new: "", confirm: "" });
    setEditMode({ ...editMode, [section]: false });
  };

  // Update temporary data
  const handleChange = (field: string, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  // Update password data
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
                    isActive(item.href)
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-b border-gray-100 last:border-b-0`}
                >
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Personal Information Section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  {!editMode.personalInfo && (
                    <button
                      onClick={() => handleEdit("personalInfo")}
                      className="text-red-500 text-sm font-medium hover:text-red-600"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editMode.personalInfo ? (
                  <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={tempData.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={tempData.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={tempData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={tempData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={tempData.dateOfBirth}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Gender
                      </label>
                      <select
                        value={tempData.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSave("personalInfo")}
                        className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => handleCancel("personalInfo")}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">First Name</p>
                      <p className="text-gray-900">{userData.firstName}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Last Name</p>
                      <p className="text-gray-900">{userData.lastName}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Email</p>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Phone Number</p>
                      <p className="text-gray-900">{userData.phone}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Date of Birth
                      </p>
                      <p className="text-gray-900">{userData.dateOfBirth}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Gender</p>
                      <p className="text-gray-900">{userData.gender}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address Section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                  {!editMode.shippingAddress && (
                    <button
                      onClick={() => handleEdit("shippingAddress")}
                      className="text-red-500 text-sm font-medium hover:text-red-600"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editMode.shippingAddress ? (
                  <div className="space-y-4">
                    {/* Country */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={tempData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={tempData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* State/Province */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={tempData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Postal/ZIP Code */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        value={tempData.postalCode}
                        onChange={(e) =>
                          handleChange("postalCode", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={tempData.streetAddress}
                        onChange={(e) =>
                          handleChange("streetAddress", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Apartment/Unit */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Apartment / Unit (optional)
                      </label>
                      <input
                        type="text"
                        value={tempData.apartment}
                        onChange={(e) =>
                          handleChange("apartment", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSave("shippingAddress")}
                        className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => handleCancel("shippingAddress")}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Country</p>
                      <p className="text-gray-900">{userData.country}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">City</p>
                      <p className="text-gray-900">{userData.city}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        State/Province
                      </p>
                      <p className="text-gray-900">{userData.state}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Postal / ZIP Code
                      </p>
                      <p className="text-gray-900">{userData.postalCode}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Street Address
                      </p>
                      <p className="text-gray-900">{userData.streetAddress}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Apartment / Unit
                      </p>
                      <p className="text-gray-900">
                        {userData.apartment || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Login Details Section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Login Details
                  </h2>
                  {!editMode.password && (
                    <button
                      onClick={() => handleEdit("password")}
                      className="text-red-500 text-sm font-medium hover:text-red-600"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editMode.password ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          handlePasswordChange("current", e.target.value)
                        }
                        placeholder="Enter current password"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          handlePasswordChange("new", e.target.value)
                        }
                        placeholder="Enter new password"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) =>
                          handlePasswordChange("confirm", e.target.value)
                        }
                        placeholder="Confirm new password"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSave("password")}
                        className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => handleCancel("password")}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Password</p>
                      <p className="text-gray-900">••••••••••••</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Manage Account Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Account
                </h3>
                <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors rounded">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
