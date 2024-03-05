import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 70, 50, 70 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
const axisMaterial = new THREE.LineBasicMaterial({color:0xffffff});
const originVector = new THREE.Vector3(0, 0, 0)

let axisPoints = [];
axisPoints.push(new THREE.Vector3(-100, 0, 0));
axisPoints.push(new THREE.Vector3(100, 0, 0));

const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints)

const xAxis = new THREE.Line(xAxisGeometry, axisMaterial)
scene.add(xAxis);

axisPoints = [];
axisPoints.push(new THREE.Vector3(0, -100, 0));
axisPoints.push(new THREE.Vector3(0, 100, 0));

const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
const yAxis = new THREE.Line(yAxisGeometry, axisMaterial);
scene.add(yAxis)

axisPoints = [];
axisPoints.push(new THREE.Vector3(0, 0, -100));
axisPoints.push(new THREE.Vector3(0, 0, 100));

const zAxisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
const zAxis = new THREE.Line(zAxisGeometry, axisMaterial);
scene.add(zAxis)

let startingAngle = 0;
let elevation = 100
let radius = 100000


//let tri = nSidedPolygon(4, 10, "xz", 0)

function Cube3(l, xs, ys, zs, xr) {
    const mat = new THREE.LineBasicMaterial({color: 0x0000ff});
    
    let r = l*Math.sqrt(3), theta = Math.PI - (Math.PI/4), phi = xr + (-Math.PI/2)-(Math.PI/4);
    let phiStep = Math.PI/2, thetaStep = -Math.PI/2;
    // Positive Y axis - theta = 0
    // Positive X axis - phi = 0

    //Bottom half - theta = pi
    const bottomPts = []
    let x, y, z;
    phi -= Math.PI
    x = xs + r*(Math.cos(phi))*(Math.sin(theta))
    z = zs + r*(Math.sin(phi))*(Math.sin(theta))
    y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
    bottomPts.push(new THREE.Vector3(x, y, z))
    phi += Math.PI

    for (let count = 0; count < 4; count++) {
        //Bottom vector
        x = xs + r*(Math.cos(phi))*(Math.sin(theta))
        z = zs + r*(Math.sin(phi))*(Math.sin(theta))
        y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
        bottomPts.push(new THREE.Vector3(x, y, z))
        //UpBack vector
        phi -= phiStep
        theta += thetaStep
        x = xs + r*(Math.cos(phi))*(Math.sin(theta))
        z = zs + r*(Math.sin(phi))*(Math.sin(theta))
        y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
        bottomPts.push(new THREE.Vector3(x, y, z))
        //UpForward vector
        phi += phiStep
        x = xs + r*(Math.cos(phi))*(Math.sin(theta))
        z = zs + r*(Math.sin(phi))*(Math.sin(theta))
        y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
        bottomPts.push(new THREE.Vector3(x, y, z))
        //Down vector
        theta -= thetaStep;
        x = xs + r*(Math.cos(phi))*(Math.sin(theta))
        z = zs + r*(Math.sin(phi))*(Math.sin(theta))
        y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
        bottomPts.push(new THREE.Vector3(x, y, z))
        //Advance to next side
        phi += phiStep
    }
    x = xs + r*(Math.cos(phi))*(Math.sin(theta))
    z = zs + r*(Math.sin(phi))*(Math.sin(theta))
    y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
    bottomPts.push(new THREE.Vector3(x, y, z))
    theta = Math.PI/4
    x = xs + r*(Math.cos(phi))*(Math.sin(theta))
    z = zs + r*(Math.sin(phi))*(Math.sin(theta))
    y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
    bottomPts.push(new THREE.Vector3(x, y, z))
    phi -= Math.PI
    x = xs + r*(Math.cos(phi))*(Math.sin(theta))
    z = zs + r*(Math.sin(phi))*(Math.sin(theta))
    y = ys + (r/(Math.sqrt(2)))*(Math.cos(theta))
    bottomPts.push(new THREE.Vector3(x, y, z))
    phi += Math.PI


    let geo = new THREE.BufferGeometry().setFromPoints(bottomPts);
    let shape = new THREE.Line(geo, mat)
    return shape
}

let cubes = []
for (let h = -50; h < 60; h += 10) {
    for (let j = -50; j < 60; j += 4) {
        for (let i = -50; i < 60; i+=5) {
            let newCube = Cube3(2, i, h, j, 0)
            cubes.push(newCube)
            scene.add(newCube)
        }
    }
}

renderer.render( scene, camera );
let cubeRot = 0

function animate() {
    requestAnimationFrame( animate );
    startingAngle += .005;
    let [x, y, z] = xzCircleParametric(elevation, radius, startingAngle)
    camera.position.set( x, y, z );
    camera.lookAt(0, 0, 0)
    cubes.forEach(function (cube) {
        scene.remove(cube)
    }) 
    cubes.forEach(function (cube) {
        scene.add(cube)
    }) 
    
    cubeRot += .05
    renderer.render( scene, camera );
}

function xzCircleParametric(y, r, t) {
// Returns a set of x, y, z points following a circular path at angle t with radius r
    let h = Math.sqrt(r)
    let x = h*(Math.cos(t))
    let z = h*(Math.sin(t))
    return [x, y, z]
}

function constructVectorLine(vectorPoints, color) {
    let vectorMaterial = new THREE.LineBasicMaterial({color: color})
    let vgeo = new THREE.BufferGeometry().setFromPoints(vectorPoints);
    let v = new THREE.Line(vgeo, vectorMaterial);
    return v
}

function nSidedPolygon(n, s, shapePlane, y) {
    // n = side count
    // s = side length
    // shapePlane = plane to draw in.
    // Options are: xy, xz, yz
    // Originates from origin
    const mat = new THREE.LineBasicMaterial({color: 0x0000ff});
    const shapePoints = [];

    let exteriorAngle = (2*Math.PI)/n
    let currentAngle = 0;
    let currentVertex, nextVertex;

    if (shapePlane = "xz") {
        // Base line
        let currentZ = 0, currentX = s;

        currentVertex = new THREE.Vector3(0, y, currentZ);
        shapePoints.push(currentVertex);
        nextVertex = new THREE.Vector3(currentX, y, currentZ);
        shapePoints.push(nextVertex);
        
        currentAngle += exteriorAngle;

        // Next lines
        let xStep, zStep;
        for (let side = 0; side < n-1; side++) {
            xStep = s * Math.cos(currentAngle);
            zStep = s * Math.sin(currentAngle);
            currentX += xStep;
            currentZ += zStep;
            shapePoints.push(new THREE.Vector3(currentX, y, currentZ));
            currentAngle += exteriorAngle;
        }

        let geo = new THREE.BufferGeometry().setFromPoints(shapePoints);
        let shape = new THREE.Line(geo, mat)
        return shape
    }
}


  
animate();