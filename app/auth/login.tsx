import { Button } from "@react-navigation/elements";
import { View, StyleSheet, Pressable } from "react-native";
import InputBox from "../components/inptField";
import { useState } from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import { useModalContext } from "../contexts/modalContext";
import CustomText from "../components/customText";
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { alert, updateActivity, setActivityVisible } = useModalContext();


    function handleSlackLogin() {
        console.log("Tried slack login");
    }
    function handleLogin() {
        setActivityVisible(true);
        updateActivity(0.1, "Logging in...");
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
                    navigation.replace("Tabs");
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
    return (
        <View style={styles.container}>

            <CustomText style={styles.heading}>
                Hack Net
            </CustomText>
            <CustomText style={styles.subHeading}>
                Social media for teen hackers.
                Made By a hackclubber, for hackclubbers!
            </CustomText>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={email} valueFn={setEmail} color="#8492a6" icon="email" placeholder="Your Email" type="emailAddress" />
                <InputBox secure={true} value={password} valueFn={setPassword} color="#8492a6" icon="key" placeholder="Your Password" type="password" />

            </View>
            <CustomText style={styles.forgotPass} onPress={() => { navigation.navigate("ForgotPass") }}>Forgot Password?</CustomText>
            <Button color="white" style={[styles.button, { backgroundColor: "#ec3750" }]} onPressIn={handleLogin}>
                Login
            </Button>

            <CustomText style={styles.smallTxt}>Don't have an account? <CustomText style={styles.signupBtn} onPress={() => { navigation.navigate("SignUp") }}>Sign up here</CustomText></CustomText>

            <View
                style={{
                    borderBottomColor: 'white',
                    width: "80%",
                    borderBottomWidth: 1,
                    marginVertical: 3
                }}
            >
            </View>

            <CustomText style={styles.subHeading}>
                or
            </CustomText>


            <Pressable style={[styles.button, { backgroundColor: "#8492a6" }]} onPress={handleSlackLogin}>
                <CustomText style={{ color: "white", fontSize: 15, marginRight: 6 }}>
                    Login With Slack
                </CustomText>
                <MaterialDesignIcons name="slack" size={20} color="white" />
            </Pressable>

            <CustomText style={{ color: "#8492a6" }}>(Coming soon)</CustomText>
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
