import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import { AuthProvider } from "./auth/context/AuthContext";
import ProtectedRoute from "./auth/components/ProtectedRoute";
import Visualizer from "./pages/Visualizer";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/visualizer"
          element={
            <ProtectedRoute>
              <Visualizer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
