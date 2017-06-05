app.filter('cleanDom', function() {
  return function(value) {
    return safeResponse.cleanDomString(value)
  };
});
