const cheerio = require('cheerio');

var HtmlParser = (function() {
  var HtmlParser = function(html, url) {
    this.$ = cheerio.load(html);
    this.url = url;
  };

  var p = HtmlParser.prototype;

  p.siteName = function() {
    return this.$("meta[property='og:site_name']").attr('content');
  };

  p.title = function() {
    return this.$('title').text();
  };

  p.description = function() {
    return this.$('meta[name="description"]').attr('content');
  };

  p.ogSiteName = function() {
    return this.$("meta[property='og:site_name']").attr('content');
  };

  p.ogTitle = function() {
    return this.$("meta[property='og:title']").attr('content');
  };

  p.ogDescription = function() {
    return this.$("meta[property='og:description']").attr('content');
  };

  p.ogImage = function() {
    return this.$("meta[property='og:image']").attr('content');
  };

  p.faviconImage = function() {
    if (this.$("link[rel='shortcut icon']").attr('href')) {
      return this.$("link[rel='shortcut icon']").attr('href');
    } else if (this.$("link[rel='icon']").attr('href')) {
      return this.$("link[rel='icon']").attr('href');
    }
  };

  return HtmlParser;
})();

module.exports = HtmlParser;

// Allow use of default import syntax in TypeScript
module.exports.default = HtmlParser;
