"use client";

import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "../lib/utils.js";


interface DicebearAvatarProps {
    seed: string;
    size?: number;
    className?: string;
    badgeClassName?: string;
    ImageUrl?: string;
    badgeImageUrl?: string;
}

export const DicebearAvatar = ({
    seed,
    size = 32,
    className,
    badgeClassName,
    ImageUrl,
    badgeImageUrl,
}: DicebearAvatarProps) => {
    const avatarSrc = useMemo(() => {
        if (ImageUrl) {
            return ImageUrl
        }
        const avatar = createAvatar(glass, {
            seed: seed.toLowerCase().trim(),
            size,
        });
        return avatar.toDataUri();
    }, [seed, size]);
    const badgeSize = Math.round(size * 0.5);
    return <div className="relative inline-block" style={{ width: size, height: size }}>
        <Avatar className={cn("border", className)} style={{ width: size, height: size }}>
            <AvatarImage src={avatarSrc} alt="Image" />
        </Avatar>
        {badgeImageUrl && <div className={cn("absolute bottom-0 right-0 items-center justify-center overflow-hidden rounded-full border-2 border-background", badgeClassName)}
            style={{
                width: badgeSize,
                height: badgeSize,
                transform: "translate(15%, 15%)"
            }}>
            <img className="h-full w-full object-cover"
                height={badgeSize}
                width={badgeSize}
                src={badgeImageUrl}
                alt="Badge" />
        </div>}
    </div>
}       