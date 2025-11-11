"use client";
import { useVapi } from "@/module/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  const { startCall, endCall, isConnected, isConnecting, isSpeaking, transcript } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh bg-background text-foreground transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
        <CardContent className="flex flex-col gap-6 p-6">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-xl font-semibold text-primary tracking-tight"
          >
            Vapi Call Assistant
          </motion.h1>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Connected</p>
              <p
                className={`font-medium ${
                  isConnected ? "text-green-400" : "text-destructive"
                }`}
              >
                {isConnected ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Connecting</p>
              <p
                className={`font-medium ${
                  isConnecting ? "text-yellow-400" : "text-muted-foreground"
                }`}
              >
                {isConnecting ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Speaking</p>
              <p
                className={`font-medium ${
                  isSpeaking
                    ? "text-primary animate-pulse"
                    : "text-muted-foreground"
                }`}
              >
                {isSpeaking ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              onClick={() => startCall()}
              disabled={isConnecting || isConnected}
            >
              <Phone className="w-4 h-4 mr-2" /> Start
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
              onClick={() => endCall()}
              disabled={!isConnected}
            >
              <PhoneOff className="w-4 h-4 mr-2" /> End
            </Button>
          </div>

          {/* Transcript */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-3 rounded-xl bg-muted/40 border border-border max-h-64 overflow-y-auto text-sm leading-relaxed"
          >
            {transcript.length > 0 ? (
              transcript.map((msg, i) => (
                <p
                  key={i}
                  className={`${
                    msg.role === "assistant"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? "AI: " : "You: "}
                  {msg.content}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground text-center italic">
                Transcript will appear here...
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
