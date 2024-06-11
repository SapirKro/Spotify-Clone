import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ArtistCard from "../components/ArtistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import { useNavigation } from "@react-navigation/native";
import {
  getPlaylists,
  getProfile,
  getRecentlyPlayedSongs,
  getTopArtists,
} from "../spotifyApi";


const HomeScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const navigation = useNavigation();

  // Fetch data from Spotify API
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [profileData, playlistsData, recentlyPlayedData, topArtistsData] = await Promise.all([
          getProfile(),
          getPlaylists(),
          getRecentlyPlayedSongs(),
          getTopArtists(),
        ]);
        /* console.log(profileData) */
        setUserProfile(profileData);
        setPlaylists(playlistsData);
        setRecentlyPlayed(recentlyPlayedData);
        
        setTopArtists(topArtistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);



  // Generate greeting message based on the current time
  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const message = greetingMessage();

  // Render each playlist item
  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("PlaylistInfo", {
            item: item,
          })
        }
        style={styles.playlistItem}
      >
        <Image
          style={styles.playlistImage}
          source={{ uri: item.images[0].url }}
        />
        <View style={styles.playlistInfo}>
          <Text
            numberOfLines={2}
            style={styles.playlistName}
          >
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        {/* User Profile and Greeting */}
        <View style={styles.profileContainer}>
          <View style={styles.greetingContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: userProfile?.images[0]?.url }}
            />
            <Text style={styles.greetingText}>
              {message} {userProfile?.display_name}!
            </Text>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>

        {/* Music and Podcast Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.musicButton}>
            <Text style={styles.musicButtonText}>Music</Text>
          </Pressable>
          <Pressable style={styles.podcastButton}>
            <Text style={styles.podcastButtonText}>
              Podcasts & Shows
            </Text>
          </Pressable>
        </View>

        {/* Quick Access to Liked Songs */}
        <View style={styles.quickAccessContainer}>
          <Pressable
            onPress={() => navigation.navigate("Liked")}
            style={styles.likedSongsContainer}
          >
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable style={styles.likedSongsIcon}>
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>
            <Text style={styles.likedSongsText}>Liked Songs</Text>
          </Pressable>

          <View style={styles.randomArtistContainer}>
            <Image
              style={styles.randomArtistImage}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <Text style={styles.randomArtistText}>
              Hiphop Tamhiza
            </Text>
          </View>
        </View>

        {/* Playlists */}
        <FlatList
          data={playlists}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.playlistWrapper}
          contentContainerStyle={styles.playlistContent}
          scrollEnabled={false}
        />

        {/* Top Artists */}
        <Text style={styles.sectionTitle}>
          Your Top Artists
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>

        {/* Recently Played */}
        <Text style={styles.sectionTitle}>
          Recently Played
        </Text>
        <FlatList
          data={recentlyPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecentlyPlayedCard item={item} key={index} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  profileContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  greetingText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  musicButton: {
    backgroundColor: "#1ED760",
    padding: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 45,
  },
  musicButtonText: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
  },
  podcastButton: {
    backgroundColor: "#282828",
    padding: 10,
    borderRadius: 50,
  },
  podcastButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
  },
  quickAccessContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: -8,
    marginBottom: 5,
  },
  likedSongsContainer: {
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#202020",
    borderRadius: 4,
    elevation: 3,
  },
  likedSongsIcon: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  likedSongsText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  randomArtistContainer: {
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginHorizontal: 9,
    marginVertical: 8,
    backgroundColor: "#202020",
    borderRadius: 4,
    elevation: 3,
  },
  randomArtistImage: {
    width: 55,
    height: 55,
  },
  randomArtistText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  playlistItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#282828",
    borderRadius: 4,
    elevation: 3,
  },
  playlistImage: {
    height: 55,
    width: 55,
  },
  playlistInfo: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  playlistName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
  playlistWrapper: {
    justifyContent: "space-between",
    gap: -9,
  },
  playlistContent: {
    gap: -5,
  },
  sectionTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 10,
  },
});
