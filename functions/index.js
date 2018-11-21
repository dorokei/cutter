const functions = require('firebase-functions');
const axios = require('axios');

exports.getSiteInfo = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const url = req.query.url;

  if (!url || url.length == 0) {
    return res
      .status(500)
      .json({ error: 'TypeError: Parameter "url" must be a string.' });
  }

  axios
    .get(url)
    .then(data => {
      console.log('--------------------');
      console.log(data.data);
      const json = {
        html: 'test'
      };
      return res.json(json);
    })
    .catch(error => {
      return res.status(500).json({ error: error });
    });
});
