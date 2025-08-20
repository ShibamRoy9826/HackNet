import { Button } from "@react-navigation/elements";
import { ScrollView, View, StyleSheet, Pressable, RefreshControl } from "react-native";
import InputBox from "../components/inptField";
import { useState, } from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from './firebase';
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import CustomText from "../components/customText";
import { useModalContext } from "../contexts/modalContext";
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'SignUp'>;

function isValidEmail(email: string) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
export default function SignUpScreen({ navigation }: Props) {
    const { alert, updateActivity, setActivityVisible } = useModalContext();
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setCpassword] = useState("");

    const registerUser = async (email: string, password: string, name: string) => {
        setActivityVisible(true);
        updateActivity(0.2, "Creating User");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        updateActivity(0.3, "Updating Details");
        await updateProfile(user, {
            displayName: name,
            photoURL: 'https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg'
        }).then(() => { console.log("Profile updated successfully") });

        updateActivity(0.5, "Creating User Profile");
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            displayNameLower: user.displayName?.toLowerCase(),
            createdAt: new Date(),
            avatar: user.photoURL || null,
            num_trackers: 0,
            num_tracking: 0,
            num_logs: 0,
            friends: [],
            bio: "This Hacker hasn't set up their bio yet :("

        }).then().catch((e) => { console.log("Error occured while making db changes.", e.code, e.message) });

        updateActivity(0.8, "Sending verification email");
        await sendEmailVerification(user).then(() => console.log("SENT EMAIL ADDRESS!")).catch((e) => console.log("Couldn't register user :", e));
        updateActivity(1, "Done!");
        setActivityVisible(false);

    };

    function createUser() {
        if (password != confirmpassword) {
            alert("Failed", "Passwords don't match! Please re-enter")
        } else if (username == "") {
            alert("Failed", "Username Can't be empty! You can't be that much anonymous")
        } else if (password == "") {
            alert("Failed", "Password can't be empty! You don't want other hackers to hack into it!")
        } else if (email == "") {
            alert("Failed", "Email can't be empty! You will be in problem if you forget the password")
        }
        else if (!isValidEmail(email)) {
            alert("Failed", "Please enter a valid email! I swear I won't sell it...")
        }

        // Password checks
        else if (!(password.length >= 8)) {
            alert("Failed", "Password must have 8 characters! Including symbols, numbers and alphabets")
        }
        else if (!(/[^a-zA-Z0-9]/.test(password))) {
            alert("Failed", "Password doesn't have symbols, make it secure bruh...")
        }
        else if (!(/\d/.test(password))) {
            alert("Failed", "Password doesn't have numbers, make it secure bruh...")
        }

        else {
            registerUser(email, password, username).then(
                () => {
                    alert("Success!", "Further instructions for verification have been sent to your mail", () => { navigation.navigate("Login") });
                }
            ).catch(
                (error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert("Failed", "Email already in use, please use some other email! If you recently tried to sign up, check your email for verification")
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert("Failed", 'Hey, That email address is invalid!');
                    }
                }
            )
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (

        <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            <CustomText style={styles.heading}>
                Sign Up
            </CustomText>
            <CustomText style={styles.subHeading}>
                Get ready to be one of hackers!
            </CustomText>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={username} valueFn={setUserName} color="#8492a6" icon="account-circle" placeholder="Your Name" type="emailAddress" />
                <InputBox secure={false} value={email} valueFn={setEmail} color="#8492a6" icon="email" placeholder="Your Email" type="emailAddress" />
                <InputBox secure={true} value={password} valueFn={setPassword} color="#8492a6" icon="key" placeholder="Your Password" type="password" />
                <InputBox secure={true} value={confirmpassword} valueFn={setCpassword} color="#8492a6" icon="key" placeholder="Confirm Password" type="password" />
            </View>
            <Button color="white" style={styles.button} onPressIn={createUser}>
                Create Account
            </Button>

            <CustomText style={styles.smallTxt}>Already have an account? <CustomText style={styles.signupBtn} onPress={() => { navigation.navigate("Login") }}>Login here</CustomText></CustomText>

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


            <Pressable style={[styles.button, { backgroundColor: "#8492a6" }]} onPress={() => { console.log("tried slack login"); }}>
                <CustomText style={{ color: "white", fontSize: 15, marginRight: 6 }}>
                    Login With Slack
                </CustomText>
                <MaterialDesignIcons name="slack" size={20} color="white" />
            </Pressable>

            <CustomText style={{ color: "#8492a6" }}>(Coming soon)</CustomText>
        </ScrollView>
    );
};

const styles = StyleSheet.create(
    {
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
        inputBox: {
            backgroundColor: "#233345ff",
            borderRadius: 12,
            margin: 10,
            width: "80%",
            paddingHorizontal: 12,
            color: "white",
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
            color: "#ec3750",
            textDecorationLine: "underline",
            fontSize: 15
        }
    }
);
