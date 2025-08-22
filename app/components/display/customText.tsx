import { Text } from 'react-native';

export default function CustomText(props) {
    return (
        <Text
            {...props}
            style={[{ fontFamily: "PhantomSans", fontWeight: 400 }, props.style]}
        >
            {props.children}
        </ Text>
        // <Text {...props} style={[{ fontFamily: "PhantomSans-Regular" }, props.style]}>
        //     {props.children}
        // </Text>
    )
}