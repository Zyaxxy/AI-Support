"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";


interface Props {
  organizationId: string;
};

export const WidgetView = ({ organizationId }: Props) => {
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p className="text-4xl font-bold">Hey there👋</p>
                    <p className="text-lg font-bold">
                        How can we help you today?
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex-1 overflow-auto">
                Content
                org: {organizationId}
            </div>
            <WidgetFooter />
        </main>
    );
};

