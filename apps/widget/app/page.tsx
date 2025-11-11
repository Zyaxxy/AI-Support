"use client";
import { useVapi } from "@/module/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";
import { Card, CardHeader, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  const {
    startCall,
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    endCall,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-4 backdrop-blur-md">
        <CardContent className="flex flex-col gap-6 mt-6">
          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 text-center text-sm"
          >
            <div>
              <p className="text-slate-400">Connected</p>
              <p
                className={`font-medium ${
                  isConnected ? "text-green-400" : "text-red-400"
                }`}
              >
                {isConnected ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Connecting</p>
              <p
                className={`font-medium ${
                  isConnecting ? "text-yellow-400" : "text-slate-500"
                }`}
              >
                {isConnecting ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Speaking</p>
              <p
                className={`font-medium ${
                  isSpeaking ? "text-cyan-400 animate-pulse" : "text-slate-500"
                }`}
              >
                {isSpeaking ? "Yes" : "No"}
              </p>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => startCall()}
              disabled={isConnecting || isConnected}
            >
              <Phone className="w-4 h-4 mr-2" /> Start Call
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => endCall()}
              disabled={!isConnected}
            >
              <PhoneOff className="w-4 h-4 mr-2" /> End Call
            </Button>
          </div>

          {/* Transcript */}
          <div className="mt-4 border-slate-700 rounded-xl p-3 max-h-64 overflow-y-auto text-sm leading-relaxed">
            {transcript.length > 0 ? (
              transcript.map((msg, i) => (
                <p
                  key={i}
                  className={`${
                    msg.role === "assistant"
                      ? "text-blue-400"
                      : "text-slate-200"
                  }`}
                >
                  {msg.role === "assistant" ? "AI: " : "You: "}
                  {msg.content}
                </p>
              ))
            ) : (
              <p className="text-slate-500 text-center italic">
                Transcript will appear here...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
