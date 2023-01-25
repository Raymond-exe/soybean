import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { OrbitControls } from './utils/OrbitControls.js';
import { OBJLoader } from './utils/OBJLoader.js';
import { MTLLoader } from './utils/MTLLoader.js';

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

let textObj;

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff);
light.intensity = 3;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: function() { return this.width/this.height; }
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

async function load() {
    const parentFile = getPageName()
    const textMtl = await loadMtl(`./assets/${parentFile}.mtl`);
    textObj = await loadObj(`./assets/${parentFile}.obj`, textMtl);

    scene.add(textObj);
    textObj.position.y = 0.5;
    console.log(getPageName())

    function getPageName() {
        const path = window.location.pathname;
        return path.split("/").pop().split('.')[0];
    }
}

window.addEventListener('resize', function() {
    // TODO add resizability
    camera.aspect = sizes.ratio();
    camera.updateProjectionMatrix();
})

function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (textObj) { textObj.rotateY(0.005) }
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