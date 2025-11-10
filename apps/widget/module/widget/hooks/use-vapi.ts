import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // Prevent Vapi from loading on the server
    if (typeof window === "undefined") return;

    const init = async () => {
      const { default: Vapi } = await import("@vapi-ai/web");

      const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
      if (!apiKey) {
        console.error("❌ Missing NEXT_PUBLIC_VAPI_KEY");
        return;
      }

      const vapiInstance = new Vapi(apiKey);
      setVapi(vapiInstance);

      vapiInstance.on("call-start", () => {
        setIsConnected(true);
        setIsConnecting(false);
        setTranscript([]);
      });

      vapiInstance.on("call-end", () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
      });

      vapiInstance.on("speech-start", () => setIsSpeaking(true));
      vapiInstance.on("speech-end", () => setIsSpeaking(false));
      vapiInstance.on("error", (err: any) => {
        console.error("Vapi error:", err);
        setIsConnecting(false);
      });

      vapiInstance.on("message", (message: any) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          setTranscript((prev) => [
            ...prev,
            {
              role: message.role === "user" ? "user" : "assistant",
              content: message.transcript,
            },
          ]);
        }
      });
    };

    init();

    return () => {
      vapi?.stop?.();
    };
  }, []);

  const startCall = () => {
    if (!vapi) return;
    setIsConnecting(true);
    vapi.start(process.env.NEXT_PUBLIC_VAPI_AGENT_ID as string);
  };

  const endCall = () => {
    if (vapi) vapi.stop();
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};

