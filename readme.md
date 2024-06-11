# Spotify Clone App
<div align="center">
	<img src="https://github.com/SapirKro/Spotify-Clone/blob/main/screens_images/home_screen.png?raw=true" alt="Spotify Clone App" width="30%"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://github.com/SapirKro/Spotify-Clone/blob/main/screens_images/player.png?raw=true" alt="Spotify Clone App" width="30%"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://github.com/SapirKro/Spotify-Clone/blob/main/screens_images/album.png?raw=true" alt="Spotify Clone App" width="30%"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

A client-side Spotify clone, bringing the essence of Spotify directly to your device. 
This project aims to replicate the core functionalities of Spotify, allowing users to stream their recently played songs, playlists, and liked songs.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#Credits)


## Technologies Used
  - **Spotify Web API:** API provided by Spotify for accessing music data and user information.
  - **React Native:** Framework for building mobile applications using JavaScript and React.
  - **Expo:** Provides tools for building and deploying React Native applications with ease.
  - **Audio (Expo AV):** API for audio and video playback in Expo projects.
  - **Axios:** Promise-based HTTP client for making requests to the Spotify API.
  - **AsyncStorage:** Library for persisting data in React Native apps.


## Features
- **Stream User's Recently Played Songs:** Users can access and stream their recently played songs.
- **Stream User's Playlists:** Users can view and play their playlists directly within the application.
- **Get User's Top Artists:** The application fetches and displays the user's top artists based on their listening history.
- **Stream User's Liked Songs:** Users can listen to their liked songs from their Spotify library.


## Installation
To get a local copy up and running, follow these steps:

1. **Ensure You Have a Spotify Account**   
   Make sure you have a Spotify account, if not, create a new account.

2. **Clone the Repository**
    ```bash
    git clone https://github.com/SapirKro/Spotify-Clone.git
    ```

3. **Navigate to the Project Directory**
    ```bash
    cd Spotify-Clone
    ```

4. **Install Dependencies**
    ```bash
    npm install
    ```

5. **Set Up Spotify API**
    - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new app by clicking the "Create App" button.
    - In the "Redirect URIs" section, add:
      ```
      exp://192.168.1.160:8081/--/spotify-auth-callback/
      ```
    - In the "Which API/SDKs are you planning to use?" section, select:
        ```
        - Android / iOS
        - Web Playback SDK
        - Web API
        ```
      Choose iOS or Android, based on the phone you want to use.

    > **Note:** The Redirect URIs might need to change later, based on the address Expo chooses to open the app.Follow the next steps to ensure it's the correct URL.

6. **Configure Client ID and Client Secret**
    - Go to the "Settings" screen on the Spotify Developer Dashboard and copy the Client ID and Client Secret.
    - Paste them into the `spotifyApi.js` file:
      ```javascript
      const CLIENT_ID = 'your_client_id';
      const CLIENT_SECRET = 'your_client_secret';
      const MY_REDIRECT_URI = 'exp://192.168.1.160:8081/--/spotify-auth-callback/';
      ```

7. **Start the App**
    ```bash
    npx expo start
    ```

    Check the line:
    ```
    › Metro waiting on exp://192.168.1.160:8081
    ```
    As you can see the Expo Go address is: ```exp://192.168.1.160:8081```  
    Make sure Redirect URIs in Spotify Developer Dashboard has the same IP and port as in the current address Expo.  
    If not, change the IP and the port to match the Expo address in:  
    1.The Redirect URIs in Spotify Developer Dashboard.  
    2.The `MY_REDIRECT_URI` in `spotifyApi.js` file.

    For example, if you open the app and get the following Expo Go address:
    ```
    › Metro waiting on exp://192.168.1.110:8081
    ```
    The Redirect URIs in Spotify Developer Dashboard should be:
    ```
    exp://192.168.1.110:8081/--/spotify-auth-callback/
    ```
    The `MY_REDIRECT_URI` in the `spotifyApi.js` file should be:
    ```javascript
    const MY_REDIRECT_URI = 'exp://192.168.1.110:8081/--/spotify-auth-callback/';
    ```

Following these steps will help ensure that your Spotify integration works correctly with your Expo app.


## Usage
Once the app is running, open your Expo Go app on your mobile device and scan the provided QR code to start the app.  
Login with your Spotify account and enjoy!

> **Note:** Due to copyright restrictions, each song can only play a 30-second preview.

## Credits
- This project is inspired by the Spotify application and its design,and for study purpose only.  
- The following tutorial is used as a template: [YouTube Video Link](https://www.youtube.com/watch?v=mVd8XQ9Pl-0)
