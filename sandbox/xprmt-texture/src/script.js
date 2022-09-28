

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var g_info = {
};

function render() {

  // Control update
  g_info.controls.update();

  // Render
  g_info.renderer.render(g_info.scene, g_info.camera);
  window.requestAnimationFrame(render);

}

function init() {
  let sz = 4096;
  sz = 256;

  const canvas = document.getElementById("three-canvas");
  const renderer = new  THREE.WebGLRenderer({canvas: canvas, antialias: true});
  renderer.setSize(sz, sz, false);
  g_info["renderer"] = renderer;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  g_info["scene"] = scene;

  // Camera
  const near = 0.1;
  const far = 1000;
  const width = 1024;
  const height = 1024;
  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, near, far);
  g_info["camera"] = camera;

  // Camera position
  camera.position.x = 256;
  camera.position.y = 512;
  camera.position.z = 256;

  // Look at the center
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // OrbitControl
  const controls = new OrbitControls(camera, renderer.domElement);
  g_info["controls"] = controls;

  // Plane geometry
  let planeSize = 512;
  let planeSegments = 400;
  planeSize = 4;
  planeSegments = 4;
  let geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, planeSegments, planeSegments);

  // Plane material
  const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x333333)
  });

  // Plane mesh
  const plane = new THREE.Mesh(geometry, material);

  plane.rotateX(-Math.PI / 2.);
  plane.position.y = -100;
  scene.add(plane);

  /*
  // Render loop
  const render = () => {

    // Control update
    controls.update();

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  } 
  */

  render();

}

function create_texture() {
  let W = 128;
  let H = 128;

  let canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = W;

  let ctx = canvas.getContext('2d');

  /// fill ctx
  //

  let texture = new THREE.CAnvasTexture( canvas );
  return texture;
}


init();
console.log("...");
