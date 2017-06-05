app.filter('cleanDom', function() {
  return function(value) {
    console.log(value)
    return safeResponse.cleanDomString(value)
  };
});
