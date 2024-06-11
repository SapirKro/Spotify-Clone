import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

// ArtistCard Component
const ArtistCard = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Artist Image */}
      <Image
        style={styles.image}
        source={{ uri: item.images[0].url }}
      />
      {/* Artist Name */}
      <Text style={styles.text}>
        {item?.name}
      </Text>
    </View>
  );
};

export default ArtistCard;

// Styles for the ArtistCard component
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    marginTop: 10,
  },
});
