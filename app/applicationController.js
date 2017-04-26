angular.module('app')
.controller('applicationController',['$scope','$http','$mdToast','$location','$anchorScroll','$sce', function ($scope,$http,$mdToast,$location,$anchorScroll,$sce) {
    $scope.movies = [];
	$scope.searchMovies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
	$scope.currentPage = 1;
	$scope.showMovie = false;
	$scope.contentExtra = 'Show more';
	$scope.videoID;
	$scope.isOpen = false;
	$scope.contentCss = {
		'height': '32px'
	};

	$scope.openMenu = function($mdOpenMenu, ev) {
      	$mdOpenMenu(ev);
    };

	$scope.toast = $mdToast.simple()
		.textContent('No Network Found!')
		.action('Refresh')
		.highlightAction(true)
		.highlightClass('md-accent')
		.position('top, right');

    $scope.getMovies = function(type) {
		$scope.showMovie = false;
		url='';
		if(type === 'Popular') {
			url='https://yts.ag/api/v2/list_movies.json?limit=21&sort_by=download_count&with_rt_ratings=true'
		} else {
			url='https://yts.ag/api/v2/list_movies.json?limit=21&with_rt_ratings=true'
		}
		$scope.movies = [];
		if(navigator.onLine) {
			$scope.myLoadingScope = true;
			$http.get(url)
			.then(function(response) {
				$scope.currentPage = response.data.data.page_number;
				$scope.movies = angular.copy(response.data.data.movies);
				$scope.myLoadingScope = false;
			}, function() {
				$mdToast.show(
					$mdToast.simple()
					.textContent('Error while fetching data.')
					.position('top, right')
					.hideDelay(2000)
				);
			});
		}
		else {
			$mdToast.show($scope.toast).then(function(response) {
				if ( response == 'ok' ) {
					$scope.getMovies(type)
				}
			});
		}
	}

    $scope.viewMovie = function(movie) {
		$scope.showMovie = true;
		$scope.contentExtra = 'Show more';
		$scope.contentCss = {
			'height': '32px'
		};
		$scope.movie = [];
    	$scope.movie = angular.copy(movie);
		$scope.videoID = 'https://www.youtube.com/embed/'+$scope.movie.yt_trailer_code;
		$scope.videoID = $sce.trustAsResourceUrl($scope.videoID);
		$('.main-container').scrollTop(0)
    }

	$scope.searchMovie = function() {
		if($scope.searchInput.length != 0 && navigator.onLine) {
			$scope.myLoadingScope = true;
			$scope.searchMovies = [];
			$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&with_rt_ratings=true&query_term='+$scope.searchInput)
			.then(function(response) {
				$scope.myLoadingScope = false;
				if(response.data.data.movie_count > 0)
					$scope.searchMovies = angular.copy(response.data.data.movies);
			});
		}
		else {
			if(!navigator.onLine) {
				$mdToast.show($scope.toast).then(function(response) {
					if ( response == 'ok' ) {
						$scope.searchMovie()
					}
				});
			}
		}
	}

	$scope.loadMore = function() {
		$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&page='+($scope.currentPage+1))
		.then(function(response) {
			$scope.myLoadingScope = false;
			$scope.currentPage = response.data.data.page_number;
			response.data.data.movies.forEach(function(element) {
				$scope.movies.push(element)
			}, this);
		});
	}

	$scope.downloadFile = function(url, quality) {
		chrome.downloads.download({
			url: url
		});
	}

	$scope.showContent = function() {
		if($scope.contentExtra === 'Show more') {
			$scope.contentExtra = 'Show less';
			$scope.contentCss = {
				'height': '100%;',
				'transition': 'height 1s ease;'
			};
		} else {
			$scope.contentExtra = 'Show more';
			$scope.contentCss = {
				'height': '32px'
			};
		}
	}
	$scope.goback = function() {
		$scope.showMovie = false;
		$scope.contentExtra = 'Show more';
		$scope.contentCss = {
			'height': '32px'
		};
	}

}]);