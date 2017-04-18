angular.module('app').controller('applicationController', function ($scope,$http) {
    
    $scope.movies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
    $scope.getMovies = function(type) {
    	$scope.myLoadingScope = true;
		url='';
		$scope.movies = [];
		if(type === 'Popular') {
			url='https://yts.ag/api/v2/list_movies.json?limit=15&sort_by=download_count'
		} else {
			url='https://yts.ag/api/v2/list_movies.json?limit=15'
		}
		if(url != '') {
			$http.get(url)
			.then(function(response) {
				$scope.movies = angular.copy(response.data.data.movies);
				$scope.myLoadingScope = false;
			});
		}
	}

    $scope.getMovies('Popular');

    $scope.viewMovie = function(index) {
    	$scope.movie = angular.copy($scope.movies[index]);
    }
});