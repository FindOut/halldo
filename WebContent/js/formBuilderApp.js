angular.module('formBuilderApp', ['threeCanvas'])
.directive('building', function() {
  return {
    require: '^threeCanvas',
    restrict: 'E',
    transclude: true,
    scope: { pos: '=', config: '='},
    link: function(scope, element, attrs, threeCanvasCtrl) {
      var geom = applyToConstructor(THREE.CubeGeometry, strTofloatArray(scope.config.size));
      var cube = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({color: '#ffffff'}));
      threeCanvasCtrl.scene.add(cube);
      var m4 = new THREE.Matrix4();
      cube.geometry.applyMatrix(m4.makeTranslation(scope.pos.x, scope.pos.y, scope.pos.z));
    },
    replace: true
  };
});