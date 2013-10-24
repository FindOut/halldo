/**
 * Build a house
 */
function HouseBuilder(config) {
  var wallMaterial = new THREE.MeshLambertMaterial({
    color : '#ffffff'
  });

  this.build = function() {
    var size = strTofloatArray(config.size);

    if (true) {
      var house = new THREE.Object3D();
      var roofDown = config.wallThickness / 2;
      var geom = new THREE.CubeGeometry(size[0], config.wallThickness,
          size[2]);
      var cube = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
        color : '#ffffff'
      }));
      var m4 = new THREE.Matrix4();
      cube.geometry.applyMatrix(m4.makeTranslation(0,
          (config.wallThickness) / 2 - roofDown, 0));
      house.add(cube);
      
      house.add(makeWallMeshRotateMove(0, new THREE.Vector3(-size[0] / 2, 0,
          size[2] / 2), size[0], size[1], config.wallThickness,
          wallMaterial));
      house.add(makeWallMeshRotateMove(Math.PI / 2, new THREE.Vector3(
          size[0] / 2, 0, size[2] / 2), size[2], size[1],
          config.wallThickness, wallMaterial));
      house.add(makeWallMeshRotateMove(Math.PI, new THREE.Vector3(size[0] / 2, 0,
          -size[2] / 2), size[0], size[1], config.wallThickness,
          wallMaterial));
      house.add(makeWallMeshRotateMove(3 * Math.PI / 2, new THREE.Vector3(
          -size[0] / 2, 0, -size[2] / 2), size[2], size[1],
          config.wallThickness, wallMaterial));
    } else {
      var geometry = new THREE.ExtrudedWedgeGeometry( 5, 5, 5, 8, 1, false, -Math.PI / 2 , 0);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      return new THREE.Mesh(geometry, wallMaterial);
    }

    return house;
  };

  function makeWallMeshRotateMove(roty, move, width, height, thickness, material) {
    var wallMesh = makeWallMesh(width, height, thickness, material);
    wallMesh.applyMatrix(new THREE.Matrix4().makeRotationY(roty));
    wallMesh.applyMatrix(new THREE.Matrix4().makeTranslation(move.x, move.y,
        move.z));
    return wallMesh;
  }
  
  function makeWallMesh(width, height, thickness, material) {
    var wall = new THREE.Object3D();
    var wallCornerTop = new THREE.Mesh(new THREE.SphereGeometry(thickness, 20,
        20, 0, Math.PI / 2, 0, Math.PI / 2), material);
    wall.add(wallCornerTop);
    wall.add(makeWallCornerMesh(height, thickness, material));
    wall.add(makeWallTopMesh(width, height, thickness, material));
    wall.add(makeWallSideMesh(width, height, thickness, material));
    return wall;
  }
  
  function makeWallSideMesh(width, height, thickness, material) {
    var lidPath = getWallSidePath(width, height, thickness);
    lidPath.makeGeometry();
    var extrusionSettings = {
        amount : thickness,
        bevelEnabled : false
    };
    var geometry = new THREE.ExtrudeGeometry(lidPath, extrusionSettings);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI / 2));
    return new THREE.Mesh(geometry, material);
  }
  
  function getWallSidePath(width, height, thickness) {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(height, width);
    shape.lineTo(height, 0);
    
    var doorShape = new THREE.Shape();
    var w2 = width / 2, h2 = height / 2;
    var w10 = config.doors[0].size[0], h10 = config.doors[0].size[1];
    doorShape.moveTo(h2, w2);
    doorShape.lineTo(h2 + h10, w2);
    doorShape.lineTo(h2 + h10, w2 + w10);
    doorShape.lineTo(h2, w2 + w10);
    shape.holes.push(doorShape);
    
    return shape;
  }

  function makeWallCornerMesh(height, thickness, material) {
    var geometry = new THREE.ExtrudedWedgeGeometry( thickness, thickness, height, 20, 1, false, -Math.PI / 2, 0 );
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -height / 2, 0));
    return new THREE.Mesh(geometry, material);
  }
  
  function makeWallTopMesh(width, height, thickness, material) {
    var geometry = new THREE.ExtrudedWedgeGeometry( thickness, thickness, width, 20, 1, false, 0, Math.PI / 2 );
    geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(width / 2, 0, 0));
    return new THREE.Mesh(geometry, material);
  }
}

