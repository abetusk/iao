import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function init() {
  const canvas = document.getElementById("three-canvas");
  const renderer = new  THREE.WebGLRenderer({canvas: canvas, antialias: true});
  renderer.setSize(4096, 4096, false);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  // Camera
  const near = 0.1;
  const far = 1000;
  const width = 1024;
  const height = 1024;
  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, near, far);

  // Camera position
  camera.position.x = 256;
  camera.position.y = 512;
  camera.position.z = 256;

  // Look at the center
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // OrbitControl
  const controls = new OrbitControls(camera, renderer.domElement);

  // Plane geometry
  const planeSize = 512;
  const planeSegments = 400;
  const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, planeSegments, planeSegments);

  // Plane material
  const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x333333)
  });

  // Plane mesh
  const plane = new THREE.Mesh(geometry, material);

  plane.rotateX(-Math.PI / 2.);
  plane.position.y = -100;
  scene.add(plane);

  // Render loop
  const render = () => {

  // Control update
  controls.update();

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
} 

render();




}

init();
console.log("...");
