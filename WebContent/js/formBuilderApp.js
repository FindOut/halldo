angular.module('formBuilderApp', ['threeCanvas'])
.directive('building', function() {
  return {
	require: '^threeCanvas',
	restrict: 'E',
	transclude: true,
	scope: { pos: '=', config: '='},
	link: function(scope, element, attrs, threeCanvasCtrl) {
    	var size = strTofloatArray(scope.config.size);

    	var wallMaterial = new THREE.MeshLambertMaterial({color: '#ffffff'});
 		threeCanvasCtrl.scene.add(makeWallMeshRotateMove(0, new THREE.Vector3(-size[0] / 2, 0, size[2] / 2), size[0], size[1], scope.config.wallThickness, wallMaterial));
 		threeCanvasCtrl.scene.add(makeWallMeshRotateMove(Math.PI / 2, new THREE.Vector3(size[0] / 2, 0, size[2] / 2), size[2], size[1], scope.config.wallThickness, wallMaterial));
 		threeCanvasCtrl.scene.add(makeWallMeshRotateMove(Math.PI, new THREE.Vector3(size[0] / 2, 0, -size[2] / 2), size[0], size[1], scope.config.wallThickness, wallMaterial));
 		threeCanvasCtrl.scene.add(makeWallMeshRotateMove(3 * Math.PI / 2, new THREE.Vector3(-size[0] / 2, 0, -size[2] / 2), size[2], size[1], scope.config.wallThickness, wallMaterial));
    },
    replace: true
  };
});

function makeWallMeshRotateMove(roty, move, width, height, thickness, material) {
	var wallMesh = makeWallMesh(width, height, thickness, material);
	wallMesh.applyMatrix(new THREE.Matrix4().makeRotationY(roty));
	wallMesh.applyMatrix(new THREE.Matrix4().makeTranslation(move.x, move.y, move.z));
	return wallMesh;
}

function makeWallMesh(width, height, thickness, material) {
   	var wall = new THREE.Object3D();
	var wallCornerTop = new THREE.Mesh(
		new THREE.SphereGeometry(thickness, 20, 20, 0, Math.PI / 2, 0, Math.PI / 2), 
		material);
	wall.add(wallCornerTop);
	wall.add(makeWallCornerMesh(height, thickness, material));
	wall.add(makeWallSideMesh(width, height, thickness, material));
	return wall;
}

function makeWallCornerMesh(height, thickness, material) {
	  var lidPath = getWallCornerTopPath(thickness);
	  lidPath.makeGeometry();
	  var extrusionSettings = {
	    amount: height, 
	    bevelEnabled: false
	  };
	  geometry = new THREE.ExtrudeGeometry(lidPath, extrusionSettings);
	  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
	//  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, top, 0));

	  return new THREE.Mesh(geometry, material);
	}

	function getWallCornerTopPath(thickness) {
		var vsteps = 20;
		var vstep = Math.PI / 2 / 20;
		var shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.lineTo(0, thickness);
		// add half circle lines around to2 to [to2.x - rightr.x, to2.y - rightr.y]
		var cv = Math.PI / 2;
		for (var i = 0; i < vsteps; i++) {
			cv += vstep;
			shape.lineTo(thickness * Math.cos(cv), thickness * Math.sin(cv));
		}
		shape.lineTo(0, 0);
		return shape;
	}

	function makeWallSideMesh(width, height, thickness, material) {
	  var lidPath = getWallSidePath(height, thickness);
	  lidPath.makeGeometry();
	  var extrusionSettings = {
	    amount: width, 
	    bevelEnabled: false
	  };
	  geometry = new THREE.ExtrudeGeometry(lidPath, extrusionSettings);
	  geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
	//  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, top, 0));

	  return new THREE.Mesh(geometry, material);
	}

	function getWallSidePath(height, thickness) {
		var vsteps = 20;
		var vstep = Math.PI / 2 / 20;
		var shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.lineTo(0, thickness);
		// add half circle lines around to2 to [to2.x - rightr.x, to2.y - rightr.y]
		var cv = Math.PI / 2;
		for (var i = 0; i < vsteps; i++) {
			cv += vstep;
			shape.lineTo(thickness * Math.cos(cv), thickness * Math.sin(cv));
		}
		shape.lineTo(-thickness, -height);
		shape.lineTo(0, -height);
		shape.lineTo(0, 0);
		return shape;
	}

