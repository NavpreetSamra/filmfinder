var app = angular.module('app', ['ngLoadingScreen','ngClickCopy'])
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 48;   // always scroll by 50 extra pixels
}])
app.filter('cleanDom', function() {
  return function(value) {
    console.log(value)
    return safeResponse.cleanDomString(value)
  };
});
