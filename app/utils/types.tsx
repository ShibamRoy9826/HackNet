import { Timestamp } from "firebase/firestore";


export interface comment {
    id: string,
    uid: string,
    message: string,
    timestamp: Timestamp,
    likes: number
}

export type UserData = {
    bio?: string;
    avatar?: string;
    email?: string;
    num_logs?: number;
    num_trackers?: number;
    num_tracking?: number;
    displayName?: string;
    createdAt?: Timestamp;
};

export type AppStackParamList = {
    EditProfile: undefined;
    Tabs: undefined;
    SignUp: undefined;
    Notifications: undefined;
    Comments: { post_id: string };
    ForgotPass: undefined;
    Login: undefined;
    Settings: undefined;
}
