require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var data = process.argv.splice(3).join("+") || "";

function updateLog(command, data) {
    fs.appendFile("log.txt", `${command} ${data}, `, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}


function displayTracks(items) {
    for (x in items) {
        var artist = items[x].artists[0].name;
        var title = items[x].name;
        var previewLink = items[x].preview_url;
        var album = items[x].album.name;
        console.log(`
            --------------------------
            Result ${parseInt(x) + 1} of ${items.length}
            Artist Name: ${artist}
            Album: ${album}
            Song Title: ${title}
            Preview URL: ${previewLink}
            --------------------------
            `)
    }
}

function searchSpotify(songName) {
    updateLog(command, data);
    if (songName === "") {
        spotify.request("https://api.spotify.com/v1/artists/5ksRONqssB7BR161NTtJAm/top-tracks?country=US")
            .then(function(response) {
                var resData = [{
                    artists: [{ name: response.tracks[1].album.artists[0].name }],
                    name: response.tracks[1].name,
                    album: { name: response.tracks[1].album.name },
                    preview_url: response.tracks[1].preview_url
                }]
                displayTracks(resData);
            })
    } else {
        spotify
            .search({ type: 'track', query: songName, limit: 5 })
            .then(function(response) {
                var items = response.tracks.items;
                displayTracks(items)
            })
            .catch(function(err) {
                console.log(err);
            });
    }

}

function movieInfo(title) {

}



switch (command) {
    case "spotify-this-song":
        searchSpotify(data);
        break;

    case "movie_this":
        movieInfo(data);
        break;

    default:
        console.log(`
        Application Usage:
        To search for a song in Spotify:
            node liri.js spotify-this-song '<song name here>'
        
        To search for concerts for an artist/band:
            node liri.js concert-this <artist/band name here>

        To view information about a movie:
            node liri.js movie-this '<movie name here>'
            `);
        break;
}