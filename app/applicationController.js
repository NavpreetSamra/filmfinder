angular.module('app')
.controller('applicationController',['$scope','$http','$location','$sce', "$timeout", "$anchorScroll", function ($scope, $http, $location, $sce, $timeout, $anchorScroll) {
	$scope.searchMovies = [];
	$scope.popularMovies = [];
	$scope.latestMovies = [];
  $scope.myLoadingScope = false;
	$scope.showMovie = false;
  $scope.networkError = false;
  $scope.startSearch = false;
	$scope.addMore = false;
  $scope.popularPage = 1;
	$scope.latestPage = 1;
	$scope.contentExtra = 'Show more';
	$scope.videoID;
	$scope.config = {
		'timeout': '5500'
	}
  $scope.selectedTab = 'Popular'

  $scope.getMovies = function(type) {
    $location.hash('main');
    $anchorScroll();
		$scope.showMovie = $scope.networkError = false;
		if($scope.popularMovies.length == 0 || $scope.latestMovies.length == 0) {
			url='';
			if(type === 'Popular') {
	      $scope.selectedTab = 'Popular'
				url='https://yts.ag/api/v2/list_movies.json?limit=21&sort_by=download_count'
			} else {
	      $scope.selectedTab = 'Latest'
				url='https://yts.ag/api/v2/list_movies.json?limit=21'
			}
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
	          if(type === 'Popular') {
							$scope.popularPage = response.data.data.page_number;
	            $scope.popularMovies = angular.copy(response.data.data.movies);
						}
	          else {
							$scope.latestPage = response.data.data.page_number;
	            $scope.latestMovies = angular.copy(response.data.data.movies);
						}
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
			}
		}
	}

	$scope.getMovies('Popular');

  $scope.viewMovie = function(id) {
    $scope.toTop();
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
		},function(){
			$scope.startSearch = false;
      if($scope.selectedTab == 'Popular')
        $scope.movie = $scope.popularMovies.find(function(movie) { return movie.id == id})
      else
        $scope.movie = $scope.latestMovies.find(function(movie) { return movie.id == id})
      $scope.videoID = 'https://www.youtube.com/embed/'+$scope.movie.yt_trailer_code;
      $scope.videoID = $sce.trustAsResourceUrl($scope.videoID);
		});
		$location.hash(id);
  }

	$scope.searchMovie = function(searchInput) {
		if(searchInput.length != 0 && navigator.onLine) {
      $scope.startSearch = true;
			$scope.searchMovies = [];
			$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&query_term='+searchInput, $scope.config)
			.then(function(response) {
        response["headers"] = response["config"] = response["statusText"] =  null;
        delete response["headers"];
        delete response["config"];
        delete response["statusText"];
        $scope.startSearch = false;
				$scope.searchMovies = angular.copy(response.data);
			},function() {
        $scope.startSearch = false;
			});
		}
		else {
			if(!navigator.onLine) {
				console.log("No network")
			}
		}
	}

	$scope.loadMore = function(type) {
		$scope.addMore = true;
		url='';
		if(type === 'Popular') {
      $scope.selectedTab = 'Popular'
			url='https://yts.ag/api/v2/list_movies.json?limit=21&sort_by=download_count&page='+($scope.popularPage+1)
		} else {
      $scope.selectedTab = 'Latest'
			url='https://yts.ag/api/v2/list_movies.json?limit=21&page='+($scope.latestPage+1)
		}
		$http.get(url)
		.then(function(response) {
			response["headers"] = response["config"] = response["statusText"] =  null;
			delete response["headers"];
			delete response["config"];
			delete response["statusText"];
			response.data.data.movies.forEach(function(element) {
				if(type === 'Popular') {
					$scope.popularPage = response.data.data.page_number;
					$scope.popularMovies.push(element)
				} else {
					$scope.latestPage = response.data.data.page_number;
					$scope.latestMovies.push(element)
				}
			});
			$scope.addMore = false;
		}, function() {
			$scope.addMore = false;
		});
	}

	$scope.downloadFile = function(url, quality) {
    chrome.downloads.download({
			url: url
		});
	}

	$scope.showContent = function() {
		$scope.contentExtra = $scope.contentExtra === 'Show more' ? 'Show less' : 'Show more';
	}

	$scope.goback = function() {
		$scope.showMovie = false;
		$scope.contentExtra = 'Show more';
		$timeout(function() {
			$anchorScroll();
		});
	}

  $scope.toTop = function() {
    $location.hash('main');
    $anchorScroll();
  }

  $scope.openInNewTab = function(url) {
    chrome.tabs.create({
			url: url
		});
  }

}]);
