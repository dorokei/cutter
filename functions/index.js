const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });
const HtmlParser = require('./src/HtmlParser');
const htmlUtf8Convert = require('./src/htmlUtf8Convert');

exports.getSiteInfo = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Grab the text parameter.
    const url = req.query.url;

    if (!url || url.length === 0) {
      return res
        .status(500)
        .json({ error: 'TypeError: Parameter "url" must be a string.' });
    }

    console.log('Given url: ' + url);

    axios
      .get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        },
        responseType: 'arraybuffer'
      })
      .then(data => {
        console.log('status:' + data.status);
        const encodedHtml = htmlUtf8Convert(data);
        const parser = new HtmlParser(encodedHtml, url);
        const json = {
          url: url,
          title: parser.title(),
          description: parser.description(),
          og_site_name: parser.ogSiteName(),
          og_title: parser.ogTitle(),
          og_description: parser.ogDescription(),
          og_image: parser.ogImage(),
          favicon_image: parser.faviconImage()
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
});
