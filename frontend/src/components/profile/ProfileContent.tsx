"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";
import {
  updatePersonalInfoAction,
  updateShippingAddressAction,
} from "@/services/profileActions";
import { SectionCard } from "./section-card";
import { EditModal, type FieldConfig } from "./edit-modal";
import { InfoField } from "./info-field";
import PasswordSection from "./PasswordSection";
import DeleteAccountSection from "./DeleteAccountSection";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Not provided";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

const personalInfoFields: FieldConfig[] = [
  { key: "phone", label: "Phone Number", type: "tel" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: ["", "Male", "Female", "Other", "Prefer not to say"],
  },
];

const addressFields: FieldConfig[] = [
  { key: "country", label: "Country", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "postalCode", label: "Postal Code", type: "text" },
  { key: "streetAddress", label: "Street Address", type: "text" },
  { key: "apartment", label: "Apartment / Unit", type: "text" },
];

export function ProfileContent({ user }: { user: User }) {
  const setUser = useAuthStore((s) => s.setUser);
  const [editing, setEditing] = useState<"personal" | "address" | null>(null);
  const [pending, setPending] = useState(false);

  const handleSave = async (
    type: "personal" | "address",
    values: Record<string, string>,
  ) => {
    setPending(true);
    try {
      if (type === "personal") {
        const formData = new FormData();
        formData.set("phone", values.phone ?? "");
        formData.set("dateOfBirth", values.dateOfBirth ?? "");
        formData.set("gender", values.gender ?? "");
        const result = await updatePersonalInfoAction(null, formData);
        if (result.success && result.data) setUser(result.data);
      } else {
        const formData = new FormData();
        formData.set("country", values.country ?? "");
        formData.set("city", values.city ?? "");
        formData.set("state", values.state ?? "");
        formData.set("postalCode", values.postalCode ?? "");
        formData.set("streetAddress", values.streetAddress ?? "");
        formData.set("apartment", values.apartment ?? "");
        const result = await updateShippingAddressAction(null, formData);
        if (result.success && result.data) setUser(result.data);
      }
      setEditing(null);
    } finally {
      setPending(false);
    }
  };

  const initials = `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`;
  const location = [user.city, user.state, user.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
        <main className="flex-1 overflow-y-auto">
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] sm:gap-5 sm:px-8 sm:py-6">
            <div className="relative shrink-0">
              <div className="relative size-22 overflow-hidden rounded-full border-[3px] border-gray-900">
                <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-300 to-gray-400">
                  <span className="text-3xl font-extrabold text-white">
                    {initials || "?"}
                  </span>
                </div>
              </div>
              <button className="absolute bottom-0.5 right-0.5 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-gray-900 text-white">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <div className="mb-0.5 text-lg font-extrabold text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {user.role === "ADMIN" ? "Admin" : "Client"}
              </div>
              {location && (
                <div className="text-sm text-gray-500">{location}</div>
              )}
            </div>
          </div>

          <SectionCard
            title="Personal Information"
            onEdit={() => setEditing("personal")}
          >
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-md:grid-cols-2">
              <InfoField
                label="First Name"
                value={user.firstName || "Not provided"}
              />
              <InfoField
                label="Last Name"
                value={user.lastName || "Not provided"}
              />
              <InfoField label="Email" value={user.email} />
              <InfoField
                label="Phone Number"
                value={user.phone || "Not provided"}
              />
              <InfoField
                label="Date of Birth"
                value={formatDate(user.dateOfBirth)}
              />
              <InfoField label="Gender" value={user.gender || "Not provided"} />
            </div>
          </SectionCard>

          <SectionCard title="Address" onEdit={() => setEditing("address")}>
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-md:grid-cols-2">
              <InfoField
                label="Country"
                value={user.country || "Not provided"}
              />
              <InfoField label="City" value={user.city || "Not provided"} />
              <InfoField label="State" value={user.state || "Not provided"} />
              <InfoField
                label="Postal Code"
                value={user.postalCode || "Not provided"}
              />
              <InfoField
                label="Street Address"
                value={user.streetAddress || "Not provided"}
              />
              <InfoField
                label="Apartment / Unit"
                value={user.apartment || "Not provided"}
              />
            </div>
          </SectionCard>

          <PasswordSection />
          <DeleteAccountSection />
        </main>
      </div>

      {editing === "personal" && (
        <EditModal
          title="Personal Information"
          fields={personalInfoFields}
          values={{
            phone: user.phone ?? "",
            dateOfBirth: formatDateForInput(user.dateOfBirth),
            gender: user.gender ?? "",
          }}
          pending={pending}
          onSave={(values) => handleSave("personal", values)}
          onClose={() => setEditing(null)}
        />
      )}

      {editing === "address" && (
        <EditModal
          title="Address"
          fields={addressFields}
          values={{
            country: user.country ?? "",
            city: user.city ?? "",
            state: user.state ?? "",
            postalCode: user.postalCode ?? "",
            streetAddress: user.streetAddress ?? "",
            apartment: user.apartment ?? "",
          }}
          pending={pending}
          onSave={(values) => handleSave("address", values)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
