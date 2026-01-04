import Image from "next/image";

export const ConversationsView = () => {
    return (
        <div className="flex h-full flex-col flex-1 gap-y-4 bg-muted">
            <div className="flex flex-1 items-center justify-center gap-x-2">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                />
                <p className="text-xl font-semibold">Echo</p>
            </div>
        </div>
    );
};
