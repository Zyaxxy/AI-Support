import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
            <ResizablePanel size={30} minSize={20} maxSize={30}>
                <ConversationsPanel />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="h-full" size={70}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};