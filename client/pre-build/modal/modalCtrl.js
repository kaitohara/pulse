app.controller('ModalController', function($scope, $modalInstance, $window, $rootScope) {

    // $scope.key = $rootScope.key
    $scope.key = JSON.parse(localStorage.getItem('key')).keyObj;
    console.log('$scope.key',$scope.key)
 	$scope.keyOne = $scope.key.match(/\w+[^-]/)[0];
 	$scope.keyTwo = $scope.key.match(/-(.*)/)[1];

    // close with newUser passed to the parent scope
    $scope.ok = function() {
        $modalInstance.close($scope.selectedUser);
    };

    // dismiss modal (X and cancel buttons)
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});