"use client";

import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";


interface Props {
  organizationId: string;
};

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

        const screenComponent = {
        "auth": <WidgetAuthScreen/>,
        "loading": <WidgetLoadingScreen organizationId={organizationId}/>,
        "selection": <div>Selection</div>,
        "voice": <div>Voice</div>,
        "inbox": <div>Inbox</div>,
        "chat": <div>Chat</div>,
        "contact": <div>Contact</div>,
        "error": <WidgetErrorScreen/>,
    };  
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
           {screenComponent[screen]}
        </main>
    );
};

