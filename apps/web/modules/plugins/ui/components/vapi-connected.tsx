"use client"

import { BotIcon, PhoneIcon,SettingsIcon , UnplugIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

interface VapiConnectedProps {
    onDisconnect: () => void;
}

export const VapiConnected = ({onDisconnect}: VapiConnectedProps) => {

    const [activeTab, setActiveTab ] = useState<"assistants" | "phone-numbers">("phone-numbers");
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Vapi Connected</CardTitle>
                    <CardDescription>Manage your Vapi integration</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="phone-numbers" className="w-full">
                        <TabsList>
                            <TabsTrigger value="phone-numbers">Phone Numbers</TabsTrigger>
                            <TabsTrigger value="assistants">Assistants</TabsTrigger>
                        </TabsList>
                        <TabsContent value="phone-numbers">
                            <p>Phone Numbers</p>
                        </TabsContent>
                        <TabsContent value="assistants">
                            <p>Assistants</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}