import { View, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: "#17171d", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={20} />
        </View>
    );
}