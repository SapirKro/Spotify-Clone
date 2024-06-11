import React, { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";

import SongItem from "../components/SongItem";
import FloatingPlayer from "../FloatingPlayer";
import { getSavedTracks } from "../spotifyApi"; // Import the function to fetch saved tracks

const LikedSongsScreen = () => {
    // Refs
    const floatingPlayerRef = useRef(null);

    // State variables
    const [searchedTracks, setSearchedTracks] = useState([]);
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);

    // Navigation
    const navigation = useNavigation();

    // Fetch saved tracks from Spotify API
    useEffect(() => {
        const fetchSavedTracks = async () => {
            try {
                const tracks = await getSavedTracks();
                setSavedTracks(tracks);
                if (floatingPlayerRef.current) {
                    await floatingPlayerRef.current.setAllMyTracks(tracks);
                }
            } catch (error) {
                console.error("Error fetching saved tracks:", error);
            }
        };

        fetchSavedTracks();
    }, []);

    // Filter tracks based on input when savedTracks or input changes
    useEffect(() => {
        if (savedTracks.length > 0) {
            handleSearch(input);
        }
    }, [savedTracks]);

    // Debounced search function
    const debouncedSearch = debounce(handleSearch, 800);
    function handleSearch(text) {
        const filteredTracks = savedTracks.filter((item) =>
            item.track.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchedTracks(filteredTracks);
    }
    const handleInputChange = (text) => {
        setInput(text);
        debouncedSearch(text);
    };

    // Handle press on play button
    const handlePress = async () => {
        if (floatingPlayerRef.current) {
            await floatingPlayerRef.current.setAllMyTracks(savedTracks);
            await floatingPlayerRef.current.playTrack(savedTracks);
        }
    };

    // Handle press on back button
    const handleBackPress = () => {
        if (floatingPlayerRef.current) {
            floatingPlayerRef.current.handlePauseWhenBack();
        }
        navigation.goBack();
    };

    return (
        <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, marginTop: 50 }}>
                {/* Back Button */}
                <Pressable onPress={handleBackPress} style={{ marginHorizontal: 10 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                {/* Search and Sort Section */}
                <Pressable
                    style={{
                        marginHorizontal: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 9,
                    }}
                >
                    <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: "#42275a",
                            padding: 9,
                            flex: 1,
                            borderRadius: 3,
                            height: 38,
                        }}
                    >
                        <AntDesign name="search1" size={20} color="white" />
                        <TextInput
                            value={input}
                            onChangeText={handleInputChange}
                            placeholder="Find in Liked songs"
                            placeholderTextColor={"white"}
                            style={{ fontWeight: "500", color: "white" }}
                        />
                    </Pressable>

                    <Pressable
                        style={{
                            marginHorizontal: 10,
                            backgroundColor: "#42275a",
                            padding: 10,
                            borderRadius: 3,
                            height: 38,
                        }}
                    >
                        <Text style={{ color: "white" }}>Sort</Text>
                    </Pressable>
                </Pressable>

                <View style={{ height: 50 }} />
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                        Liked Songs
                    </Text>
                    <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
                        430 songs
                    </Text>
                </View>

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                    }}
                >
                    <Pressable
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "#1DB954",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <AntDesign name="arrowdown" size={20} color="white" />
                    </Pressable>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Pressable
                            onPress={handlePress}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#1DB954",
                            }}
                        >
                            <Entypo name="controller-play" size={24} color="white" />
                        </Pressable>
                    </View>
                </Pressable>

                {searchedTracks.length === 0 ? (
                    // Show a loading indicator while data is being fetched
                    <ActivityIndicator size="large" color="gray" />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={searchedTracks}
                        scrollEnabled={false}
                        renderItem={({ item,index }) => (
                            <SongItem
                                item={item}
                                onPress={floatingPlayerRef.current.play}
                                isLiked={true}
                                floatingPlayerRef={floatingPlayerRef}
                                index={index}
                            />
                        )}
                    />
                )}
            </ScrollView>

            <FloatingPlayer ref={floatingPlayerRef} />
        </LinearGradient>
    );
};

export default LikedSongsScreen;
