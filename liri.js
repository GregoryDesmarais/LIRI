require("dotenv").config();
var keys = require("./assets/keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

var command = process.argv[2];
var data = process.argv.splice(3).join("+") || "";


function updateLog(command, data) {
    if (command.length > 15) {
        console.log(command);
    }
    fs.appendFile("log.txt", `${command} ${(data) ? data : ""}\n`, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}


function displayTracks(items) {
    if (items.length === 0) {
        updateLog("Sorry, no songs were found.  Please check your spelling and try again!");
        return;
    }
    for (x in items) {
        var artist = items[x].artists[0].name;
        var title = items[x].name;
        var previewLink = items[x].preview_url;
        var album = items[x].album.name;
        updateLog(`
        Result ${parseInt(x) + 1} of ${items.length}
        --------------------------
          Artist Name: ${artist}
          Album: ${album}
          Song Title: ${title}
          Preview URL: ${(previewLink) ? previewLink : "None provided"}
        --------------------------
                  `);
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
    updateLog(command, data);
    if (title === "") {
        title = "Mr. Nobody";
    }
    var qURL = `http://www.omdbapi.com/?apikey=${keys.omdb.key}&t=` + title;
    axios.get(qURL)
        .then(function(response) {
            if (response.data.Response === "False") {
                updateLog(response.data.Error);
                return;
            }
            var movieInfo = response.data;
            updateLog(`
        --------------------------
          Movie Title: ${movieInfo.Title}
          Release Year: ${movieInfo.Year}
          IMDB Rating: ${movieInfo.imdbRating}
          Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}
          Country: ${movieInfo.Country}
          Language: ${movieInfo.Language}
          Plot: ${movieInfo.Plot}
          Actors: ${movieInfo.Actors}
        --------------------------
            `);
        })
}

function concertInfo(artist) {
    updateLog(command, data);
    var qURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bands.key}`;
    axios.get(qURL)
        .then(function(response) {
            if (typeof response.data === "string" || response.data.length === 0) {
                updateLog("No bands by that name were found.  Please try again!");
                return;
            }
            for (x in response.data) {
                var venueName = response.data[x].venue.name;
                var location = `${response.data[x].venue.city}, ${response.data[x].venue.region} ${response.data[x].venue.country}`;
                var date = moment(`${response.data[x].datetime}`).format("MM/DD/YYYY");
                updateLog(`  
        --------------------------
          Venue: ${venueName}
          Location: ${location}
          Date: ${date}
        --------------------------
                `);
            }
        })
}

function doTheThing() {
    updateLog(command, data);
    fs.readFile('assets/random.txt', 'utf8', function read(err, textData) {
        if (err) {
            throw err;
        }
        data = textData.split(",")[1];
        switchFunction(textData.split(",")[0].trim());
    });
}


function switchFunction(command) {
    switch (command) {
        case "spotify-this-song":
            updateLog(`Searching Spotify for ${data}`);
            searchSpotify(data);
            break;

        case "movie-this":
            updateLog(`Searching OMDB for ${data}`);
            movieInfo(data);
            break;

        case "concert-this":
            updateLog(`Searching Bands in Town for ${data}`);
            concertInfo(data);
            break;

        case "do-what-it-says":
            doTheThing();
            break;

        default:
            updateLog(`
  --------------------------
    Application Usage:
    To search for a song in Spotify:
    node liri.js spotify-this-song '<song name here>'
    
    To search for concerts for an artist/band:
    node liri.js concert-this <artist/band name here>
    
    To view information about a movie:
    node liri.js movie-this '<movie name here>'
  --------------------------
  `);
            break;
    }
}

switchFunction(command);