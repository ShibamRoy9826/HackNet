import { Pressable, PressableProps } from "react-native";

export default function CustomPressable(props: PressableProps) {
    return (
        <Pressable
            {...props}
            android_ripple={{ color: "rgba(0,0,0,0.2)" }}
        >
            {props.children}
        </ Pressable>
    )
}