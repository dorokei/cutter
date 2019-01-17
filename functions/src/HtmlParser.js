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
      .text()
      .trim();
  };

  p.description = function() {
    return this.$('meta[name="description"]').attr('content');
  };

  p.ogSiteName = function() {
    if (this.$("meta[property='og:site_name']").attr('content')) {
      return this.$("meta[property='og:site_name']").attr('content');
    } else {
      const u = url.parse(this.givenUrl);
      return u.hostname;
    }
  };

  p.ogTitle = function() {
    return this.$("meta[property='og:title']").attr('content');
  };

  p.ogDescription = function() {
    return this.$("meta[property='og:description']").attr('content');
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
