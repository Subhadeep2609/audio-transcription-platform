import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function VisualizerUI() {
  const [status, setStatus] = useState("Initializing...");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const smoothRef = useRef<number[]>([]);
  const hueRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* AUDIO INIT */
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(stream);

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.95;

        src.connect(analyser);

        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
        smoothRef.current = new Array(analyser.frequencyBinCount).fill(0);

        setStatus("Listening");
      } catch {
        setStatus("Microphone blocked");
      }
    })();
  }, []);

  /* CANVAS */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const initParticles = () => {
      const cx = innerWidth / 2;
      const cy = innerHeight / 2 + innerHeight * 0.08;
      const radius = Math.min(innerWidth, innerHeight) * 0.2;

      particlesRef.current = Array.from({ length: 60 }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        return {
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6,
        };
      });
    };

    initParticles();

    const draw = () => {
      requestAnimationFrame(draw);
      if (!analyserRef.current || !dataRef.current) return;

      analyserRef.current.getByteFrequencyData(dataRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = innerWidth / 2;
      const cy = innerHeight / 2 + innerHeight * 0.08;
      const baseRadius = Math.min(innerWidth, innerHeight) * 0.22;

      const bars = dataRef.current.length;
      const step = (Math.PI * 2) / bars;

      hueRef.current = (hueRef.current + 0.35) % 360;

      const glow = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.4,
        cx,
        cy,
        baseRadius * 2
      );
      glow.addColorStop(0, `hsla(${hueRef.current},90%,55%,0.12)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, innerWidth, innerHeight);

      const ringGradient = ctx.createConicGradient(
        (hueRef.current * Math.PI) / 180,
        cx,
        cy
      );
      ringGradient.addColorStop(0, "#ef4444");
      ringGradient.addColorStop(0.5, "#f97316");
      ringGradient.addColorStop(1, "#ef4444");

      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ef4444";
      ctx.stroke();

      const energy =
        dataRef.current.reduce((a, b) => a + b, 0) / (bars * 255);

      particlesRef.current.forEach(p => {
        p.x += p.vx * (0.5 + energy);
        p.y += p.vy * (0.5 + energy);

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > baseRadius * 0.9) {
          p.vx *= -1;
          p.vy *= -1;
        }

        ctx.fillStyle = `hsla(${(hueRef.current + dist) % 360},90%,60%,0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < bars; i++) {
        const raw = dataRef.current[i] / 255;
        smoothRef.current[i] =
          smoothRef.current[i] * 0.85 + raw * 0.15;

        const intensity = smoothRef.current[i];
        const waveLen = baseRadius * 0.12 + intensity * baseRadius * 0.9;

        const angle = i * step;
        const x1 = cx + Math.cos(angle) * baseRadius;
        const y1 = cy + Math.sin(angle) * baseRadius;
        const x2 = cx + Math.cos(angle) * (baseRadius + waveLen);
        const y2 = cy + Math.sin(angle) * (baseRadius + waveLen);

        const color = `hsla(${(hueRef.current + i) % 360},90%,60%,${0.4 + intensity})`;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.shadowBlur = 16;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#120000] via-[#1a0505] to-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* TOP RIGHT NAV */}
      <div className="relative z-10 w-full flex justify-end gap-3 px-6 pt-6">
        <Link
          to="/"
          className="px-4 py-2 rounded-xl border border-red-500/40 text-sm text-red-300 hover:bg-red-500/10 transition"
        >
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-red-500/40 text-sm text-red-300 hover:bg-red-500/10 transition"
        >
          Logout
        </button>
      </div>

      {/* STATUS */}
      <div className="relative z-10 flex flex-col items-center pt-2 gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-300 text-xs animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          LIVE
        </div>

        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-md border border-red-500/20 rounded-2xl px-6 py-4 shadow-xl">
          <h1 className="text-center text-white text-xl sm:text-2xl font-semibold tracking-wide">
            Real-Time Audio Visualizer
          </h1>
          <p className="text-center text-slate-300 mt-1 text-sm sm:text-base">
            {status}
          </p>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs text-slate-500">
        Powered by EchoSphere
      </footer>
    </div>
  );
}
