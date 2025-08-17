// import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dimensions, Modal, View, Text, StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';


interface Props {
    animation?: "slide" | "fade" | "none",
    isVisible: boolean,
    setIsVisible: (s: boolean) => void,
    progress: number,
    text: string,
}

const { width, height } = Dimensions.get("window");
export default function ActivityBox({ progress, animation, isVisible, setIsVisible, text }: Props) {
    return (
        <Modal
            animationType={animation}
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{text}</Text>
                    <Progress.Bar progress={progress} width={200} animationType="spring" color="#338eda" unfilledColor="#25252fff" borderWidth={1} borderColor="#25252fff" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: width,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    modalView: {
        margin: 20,
        backgroundColor: '#17171d',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#25252fff",
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 5,
        elevation: 2,
        backgroundColor: "#ec3750",
        position: "absolute",
        top: 0,
        right: 0,
        margin: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    modalSubtext: {
        marginBottom: 15,
        textAlign: 'center',
        color: "#8492a6",
        fontSize: 15
    },
});
