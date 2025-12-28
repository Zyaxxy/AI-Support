"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ListIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon, Link } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { getCountryFromTimezone } from "../../../../lib/countryUtils";
import { api } from "@workspace/backend/_generated/api";
import { cn } from "@workspace/ui/lib/utils";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { usePathname } from "next/navigation";
export const ConversationsPanel = () => {
    const pathname = usePathname();
    const conversations = usePaginatedQuery(api.private.conversation.getMany,
        {
            status: undefined,

        },
        {
            initialNumItems: 10,
        },
    );

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
                {conversations.results.map((conversation) => {
                    const isLastMessageFromOperator = conversation.lastMessage?.message?.role !== "user";
                    const country = getCountryFromTimezone(conversation.contactSession.metadata?.timezone || "");
                    const countryFlagUrl = `https://flagcdn.com/w20/${country?.code?.toLowerCase()}`;

                    return (
                        <Link href={`/dashboard/conversations/${conversation._id}`} key={conversation._id}
                            className={cn("relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                                pathname === `/conversations/${conversation._id}` && "bg-accent text-accent-foreground")}>
                            <div className={cn("-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity duration-200",
                                pathname === `/conversations/${conversation._id}` && "opacity-100")}>
                            </div>
                            <DicebearAvatar
                                seed={conversation.contactSession._id}
                                size={40}
                                className="shrink-0"
                            />

                        </Link>
                    )
                })}
            </div>
        </ScrollArea>
    </div>
    )
};
