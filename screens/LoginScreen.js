import React, { useEffect } from "react";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSpotifyAuth, checkTokenValidity, fetchSpotifyToken } from "../spotifyApi";
import { FontAwesome5 } from '@expo/vector-icons';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [request, response, promptAsync] = useSpotifyAuth();

    // Effect to handle Spotify authentication response
    useEffect(() => {
        if (response?.type === 'success') {
            const handleSpotifyAuth = async () => {
                const code = response.params.code;
                const result = await fetchSpotifyToken(code);
                if (result) {
                    navigation.navigate("Main");
                }
            };
            handleSpotifyAuth();
        }
    }, [response, navigation]);

    // Function to handle authentication process
    const authenticate = async () => {
        ///check if user already connect
        const validToken = await checkTokenValidity();
        if (validToken) {
            /* console.log("token ok") */
            ///user connected already - navigate to main screen
            navigation.replace("Main");
        } else {
            ///connect to spotify
            promptAsync();
         } 
    };
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <SafeAreaView>
                <View style={{ height: 50 }} />
                <Entypo style={{ textAlign: "center" }} name="spotify" size={150} color="white" />
                <Text
                    style={{ color: "white", fontSize: 30, fontWeight: "bold", textAlign: "center", marginTop: 40 }}>
                    Millions of Songs.{"\n"}Free on Spotify.</Text>

                <View style={{ height: 80 }} />
                <Pressable
                    style={{
                        backgroundColor: "#1ED760",
                        padding: 10,
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 337,
                        height: 49,
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: 7,
                    }}>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>Sign Up free</Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor: "#121212",
                    padding: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: 337,
                    height: 49,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginVertical: 7,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.8
                }}>
                    <AntDesign name="google" size={24} color="red" />
                    <Text style={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 17, textAlign: "center", flex: 1 }}>Continue with Google</Text>

                </Pressable>
                <Pressable style={{
                    backgroundColor: "#121212",
                    padding: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: 337,
                    height: 49,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginVertical: 7,
                    borderColor: "#C0C0C0",
                    borderWidth: 0.8
                }}>
                    <FontAwesome5 name="facebook" size={24} color="#105ACF" />
                    <Text style={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 17, textAlign: "center", flex: 1 }}>Continue with Facebook</Text>

                </Pressable>
                <Pressable onPress={authenticate} style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: 337,
                    height: 49,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginVertical: 0,
                }}>
                    <Text style={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 17, textAlign: "center", flex: 1 }}>Log in</Text>

                </Pressable>
            </SafeAreaView>
        </LinearGradient>);
};

export default LoginScreen;
