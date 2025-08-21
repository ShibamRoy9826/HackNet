import { Text } from 'react-native';

export default function CustomText(props) {
    return (
        <Text {...props} style={[{ fontFamily: "PhantomSans-Regular" }, props.style]}>
            {props.children}
        </Text>
    )
}