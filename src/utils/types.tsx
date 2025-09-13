import { Timestamp } from "firebase/firestore";
import React from "react";

export type post = {
    id: string;
    uid: string;
    post_message: string;
    used_media: boolean;
    timestamp: Timestamp;
    media: string[];
    likes: number;
    num_comments: number;
    comments_enabled: boolean;
}

export interface comment {
    id: string,
    uid: string,
    message: string,
    timestamp: Timestamp,
    likes: number
}

export type UserData = {
    uid: string;
    bio?: string;
    avatar?: string;
    banner: string;
    email?: string;
    num_logs?: number;
    num_tracking?: number;
    displayName?: string;
    displayNameLower?: string;
    createdAt?: Timestamp;
    notificationToken?: string;
};

export type BottomSheetItem = {
    text: string;
    func: () => void;
    icon: "delete" | "share-variant" | "account-plus" | "heart" | "exclamation" | "account-group" | "sticker-check-outline" | "account-minus"
};

export type BottomSheetData = {
    id: string;
    header?: React.ReactNode
};

export type notification = {
    id: string;
    title: string;
    message: string;
    data: { url: string };
    uid: string;
    createdAt: Timestamp;
}
export type friendRequest = {
    createdAt: Timestamp
    id: string;
}

export type friend = {
    createdAt: Timestamp
    id: string;
}

export type chat = {
    id: string,
    uids: string[],
    lastMessage: string,
    updatedAt: Timestamp
}
export type message = {
    id: string,
    text: string,
    sender: string,
    receiver: string,
    createdAt: Timestamp
}