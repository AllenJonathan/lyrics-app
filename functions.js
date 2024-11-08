const axios = require('axios');
const cheerio = require('cheerio');

async function getAccessToken(clientId, clientSecret) {

    var url = 'https://accounts.spotify.com/api/token';

    const config = {
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const options = {
        grant_type: 'client_credentials',
        json: true
    }

    try {
        let res = await axios.post(url, options, config)
        return res;
    }
    catch (error) {
        console.log(error);
    }

}

async function scrapeGoogle(keyword) {
    const url = `https://www.google.com/search?gl=us&q=${keyword}`;
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    var links = $('a');
    for (var i = 0; i < links.length; i++) {
        value = links[i]
        hrefText = $(value).attr("href");
        if (hrefText && hrefText.startsWith("/url?q=https://genius.com/")) {
            const match = hrefText.match(/http[^&]*/);
            var geniusText = match ? match[0] : null;
            break;
        }
    }

    return geniusText

}

async function scrapeGenius(url) {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    var lyrics = "";

    var divArr = $('[data-lyrics-container=true]').contents().toString().split("<br>");
    divArr.forEach(line => {
        if (line === " ") {
            lyrics = lyrics.concat("\n");
        } else {
            lyrics = lyrics.concat(line+"\n");
        }
    });

    lyrics = lyrics.replace(/<\/?[^>]+(>|$)/g, "").trim();

    // insert newlines and missing places
    let i = 0;
    while (i < lyrics.length) {
        if (i > 1 && lyrics[i] == '[') {
            if (!(lyrics[i-1] == '\n' && lyrics[i-2] == '\n')) {
                lyrics = lyrics.slice(0,i) + '\n' + lyrics.slice(i);
            }
        } 
        i++;
    }

    return lyrics

}

module.exports = { getAccessToken, scrapeGoogle, scrapeGenius }