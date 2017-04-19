angular.module('app').controller('applicationController', function ($scope,$http,$mdToast) {
    
    $scope.movies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
    $scope.getMovies = function(type) {
		url='';
		if(type === 'Popular') {
			url='https://yts.ag/api/v2/list_movies.json?limit=15&sort_by=download_count'
		} else {
			url='https://yts.ag/api/v2/list_movies.json?limit=15'
		}
		$scope.movies = [];
		if(navigator.onLine) {
			$scope.myLoadingScope = true;
			$http.get(url)
			.then(function(response) {
				$scope.myLoadingScope = false;
				$scope.movies = angular.copy(response.data.data.movies);
			});
		}
		else {
			$mdToast.show(
				$mdToast.simple()
						.textContent('No Internet Connection')
						.position('top, right')
						.hideDelay(2000)
			);
		}
	}

    $scope.viewMovie = function(index) {
    	$scope.movie = angular.copy($scope.movies[index]);
    }
});