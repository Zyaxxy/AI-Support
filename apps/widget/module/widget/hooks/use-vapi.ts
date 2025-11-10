import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // Prevent Vapi from initializing on the server
    if (typeof window === "undefined") return;

    const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
    if (!apiKey) {
      console.error("❌ Missing NEXT_PUBLIC_VAPI_KEY in environment variables");
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

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
      setIsConnecting(false);
    });

    vapiInstance.on("message", (message) => {
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

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = () => {
    if (!vapi) return;
    setIsConnecting(true);

    const assistantId = process.env.NEXT_PUBLIC_VAPI_AGENT_ID;
    if (!assistantId) {
      console.error("❌ Missing NEXT_PUBLIC_VAPI_AGENT_ID in environment variables");
      setIsConnecting(false);
      return;
    }

    // Must specify the type: assistant, squad, or workflow
    vapi.start(process.env.NEXT_PUBLIC_VAPI_AGENT_ID as string);

  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
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
