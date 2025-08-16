import { RefreshControl, View, TextInput, StyleSheet, Pressable, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import FollowBox from "../components/follow";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import RadioBtn from "../components/radioBtn";
import { useUserData } from "../contexts/userContext";
import Post from "../components/post";
import { collection, getDocs, where, query, limit } from 'firebase/firestore';
import { db } from "../auth/firebase";
import { FlatList } from "react-native";

// import Post from "../components/post";

interface user {
    uid: string,
    bio: string,
    avatar: string,
    num_trackers: number,
    num_tracking: number,
    num_logs: number,
    displayName: string,
    displayNameLower: string,
    email: string,
}
interface post {
    id: string,
    uid: string,
    post_message: string,
    used_media: boolean,
}

export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const [userResults, setUserResults] = useState<user[]>([]);
    const [suggested, setSuggested] = useState<user[]>([]);
    const [postResults, setPostResults] = useState<post[]>([]);
    const [currTab, setCurrTab] = useState("Suggestions");
    const { userData } = useUserData();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    async function searchUsers() {
        const userQuery = search.trim().toLowerCase();
        const getUsersQuery = query(
            collection(db, "users"),
            where("displayNameLower", ">=", userQuery),
            where("displayNameLower", "<=", userQuery + "\uf8ff")
        )
        // const getPostsQuery=query(
        //     collection(db,"posts"),
        //     where("post_message",">=",userQuery),
        //     where("post_message","<=",userQuery+"\uf8ff")
        // )
        const snapshot = await getDocs(getUsersQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async function searchPosts() {
        const userQuery = search.trim().toLowerCase();
        const getUsersQuery = query(
            collection(db, "posts"),
            where("post_message", ">=", userQuery),
            where("post_message", "<=", userQuery + "\uf8ff"),
            limit(5)
        )
        const snapshot = await getDocs(getUsersQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async function suggestUsers() {
        const getUsersQuery = query(
            collection(db, "users")
        )
        const snapshot = await getDocs(getUsersQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async function handleSearch() {
        const userMatches = await searchUsers();
        const postMatches = await searchPosts();

        // console.log(postMatches);
        setUserResults(userMatches);
        setPostResults(postMatches);
    }

    useEffect(() => {
        async function sUsers() {
            const suggestedUsers = await suggestUsers();
            setSuggested(suggestedUsers);
        }
        sUsers();
    }, [])

    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 50, paddingBottom: 100, alignItems: "center" }}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>

                <View style={styles.fieldContainer}>
                    <TextInput value={search} onChangeText={setSearch} maxLength={50} autoCapitalize="none" textContentType={"none"} style={styles.text} placeholder={"Search HackNet"} placeholderTextColor={"#8492a6"} />
                </View>

                <Pressable style={styles.btn} onPress={handleSearch}>
                    <MaterialDesignIcons name={"magnify"} size={20} color={"white"} />
                </Pressable>

            </View>

            <RadioBtn
                options={["Hackers", "Posts", "Suggestions"]}
                iconList={["account", "post", "message"]}
                selected={currTab}
                setSelected={setCurrTab}
            />

            {currTab == "Hackers" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    {
                        (userResults.length == 0) ?
                            <View style={{ flex: 1 }}>
                                <Text style={styles.heading}>Search for other hackers</Text>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Image
                                        source={require("../../assets/images/empty-box.png")}
                                        style={{ borderRadius: 50, width: 70, height: 70, marginHorizontal: 10, marginVertical: 40 }}
                                    />
                                    <Text style={styles.subtext}>There's nothing here....</Text>
                                </View>
                            </View>
                            :
                            <Text style={styles.heading}>Hackers you may be looking for</Text>
                    }
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={userResults}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <FollowBox
                                avatar={item.avatar}
                                username={item.displayName}
                                bio={item.bio}
                            />
                        )} />
                </View>
            )}

            {currTab == "Posts" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    {
                        (postResults.length == 0) ?
                            <View style={{ flex: 1 }}>
                                <Text style={styles.heading}>Search for some logs</Text>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Image
                                        source={require("../../assets/images/empty-box.png")}
                                        style={{ borderRadius: 50, width: 70, height: 70, marginHorizontal: 10, marginVertical: 40 }}
                                    />
                                    <Text style={styles.subtext}>There's nothing here....</Text>
                                </View>
                            </View>
                            :
                            <Text style={styles.heading}>Logs you may be looking for</Text>
                    }
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={postResults}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Post uid={item.uid} timestamp="today at 12:00pm" message={item.post_message} used_media={item.used_media} />
                        )}
                        removeClippedSubviews={true}
                    />
                </View>
            )}

            {currTab == "Suggestions" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    <Text style={styles.heading}>Hackers you can follow</Text>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={suggested}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <FollowBox
                                avatar={item.avatar}
                                username={item.displayName}
                                bio={item.bio}
                            />
                        )}
                        style={{ backgroundColor: "#17171d", flex: 1, height: "80%", marginBottom: 100, }}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        backgroundColor: "#292932ff",
        borderRadius: 12,
        margin: 10,
        width: "75%",
        paddingHorizontal: 12,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    },
    text: {
        color: "white",
        textAlign: "left",
        width: "100%",
        paddingLeft: 10
    },
    heading: {
        color: "white",
        textAlign: "left",
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    subtext: {
        color: "#8492a6",
        textAlign: "center",
        paddingLeft: 10,
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 20
    },
    btn: {
        backgroundColor: "#292932ff",
        borderRadius: 10,
        margin: 3,
        padding: 10,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    }

});