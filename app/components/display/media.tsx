import { Image, StyleProp, ImageStyle, StyleSheet, View } from "react-native";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

interface Props {
    source: string,
    style: StyleProp<ImageStyle>,
    resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center" | "none"
    onBuffer?: () => void,
    onError?: () => void,


}

const videoTypes = [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".flv",
    ".wmv",
    ".webm",
    ".3gp",
    ".mpeg",
    ".mpg",
    ".m4v",
    ".ogv"
];

export default function Media({ onBuffer, onError, source, style, resizeMode }: Props) {
    let type = "image";


    for (let i = 0; i < videoTypes.length; ++i) {
        if (source.endsWith(videoTypes[i])) {
            type = "video";
        }
    }
    if (type == "image") {
        return (
            <>
                <Image
                    source={{ uri: source }}
                    style={style}
                    resizeMode={resizeMode ? resizeMode : "contain"}
                >
                </Image>
            </>
        );
    }
    const player = useVideoPlayer(source, player => {
        player.loop = false;
        player.play();
        player.muted = false;
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    return (
        <>
            <VideoView
                style={[styles.video, style]}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />
            <View style={styles.controlsContainer}>
            </View>
        </>
    );

}

const styles = StyleSheet.create(
    {
        contentContainer: {
            flex: 1,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 50,
        },
        video: {
            width: 350,
            height: 275,
        },
        controlsContainer: {
            padding: 10,
        }
    }
)