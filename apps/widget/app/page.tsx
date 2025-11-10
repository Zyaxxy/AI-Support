"use client";
import { useVapi } from "@/module/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";
export default function Page() {
  const { startCall, 
          isConnected,
          isConnecting,
          isSpeaking,
          transcript,
          endCall } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <Button onClick={()=>startCall()}>Start Call</Button>
      <Button onClick={()=>endCall()}>End Call</Button>

      <p>Is Connected: {isConnected ? "true" : "false"}</p>
      <p>Is Connecting: {isConnecting ? "true" : "false"}</p>
      <p>Is Speaking: {isSpeaking ? "true" : "false"}</p>
      <p>Transcript: {transcript.map((message) => message.content).join("\n")}</p>
    </div>
  )
}
