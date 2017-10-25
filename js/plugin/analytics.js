
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-103975839-2']);
_gaq.push(['_trackPageview']);

function trackButtons(e) {
  _gaq.push(['_trackEvent', e.target.parentElement.id, 'clicked']);
};

var buttons = document.querySelectorAll('button')
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', trackButtons);
}

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();