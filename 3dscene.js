import * as THREE from 'three';
import * as p from './primitives';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
let camLookX = 0, camLookY = 0, camLookZ = 0, camX = 9, camY = 5, camZ = 10, camUp = 0, camFlat = 0
camera.position.set( camX, camY, camZ );
camera.lookAt( camLookX, camLookY, camLookZ );

const scene = new THREE.Scene();
const axes = new p.Axis(scene);



function animate() {
    requestAnimationFrame( animate );
    const cube = new p.Cube(new THREE.Vector3(0,0,0), new THREE.Vector3(0,  0, 0), new THREE.Vector3(1,1,1), scene)
    renderer.render( scene, camera );
}

animate();