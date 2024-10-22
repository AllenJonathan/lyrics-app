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

async function scrapeSite(keyword) {
	const url = `https://www.google.com/search?gl=us&q=${keyword}`;
	const { data } = await axios.get(url);

	const $ = cheerio.load(data);
  var links = $('a');
  for (var i=0; i < links.length; i++) {
    value = links[i]
    hrefText = $(value).attr("href");
    if (hrefText && hrefText.startsWith("/url?q=https://genius.com/")) {
      var geniusText = $(value).text();
      break;
    }
  }

  geniusText = "https://genius.com/" + geniusText.split(" › ")[1]

  return geniusText

  // links.each((index, value) => {
  //   // Print the text from the tags and the associated href
  //   hrefText = $(value).attr("href");
  //   console.log(typeof(hrefText))
  //   if (hrefText && hrefText.startsWith("/url?q=https://genius.com/")) {
  //     console.log($(value).text())
  //   }
  //   const tempArr = text.split(" > ");
    // console.log($(value).text(), " => ", $(value).attr("href"));
}

module.exports = { getAccessToken, scrapeSite }