const functions = require('firebase-functions');
const axios = require('axios');
const cheerio = require('cheerio');

exports.getSiteInfo = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const url = req.query.url;

  if (!url || url.length === 0) {
    return res
      .status(500)
      .json({ error: 'TypeError: Parameter "url" must be a string.' });
  }

  axios
    .get(url)
    .then(data => {
      const $ = cheerio.load(data.data);
      const json = {
        site_name: $("meta[property='og:site_name']").attr('content'),
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        og_site_name: $("meta[property='og:site_name']").attr('content'),
        og_title: $("meta[property='og:title']").attr('content'),
        og_description: $("meta[property='og:description']").attr('content'),
        og_image: $("meta[property='og:image']").attr('content'),
        favicon_image: $("link[rel='shortcut icon']").attr('href')
      };
      return res.json(json);
    })
    .catch(error => {
      console.log(error);
      return res
        .status(500)
        .json({ error: 'InvalidUrlError. Cannot access given url.' });
    });
});
