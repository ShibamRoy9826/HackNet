import { Text, TextProps } from 'react-native';

export default function CustomText(props: TextProps) {
    return (
        <Text
            {...props}
            style={[{ fontFamily: "PhantomSans", fontWeight: 400 }, props.style]}
        >
            {props.children}
        </ Text>
    )
}