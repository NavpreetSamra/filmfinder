angular.module('app').controller('applicationController',['$scope','$http','$mdToast','$window', function ($scope,$http,$mdToast,$window) {
    
    $scope.movies = [];
	$scope.searchMovies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
	$scope.currentPage = 1;
	$scope.showMovie = false;
	$scope.contentExtra = 'Show more';
	$scope.contentCss = {
		'height': '40px'
	};
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
			$mdToast.show(
				$mdToast.simple()
				.textContent('No Network Found!')
				.position('top, right')
				.hideDelay(2000)
			);
		}
	}
	
    $scope.viewMovie = function(movie) {
		$scope.showMovie = true;
		$scope.movie = [];
    	$scope.movie = angular.copy(movie);
		// $scope.heroImage = {
		// 	'background': 'url(' + $scope.movie.background_image + ')'
		// };
		console.log($window)
		$window.scrollY = 0;
		$scope.videoID = $scope.movie.yt_trailer_code;
		// console.log($scope.movie);
    }

	$scope.searchMovie = function() {
		if($scope.searchInput.length != 0) {
			$scope.myLoadingScope = true;
			$scope.searchMovies = [];
			$http.get('https://yts.ag/api/v2/list_movies.json?limit=21&query_term='+$scope.searchInput)
			.then(function(response) {
				$scope.myLoadingScope = false;
				if(response.data.data.movie_count > 0)
					$scope.searchMovies = angular.copy(response.data.data.movies);
			});
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
			//$scope.movies.push(response.data.data.movies);
		});
	}

	$scope.downloadFile = function(url) {
		chrome.downloads.download({
			url: url
		});
	}

	$scope.showContent = function() {
		if($scope.contentExtra === 'Show more') {
			$scope.contentExtra = 'Show less';
			$scope.contentCss = {
				'height': '100%;',
				'transition': 'height 75ms'
			};
		} else {
			$scope.contentExtra = 'Show more';
			$scope.contentCss = {
				'height': '40px'
			};
		}
	}
	$scope.goback = function() {
		$scope.showMovie = false;
		$scope.contentExtra = 'Show more';
		$scope.contentCss = {
			'height': '40px'
		};
	}

}]);