//components
import CustomText from "@components/display/customText";
import CustomButton from "@components/inputs/customButton";
import IconButton from "@components/inputs/IconButton";
import InputBox from "@components/inputs/inptField";
import { StyleSheet, View } from "react-native";

//firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

//contexts
import { auth, db } from '@auth/firebase';
import { useNotificationContext } from "@contexts/notificationContext";
import { useTheme } from "@contexts/themeContext";
import { useModalContext } from "../../src/contexts/modalContext";

//func
import { handleSlackLogin } from "@utils/otherUtils";

//react 
import { useState } from "react";

//navigation
import { Redirect, useRouter } from "expo-router";


export default function LoginScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const user = auth.currentUser;
    const { alert, updateActivity, setActivityVisible, setActivityText } = useModalContext();
    const { expoPushToken } = useNotificationContext();

    if (user) {
        if (user.emailVerified) {
            return <Redirect href={"/(tabs)/home"} />
        }
    }

    setActivityText("Logging in");

    function handleLogin() {
        setActivityVisible(true);
        updateActivity(0.1, "Finding user");
        signInWithEmailAndPassword(auth, email, password).then(() => {
            const user = auth.currentUser;
            updateActivity(0.3, "Verifying user");
            if (user) {
                if (!user.emailVerified) {
                    setActivityVisible(false);
                    alert("Login Failed", "Please check your email, a verification link has been sent. If you can't find it, check your spam folder");
                } else {
                    updateActivity(1, "Done!");
                    setActivityVisible(false);
                    updateDoc(doc(db, "users", user.uid),
                        {
                            notificationToken: expoPushToken
                        });
                    router.replace("/(tabs)/home");
                }
            } else {
                updateActivity(0.6, "Something wrong happened");
                setActivityVisible(false);
                alert("Login Failed", "Something is wrong please try again!");
            }
        }).catch((e) => {
            updateActivity(0.6, "Something wrong happened");
            setActivityVisible(false);
            alert("Login Failed", "Invalid credentials! Please try again, " + e.code + e.message)
        })
    }
    const styles = StyleSheet.create({
        container: {
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
            width: "100%"
        },
        subHeading: {
            width: "100%",
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
            color: colors.muted
        },
        signupBtn: {
            color: colors.secondary,
            textDecorationLine: "underline",
            fontSize: 15
        },
        forgotPass: {
            color: colors.secondary,
            textDecorationLine: "underline",
            fontSize: 15,
            textAlign: "right",
            width: "100%",
            paddingRight: "10%",
            marginBottom: 20
        }
    })

    return (
        <View style={styles.container}>
            <CustomText style={styles.heading}>
                Hack Net
            </CustomText>
            <CustomText style={styles.subHeading}>
                Social media for teen hackers.{"\n"}
                Made By a hackclubber, for hackclubbers!
            </CustomText>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={email} valueFn={setEmail} color={colors.muted} icon="email" placeholder="Your Email" type="emailAddress" />
                <InputBox secure={true} eye={true} value={password} valueFn={setPassword} color={colors.muted} icon="key" placeholder="Your Password" type="password" />

            </View>
            <CustomText style={styles.forgotPass} onPress={() => { router.navigate("/auth/forgotPass") }}>Forgot Password?</CustomText>

            <CustomButton
                text="Login"
                func={handleLogin}
            />


            <CustomText style={styles.smallTxt}>Don&apos;t have an account? <CustomText style={styles.signupBtn} onPress={() => { router.navigate("/auth/signup") }}>Sign up here</CustomText></CustomText>

            <View
                style={{
                    borderBottomColor: colors.text,
                    width: "80%",
                    borderBottomWidth: 1,
                    marginVertical: 3
                }}
            >
            </View>

            <CustomText style={styles.subHeading}>
                or
            </CustomText>

            <IconButton
                text="Login With Slack"
                icon="slack"
                func={handleSlackLogin}
                disabled
            />
            <CustomText style={{ color: colors.muted }}>(Coming soon)</CustomText>
        </View>
    );
};
