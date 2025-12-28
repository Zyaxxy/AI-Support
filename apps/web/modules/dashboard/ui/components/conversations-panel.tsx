"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ListIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
export const ConversationsPanel = () => {

    return (<div className="flex flex-col h-full w-full bg-background text-side">
        <div className="flex h-full border-b gap-3.5 p-2">
            <div className="flex flex-col h-full w-full">
                <Select defaultValue="all"
                    onValueChange={(value) => console.log(value)}
                    value="all">
                    <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center justify-between gap-2">
                                <ListIcon className="size-4" />
                                <span> All</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="unresolved">
                            <div className="flex items-center justify-between gap-2">
                                <ArrowRightIcon className="size-4" />
                                <span>Unresolved</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="escalated">
                            <div className="flex items-center justify-between gap-2">
                                <ArrowUpIcon className="size-4" />
                                <span>Escalated</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                            <div className="flex items-center justify-between gap-2">
                                <CheckIcon className="size-4" />
                                <span>Resolved</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
        <ScrollArea className="max-h-[calc(100vh-53px)]">
            <div className="flex flex-1 flex-col w-full">

            </div>
        </ScrollArea>
    </div>
    )
};
