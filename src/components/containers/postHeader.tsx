import CustomText from "@components/display/customText";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { useTheme } from "@contexts/themeContext";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Post from "./post";

interface Props {
    isVisible: boolean,
    postId: string,
    id: string,
    user_uid: string,
    media: string[],
    used_media: boolean,
    timestamp: Timestamp,
    comment_count: number,
    uid: string
    message: string;

}
export default function PostHeader({ isVisible, postId, user_uid, media, used_media, message, timestamp, comment_count, uid }: Props) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    return (

        <View style={{ paddingTop: insets.top }}>
            <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ position: "absolute", top: 0, left: 20, zIndex: 5 }} />
            <CustomText style={{ color: colors.text, left: 80, fontSize: 18, top: 0, fontWeight: 700 }}>Post</CustomText>
            {
                isVisible ?
                    <Post id={postId} user_uid={user_uid} media={media} used_media={used_media} message={message}
                        timestamp={timestamp} comment_count={comment_count} uid={uid} />
                    : <View></View>
            }

        </View>
    )
}