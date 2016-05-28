function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

var scene, camera, renderer;
var geometry, material, mesh;
var childGeometry, childMaterial, childMesh;
var pointsGeometry, pointsMaterial, points, pointsArray;

var maxPoints = 100;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.SphereGeometry( 100, 30, 30 );
    material = new THREE.MeshBasicMaterial({color: 0x222222});

    mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    scene.add( mesh );

    childGeometry = new THREE.BoxGeometry( 0, 0, 0 );
    childMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    childMesh = new THREE.Mesh( childGeometry, childMaterial );
    childMesh.position.z = 120;
    mesh.add(childMesh);

    pointsGeometry = new THREE.BufferGeometry();
    pointsMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            amplitude: { type: "f", value: 1.0 },
            color:     { type: "c", value: new THREE.Color( 0xffffff ) }
        },
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        transparent:    true
    });

    var positions = new Float32Array( maxPoints * 3 );
    var colors = new Float32Array( maxPoints * 4 ); //alpha
    var sizes = new Float32Array( maxPoints );

    for(var i = 0; i < maxPoints; i++) {
        let v = new THREE.Vector3(0,0,0);
        let c = new THREE.Color();
        v.toArray(positions, i * 3);
        c.setHSL(1,1,1);
        c.toArray(colors, i * 4);
        c.set(1, i * 4 + 3);
        sizes[i] = 20;
    }

    pointsGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    pointsGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    pointsGeometry.addAttribute( 'ca', new THREE.BufferAttribute( colors, 4 ) );
    points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.castShadow = true;
    scene.add( points );

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
}

function updatePoints() {
    scene.updateMatrixWorld();
    var vertices = points.geometry.attributes.position.array;
    var sizes = points.geometry.attributes.size.array;
    var colors = points.geometry.attributes.ca.array;
    var newP = new THREE.Vector3().setFromMatrixPosition( childMesh.matrixWorld );
    var old = vertices.subarray(0, vertices.length - 3);
    vertices.set([newP.x, newP.y, newP.z]);
    vertices.set(old, 3);
    for(var i = 0; i < maxPoints; i++) {
        sizes[i] = map(i, 0, maxPoints, 5, 0);
        colors[i*4 + 3] = map(i, 0, maxPoints, 1, 0);
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.size.needsUpdate = true;
    points.geometry.attributes.ca.needsUpdate = true;
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.02;
    mesh.rotation.y += 0.04;
    mesh.rotation.z += 0.04;
    childMesh.rotation.y += 0.02;
    childMesh.rotation.x += 0.02;
    updatePoints();

    renderer.render( scene, camera );

}
