import Vapi from "@vapi-ai/web";


import { useEffect, useState } from "react";

interface TranscriptMessage{
    role: "user" | "assistant";
    content: string; 

};

export const useVapi = () => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        //only for development  
        const vapiInstance = new Vapi('61149591-a520-47e7-8308-452bc9bf0375');
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
            console.error(error,"error");  
            setIsConnecting(false);
        });

        vapiInstance.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev, 
                    {
                    role: message.role == "user" ? "user" : "assistant",
                    content: message.transcript,
                    }]);
            }
        });

        return () => {
            vapiInstance?.stop();
        };
    },[])

    const startCall = () => {
        setIsConnecting(true);

        if (vapi) {
            vapi.start('06583980-fcdd-4984-955c-dbf2c00d16e9');
        };
    }

    const endCall = () => {  
        if (vapi) {
            vapi.stop();

        };
    }

    return {
        isConnected,
        isConnecting,
        isSpeaking,
        transcript,
        startCall,
        endCall
    }

}