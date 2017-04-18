angular.module('app').controller('applicationController', function ($scope,$http) {
    
    $scope.movies = [];
    $scope.movie = [];
    $scope.myLoadingScope = false;
    // $scope.viewFlag = false;
    $scope.init = function() {
    	$scope.myLoadingScope = true;
		$http.get('https://yts.ag/api/v2/list_movies.json?limit=15')
		.then(function(response) {
		  	$scope.movies = response.data.data.movies;
		  	$scope.myLoadingScope = false;
		  	// console.log($scope.movies)
		});
	}

    $scope.init();

    $scope.viewMovie = function(index) {
    	// $scope.viewFlag = true;
    	$scope.movie = angular.copy($scope.movies[index]);
    	// console.log($scope.movie)
    }
});