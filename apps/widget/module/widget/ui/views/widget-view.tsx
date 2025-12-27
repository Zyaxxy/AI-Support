"use client";

import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
import { WidgetInboxScreen } from "../screens/widget-inbox-screen";

interface Props {
    organizationId: string;
};

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponent = {
        "auth": <WidgetAuthScreen />,
        "loading": <WidgetLoadingScreen organizationId={organizationId} />,
        "selection": <WidgetSelectionScreen />,
        "voice": <div>Voice</div>,
        "inbox": <WidgetInboxScreen />,
        "chat": <WidgetChatScreen />,
        "contact": <div>Contact</div>,
        "error": <WidgetErrorScreen />,
    };
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponent[screen]}
        </main>
    );
};

