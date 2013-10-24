// Like CylinderGeometry, but with a wedge from startAngle to endAngle as top and bottom
// doesn't make sides if openEnded
// doesn't handle texture on sides

THREE.ExtrudedWedgeGeometry = function ( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, startAngle, endAngle ) {

  THREE.Geometry.call( this );

  this.radiusTop = radiusTop = radiusTop !== undefined ? radiusTop : 20;
  this.radiusBottom = radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
  this.height = height = height !== undefined ? height : 100;

  this.radiusSegments = radiusSegments = radiusSegments || 8;
  this.heightSegments = heightSegments = heightSegments || 1;

  this.openEnded = openEnded = openEnded !== undefined ? openEnded : false;
  
  this.startAngle = startAngle !== undefined ? startAngle : 0;
  this.endAngle = endAngle !== undefined ? endAngle : Math.PI * 2;
  
  var arcAngle = endAngle - startAngle;

  var heightHalf = height / 2;

  var x, y, vertices = [], uvs = [];

  for ( y = 0; y <= heightSegments; y ++ ) {

    var verticesRow = [];
    var uvsRow = [];

    var v = y / heightSegments;
    var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

    for ( x = 0; x <= radiusSegments; x ++ ) {

      var u = x / radiusSegments;

      var vertex = new THREE.Vector3();
      vertex.x = radius * Math.sin( startAngle + u * arcAngle );
      vertex.y = - v * height + heightHalf;
      vertex.z = radius * Math.cos( startAngle + u * arcAngle );

      this.vertices.push( vertex );
      verticesRow.push( this.vertices.length - 1 );
      uvsRow.push( new THREE.Vector2( u, 1 - v ) );

    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

  }

  var tanTheta = ( radiusBottom - radiusTop ) / height;
  var na, nb;

  for ( x = 0; x < radiusSegments; x ++ ) {

    if ( radiusTop !== 0 ) {

      na = this.vertices[ vertices[ 0 ][ x ] ].clone();
      nb = this.vertices[ vertices[ 0 ][ x + 1 ] ].clone();

    } else {

      na = this.vertices[ vertices[ 1 ][ x ] ].clone();
      nb = this.vertices[ vertices[ 1 ][ x + 1 ] ].clone();

    }

    na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
    nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();

    for ( y = 0; y < heightSegments; y ++ ) {

      var v1 = vertices[ y ][ x ];
      var v2 = vertices[ y + 1 ][ x ];
      var v3 = vertices[ y + 1 ][ x + 1 ];
      var v4 = vertices[ y ][ x + 1 ];

      var n1 = na.clone();
      var n2 = na.clone();
      var n3 = nb.clone();
      var n4 = nb.clone();

      var uv1 = uvs[ y ][ x ].clone();
      var uv2 = uvs[ y + 1 ][ x ].clone();
      var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
      var uv4 = uvs[ y ][ x + 1 ].clone();

      this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

    }

  }

  var topMidVertex, bottomMidVertex;

  // top cap
  this.vertices.push( new THREE.Vector3( 0, heightHalf, 0 ) );
  if ( openEnded === false && radiusTop > 0 ) {

    topMidVertex = this.vertices.length - 1;

    for ( x = 0; x < radiusSegments; x ++ ) {

      var v1 = vertices[ 0 ][ x ];
      var v2 = vertices[ 0 ][ x + 1 ];
      var v3 = this.vertices.length - 1;

      var n1 = new THREE.Vector3( 0, 1, 0 );
      var n2 = new THREE.Vector3( 0, 1, 0 );
      var n3 = new THREE.Vector3( 0, 1, 0 );

      var uv1 = uvs[ 0 ][ x ].clone();
      var uv2 = uvs[ 0 ][ x + 1 ].clone();
      var uv3 = new THREE.Vector2( uv2.u, 0 );

      this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

    }

  }
  
  // bottom cap
  this.vertices.push( new THREE.Vector3( 0, - heightHalf, 0 ) );
  if ( openEnded === false && radiusBottom > 0 ) {

    bottomMidVertex = this.vertices.length - 1;

    for ( x = 0; x < radiusSegments; x ++ ) {

      var v1 = vertices[ y ][ x + 1 ];
      var v2 = vertices[ y ][ x ];
      var v3 = this.vertices.length - 1;

      var n1 = new THREE.Vector3( 0, - 1, 0 );
      var n2 = new THREE.Vector3( 0, - 1, 0 );
      var n3 = new THREE.Vector3( 0, - 1, 0 );

      var uv1 = uvs[ y ][ x + 1 ].clone();
      var uv2 = uvs[ y ][ x ].clone();
      var uv3 = new THREE.Vector2( uv2.u, 1 );

      this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

    }

  }
  
  // add sides
  if (Math.abs(Math.abs(endAngle - startAngle) - 2 * Math.PI) > 0.00001) {
    var v1 = vertices[ 0 ][ 0 ];
    var v2 = vertices[ y ][ 0 ];
    var v3 = vertices[ 0 ][ radiusSegments ];
    var v4 = vertices[ y ][ radiusSegments ];
    this.faces.push( new THREE.Face4( v1, topMidVertex, bottomMidVertex, v2 ) );
    this.faces.push( new THREE.Face4( v4, bottomMidVertex, topMidVertex, v3 ) );
  }

  this.computeCentroids();
  this.computeFaceNormals();

}

THREE.ExtrudedWedgeGeometry.prototype = Object.create( THREE.Geometry.prototype );
