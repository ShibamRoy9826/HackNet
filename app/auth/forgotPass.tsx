import { Button } from "@react-navigation/elements";
import { View, StyleSheet } from "react-native";
import InputBox from "../components/inptField";
import { useState, useRef } from "react";
import { sendPasswordResetEmail, } from "firebase/auth";
import { auth } from './firebase';
import ModalBox from "../components/modal";
import CustomText from "../components/customText";
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'ForgotPass'>;

export default function ForgotPassScreen({ navigation }: Props) {

    const [email, setEmail] = useState("");

    const [modalText, setModalText] = useState("");
    const [modalSubtext, setmodalSubtext] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const modalFnRef = useRef<() => void>(() => { });

    function alert(text: string, subtext: string, onClose?: () => void) {
        setModalVisible(true);
        setModalText(text);
        setmodalSubtext(subtext);

        modalFnRef.current = onClose || (() => { });
    }


    function handleForgotPass() {
        sendPasswordResetEmail(auth, email).then(
            () => {
                alert("Check your email", "A password reset link has been sent to your email, make sure to check your spam folder if you can't find it");
            }
        ).catch((e) => {
            alert(`(${e.code}) An error occured:(`, e.message);
        })
    }
    return (
        <View style={styles.container}>

            <ModalBox
                onClose={() => modalFnRef.current()}
                animation="fade"
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                text={modalText}
                subtext={modalSubtext}
            />
            <CustomText style={styles.heading}>
                Forgot password?
            </CustomText>
            <CustomText style={styles.subHeading}>
                No worries, enter your registered email ID for a password reset email
            </CustomText>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={email} valueFn={setEmail} color="#8492a6" icon="email" placeholder="Your Email" type="emailAddress" />
            </View>

            <Button color="white" style={styles.button} onPressIn={handleForgotPass}>
                Send Email
            </Button>

            <CustomText style={styles.smallTxt}>Recalled it? <CustomText style={styles.signupBtn} onPress={() => { navigation.navigate("Login") }}>Login back in here</CustomText></CustomText>

            <View
                style={{
                    width: "80%",
                    marginVertical: 3
                }}
            >
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#17171d",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    heading: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    subHeading: {
        color: "#8492a6",
        fontSize: 15,
        fontWeight: "normal",
        textAlign: "center",
        margin: 10,
        marginBottom: "5%"
    },
    fieldContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    smallTxt: {
        fontSize: 15,
        marginVertical: 20,
        color: "#8492a6"
    },
    button: {
        backgroundColor: "#ec3750",
        elevation: 10,
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 15
    },
    signupBtn: {
        color: "#4ea6f0",
        textDecorationLine: "underline",
        fontSize: 15
    },
    forgotPass: {
        color: "#4ea6f0",
        textDecorationLine: "underline",
        fontSize: 15,
        textAlign: "right",
        width: "100%",
        paddingRight: "10%",
        marginBottom: 20
    }
})
