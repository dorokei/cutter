const functions = require('firebase-functions');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')({ origin: true });
const Iconv = require('iconv').Iconv;
const jschardet = require('jschardet');

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
        responseType: 'arraybuffer',
        transformResponse: [
          data => {
            const detectResult = jschardet.detect(data);
            const iconv = new Iconv(
              detectResult.encoding,
              'UTF-8//TRANSLIT//IGNORE'
            );
            return iconv.convert(data).toString();
          }
        ]
      })
      .then(data => {
        console.log('status:' + data.status);
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
});
