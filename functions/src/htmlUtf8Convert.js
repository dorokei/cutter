const Iconv = require('iconv').Iconv;
const jschardet = require('jschardet');

var htmlUtf8Convert = function(data) {
  var charset = 'utf-8';

  const contentType = data.headers['content-type'];
  console.log(contentType);
  const urlRegex = /charset=[a-zA-Z0-9!-/:-@¥[-`{-~]+/;
  const matches = contentType.match(urlRegex); // Return null if there is no matches.

  if (matches) {
    const tmp = matches[0].replace('charset=', '');
    console.log('Detected charset: ' + tmp);
    if (tmp.length > 0) {
      charset = tmp;
    }
  } else {
    console.log('no matches');
    const detectResult = jschardet.detect(data.data);
    console.log(detectResult.encoding);
    charset = detectResult.encoding;
  }

  console.log('Convert charset from ' + charset + ' to ' + 'UTF-8.');
  const iconv = new Iconv(charset, 'UTF-8//TRANSLIT//IGNORE');
  const encodedHtml = iconv.convert(data.data).toString();
  return encodedHtml;
};

module.exports = htmlUtf8Convert;

// Allow use of default import syntax in TypeScript
module.exports.default = htmlUtf8Convert;

