import React, { useState, useContext, useRef, forwardRef, useImperativeHandle } from "react";
import { AntDesign, Entypo, Ionicons, Feather } from '@expo/vector-icons';
import { BottomModal, ModalContent } from "react-native-modals";
import { Player } from "./PlayerContext";
import { Audio } from "expo-av";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
/* import Toast from 'react-native-simple-toast'; */
// FloatingPlayer component that manages audio playback and UI
import { ToastAndroid, Platform, Alert} from 'react-native';

function notifyMessage() {
  if (Platform.OS === 'android') {
    ToastAndroid.show("toasttt andoird", ToastAndroid.SHORT)
  } else {
    Alert.alert("toasttt ios");
  }
}

const FloatingPlayer = forwardRef(({ image }, ref) => {
    useImperativeHandle(ref, () => ({
        playTrack,
        play,
        handlePauseWhenBack,
        isSongPlaying,
        setAllMyTracks,
        handlePlayPause
    }));

    // State variables
    const [isPlaying, setIsPlaying] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [myTracks, setMyTracks] = useState([]);
    const circleSize = 12;
    const value = useRef(0);
    const { currentTrack, setCurrentTrack } = useContext(Player);

    // Set all tracks for playback
    const setAllMyTracks = async (tracks) => {
        value.current = 0;
        if (tracks.length > 0) {
            setMyTracks(tracks);
        }
    };

    // Play the tracks by order 
    const playTrack = async (tracks) => {
        setCurrentTrack(tracks[0]);
        const result = await play(tracks[0], value.current);
        return result;
    };


    // Play the track using expo-av library
    const play = async (trackToPlay, index) => {
        const preview_url = trackToPlay?.track?.preview_url || trackToPlay?.preview_url;
        if (preview_url == null) {
            const msg="Preview of the song isn\'t available in US market"
            console.log(msg)
            if (Platform.OS === 'android') {
                ToastAndroid.show(msg, ToastAndroid.SHORT)
              } else {
                Alert.alert(msg);
              }
            return trackToPlay;
        }
        else {
            try {
                if (currentSound) {
                    await currentSound.stopAsync();
                }
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: false,
                });
                const { sound, status } = await Audio.Sound.createAsync(
                    { uri: preview_url },
                    { shouldPlay: true, isLooping: false },
                    onPlaybackStatusUpdate
                );
                onPlaybackStatusUpdate(status);
                setCurrentSound(sound);
                setIsPlaying(status.isLoaded);
                value.current = index
                await sound.playAsync();
                return trackToPlay;
            } catch (err) {
                console.log(err.message);
            }
        }
    };

    // Update playback status
    const onPlaybackStatusUpdate = async (status) => {
        if (status.isLoaded && status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            setProgress(progress);
            setCurrentTime(status.positionMillis);
            setTotalDuration(status.durationMillis);
        }
        if (status.didJustFinish) {
            setCurrentSound(null);
            playNextTrack();
        }
    };

    // Format time for display
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };


    // Play the next track in the list
    const playNextTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current += 1;
        if (value.current < myTracks.length) {
            //do nothing
        } else {
            //end of list,strat from begining
            value.current = 0
        }
        const nextTrack = myTracks[value.current];
        setCurrentTrack(nextTrack);
        await play(nextTrack, value.current);
    };

    // Play the previous track in the list
    const playPreviousTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current -= 1;
        if (value.current >= 0) {
            //do nothing
        } else {
            //start from begining
            value.current = 0
        }
        const nextTrack = myTracks[value.current];
        setCurrentTrack(nextTrack);
        await play(nextTrack, value.current);
    };

    // Handle play/pause button action
    const handlePlayPause = async () => {
        if (currentSound) {
            if (isPlaying) {
                await currentSound.pauseAsync();
            } else {
                await currentSound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle play/pause when the modal is closed
    const handlePauseWhenBack = async () => {
        if (currentSound && isPlaying) {
            await currentSound.pauseAsync();
        }
        setCurrentSound(null);
        setIsPlaying(false);
        setCurrentTrack(null);
    };

    // Check if a song is currently playing
    const isSongPlaying = () => isPlaying;

    // Determine the image URL for the current track
    const url_image = currentTrack?.track?.album?.images[0]?.url || image;
    return (
        <>
            {currentTrack && <Pressable
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                    backgroundColor: "#5072A7",
                    width: "90%",
                    padding: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 15,
                    position: "absolute",
                    borderRadius: 6,
                    left: 20,
                    bottom: 10,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: url_image }}
                    />

                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 13,
                            width: 220,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >

                        {currentTrack?.track?.name ? currentTrack?.track?.name : currentTrack?.name} •{" "}
                        {/* {currentTrack?.track?.name} •{" "} */}
                        {currentTrack?.track?.artists[0].name ? currentTrack?.track?.artists[0].name : currentTrack?.artists[0].name}
                        {/* {currentTrack?.track?.artists[0].name} */}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <AntDesign name="heart" size={24} color="#1DB954" />

                    <Pressable onPress={handlePlayPause}>
                        {isPlaying ? (
                            <AntDesign name="pausecircle" size={24} color="white" />
                        ) : (
                            <Pressable
                                onPress={handlePlayPause}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                            >
                                <Entypo name="controller-play" size={24} color="black" />
                            </Pressable>
                        )}
                    </Pressable>
                    {/*  <Pressable >
                <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable> */}
                </View>
            </Pressable>}
            <BottomModal
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(false)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
            >
                <ModalContent
                    style={{ height: "100%", width: "100%", backgroundColor: "#5072A7" }}
                >
                    <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
                        <Pressable
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <AntDesign
                                onPress={() => setModalVisible(!modalVisible)}
                                name="down"
                                size={24}
                                color="white"
                            />

                            <Text
                                style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
                            >

                                {/* {currentTrack?.track?.name} */}
                                {currentTrack?.track?.name ? currentTrack?.track?.name : currentTrack?.name}
                            </Text>

                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </Pressable>

                        <View style={{ height: 70 }} />

                        <View style={{ padding: 10 }}>
                            <Image
                                style={{ width: "100%", height: 330, borderRadius: 4 }}
                                source={{ uri: url_image }}
                            />
                            <View
                                style={{
                                    marginTop: 20,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                                    >

                                        {/* {currentTrack?.track?.name} */}
                                        {currentTrack?.track?.name ? currentTrack?.track?.name : currentTrack?.name}
                                    </Text>
                                    <Text style={{ color: "#D3D3D3", marginTop: 4 }}>

                                        {/* {currentTrack?.track?.artists[0].name} */}
                                        {currentTrack?.track?.artists[0].name ? currentTrack?.track?.artists[0].name : currentTrack?.artists[0].name}
                                    </Text>
                                </View>

                                <AntDesign name="heart" size={24} color="#1DB954" />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <View
                                    style={{
                                        width: "100%",
                                        marginTop: 10,
                                        height: 3,
                                        backgroundColor: "gray",
                                        borderRadius: 5,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.progressbar,
                                            { width: `${progress * 100}%` },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            {
                                                position: "absolute",
                                                top: -5,
                                                width: circleSize,
                                                height: circleSize,
                                                borderRadius: circleSize / 2,
                                                backgroundColor: "white",
                                            },
                                            {
                                                left: `${progress * 100}%`,
                                                marginLeft: -circleSize / 2,
                                            },
                                        ]}
                                    />
                                </View>
                                <View
                                    style={{
                                        marginTop: 12,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                                    >

                                        {formatTime(currentTime)}
                                    </Text>

                                    <Text
                                        style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                                    >

                                        {formatTime(totalDuration)}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: 17,
                                }}
                            >
                                <Pressable>
                                    {  /* <FontAwesome name="arrows" size={30} color="#03C03C" />*/}
                                </Pressable>
                                <Pressable onPress={playPreviousTrack} >
                                    <Ionicons name="play-skip-back" size={30} color="white" />
                                </Pressable>
                                <Pressable onPress={handlePlayPause} >
                                    {isPlaying ? (
                                        <AntDesign name="pausecircle" size={60} color="white" />
                                    ) : (
                                        <Pressable
                                            onPress={handlePlayPause}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                                backgroundColor: "white",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Entypo name="controller-play" size={26} color="black" />
                                        </Pressable>
                                    )}
                                </Pressable>
                                <Pressable onPress={playNextTrack}>
                                    <Ionicons name="play-skip-forward" size={30} color="white" />
                                </Pressable>
                                <Pressable>
                                    <Feather name="repeat" size={30} color="#03C03C" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );

});

export default FloatingPlayer;

const styles = StyleSheet.create({
    progressbar: {
        height: "100%",
        backgroundColor: "white",
    },
});