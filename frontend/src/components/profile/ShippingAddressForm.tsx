"use client";

import { updateShippingAddressAction } from "@/services/profileActions";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useEditableForm } from "@/hooks/useEditableForm";
import { FieldError } from "@/components/ui/FieldError";

export default function ShippingAddressForm({ user }: { user: User }) {
  const setUser = useAuthStore((s) => s.setUser);
  const { editing, setEditing, state, formAction, isPending, getFieldErrors } =
    useEditableForm(updateShippingAddressAction, (data) => {
      if (data) setUser(data);
    });

  if (!editing) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Shipping Address
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
            <p className="text-gray-600 text-sm mb-1">Country</p>
            <p className="text-gray-900">{user.country || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">City</p>
            <p className="text-gray-900">{user.city || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">State/Province</p>
            <p className="text-gray-900">{user.state || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Postal / ZIP Code</p>
            <p className="text-gray-900">{user.postalCode || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Street Address</p>
            <p className="text-gray-900">
              {user.streetAddress || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Apartment / Unit</p>
            <p className="text-gray-900">{user.apartment || "Not provided"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Shipping Address
        </h2>
      </div>
      <form action={formAction} className="space-y-4">
        {/* Country */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">Country</label>
          <input
            type="text"
            name="country"
            defaultValue={user.country ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              getFieldErrors("country") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldErrors("country") && (
            <FieldError message={getFieldErrors("country")![0]} />
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">City</label>
          <input
            type="text"
            name="city"
            defaultValue={user.city ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              getFieldErrors("city") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldErrors("city") && (
            <FieldError message={getFieldErrors("city")![0]} />
          )}
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            State/Province
          </label>
          <input
            type="text"
            name="state"
            defaultValue={user.state ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              getFieldErrors("state") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldErrors("state") && (
            <FieldError message={getFieldErrors("state")![0]} />
          )}
        </div>

        {/* Postal/ZIP Code */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            Postal / ZIP Code
          </label>
          <input
            type="text"
            name="postalCode"
            defaultValue={user.postalCode ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              getFieldErrors("postalCode") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldErrors("postalCode") && (
            <FieldError message={getFieldErrors("postalCode")![0]} />
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="streetAddress"
            defaultValue={user.streetAddress ?? ""}
            className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              getFieldErrors("streetAddress") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldErrors("streetAddress") && (
            <FieldError message={getFieldErrors("streetAddress")![0]} />
          )}
        </div>

        {/* Apartment/Unit */}
        <div>
          <label className="block text-gray-600 text-sm mb-2">
            Apartment / Unit (optional)
          </label>
          <input
            type="text"
            name="apartment"
            defaultValue={user.apartment ?? ""}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
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
