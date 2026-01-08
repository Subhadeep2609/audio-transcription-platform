import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../../api/api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await api<{ token: string }>("/api/auth/register", {
        method: "POST",
        body: { email, password },
        auth: false,
      });

      // backend returns JWT token
      login(data.token);
      navigate("/visualizer");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
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
