import { Timestamp } from "firebase/firestore";

export type post = {
    id: string;
    uid: string;
    post_message: string;
    used_media: boolean;
    timestamp: Timestamp;
    media: string[];
    likes: number;
    num_comments: number;
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
    email?: string;
    num_logs?: number;
    num_tracking?: number;
    displayName?: string;
    displayNameLower?: string;
    createdAt?: Timestamp;
};
