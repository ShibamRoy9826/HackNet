import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from "react-native";

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

    const player = useVideoPlayer(source, player => {
        player.loop = false;
        player.play();
        player.muted = false;
    });

    useEvent(player, 'playingChange', { isPlaying: player.playing });

    if (type === "image") {
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
    return (
        // <VisibilitySensor
        //     onChange={() => { setIsVisible(!visible) }}
        //     // onPercentChange={setPercentVisible} // optional callback for % change
        //     threshold={{ top: 50, bottom: 50 }}
        // >

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
        // </VisibilitySensor>
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