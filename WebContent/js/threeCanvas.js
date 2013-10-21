angular.module('threeCanvas', [])
.directive('threeCanvas', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      width:"@", 
      height:"@"},
    controller: [ "$scope", function($scope) {
      console.log("threeCanvas controller");
      this.scene = new THREE.Scene();
      $scope.scene = this.scene;
    }],
    link: function(scope, elm, attrs, contr) {
      console.log("threeCanvas link");
      $(elm).attr('width', scope.width);
      $(elm).attr('height', scope.height);
      
      var scene = scope.scene;
      var aspectRatio = scope.width/scope.height;
      var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
      var renderer = new THREE.WebGLRenderer({canvas: elm[0], antialias: true});
      renderer.setSize(scope.width, scope.height);
      camera.position.z = 50;
      
      var changed = true;
      var controller = new THREE.OrbitControls(camera, elm[0]);
      controller.addEventListener("change", function() {changed = true;});
      scene.add(controller);
      
      var render = function () {
          requestAnimationFrame(render);
    	  controller.update();
          if (changed) {
        	  renderer.render(scene, camera);
        	  changed = false;
          }
      };
      $(window).load(render);
    },
    template:
      '<canvas ng-transclude></canvas>',
    replace: true
  };
})
.directive('box', function() {
  return {
    require: '^threeCanvas',
    restrict: 'E',
    transclude: true,
    scope: { pos: '=', size: '@', color: '@'},
    link: function(scope, element, attrs, threeCanvasCtrl) {
      var geom = applyToConstructor(THREE.CubeGeometry, strTofloatArray(scope.size));
      var cube = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({color: scope.color}));
      threeCanvasCtrl.scene.add(cube);
      var m4 = new THREE.Matrix4();
      cube.geometry.applyMatrix(m4.makeTranslation(scope.pos.x, scope.pos.y, scope.pos.z));
//      cube.geometry.applyMatrix(m4.makeTranslation.apply(m4, strTofloatArray(scope.pos)));
    },
    replace: true
  };
})
.directive('sphere', function() {
  return {
    require: '^threeCanvas',
    restrict: 'E',
    transclude: true,
    scope: { pos: '@', radius: '=', color: '@'},
    link: function(scope, element, attrs, threeCanvasCtrl) {
      var geom = new THREE.SphereGeometry(parseFloat(scope.radius), 20, 20);
      var sphere = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({color: scope.color}));
      threeCanvasCtrl.scene.add(sphere);
      var m4 = new THREE.Matrix4();
      sphere.geometry.applyMatrix(m4.makeTranslation.apply(m4, strTofloatArray(scope.pos)));
    },
    replace: true
  };
})
.directive('pointLight', function() {
	  return {
	    require: '^threeCanvas',
	    restrict: 'E',
	    transclude: true,
	    scope: { pos: '@', color: '@'},
	    link: function(scope, element, attrs, threeCanvasCtrl) {
	      var light = new THREE.PointLight(scope.color);
	      light.position.set.apply(light.position, strTofloatArray(scope.pos));
	      threeCanvasCtrl.scene.add(light);
	    },
	    replace: true
	  };
	})
.directive('ambientLight', function() {
	  return {
	    require: '^threeCanvas',
	    restrict: 'E',
	    transclude: true,
	    scope: { color: '@'},
	    link: function(scope, element, attrs, threeCanvasCtrl) {
	      var light = new THREE.AmbientLight(scope.color);
	      threeCanvasCtrl.scene.add(light);
	    },
	    replace: true
	  };
	})
.directive('skyBox', function() {
	  return {
	    require: '^threeCanvas',
	    restrict: 'E',
	    transclude: true,
	    scope: { color: '@', path: '@', suffix: '@'},
	    link: function(scope, element, attrs, threeCanvasCtrl) {
			var imagePrefix = scope.path;
			var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
			var imageSuffix = scope.suffix;
			var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
//			skyGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2500, 0));
			
			var materialArray = [];
			for (var i = 0; i < 6; i++)
				materialArray.push( new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
					side: THREE.BackSide
				}));
			var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
			var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
			threeCanvasCtrl.scene.add(skyBox);
	    },
	    replace: true
	  };
	});

function applyToConstructor(constructor, argArray) {
  var args = [null].concat(argArray);
  var factoryFunction = constructor.bind.apply(constructor, args);
  return new factoryFunction();
}
function applyToFunction(obj, f, argArray) {
  var args = [obj].concat(argArray);
  var factoryFunction = f.bind.apply(f, args);
  return new factoryFunction();
}

// converts "1, 2.5, 5" to [1, 2.5, 5]
function strTofloatArray(s) {
  return s.split(",").map(function(s) {return parseFloat(s);});
}