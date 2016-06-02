function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

var controls, scene, camera, renderer;
var cone, coneGeometry, coneMaterial;
var geometry, glowTexture, material, mesh;

var viewPortWidth = 1024;
var viewPortHeight = 512;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, viewPortWidth / viewPortHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.SphereGeometry( 200, 10, 10 );

    glowTexture = new THREE.TextureLoader().load( 
        "sphere-glow-texture.png",
        function (tex) {
            console.log(tex);
            material = new THREE.MeshBasicMaterial({ map: tex, wireframe: true, color: 0xffffff, transparent: true });
            mesh = new THREE.Mesh( geometry, material );
            scene.add(mesh);
            mesh.add(cone);
        } 
    );
    glowTexture.wrapS = THREE.RepeatWrapping;
    glowTexture.wrapT = THREE.RepeatWrapping;

    coneGeometry = new THREE.ConeGeometry(50, 200, 20);
    coneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    cone = new THREE.Mesh( coneGeometry, coneMaterial );
    cone.position.y -= 100;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( viewPortWidth, viewPortHeight );
    renderer.domElement.width = viewPortWidth;
    renderer.domElement.height = viewPortHeight;
    renderer.updateStyle = true;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.0;

    controls.noZoom = true;
    controls.noPan = true;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener("change", () => glowTexture.offset.y = 0.45);

    document.body.appendChild( renderer.domElement );
}

function animate() {

    requestAnimationFrame( animate );
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
    mesh.rotation.z += 0.001;
    if(glowTexture.offset.y >= -0.55) {
        glowTexture.offset.y -= 0.01;
    }
    controls.update();
    renderer.render( scene, camera );

}
