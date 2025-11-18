"use client";

import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";


interface Props {
  organizationId: string;
};

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

        const screenComponent = {
        "auth": <WidgetAuthScreen/>,
        "loading": <div>Loading</div>,
        "selection": <div>Selection</div>,
        "voice": <div>Voice</div>,
        "inbox": <div>Inbox</div>,
        "chat": <div>Chat</div>,
        "contact": <div>Contact</div>,
        "error": <div>Error</div>,
    };  
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
           {screenComponent[screen]}
        </main>
    );
};

