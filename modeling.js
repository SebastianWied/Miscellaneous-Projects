import * as THREE from 'three';
import * as p from './oldprimitives';
import * as math from 'mathjs';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 7, 4, 8 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
let axisMaterial = new THREE.LineBasicMaterial({color:0xff0000});
const originVector = new THREE.Vector3(0, 0, 0)

let axisPoints = [];
axisPoints.push(new THREE.Vector3(-100, 0, 0));
axisPoints.push(new THREE.Vector3(100, 0, 0));

const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints)

const xAxis = new THREE.Line(xAxisGeometry, axisMaterial)
scene.add(xAxis);
axisMaterial = new THREE.LineBasicMaterial({color:0x00ff00});
axisPoints = [];
axisPoints.push(new THREE.Vector3(0, -100, 0));
axisPoints.push(new THREE.Vector3(0, 100, 0));

const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
const yAxis = new THREE.Line(yAxisGeometry, axisMaterial);
scene.add(yAxis)
axisMaterial = new THREE.LineBasicMaterial({color:0x0000ff});
axisPoints = [];
axisPoints.push(new THREE.Vector3(0, 0, -100));
axisPoints.push(new THREE.Vector3(0, 0, 100));

const zAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
const zAxis = new THREE.Line(zAxisGeometry, axisMaterial);
scene.add(zAxis)

function xzCircleParametric(y, r, t) {
    // Returns a set of x, y, z points following a circular path at angle t with radius r
        let h = Math.sqrt(r)
        let x = h*(Math.cos(t))
        let z = h*(Math.sin(t))
        return [x, y, z]
}


function sphericalCam(dist, flatRot, upRot) {
    // dist is the radius from the center
    // both rotation of zero is lying on x axis facing 0, 0
    // Flat rotation goes round Y axis, from +x to +z to -x to -z to +x. controls x and z values
    // up rotation controls y value.

    let y = dist * (Math.sin(upRot));
    let flatDist = dist * (Math.cos(upRot))
    let x = flatDist * (Math.cos(flatRot));
    let z = flatDist * (Math.sin(flatRot));
    if (flatDist < 0) {
        x *= -1
        z *= -1
    }
    return [x, y, z]
}

let r = 100, flatRot = 0, upRot = 0
window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key === "w") {
        if (upRot + Math.PI/48 < Math.PI/2) {
            upRot += Math.PI/48
        }
        else {
            upRot = Math.PI/2
        }
        console.log(upRot)
    }
    if (event.isComposing || event.key === "s") {
        if (upRot - Math.PI/48 > -Math.PI/2) {
            upRot -= Math.PI/48
        }
        else {
            upRot = -Math.PI/2
        }
        console.log(upRot)
    }
    if (event.isComposing || event.key === "d") {
        flatRot -= Math.PI/48
    }
    if (event.isComposing || event.key === "a") {
        flatRot += Math.PI/48
    }
    if (event.isComposing || event.key === "q") {
        r += 6
    }
    if (event.isComposing || event.key === "e") {
        r -= 6
    }
})

// Sierpinski cube
const subdivisions = 2;
let color = new THREE.Color().setRGB(120,120,0)
const sierpCubes = []

function seirpCube(depth, x, y, z, size) {
    if (depth == 1) {
        sierpCubes.push(new p.Cube(x, y, z, size, size, size, color))
    }
    else {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    if ((k==0 && i==0) || (j==0 && i==0) || (j==0 && k==0)) {
                        continue
                    }
                    let xuse = x+(i*(size/3))
                    let yuse = y+(j*(size/3))
                    let zuse = z+(k*(size/3))
                    seirpCube(depth-1,xuse, yuse, zuse, size/3)
                }
            }
        }
    }
}
//seirpCube(2, 0, 0, 0, 10)

// sierpCubes.forEach(function (cube) {
//     scene.add(cube.cube)
// })

renderer.render( scene, camera );

color = new THREE.Color().setRGB(255,255,255)
let newCube = new p.Cube(5, 0, 0, 5, 5, 5, color)
scene.add(newCube.cube)

let newPlane = new p.PlaneFromCenter(0, 10, 0, 100, 100, 100,scene);
scene.add(newPlane.plane)

function animate() {
    requestAnimationFrame( animate );
    flatRot += .005;
    let [x, y, z] = sphericalCam(r, flatRot, upRot)
    camera.position.set( x, y, z );
    camera.lookAt(0, 0, 0)
    renderer.render( scene, camera );
}

animate();