import Footer from "@/components/footer";
import Header from "@/components/header";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center w-full h-[450px] my-32">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Log in to continue shopping in style.
          </p>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
