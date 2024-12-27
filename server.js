const express = require('express'); 
const f = require('./functions');
const axios = require('axios');
require('dotenv').config();

const app = express();  
const port = process.env.DEV_PORT || 5000;

// Serve static files
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_SECRET_KEY;
const auth_token = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
console.log(auth_token)


app.get('/', (req, res) => {
    res.render(__dirname + '/src/views/index.ejs');
})

// Search route
app.get('/search', async (req, res) => {

    const accessToken = await f.getAuth(auth_token);
    
    const searchQuery = req.query.q;  // Get the query string from the request
    console.log(`Search query: ${searchQuery}`);

    var config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: searchQuery,
            type: 'track',
        }
    };

    try {
        const response = await axios.request(config);
        tracks = response.data.tracks.items
        res.render(__dirname + '/src/views/search.ejs', {
            songs: tracks,
        });
    } catch (error) {
        console.error(error);
    }

});


// Listen on local host 5000;
app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});

app.get('/lyrics/:song', function(req, res) {
    songName = req.params.song;
    songTitle = req.query.title;
    songArtists = req.query.artists;
    imageURL = req.query.imageURL;
    googleQuery = `${songName}%20genius%20lyrics`;
    
    f.scrapeGoogle(googleQuery).then(result => {
        var geniusLink = result;
        console.log(geniusLink);
        // scrape genius
        f.scrapeGenius(geniusLink).then(result => {
            console.log(result);
            res.render(__dirname + '/src/views/lyrics.ejs', {
                title: songTitle,
                artists: songArtists,
                lyrics: result,
                albumCover: imageURL,
            });
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))

});
