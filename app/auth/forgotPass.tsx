//components
import CustomText from "@components/display/customText";
import CustomButton from "@components/inputs/customButton";
import InputBox from "@components/inputs/inptField";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { StyleSheet, View } from "react-native";

//firebase
import { auth } from '@auth/firebase';
import { sendPasswordResetEmail, } from "firebase/auth";

//react
import { useState } from "react";

//contexts
import { useModalContext } from "../../src/contexts/modalContext";

//navigation
import { useTheme } from "@contexts/themeContext";
import { useRouter } from "expo-router";


export default function ForgotPassScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState("");

    const { alert, updateActivity, setActivityVisible, setActivityText } = useModalContext();
    setActivityText("Sending");

    function handleForgotPass() {
        setActivityVisible(true);
        updateActivity(0.3, "Sending reset email...");
        sendPasswordResetEmail(auth, email).then(
            () => {
                updateActivity(1, "Sent!")
                setActivityVisible(false);
                alert("Check your email", "A password reset link has been sent to your email, make sure to check your spam folder if you can't find it");
            }
        ).catch((e) => {
            updateActivity(0.9, "Some error occured")
            setActivityVisible(false);
            alert(`(${e.code}) An error occured:(`, e.message);
        })
    }

    const styles = StyleSheet.create({
        container: {
            position: "relative",
            backgroundColor: colors.background,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        heading: {
            color: colors.text,
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
        },
        subHeading: {
            color: colors.muted,
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
            color: colors.muted,
        },
        link: {
            color: colors.secondary,
            textDecorationLine: "underline",
            fontSize: 15
        }
    })
    return (
        <View style={styles.container}>
            <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ position: "absolute", top: 50, left: 20 }} />

            <CustomText style={styles.heading}>
                Forgot password?
            </CustomText>

            <CustomText style={styles.subHeading}>
                No worries, enter your registered email ID for a password reset email
            </CustomText>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={email} valueFn={setEmail} color={colors.muted} icon="email" placeholder="Your Email" type="emailAddress" />
            </View>

            <CustomButton
                func={handleForgotPass}
                text="Send Email"
            />
            <CustomText style={styles.smallTxt}>Recalled it? <CustomText style={styles.link} onPress={() => { router.navigate("/auth/login") }}> Login back in here</CustomText></CustomText>
        </View>
    );
};
