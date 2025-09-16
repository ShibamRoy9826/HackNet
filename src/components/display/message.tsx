import { auth } from "@auth/firebase";
import { useDataContext } from "@contexts/dataContext";
import { useTheme } from "@contexts/themeContext";
import { extractTime } from "@utils/stringTimeUtils";
import { message } from "@utils/types";
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "./customText";

interface Props {
    message: message,
}
export default function Message({ message }: Props) {
    const { colors } = useTheme();
    const [selected, setSelected] = useState(false);
    const { selectionMode, setSelectionMode, setMessageIds, messageIds } = useDataContext();

    const user = auth.currentUser


    function addSelectedId(id: string) {
        setMessageIds(prev => [...prev, id]);
    }

    function removeSelectedId(id: string) {
        setMessageIds(prev => prev.filter(m => m !== id));
    }


    useEffect(() => {
        if (messageIds.includes(message.id)) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [messageIds]);

    const styles = StyleSheet.create({
        text: {
            color: colors.text,
            fontSize: 15,
            textAlign: (user?.uid === message.sender) ? "right" : "left",
        },
        timestamp: {
            marginTop: 2,
            color: colors.smallText,
            fontSize: 12,
            textAlign: (user?.uid === message.sender) ? "right" : "left",
        },

        textContainer: {
            backgroundColor: (user?.uid === message.sender) ? colors.primary : colors.secondaryBackground,
            paddingVertical: 8,
            paddingHorizontal: 15,
            // borderRadius: 10,
            borderColor: colors.border,
            alignSelf: (user?.uid === message.sender) ? "flex-end" : "flex-start",
            elevation: 5,
            marginVertical: 5,
            maxWidth: "90%",

        },
        pressable: {
            backgroundColor: selected ? colors.darkBackground : colors.background,
            width: "100%"
        },

        selfMessage: {
            right: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        otherMessage: {
            left: 10,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
    })

    function handleLongPress() {
        if (!selected) {
            setSelectionMode(true);
            addSelectedId(message.id);
        }
        setSelected(!selected);
    }

    function handleShortPress() {
        if (selectionMode) {
            setSelected(!selected);
            if (!selected) {
                addSelectedId(message.id);
            } else {
                removeSelectedId(message.id);
            }
        }
    }

    return (
        <Pressable style={styles.pressable} onLongPress={handleLongPress} onPress={handleShortPress}>
            <View style={[styles.textContainer, (user?.uid === message.sender) ? styles.selfMessage : styles.otherMessage]}>
                <CustomText style={styles.text}>{message.text}</CustomText>
                <CustomText style={styles.timestamp}>{extractTime(message.createdAt, true)}</CustomText>
            </View>
        </Pressable>
    );
}