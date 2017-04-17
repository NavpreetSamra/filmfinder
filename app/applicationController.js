angular.module('app').controller('applicationController', function ($scope,$http) {
    
    $scope.movies = [];
    $scope.users = ['Fabio', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];
    $scope.init = function() {
		$http.get('https://yts.ag/api/v2/list_movies.json?limit=15')
		.then(function(response) {
		  $scope.movies = response.data.data.movies;
		  // console.log($scope.movies)
		});
	}

    $scope.init();
});