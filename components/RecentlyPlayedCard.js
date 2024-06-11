import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

// RecentlyPlayedCard Component
const RecentlyPlayedCard = ({ item, index }) => {
  const navigation = useNavigation();

  // Unique key for the album
  const key1 = item.track.album.id;

  return (
    <Pressable
      key={key1}
      onPress={() =>
        navigation.navigate("Info", {
          item: item,
          key: key1,
        })
      }
      style={styles.pressable}
    >
      {/* Album Image */}
      <Image
        style={styles.image}
        source={{ uri: item.track.album.images[0].url }}
      />
      <View style={styles.container}>
        {/* Track Name */}
        <Text numberOfLines={3} style={styles.text}>
          {item?.track?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

// Styles for the RecentlyPlayedCard component
const styles = StyleSheet.create({
  pressable: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  container: {
    width: 130,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    marginTop: 10,
    width: "100%",
  },
});
