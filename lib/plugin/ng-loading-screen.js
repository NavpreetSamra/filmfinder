angular.module('ngLoadingScreen', []).directive('loadingScreen', function () {
    var linker = function ($scope, element, attrs) {
        $scope.$watch('isLoading', function (newValue, oldValue) {
            var timer = $scope.timer ? $scope.timer : 500;

            if (newValue) {
                /* Prevent scrolling when loading is on */
                document.ontouchstart = function (e) {
                    e.preventDefault();
                };

                /* Size variables */
                var defaultSize = 60;
                var width = $scope.width ? $scope.width : defaultSize;
                var height = $scope.height ? $scope.height : defaultSize;

                /* Set icon */
                var icon;
                if ($scope.src) {
                    icon = '<img width="' + width + '" height="' + height + '" src="' + $scope.src + '"/>'
                } else if ($scope.iconClass) {
                    icon = '<i style="font-size:24px" class="' + $scope.iconClass + '"></i>'
                } else {
                    icon = '<span style="font-size: 22px">Loading...</span>'
                }

                /* Template */
                var customLoadingCss = '<style>.custom-loading { position: fixed; top: 0; left: 0; height: 100%; width: 100%; background: rgba(192,192,192, .1); z-index: 999999999; } .custom-loading > div { height: 100%; display: -webkit-box; -webkit-box-orient: vertical; -webkit-box-pack: center; -webkit-box-align: center; } .custom-loading > div > .icon { font-size: 54px; }</style>';
                var pulsateCss = '<style>.pulsate-item { -webkit-animation: pulsate 1s ease-out; -webkit-animation-iteration-count: infinite; opacity: 0.0 } @-webkit-keyframes pulsate { 0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;} 50% {opacity: 1.0;} 100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;} }</style>'
                var html = '<div class="custom-loading"> <div> <div class="pulsate-item"> ' + icon + ' </div> </div> </div>';
                var template = customLoadingCss + html;
                // var template = customLoadingCss + pulsateCss + html;
                element.html(template);
            } else {
                /* Wait until we remove the loading page */
                setTimeout(function () {
                    element.html('');

                    /* Return default when loading is off */
                    document.ontouchstart = function (e) {
                        return true;
                    };
                }, timer);
            }
        });
    };

    return {
        restrict: 'E',
        scope: {
            isLoading: '=',
            src: '@',
            width: '=',
            height: '=',
            timer: '='
        },
        link: linker
    };
});