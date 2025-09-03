import { useBottomSheetContext } from '@contexts/BottomSheetContext';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BottomSheetItem } from '@utils/types';
import { useState } from 'react';
import { Pressable, View } from 'react-native';


interface Props {
    data: BottomSheetItem[]
}

export default function ThreeDots({ data }: Props) {
    const [isVisible, setVisible] = useState(false);
    const { setSheetData, closeSheet, expandSheet } = useBottomSheetContext();

    function toggleSheet() {
        setSheetData(data);
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