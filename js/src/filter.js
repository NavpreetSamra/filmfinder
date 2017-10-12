app.filter('cleanDom', function() {
  return function(value) {
    return safeResponse.cleanDomString(value)
  };
});
app.filter('runTime', function() {
  return function(value) {
    if(value < 60){
      return (value) + 'm';
    }
    else if(value%60==0){
      return (value-value%60)/60 + 'h';
    }
    else{
      return ((value-value%60)/60 + 'h' + ' ' + value%60 + 'm');
    }
  };
});
