import { useEffect, useRef, useState } from "react";

function App() {
  const [status, setStatus] = useState("Initializing audio...");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        setStatus("Audio analyser initialized");
      } catch (error) {
        console.error(error);
        setStatus("Failed to initialize audio");
      }
    };

    initAudio();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">
          Audio Transcription Platform
        </h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}

export default App;
