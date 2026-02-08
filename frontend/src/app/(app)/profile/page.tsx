import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import ShippingAddressForm from "@/components/profile/ShippingAddressForm";
import PasswordSection from "@/components/profile/PasswordSection";

export default async function AccountOverview() {
  const cookie = await getCookies();
  const user = await getCurrentUser(cookie);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <PersonalInfoForm user={user} />
              <ShippingAddressForm user={user} />
              <PasswordSection />

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
