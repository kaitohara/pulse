app.controller('ModalController', function($scope, $modalInstance, $window, $rootScope) {

    $scope.key = $rootScope.key
 	$scope.keyOne = $rootScope.key.match(/\w+[^-]/)[0];
 	$scope.keyTwo = $rootScope.key.match(/-(.*)/)[1];

    // close with newUser passed to the parent scope
    $scope.ok = function() {
        $modalInstance.close($scope.selectedUser);
    };

    // dismiss modal (X and cancel buttons)
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});