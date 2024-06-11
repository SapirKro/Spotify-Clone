import { Image, Pressable, ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import SongItem from "../components/SongItem";
import { fetchPlaylistSongs } from "../spotifyApi"; // Import the fetchPlaylistSongs function
import FloatingPlayer from "../FloatingPlayer";


const PlaylistInfoScreen = () => {
  const floatingPlayerRef = useRef(null);
  const route = useRoute();
  const playlistUrl = route?.params?.item.external_urls.spotify;
  const playlistId = playlistUrl.split("/")[4];
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadSongs() {
      try {
        const tracks = await fetchPlaylistSongs(playlistId);
        setPlaylistTracks(tracks);
      } catch (err) {
        console.log(err.message);
      }
    }
    loadSongs();
  }, [playlistId]);

  // Handle press on play button
  const handlePress = async () => {
    if (floatingPlayerRef.current) {
      await floatingPlayerRef.current.setAllMyTracks(playlistTracks);
      await floatingPlayerRef.current.playTrack(playlistTracks);
    }
  };

  // Handle press on back button
  const handlePress2 = () => {
    if (floatingPlayerRef.current) {
      floatingPlayerRef.current.handlePauseWhenBack();
    }
    navigation.goBack();
  };

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ flexDirection: "row", padding: 12 }}>
          <Ionicons
            onPress={handlePress2}
            name="arrow-back"
            size={24}
            color="white"
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{ uri: route?.params?.item?.images[0].url }}
            />
          </View>
        </View>
        <Text
          style={{
            color: "white",
            marginHorizontal: 12,
            marginTop: 10,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {route?.params?.item?.name} 
        </Text>
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 10,
            gap: 7,
          }}
        >
          {route?.params?.item?.track?.artists?.map((item, index) => (
            <Text
              key={index}
              style={{ color: "#909090", fontSize: 13, fontWeight: "500" }}
            >
              {item.name}
            </Text>
          ))}
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
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
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
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={playlistTracks}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <SongItem
                item={item}
                onPress={floatingPlayerRef.current.play}
                isLiked={false}
                floatingPlayerRef={floatingPlayerRef}
              />
            )}
          />
        </View>
      </ScrollView>
      <FloatingPlayer ref={floatingPlayerRef} />
    </LinearGradient >
  );
};

export default PlaylistInfoScreen;

const styles = StyleSheet.create({});
