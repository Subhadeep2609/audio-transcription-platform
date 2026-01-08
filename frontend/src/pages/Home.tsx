import { motion } from "framer-motion";
import { Link , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<string[]>([
    "System bootstrapped successfully",
    "Awaiting audio input stream",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [
        ...prev.slice(-4),
        "Streaming audio → processing → AI inference",
      ]);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-br from-[#120000] via-[#1a0505] to-black text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-wide text-red-400">
            EchoSphere
          </div>

          <div className="hidden md:flex gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-red-400 transition">Features</a>
            <a href="#usecases" className="hover:text-red-400 transition">Use Cases</a>
            <a href="#pricing" className="hover:text-red-400 transition">Pricing</a>
            <a href="#contact" className="hover:text-red-400 transition">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-red-500/40 text-sm hover:bg-red-500/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl border border-red-500/40 text-sm hover:bg-red-500/10 transition"
                >
                  Register
                </Link>

                
              </>
            ) : (
              <>
                <Link
                  to="/visualizer"
                  className="px-6 py-2 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition shadow-lg shadow-red-500/30"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-red-500/40 text-sm hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.9 }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              EchoSphere <br />
              <span className="text-red-400">Real-Time Audio Intelligence</span>
            </h1>

            <p className="mt-6 text-slate-400 text-lg">
              EchoSphere is a full-stack SaaS platform that enables real-time audio
              capture, visualization, streaming transcription, and AI-powered
              insights — built for scale, speed, and reliability.
            </p>

            <div className="mt-10 flex gap-6">
              <Link
                to={isAuthenticated ? "/visualizer" : "/register"}
                className="px-8 py-4 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </Link>

              <a
                href="#features"
                className="px-8 py-4 rounded-xl border border-red-500/40 hover:bg-red-500/10 transition"
              >
                Explore Platform
              </a>
            </div>
          </div>

          <motion.img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
            className="rounded-3xl shadow-2xl shadow-red-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-32 bg-black/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">
            Core Platform Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Live Audio Visualization",
                points: [
                  "High-FPS circular waveform rendering",
                  "GPU-friendly Canvas drawing",
                  "Smooth amplitude & frequency mapping",
                  "Adaptive to mic & system audio",
                ],
              },
              {
                title: "Real-Time Transcription",
                points: [
                  "Chunk-based audio streaming",
                  "Low latency AI inference",
                  "Live partial & final transcripts",
                  "Supports long-running sessions",
                ],
              },
              {
                title: "Scalable SaaS Architecture",
                points: [
                  "Reactive backend pipelines",
                  "WebSocket & SSE support",
                  "Cloud-native deployment",
                  "Designed for high concurrency",
                ],
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -8 }}
                className="p-8 bg-[#140404] rounded-2xl border border-red-500/20"
              >
                <h3 className="text-xl font-semibold text-red-400 mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  {item.points.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Teams Choose EchoSphere
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["⚡ Ultra Low Latency", "Optimized streaming pipeline with millisecond-level response times."],
              ["🎯 Production-Grade Accuracy", "AI transcription tuned for real-world audio conditions."],
              ["🧩 Modular & Extensible", "Easily plug in new AI models, pipelines, or data sinks."],
              ["☁️ Cloud-First Design", "Built for Vercel & Render with horizontal scalability."],
            ].map(([title, desc]) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-[#140404] rounded-xl border border-red-500/20"
              >
                <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TECHNOLOGIES SLIDER */}
      <section className="py-24 bg-black/40 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xl text-red-300">
          {[
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Web Audio API",
            "Canvas API",
            "Spring WebFlux",
            "WebSockets",
            "Gemini AI",
            "Docker",
            "Vercel",
            "Render",
          ].map((tech) => (
            <span key={tech} className="mx-16 inline-block font-medium">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Trusted by Developers & Teams
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["https://i.pravatar.cc/150?img=14", "Aarav", "EchoSphere feels like a real production-grade SaaS platform."],
              ["https://i.pravatar.cc/150?img=22", "Meera", "The real-time audio visualization is incredibly smooth."],
              ["https://i.pravatar.cc/150?img=48", "Rohan", "A solid example of modern full-stack and AI integration."],
            ].map(([img, name, text]) => (
              <div key={name} className="p-8 bg-[#140404] rounded-2xl border border-red-500/20">
                <img src={img} className="w-14 h-14 rounded-full mb-4" />
                <p className="text-slate-300">“{text}”</p>
                <p className="mt-4 text-red-400 font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-32 bg-black/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Transparent Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { plan: "Starter", price: "Free", features: ["Live audio visualizer", "Basic transcription", "Local usage", "Community support"] },
              { plan: "Pro", price: "$19 / month", features: ["Unlimited sessions", "Real-time transcription", "Cloud streaming", "Priority updates"] },
              { plan: "Enterprise", price: "Custom", features: ["Dedicated backend", "High-volume streaming", "Custom AI models", "SLA & priority support"] },
            ].map((tier) => (
              <motion.div key={tier.plan} whileHover={{ y: -8 }} className="p-8 bg-[#140404] rounded-2xl border border-red-500/20">
                <h3 className="text-xl font-semibold text-red-400 mb-2">{tier.plan}</h3>
                <p className="text-3xl font-bold mb-4">{tier.price}</p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  {tier.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-32 bg-black/40">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Contact Sales / Request Demo</h2>
          <p className="text-center text-slate-400 mb-12">Tell us about your requirements and we’ll get back to you.</p>

          <form className="grid md:grid-cols-2 gap-6">
            <input className="input" placeholder="Full Name" />
            <input className="input" placeholder="Company / Organization" />
            <input className="input md:col-span-2" placeholder="Work Email" />
            <textarea className="input md:col-span-2" rows={4} placeholder="Describe your use case" />
            <button className="md:col-span-2 px-8 py-4 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition">
              Submit Request
            </button>
          </form>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-20 bg-black/60 text-slate-400">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white font-semibold mb-4">EchoSphere</h3>
            <p>Real-Time Audio Intelligence SaaS</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <p>Visualizer</p>
            <p>Transcription</p>
            <p>AI Processing</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Technology</h3>
            <p>React</p>
            <p>Spring WebFlux</p>
            <p>WebSockets</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Deployment</h3>
            <p>Vercel</p>
            <p>Render</p>
            <p>© {new Date().getFullYear()} EchoSphere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
