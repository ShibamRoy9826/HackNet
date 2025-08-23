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
    num_trackers?: number;
    num_tracking?: number;
    displayName?: string;
    displayNameLower?: string;
    createdAt?: Timestamp;
};

export type AppStackParamList = {
    EditProfile: undefined;
    Tabs: undefined;
    SignUp: undefined;
    Notifications: undefined;
    Comments: { post_id: string };
    OtherUser: { user_id: string };
    ForgotPass: undefined;
    Login: undefined;
    Settings: undefined;
}

export type AppAllList = {
    EditProfile: undefined;
    Tabs: undefined | { screen: string };
    SignUp: undefined;
    Notifications: undefined;
    Comments: { post_id: string };
    OtherUser: { user_id: string };
    ForgotPass: undefined;
    Login: undefined;
    Settings: undefined;
    Profile: undefined;
    Log: undefined;
    Home: undefined;
    Friends: undefined;
    Search: undefined;

}

export type AppTabParamList = {
    Profile: undefined;
    Log: undefined;
    Home: undefined;
    Friends: undefined;
    Search: undefined;
}

export type AppHomeHeaderList = {
    Home: undefined;
    Profile: undefined;
    Comments: { post_id: string };
    Settings: undefined;
    Notifications: undefined;
}
