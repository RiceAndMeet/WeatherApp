/**
 * 
 */
var app= angular.module('myApp', []);
app.controller('namesCtrl', function($scope) {
    $scope.names = [
        'Jani',
        'Carl',
        'Margareth',
        'Hege',
        'Joe',
        'Gustav',
        'Birgit',
        'Mary',
        'Kai'
    ];

    var count =0;
    $scope.restCall= function ($event){
    	++count;
    	if (count == 3){
    		console.log("asasd");
    		count =0;}
    }
    
});

app.service('myDataService', ['$http', function ($http) {
    this.getAbc = function () {
        return $http({
            headers: { 'Content-Type': 'application/json' },
            url: "http://api.openweathermap.org/data/2.5/weather",
            method: "POST",
            data: {q: "Toronto", APPID: APIKey}
        });
    };
} ]);

app.controller('GridController', ['$scope', '$http', 'myDataService', '$q', 
				function ($scope, $http, myDataService, $q){

	$scope.DoSomething = function() {

	    var paramsToPost = null; // you could pass something useful here.

	    var deferred = $q.defer();
	    deferred.notify();

	    $scope.myWelcome= myDataService.getAbc()
	        .success(function() {
	            deferred.resolve();
	        })
	        .error(function() {
	            deferred.reject();
	        });

	    return deferred.promise;
	}
	
	var promise = $scope.DoSomething();
	promise.then(function(successParam) { // success callback
	  console.log("success");
	}, function(rejectParam) { // error callback with reason
	  console.log("rejected");
	}, function(notifyParam) { // notification
	  console.log("notify");
	});

	
}]);



