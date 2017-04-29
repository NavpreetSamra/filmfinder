angular.module('app')
.controller('applicationController',['$scope','$http','$mdToast','$location','$sce', function ($scope,$http,$mdToast,$location,$sce) {
    $scope.movies = [];
	$scope.searchMovies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
	$scope.loadMovie = false;
	$scope.currentPage = 1;
	$scope.showMovie = false;
	$scope.contentExtra = 'Show more';
	$scope.videoID;
	$scope.scrollPos = 0;
	$scope.config = {
		'timeout': '5500'
	}

	$scope.openMenu = function($mdOpenMenu, ev) {
      	$mdOpenMenu(ev);
    };

	$scope.toast = $mdToast.simple()
		.textContent('No Network Found!')
		.action('Refresh')
		.highlightAction(true)
		.highlightClass('md-accent')
		.hideDelay(3000)
		.position('top, right');

    $scope.getMovies = function(type) {
		$scope.showMovie = false;
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
				$scope.currentPage = response.data.data.page_number;
				$scope.movies = angular.copy(response.data.data.movies);
				$scope.myLoadingScope = false;
			}, function() {
				$scope.myLoadingScope = false;
				$mdToast.show(
					$mdToast.simple()
					.textContent('Error while fetching data.')
					.position('top, right')
					.hideDelay(2000)
				);
			});
		}
		else {
			$scope.myLoadingScope = false;
			$mdToast.show($scope.toast).then(function(response) {
				if ( response == 'ok' ) {
					$scope.getMovies(type)
				}
			});
		}
	}

    $scope.viewMovie = function(id) {
		$scope.loadMovie = true;		
		$scope.showMovie = true;
		$scope.contentExtra = 'Show more';
		$scope.movie = [];
		$http.get('https://yts.ag/api/v2/movie_details.json?movie_id='+id)
		.then(function(response) {
			$scope.loadMovie = false;
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
			console.log($scope.movie)
		},function(){
			$scope.loadMovie = false;
		});
		$scope.scrollPos = $('.main-container').scrollTop();
		$('.main-container').scrollTop(0)
    }

	$scope.searchMovie = function(searchInput) {
		if(searchInput.length != 0 && navigator.onLine) {
			$scope.myLoadingScope = true;
			$scope.searchMovies = [];
			$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&query_term='+searchInput, $scope.config)
			.then(function(response) {
				$scope.myLoadingScope = false;
				$scope.searchMovies = angular.copy(response.data);
			},function() {
				$scope.myLoadingScope = false;
				$mdToast.show(
					$mdToast.simple()
					.textContent('Error while fetching data.')
					.position('top, right')
					.hideDelay(2000)
				);
			});
		}
		else {
			if(!navigator.onLine) {
				$mdToast.show($scope.toast).then(function(response) {
					if ( response == 'ok' ) {
						$scope.searchMovie(searchInput)
					}
				});
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
		$('.main-container').animate({
			scrollTop: $scope.scrollPos
		},20);
	}

}]);