// navigation and components
import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";

// firebase stuff
import { auth } from "@auth/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

//react and expo
import { useEffect, useState } from 'react';

export default function RootPage() {
    // handling loading state
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/auth/login");
        }
    }, [loading, user])

    if (loading) {
        return (
            <Stack>
                <Stack.Screen name="loading" options={{ headerShown: false }} />
            </Stack>
        )
    }

    return (
        <View >
            <Text>This is the root page</Text>
        </View>
    );
}