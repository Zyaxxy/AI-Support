"use client";
import { LoaderIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string|null }) => {
  

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
            <p className="text-4xl font-bold">Hey there👋</p>
            <p className="text-lg font-bold">
                Let&apos;s get you started
            </p>
        </div>
        </WidgetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
            <LoaderIcon className="animate-spin"/>
            <p className="text-sm font-bold">
                Loading...
            </p>

        </div>
    </>
  );
};