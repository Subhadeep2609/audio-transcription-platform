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
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const smoothRef = useRef<number[]>([]);
  const hueRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Recorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

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

  /* TRANSCRIBE */
  const handleTranscribe = () => {
    setTranscript("");
    setLoading(true);

    const token = localStorage.getItem("token");

    const eventSource = new EventSource(
      `http://localhost:8080/api/transcribe/stream?token=${token}`
    );

    eventSource.addEventListener("transcript", (e: MessageEvent) => {
      setTranscript((prev) => (prev ? prev + "\n" : "") + e.data);
    });

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };

    eventSource.addEventListener("complete", () => {
      eventSource.close();
      setLoading(false);
    });
  };

  /* CANVAS */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // INIT PARTICLES INSIDE CIRCLE
    const initParticles = () => {
      const cx = innerWidth / 2;
      const cy = innerHeight / 2 + innerHeight * 0.08;
      const radius = Math.min(innerWidth, innerHeight) * 0.22 * 0.9;

      particlesRef.current = Array.from({ length: 60 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;

        return {
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
        };
      });
    };

    initParticles();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };
    resize();
    window.addEventListener("resize", resize);

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

      // BASE STATIC CIRCLE (ANCHOR)
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hueRef.current % 360},90%,60%,0.6)`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ef4444";
      ctx.stroke();

      // PARTICLES INSIDE CIRCLE
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Bounce inside circle
        if (dist > baseRadius * 0.9) {
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx -= 2 * (p.vx * nx + p.vy * ny) * nx;
          p.vy -= 2 * (p.vx * nx + p.vy * ny) * ny;
        }

        ctx.fillStyle = `hsla(${(hueRef.current + dist) % 360},90%,60%,0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < bars; i++) {
        const raw = dataRef.current[i] / 255;
        smoothRef.current[i] = smoothRef.current[i] * 0.85 + raw * 0.15;
        const intensity = smoothRef.current[i];

        const angle = i * step;
        const x1 = cx + Math.cos(angle) * baseRadius;
        const y1 = cy + Math.sin(angle) * baseRadius;
        const x2 = cx + Math.cos(angle) * (baseRadius + intensity * baseRadius);
        const y2 = cy + Math.sin(angle) * (baseRadius + intensity * baseRadius);

        ctx.strokeStyle = `hsla(${(hueRef.current + i) % 360},90%,60%,0.6)`;
        ctx.lineWidth = 2;

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

      {/* TOP RIGHT */}
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

      {/* CENTER */}
      <div className="relative z-10 flex flex-col items-center  gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-300 text-xs animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          LIVE
        </div>

        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-md border border-red-500/20 rounded-2xl px-6 py-4 shadow-xl text-center">
          <h1 className="text-white text-xl sm:text-2xl font-semibold">
            Real-Time Audio Visualizer
          </h1>
          <p className="text-slate-300 mt-1">{status}</p>

          <button
            onClick={handleTranscribe}
            disabled={loading}
            className="mt-2 px-6 py-2 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition disabled:opacity-60"
          >
            {loading ? "Transcribing..." : "Transcribe"}
          </button>

          {transcript && (
            <p className="mt-4 text-slate-200 text-sm">{transcript}</p>
          )}
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs text-slate-500">
        Powered by EchoSphere
      </footer>
    </div>
  );
}
