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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
  const handleTranscribe = async () => {
    if (!mediaRecorderRef.current) return;

    setTranscript(null);
    setLoading(true);
    audioChunksRef.current = [];

    mediaRecorderRef.current.start();

    setTimeout(async () => {
      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current!.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await fetch("http://localhost:8080/api/transcribe", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });

          const data = await res.json();
          setTranscript(data.text);
        } catch {
          setTranscript("Transcription failed");
        } finally {
          setLoading(false);
        }
      };
    }, 4000);
  };

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

      for (let i = 0; i < bars; i++) {
        const raw = dataRef.current[i] / 255;
        smoothRef.current[i] = smoothRef.current[i] * 0.85 + raw * 0.15;
        const intensity = smoothRef.current[i];

        const angle = i * step;
        const x1 = cx + Math.cos(angle) * baseRadius;
        const y1 = cy + Math.sin(angle) * baseRadius;
        const x2 = cx + Math.cos(angle) * (baseRadius + intensity * baseRadius);

        ctx.strokeStyle = `hsla(${(hueRef.current + i) % 360},90%,60%,0.6)`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
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
      <div className="relative z-10 flex flex-col items-center pt-6 gap-4">
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
            className="mt-4 px-6 py-3 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-400 transition disabled:opacity-60"
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
