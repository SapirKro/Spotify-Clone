import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { getAllPlaylists, getProfile } from "../spotifyApi";

const LibraryScreen = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const navigation = useNavigation();

    // Fetch playlists from Spotify API
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const playlistsData = await getAllPlaylists();
                setPlaylists(playlistsData);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, []);

    // Fetch user profile from Spotify API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile();
                setUserProfile(profileData);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <ScrollView style={{ marginTop: 50 }}>
                {/* User Profile Section */}
                <View style={{ padding: 12 }}>
                    <View style={styles.userInfo}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: userProfile?.images[0]?.url }}
                        />
                        <View>
                            <Text style={styles.userName}>
                                {userProfile?.display_name || "Username"}
                            </Text>
                            <Text style={styles.userEmail}>
                                email@email.com
                               {/*  {userProfile?.email || "email@email.com"} */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Playlists Section */}
                <Text style={styles.playlistsTitle}>Your Playlists</Text>
                <View style={styles.playlistContainer}>
                    {playlists.map((item, index) => (
                        <Pressable
                            onPress={() =>
                                navigation.navigate("PlaylistInfo", {
                                    item: item,
                                })
                            }
                            key={index}
                        >
                            <View style={styles.playlistItem}>
                                <Image
                                    source={{
                                        uri: item?.images[0]?.url ||
                                            "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                                    }}
                                    style={styles.playlistImage}
                                />
                                <View>
                                    <Text style={styles.playlistName}>{item?.name}</Text>
                                    <Text style={styles.playlistDescription}>
                                        Playlist • Made for {userProfile?.display_name}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default LibraryScreen;

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: "cover",
    },
    userName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    userEmail: {
        color: "gray",
        fontSize: 16,
        fontWeight: "bold",
    },
    playlistsTitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        marginHorizontal: 12,
    },
    playlistContainer: {
        padding: 15,
    },
    playlistItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginVertical: 10,
    },
    playlistImage: {
        width: 67,
        height: 67,
        borderRadius: 4,
    },
    playlistName: {
        fontSize: 14,
        color: "white",
        fontWeight: "bold",
    },
    playlistDescription: {
        fontSize: 12,
        color: "#B3B3B3",
        marginTop: 7,
        fontWeight: "bold",
    },
});
