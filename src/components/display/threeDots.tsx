import { useBottomSheetContext } from '@contexts/BottomSheetContext';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BottomSheetItem } from '@utils/types';
import { Pressable, View } from 'react-native';


interface Props {
    data: BottomSheetItem[],
    sheetHeader?: React.ReactNode;
    color?: string
}

export default function ThreeDots({ data, sheetHeader, color }: Props) {
    const { closedState, setSheetData, closeSheet, expandSheet, setHeader } = useBottomSheetContext();

    function toggleSheet() {
        setSheetData(data);
        setHeader(sheetHeader);
        if (closedState) {
            expandSheet();
        } else {
            closeSheet();
        }
    }

    return (
        <View>
            <Pressable onPress={toggleSheet}>
                <MaterialDesignIcons name="dots-vertical" size={25} color={color ? color : "#8492a6"} />
            </Pressable>
        </View>
    );
}