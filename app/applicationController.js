angular.module('app')
.controller('applicationController',['$scope','$http','$location','$sce', "$timeout", "$anchorScroll", function ($scope, $http, $location, $sce, $timeout, $anchorScroll) {
  $scope.movies = [];
	$scope.searchMovies = [];
  $scope.movie = [];
  $scope.myLoadingScope = false;
	$scope.showMovie = false;
  $scope.networkError = false;
  $scope.startSearch = false;
  $scope.currentPage = 1;
	$scope.contentExtra = 'Show more';
	$scope.videoID;
	$scope.config = {
		'timeout': '5500'
	}

  $scope.getMovies = function(type) {
    $location.hash('main');
    $anchorScroll();
		$scope.showMovie = $scope.networkError = false;
		url='';
		if(type === 'Popular') {
			url='https://yts.ag/api/v2/list_movies.json?limit=21&sort_by=download_count'
		} else {
			url='https://yts.ag/api/v2/list_movies.json?limit=21'
		}
		$scope.movies = [];
		if(navigator.onLine) {
			$scope.myLoadingScope = true;
			$http.get(url,$scope.config)
			.then(function(response) {
        $scope.myLoadingScope = false;
        $timeout(function () {
          response["headers"] = response["config"] = response["statusText"] =  null;
          delete response["headers"];
          delete response["config"];
          delete response["statusText"];
          $scope.currentPage = response.data.data.page_number;
  				$scope.movies = angular.copy(response.data.data.movies);
        }, 500)
			}, function() {
        $scope.myLoadingScope = false;
        $timeout(function () {
          $scope.networkError = true;
        }, 500);
			});
		}
		else {
			$scope.myLoadingScope = false;
      $scope.networkError = true;
      $scope.error = 'No network found.'
		}
	}

	$scope.getMovies('Popular');

  $scope.viewMovie = function(id) {
		$scope.showMovie = true;
    $scope.startSearch = true;
		$scope.contentExtra = 'Show more';
		$scope.movie = [];
		$http.get('https://yts.ag/api/v2/movie_details.json?movie_id='+id)
		.then(function(response) {
      $scope.startSearch = false;
			$scope.movie = angular.copy(response.data.data.movie);
			$scope.videoID = 'https://www.youtube.com/embed/'+$scope.movie.yt_trailer_code;
			$scope.videoID = $sce.trustAsResourceUrl($scope.videoID);
			if($scope.movie.runtime < 60){
				$scope.runtime = ($scope.movie.runtime) + 'm';
			}
			else if($scope.movie.runtime%60==0){
				$scope.runtime = ($scope.movie.runtime-$scope.movie.runtime%60)/60 + 'h';
			}
			else{
				$scope.runtime = (($scope.movie.runtime-$scope.movie.runtime%60)/60 + 'h' + ' ' + $scope.movie.runtime%60 + 'm');
			}
		},function(){
			$scope.startSearch = true;
		});
  }

	$scope.searchMovie = function(searchInput) {
		if(searchInput.length != 0 && navigator.onLine) {
      $scope.startSearch = true;
			$scope.searchMovies = [];
			$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&query_term='+searchInput, $scope.config)
			.then(function(response) {
        $scope.startSearch = false;
				$scope.searchMovies = angular.copy(response.data);
			},function() {
        $scope.startSearch = false;
			});
		}
		else {
			if(!navigator.onLine) {
				console.log("toast")
			}
		}
	}

	$scope.loadMore = function(type) {
		$scope.myLoadingScope = true;
		$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&sort_by=download_count&page='+($scope.currentPage+1))
		.then(function(response) {
			$scope.currentPage = response.data.data.page_number;
			response.data.data.movies.forEach(function(element) {
				$scope.movies.push(element)
			});
			$scope.myLoadingScope = false;
		});
	}

	$scope.downloadFile = function(url, quality) {
		downloading = browser.downloads.download({
			url: url,
			method: 'GET',
			filename: ''+$scope.movie.title +' ('+$scope.movie.year+') ['+quality+'] [YTS.AG].torrent',
			conflictAction : 'uniquify'
		});
		downloading.then(function(id){
		}, function() {
		});
    // chrome.downloads.download({
		// 	url: url
		// });
	}

	$scope.showContent = function() {
		$scope.contentExtra = $scope.contentExtra === 'Show more' ? 'Show less' : 'Show more';
	}
	$scope.goback = function() {
		$scope.showMovie = false;
		$scope.contentExtra = 'Show more';
	}

  $scope.toTop = function() {
    $location.hash('main');
    $anchorScroll();
  }

  $scope.openInNewTab = function(url) {
    var creating = browser.tabs.create({
			url: url
		});
    // chrome.tabs.create({
		// 	url: url
		// });
  }

}]);
