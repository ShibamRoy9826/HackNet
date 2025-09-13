import { useTheme } from '@contexts/themeContext';
import * as ImagePicker from 'expo-image-picker';
import { Image, ImageSourcePropType } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";

interface Props {
    images: ImageSourcePropType[] | ImagePicker.ImagePickerAsset[],
    setImage: (img: ImageSourcePropType | ImagePicker.ImagePickerAsset) => void,
    currImage: ImageSourcePropType
}

export default function ImageRadioBtn({ images, setImage, currImage }: Props) {
    const { colors } = useTheme();

    return (
        <ScrollView
            horizontal
            style={{ width: "100%", height: 100, marginLeft: 30, marginVertical: 10 }}
        >
            {
                images.map((img, index) => (
                    <Pressable
                        key={index.toString()}
                        onPress={() => { setImage(img); }}>
                        <Image
                            source={img}
                            style={[currImage == img ? { borderColor: colors.secondary, borderWidth: 1 } : {}, { borderRadius: 5, width: 70, height: 70, margin: 3 }]}
                        />
                    </Pressable>
                )
                )
            }
        </ScrollView>
        // <FlatList
        //     horizontal
        //     data={images}
        //     keyExtractor={(item: string, index: number) => index.toString()}
        //     renderItem={({ item }: { item: string }) => (
        //         <Image
        //             source={{ uri: item }}
        //             style={{ width: 70, height: 70, margin: 3 }}
        //         />

        //     )}
        //     style={{ width: "100%", height: 100 }}
        // />

    )

}