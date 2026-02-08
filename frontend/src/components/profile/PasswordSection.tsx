"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function PasswordSection() {
  const [editing, setEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleSave = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    // TODO: Call API to update password
    console.log("Updating password...");
    setPasswordData({ current: "", new: "", confirm: "" });
    setEditing(false);
  };

  const handleCancel = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setEditing(false);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Login Details</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-red-500 text-sm font-medium hover:text-red-600"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
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
              onChange={(e) => handlePasswordChange("new", e.target.value)}
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
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              placeholder="Confirm new password"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
            >
              Update Password
            </button>
            <button
              onClick={handleCancel}
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
  );
}
