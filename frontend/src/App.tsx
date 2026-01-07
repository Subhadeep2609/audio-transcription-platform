import { useEffect, useState } from "react";

function App() {
  const [micStatus, setMicStatus] = useState("Requesting microphone access...");

  useEffect(() => {
    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (stream) {
          setMicStatus("Microphone access granted");
        }
      } catch (error) {
        console.error(error);
        setMicStatus("Microphone access denied");
      }
    };

    initMicrophone();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">
          Audio Transcription Platform
        </h1>
        <p className="text-lg">{micStatus}</p>
      </div>
    </div>
  );
}

export default App;
