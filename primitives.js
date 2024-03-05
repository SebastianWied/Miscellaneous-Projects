import * as THREE from 'three';

export function vectorMatrixMutiply(matrix, vector) {
    const output = []
    matrix.forEach(function (row) {
        let sum = 0;
        row.forEach(function (entry, index, array) {
            sum += (entry * vector[index])
        })
        output.push(sum)
    })
    return output
}

export function rowVectorToColumn(vector) {
    const final = []
    vector.forEach(function (value) {
        final.push([value])
    })
    return final
}

export function colVectorToRow(vector) {
    const final = []
    vector.forEach(function (value) {
        final.push(value)
    })
    return final
}

export class Axis {
    constructor(scene) {
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
    }
}

export class Cube {
    constructor(position, rotation, size, scene) {
        this.position = position
        this.rotation = rotation
        this.size = size
        const unitVertices = [
            new THREE.Vector3( 1, 1, 1),
            new THREE.Vector3( 1, 1,-1),
            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(-1, 1,-1),
            new THREE.Vector3( 1,-1, 1),
            new THREE.Vector3( 1,-1,-1),
            new THREE.Vector3(-1,-1, 1),
            new THREE.Vector3(-1,-1,-1)
        ]
        this.unitVertices = unitVertices
        this.vertices = unitVertices
        const edges = Number[
            0,1,1,2,2,0,
            0,4,4,1,1,5,
            5,4,4,6,6,5,
            5,7,7,1,1,3,
            3,7,2,3,2,6,
            6,7,7,2,2,4
        ]
        this.edges = edges
        const indicesArray = new Uint16Array(this.edges)
        const positions = new Float32Array(this.unitVertices.length*3)
        const mat = new THREE.LineBasicMaterial({color: 0xffffff});
        const vectors = [];
        const vertices = this.vertices
        const geo = new THREE.BufferGeometry();
        this.unitVertices.forEach(function (vertice, index, array) {
            const vertex = vertice.clone().multiply(size).add(position);
            vertex.toArray(positions, index*3)
        })
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setIndex(new THREE.BufferAttribute(indicesArray, 1));
        const cube = new THREE.LineSegments(geo, mat);
        this.cube = cube
        scene.add(cube)
    }

    drawCube(scene) {
        let cube = this.cube
        // scene.add(cube)
    }

    updateCube() {
        //this.makeCube()
    }

    setCubePos(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
        this.updateCube()
    }

    moveCube(x, y, z) {
        this.x += x
        this.y += y
        this.z += z
        this.updateCube()
    }
    
    scaleCube(xs, ys, zs) {
        this.xs = xs
        this.ys = ys
        this.zs = zs
        this.updateCube()
    }

    rotate(rotation) {

        this.cube.setRotationFromEuler(rotation)
        
        // this.updateCube()
    }
}