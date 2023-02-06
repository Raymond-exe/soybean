import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { OrbitControls } from './utils/OrbitControls.js';
import { OBJLoader } from './utils/OBJLoader.js';
import { MTLLoader } from './utils/MTLLoader.js';

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

let importedMesh;

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff);
light.intensity = 3;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: function() { return this.width/this.height; },
    update: function () { canvas.width = this.width; canvas.height = this.height; }
}

const zoomLock = (sizes.ratio() > 1 ? 1 : 0.65);

const camera = new THREE.OrthographicCamera(
    sizes.width/(-400*zoomLock),
    sizes.width/(400*zoomLock),
    sizes.height/(400*zoomLock),
    sizes.height/(-400*zoomLock),
    1, 1000);
camera.position.set(0, 0, 5);
camera.rotation.set(0, -Math.PI, 0);

const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.maxZoom = 1;
controls.minZoom = zoomLock;
// controls.maxDistance = 1;
// controls.minDistance = 100;

const renderer = new THREE.WebGL1Renderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xff99ff);


// add objects to scene
scene.add(camera);
scene.add(light);

load();

const OFFSET = {
    '9months': { x:0, y:0.5, z:0 },
    '16months': { x:0, y:0, z:0 }
}

const parentFile = getPageName();
function getPageName() {
    const path = window.location.pathname;
    return path.split("/").pop().split('.')[0];
}

async function load() {
    const parentFile = getPageName();
    const textMtl = await loadMtl(`./assets/${parentFile}.mtl`);
    importedMesh = await loadObj(`./assets/${parentFile}.obj`, textMtl);

    scene.add(importedMesh);
    
    const off = OFFSET[parentFile];
    importedMesh.position.x = off.x;
    importedMesh.position.y = off.y;
    importedMesh.position.z = off.z;
}

window.addEventListener('resize', function() {
    sizes.update();
    camera.aspect = sizes.ratio();
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});


const deg0 = new THREE.Vector3( 0, 1, 0 );
const deg45 = new THREE.Vector3( -1, 1, 0 ).normalize();
const deg90 = new THREE.Vector3( 1, 0, 0 );
const deg135 = new THREE.Vector3( 1, 1, 0 ).normalize();
const zAxis = new THREE.Vector3( 0, 0, 1 );
const ROTATIONS = {
    'Text': deg0,
    'cube_Cube': deg0,
    '008': deg0,
    '015': zAxis,
    '007': zAxis,
    '014': deg45,
    '006': deg45,
    '013': zAxis,
    '005': zAxis,
    '012': deg90,
    '004': deg90,
    '011': zAxis,
    '003': zAxis,
    '010': deg135,
    '002': deg135,
    '009': zAxis,
    '001': zAxis,
}
function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (importedMesh) {
        switch (parentFile) {
            case '9months':
                importedMesh.rotateY(0.005);
                break;
            case '16months':
                meshLoop: for (let mesh of importedMesh.children) {
                    for (let index of Object.keys(ROTATIONS)) {
                        if (mesh.name.includes(index)) {
                            mesh.rotateOnAxis(ROTATIONS[index], 0.01)
                            continue meshLoop;
                        }
                    }
                    mesh.rotateOnAxis(deg0, 0.01);
                }
        }
    }
}

animate()

async function loadMtl(filepath) {
    return new Promise((resolve, reject) => {
        try {
            mtlLoader.load(filepath, resolve);
        } catch (err) {
            reject(err);
        }
    })
}

async function loadObj(filepath, materials = null) {
    return new Promise((resolve, reject) => {
        try {
            if(materials) {
                console.log('Loading materials!');
                materials.preload();
                objLoader.setMaterials(materials);
            }
            objLoader.load(filepath, resolve);
        } catch (err) {
            reject(err);
        }
    })
}