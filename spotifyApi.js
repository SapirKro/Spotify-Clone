import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { Buffer } from "buffer";

// Complete the web authentication session if applicable
WebBrowser.maybeCompleteAuthSession();

// Spotify API endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const MY_REDIRECT_URI = 'exp://192.168.1.160:8081/--/spotify-auth-callback/';
const LIMIT = 10;


/**
 * Fetches Spotify access token using the authorization code.
 * @param {string} code - Authorization code received from Spotify.
 * @returns {boolean} - Returns true if token is successfully fetched, otherwise false.
 */
export const fetchSpotifyToken = async (code) => {
  const querystring = require('querystring');
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": 'Basic ' + (new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'))
  };

  const data = {
    code,
    redirect_uri: MY_REDIRECT_URI,
    grant_type: 'authorization_code'
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(data),
      { headers }
    );

    const access_token = response.data.access_token;
    await AsyncStorage.setItem("token", access_token);
    const expirationDate = Date.now() + 1 * (60 * 60 * 1000); // Token valid for 1 hour
    await AsyncStorage.setItem("expirationDate", expirationDate.toString());
    return true;
  } catch (error) {
    console.error("Error fetching Spotify token: ", error);
    return false;
  }
};

/**
 * Checks the validity of the stored Spotify access token.
 * @returns {boolean} - Returns true if the token is valid, otherwise false.
 */
export const checkTokenValidity = async () => {
  const accessToken = await AsyncStorage.getItem("token");
  const expirationDate = await AsyncStorage.getItem("expirationDate");

  if (!accessToken || !expirationDate) {
    return false;
  }

  const currentTime = Date.now();
  if (currentTime < parseInt(expirationDate)) {
    // Token is still valid
    return true;
  } else {
    // Token expired, remove it from storage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("expirationDate");
    return false;
  }
};

/**
 * Custom hook for Spotify authentication using expo-auth-session.
 * @returns {Array} - Returns an array containing request, response, and promptAsync.
 */
export const useSpotifyAuth = () => {

  return useAuthRequest(
    {
      responseType: "code",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      scopes: [
        "user-read-private",
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public"
      ],
      usePKCE: false,
      redirectUri: MY_REDIRECT_URI
    },
    discovery
  );
};

/**
 * Fetches the user's saved tracks from Spotify.
 * @returns {Promise<Array>} - A promise that resolves to an array of saved tracks.
 */
export const getSavedTracks = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("token");

    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?offset=0&limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch the tracks");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching saved tracks:", error);
  }
};

/**
 * Fetches songs from a specific playlist.
 * @param {string} playlistId - ID of the playlist to fetch songs from.
 * @returns {Promise<Array>} - A promise that resolves to an array of songs.
 */
export const fetchPlaylistSongs = async (playlistId) => {
  const accessToken = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist songs");
    }

    const data = await response.json();
    return data.items;
  } catch (err) {
    console.error("Error fetching playlist songs:", err.message);
    throw err;
  }
};

/**
 * Retrieves the access token from AsyncStorage.
 * @returns {Promise<string>} - A promise that resolves to the access token.
 */
const getAccessToken = async () => {
  return await AsyncStorage.getItem("token");
};

/**
 * Fetches the user's playlists from Spotify.
 * @returns {Promise<Array>} - A promise that resolves to an array of playlists.
 */
export const getPlaylists = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/me/playlists?offset=0&limit=4`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    throw error;
  }
};

/**
 * Fetches the user's profile information from Spotify.
 * @returns {Promise<Object>} - A promise that resolves to the user's profile information.
 */
export const getProfile = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;

  } catch (err) {
    console.error("Error retrieving profile:", err.message);
    throw err;
  }
};

/**
 * Fetches the user's recently played songs from Spotify.
 * @returns {Promise<Array>} - A promise that resolves to an array of recently played songs.
 */
export const getRecentlyPlayedSongs = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (err) {
    console.error("Error retrieving recently played songs:", err.message);
    throw err;
  }
};

/**
 * Fetches the user's top artists from Spotify.
 * @returns {Promise<Array>} - A promise that resolves to an array of top artists.
 */
export const getTopArtists = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    /*     const customData = require('./topartist.json');
         console.log(customData.items); 
        return customData.items */
    return response.data.items;

  } catch (err) {
    console.error("Error retrieving top artists:", err.message);
    throw err;
  }
};

/**
 * Fetches songs from a specific album.
 * @param {string} albumId - ID of the album to fetch songs from.
 * @returns {Promise<Array>} - A promise that resolves to an array of album songs.
 */
export async function fetchAlbumSongs(albumId) {
  const accessToken = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch album songs");
    }

    const data = await response.json();
    const tracks = data.items;
    return tracks;
  } catch (err) {
    console.error("Error fetching album songs:", err.message);
    throw err;
  }
}

/**
 * Fetches all playlists of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of playlists.
 */
export const getAllPlaylists = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/me/playlists?offset=0&limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    throw error;
  }
};
