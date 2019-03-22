const cheerio = require('cheerio');
const url = require('url');

var HtmlParser = (function() {
  var HtmlParser = function(html, givenUrl) {
    this.$ = cheerio.load(html);
    this.givenUrl = givenUrl;
  };

  var p = HtmlParser.prototype;

  p.title = function() {
    return this.$('title')
      .first()
      .text()
      .replace(/\r?\n/g, '')
      .trim();
  };

  p.description = function() {
    const title = this.$('meta[name="description"]').attr('content');
    if (title) {
      return title.replace(/\r?\n/g, '').trim();
    }
  };

  p.ogSiteName = function() {
    if (this.$("meta[property='og:site_name']").attr('content')) {
      const ogSiteName = this.$("meta[property='og:site_name']").attr(
        'content'
      );
      if (ogSiteName) {
        return ogSiteName.replace(/\r?\n/g, '').trim();
      }
    } else {
      const u = url.parse(this.givenUrl);
      return u.hostname;
    }
  };

  p.ogTitle = function() {
    const ogTitle = this.$("meta[property='og:title']").attr('content');
    if (ogTitle) {
      return ogTitle.replace(/\r?\n/g, '').trim();
    }
  };

  p.ogDescription = function() {
    const ogDescription = this.$("meta[property='og:description']").attr(
      'content'
    );
    if (ogDescription) {
      return ogDescription.replace(/\r?\n/g, '').trim();
    }
  };

  p.ogImage = function() {
    var pathOrUri = this.$("meta[property='og:image']").attr('content');
    if (pathOrUri) {
      return this.checkAndConvertUrl(pathOrUri);
    }
  };

  p.faviconImage = function() {
    var pathOrUri;
    if (this.$("link[rel='shortcut icon']").attr('href')) {
      pathOrUri = this.$("link[rel='shortcut icon']").attr('href');
    } else if (this.$("link[rel='icon']").attr('href')) {
      pathOrUri = this.$("link[rel='icon']").attr('href');
    }
    if (pathOrUri) {
      return this.checkAndConvertUrl(pathOrUri);
    }
  };

  p.checkAndConvertUrl = function(pathOrUri) {
    if (
      pathOrUri.indexOf('http') === 0 ||
      pathOrUri.indexOf('https') === 0 ||
      pathOrUri.indexOf('//') === 0
    ) {
      return pathOrUri;
    } else if (pathOrUri.indexOf('/') === 0) {
      // Relative path pattern
      const u = url.parse(this.givenUrl);
      return u.protocol + '//' + u.hostname + pathOrUri;
    }
  };

  return HtmlParser;
})();

module.exports = HtmlParser;

// Allow use of default import syntax in TypeScript
module.exports.default = HtmlParser;
