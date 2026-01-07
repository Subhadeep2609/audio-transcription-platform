import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<Visualizer />} />
    </Routes>
  );
}
