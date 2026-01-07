import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login("user@example.com");
    navigate("/visualizer");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button className="w-full py-3 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition">
          Login
        </button>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        Don’t have an account?{" "}
        <Link to="/register" className="text-red-400 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
