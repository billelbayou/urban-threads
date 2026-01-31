import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center w-full my-24">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Register to start your elegant shopping experience.
          </p>
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
