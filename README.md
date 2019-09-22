# LIRI

A node.js application which takes a command and input data, and outputs the information to the console, as well as log.txt.

LIRI can search for the following information:
- Spotify track listings, based off of an title.
- Lookup concert venues and dates for a given band.
- Lookup information about movies,  including plot, actors, ratings, and more!

## Role 
I am the sole developer of this applicaiton.

## Overview
I have created functions using APIs for Spotify, OMDB, and Bands in Town to retrieve requested infomation.

I have also used the following node modules in order to accomplish this:
- axios
- moment
- node-spotify-api
- dotenv

## Installation
1. Copy the contents of the repo to your local machine.
2. Navigate to the directory where you copied the files to via Terminal/Bash.
3. run 'npm install' to install the required modules.

<!-- You will need to retrieve your own Spotify API keys for this to work.  You can accomplish this by doing the following:

1. Navigate to https://developer.spotify.com/my-applications/#!/
2. Login with your existing Spotify account, or, create a new account.
3. Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create
4. Regester a new application.  You can name this anything you want.  Click "Complete" once finished.
5. On the next screen, you should see your  -->

## Usage
    To search for a song in Spotify:
    node liri.js spotify-this-song <song name here>

    To search for concerts for an artist/band:
    node liri.js concert-this <artist/band name here>

    To view information about a movie:
    node liri.js movie-this <movie name here>

## Deployed Link
You can find the repository here:

https://github.com/GregoryDesmarais/LIRI

## Preview
![Preview of LIRI in action!](https://github.com/GregoryDesmarais/LIRI/blob/master/liri.gif)