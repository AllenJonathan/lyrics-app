const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

const getAuth = async (auth_token) => {
    try {
        //make post request to SPOTIFY API for access token, sending relavent info
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({'grant_type':'client_credentials'});
    
        const response = await axios.post(token_url, data, {
            headers: { 
            'Authorization': `Basic ${auth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded' 
        }
      })
        //return access token
        return response.data.access_token;
        //console.log(response.data.access_token);   
    } catch(error) {
        //on fail, log the error in console
        console.log(error);
    }
}

async function scrapeGoogle(keyword) {
    const url = `https://www.google.com/search?gl=us&q=${keyword}-lyrics`;
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
    if (!url) {
        return "Lyrics not available"
    }
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

module.exports = { getAuth, scrapeGoogle, scrapeGenius }