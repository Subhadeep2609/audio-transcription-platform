import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <form className="space-y-4">
        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button className="w-full py-3 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition">
          Sign Up
        </button>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-red-400 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
