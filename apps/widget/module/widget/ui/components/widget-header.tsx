import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
})=> {
    return (
        <header className={cn(
            "bg-gradient-to-b from-[#06b6d4] via-[#2563eb] to-[#6366f1] p-4 text-primary-foreground",
             className)}>
            {children}
        </header>
    );
};