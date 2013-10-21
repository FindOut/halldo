function Contr($scope) {
	$scope.buildingpos = new THREE.Vector3(1, 0, 0);

	$scope.config = {
		size : '50,10,30',
		wallThickness: 0.7,
		doors: [{
		  wall: 0,
		  position: 0
		}]
	};
}
