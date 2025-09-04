import { useBottomSheetContext } from '@contexts/BottomSheetContext';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BottomSheetItem } from '@utils/types';
import { useState } from 'react';
import { Pressable, View } from 'react-native';


interface Props {
    data: BottomSheetItem[],
    postId: string
}

export default function ThreeDots({ data, postId }: Props) {
    const [isVisible, setVisible] = useState(false);
    const { setSheetData, setExtraData, closeSheet, expandSheet } = useBottomSheetContext();

    function toggleSheet() {
        setSheetData(data);
        setExtraData({ postId: postId });
        setVisible(!isVisible);
        if (isVisible) {
            closeSheet();
        } else {
            expandSheet();
        }
    }

    return (
        <View>
            <Pressable onPress={toggleSheet}>
                <MaterialDesignIcons name="dots-vertical" size={25} color={"#8492a6"} />
            </Pressable>
        </View>
    );
}