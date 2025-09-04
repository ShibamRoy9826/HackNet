import OnlyIconButton from "@components/inputs/onlyIconButton"
import { sharePost, sharePostToFacebook, sharePostToReddit, sharePostToWhatsapp } from "@utils/otherUtils"
import { View } from "react-native"

interface Props {
    postId: string
}

export default function ShareBtns({ postId }: Props) {

    return (
        <View style={{ gap: 10, width: "100%", flexDirection: "row" }}>
            <OnlyIconButton
                func={() => { sharePostToWhatsapp(postId) }}
                icon='whatsapp'
            />

            <OnlyIconButton
                func={() => { sharePostToFacebook(postId) }}
                icon='facebook'
            />

            <OnlyIconButton
                func={() => { sharePostToReddit(postId) }}
                icon='reddit'
            />

            <OnlyIconButton
                func={() => { }}
                icon='link-variant'
            />

            <OnlyIconButton
                func={() => { sharePost(postId) }}
                icon='dots-horizontal'
            />
        </View>
    )
}