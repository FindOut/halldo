angular.module('formBuilderApp', [ 'threeCanvas' ])
.directive('building', function() {
  return {
    require : '^threeCanvas',
    restrict : 'E',
    transclude : true,
    scope : {
      pos : '=',
      config : '='
    },
    link : function(scope, element, attrs, threeCanvasCtrl) {
      threeCanvasCtrl.scene.add(new HouseBuilder(scope).build());
    },
    replace : true
  };
});
