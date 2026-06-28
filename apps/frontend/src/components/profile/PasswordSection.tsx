"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function PasswordSection() {
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (!passwords.current || !passwords.new) {
      toast.error("All fields are required");
      return;
    }
    // TODO: call API to update password
    setPasswords({ current: "", new: "", confirm: "" });
    setEditing(false);
  };

  const handleCancel = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setEditing(false);
  };

  return (
    <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_1px_6px_0_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Password
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-900 hover:text-white"
          >
            <Pencil size={13} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Enter current password"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              placeholder="Enter new password"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="cursor-pointer rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="cursor-pointer rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Update Password
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Password
            </span>
            <span className="text-base font-medium text-gray-900">
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
