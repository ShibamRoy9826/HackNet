import CustomText from '@components/display/customText';
import CustomPressable from '@components/inputs/customPressable';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BottomSheetItem } from '@utils/types';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { StyleSheet } from 'react-native';
import { useTheme } from './themeContext';

type sheetContextType = {
    setSheetData: (data: BottomSheetItem[]) => void;
    setHeader: (data: React.ReactNode | undefined) => void;
    closeSheet: () => void;
    expandSheet: () => void;
    closedState: boolean;
}
const BottomSheetContext = createContext<sheetContextType | null>(null);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<BottomSheetItem[]>([]);
    const [Header, setH] = useState<React.ReactNode | undefined>();
    const [closedState, setClosedState] = useState(true);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const { colors } = useTheme();

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

    function setHeader(data: React.ReactNode) {
        setH(data);
    }
    function closeSheet() {
        bottomSheetRef.current?.close();
    }
    function expandSheet() {
        bottomSheetRef.current?.expand();
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
            backgroundColor: colors.background,
            borderColor: colors.border,
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: 'flex-start',
            zIndex: 1,
        },
    });


    return (
        <BottomSheetContext.Provider
            value={{
                setSheetData,
                setHeader,
                closeSheet,
                expandSheet,
                closedState
            }}
        >
            {children}
            <BottomSheet
                handleIndicatorStyle={{ backgroundColor: colors.text }}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                ref={bottomSheetRef}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: colors.background }}
                onChange={(index) => {
                    setClosedState(index === -1);
                }}

            >
                <BottomSheetView style={styles.contentContainer}>
                    {
                        Header ?
                            Header
                            :
                            null
                    }
                    {
                        data.map((item: BottomSheetItem) => (
                            <CustomPressable onPress={() => { item.func(); closeSheet() }} key={item.text} style={styles.button}>
                                <MaterialDesignIcons name={item.icon} color={colors.muted} size={25} />
                                <CustomText style={{ marginLeft: 10, color: colors.muted }}>
                                    {item.text}
                                </CustomText>
                            </CustomPressable>
                        ))
                    }
                </BottomSheetView>
            </BottomSheet>

        </BottomSheetContext.Provider>
    )
}

export function useBottomSheetContext() {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error("useUser must be used within a ModalContext");
    }
    return context;
}