import ShareBtns from '@components/containers/shareBtns';
import CustomText from '@components/display/customText';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BottomSheetData, BottomSheetItem } from '@utils/types';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

type sheetContextType = {
    setSheetData: (data: BottomSheetItem[]) => void;
    setExtraData: (data: BottomSheetData) => void;
    closeSheet: () => void;
    expandSheet: () => void;
}
const BottomSheetContext = createContext<sheetContextType | null>(null);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<BottomSheetItem[]>([]);
    const [extraData, setEData] = useState<BottomSheetData>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={1}
                appearsOnIndex={2}
            />
        ),
        []
    );

    function setSheetData(data: BottomSheetItem[]) {
        setData(data);
    }

    function setExtraData(data: BottomSheetData) {
        setEData(data);
    }
    function closeSheet() {
        bottomSheetRef.current?.close();
    }
    function expandSheet() {
        bottomSheetRef.current?.expand();
    }

    return (
        <BottomSheetContext.Provider
            value={{
                setSheetData,
                setExtraData,
                closeSheet,
                expandSheet
            }}
        >
            {children}
            <BottomSheet
                handleIndicatorStyle={{ backgroundColor: "white" }}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                ref={bottomSheetRef}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: "#17171d" }}

            >
                <BottomSheetView style={styles.contentContainer}>
                    <ShareBtns postId={extraData ? extraData.postId : ""} />
                    {
                        data.map((item: BottomSheetItem) => (
                            <Pressable onPress={item.func} key={item.text} style={styles.button}>
                                <MaterialDesignIcons name={item.icon} color="#bec5d0ff" size={25} />
                                <CustomText style={{ marginLeft: 10, color: "#bec5d0ff" }}>
                                    {item.text}
                                </CustomText>
                            </Pressable>
                        ))
                    }
                </BottomSheetView>
            </BottomSheet>

        </BottomSheetContext.Provider>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 15
    },
    contentContainer: {
        backgroundColor: "#17171d",
        borderColor: "#25252f",
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        zIndex: 1,
    },
});

export function useBottomSheetContext() {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error("useUser must be used within a ModalContext");
    }
    return context;
}