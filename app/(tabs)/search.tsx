//components
import FollowBox from "@components/containers/follow";
import Post from "@components/containers/post";
import CustomText from "@components/display/customText";
import NothingHere from "@components/display/nothing";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import RadioBtn from "@components/inputs/radioBtn";
import { FlatList, RefreshControl, StyleSheet, TextInput, View } from "react-native";

//react
import React, { useEffect, useState } from "react";

//contexts
// import { useUserData } from "../contexts/userContext";

//firebase
import { auth, db } from "@auth/firebase";
import { Timestamp, collection, getDocs, limit, query, where } from 'firebase/firestore';

//typecasting
import { post } from "@utils/types";

///navigation


type UserData = {
    id: string;
    bio?: string;
    avatar?: string;
    email?: string;
    num_logs?: number;
    num_trackers?: number;
    num_tracking?: number;
    displayName?: string;
    displayNameLower?: string;
    createdAt?: Timestamp;
};

export default function SearchScreen() {
    const user = auth.currentUser;
    const [search, setSearch] = useState("");
    const [userResults, setUserResults] = useState<UserData[]>([]);
    const [suggested, setSuggested] = useState<UserData[]>([]);
    const [postResults, setPostResults] = useState<post[]>([]);
    const [currTab, setCurrTab] = useState("Suggestions");

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
            ...(doc.data()) as Omit<post, "id">
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
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 50, alignItems: "center" }}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>

                <View style={styles.fieldContainer}>
                    <TextInput onSubmitEditing={handleSearch} value={search} onChangeText={setSearch} maxLength={50} autoCapitalize="none" textContentType={"none"} style={styles.text} placeholder={"Search HackNet"} placeholderTextColor={"#8492a6"} />
                </View>
                <OnlyIconButton
                    icon="magnify"
                    func={handleSearch}
                />
            </View>

            <RadioBtn
                options={["Hackers", "Posts", "Suggestions"]}
                iconList={["account", "post", "message"]}
                selected={currTab}
                setSelected={setCurrTab}
            />

            {currTab === "Hackers" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    {
                        (userResults.length === 0) ?
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.heading}>Search for other hackers</CustomText>
                                <NothingHere />
                            </View>
                            :
                            <CustomText style={styles.heading}>Hackers you may be looking for</CustomText>
                    }
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={userResults}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <FollowBox
                                avatar={item.avatar ? item.avatar : ""}
                                username={item.displayName ? item.displayName : ""}
                                bio={item.bio ? item.bio : ""}
                                user_id={item.id}
                            />
                        )} />
                </View>
            )}

            {currTab === "Posts" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    {
                        (postResults.length === 0) ?
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.heading}>Search for some logs</CustomText>
                                <NothingHere />
                            </View>
                            :
                            <CustomText style={styles.heading}>Logs you may be looking for</CustomText>
                    }
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={postResults}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Post comment_count={item.num_comments} like_count={item.likes} user_uid={user ? user.uid : ""} id={item.id} uid={item.uid} timestamp={item.timestamp} message={item.post_message} used_media={item.used_media} media={item.media} />
                        )}
                        removeClippedSubviews={true}
                    />
                </View>
            )}

            {currTab === "Suggestions" && (
                <View style={{ width: '100%', marginVertical: 25, paddingHorizontal: 10, flex: 1 }}>
                    <CustomText style={styles.heading}>Hackers you can follow</CustomText>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={suggested}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <FollowBox
                                avatar={item.avatar ? item.avatar : ""}
                                username={item.displayName ? item.displayName : ""}
                                bio={item.bio ? item.bio : ""}
                                user_id={item.id}
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
    }

});