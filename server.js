const express = require('express'); 
const f = require('./functions');
const axios = require('axios');

const app = express();  
const port = 5000;  
const searchLimit = 20;

// Serve static files
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

var clientId = '80b5f63a30934493b67d3b1ed57fed65';
var clientSecret = '265ba65189b9410aa41082e4e423ed81';

var accessToken;
f.getAccessToken(clientId, clientSecret).then(res => accessToken = res.data.access_token);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html');
})

// Search route
app.get('/search', async (req, res) => {
    
    const searchQuery = req.query.q;  // Get the query string from the request
    console.log(`Search query: ${searchQuery}`);

    var config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Authorization: `Bearer ${accessToken}}`
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
    googleQuery = `${songName}%20lyrics`;

    f.scrapeSite(googleQuery).then(result => {
        console.log(result);
    }).catch(err => console.log(err))

});

