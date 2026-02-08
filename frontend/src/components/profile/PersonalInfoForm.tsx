"use client";

import { updatePersonalInfoAction } from "@/services/profileActions";
import { User } from "@/types/user";
import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function PersonalInfoForm({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updatePersonalInfoAction,
    null,
  );
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      if (state.data) setUser(state.data);
      setEditing(false);
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, setUser]);

  const dateOfBirth = user.dateOfBirth
    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
    : "";

  const renderError = (fieldName: string) => {
    const errors = state?.fieldErrors?.[fieldName];
    if (!errors || errors.length === 0) return null;
    return (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{errors[0]}</span>
      </p>
    );
  };

  if (!editing) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Personal Information
          </h2>
          <button
            onClick={() => setEditing(true)}
            className="text-red-500 text-sm font-medium hover:text-red-600"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">First Name</p>
            <p className="text-gray-900">{user.firstName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Last Name</p>
            <p className="text-gray-900">{user.lastName || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Email</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Phone Number</p>
            <p className="text-gray-900">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Date of Birth</p>
            <p className="text-gray-900">{dateOfBirth || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Gender</p>
            <p className="text-gray-900">{user.gender || "Not provided"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Personal Information
        </h2>
      </div>
      <form action={formAction} className="space-y-4">
        {/* First Name (read-only) */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">First Name</label>
          <input
            type="text"
            defaultValue={user.firstName}
            disabled
            className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Last Name (read-only) */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Last Name</label>
          <input
            type="text"
            defaultValue={user.lastName}
            disabled
            className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            disabled
            className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={user.phone ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              state?.fieldErrors?.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {renderError("phone")}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            defaultValue={dateOfBirth}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              state?.fieldErrors?.dateOfBirth
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {renderError("dateOfBirth")}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Gender</label>
          <select
            name="gender"
            defaultValue={user.gender ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              state?.fieldErrors?.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {renderError("gender")}
        </div>

        {/* Server error message */}
        {state?.message && !state.success && (
          <p className="text-sm text-red-500 text-center">{state.message}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium disabled:bg-gray-400"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
