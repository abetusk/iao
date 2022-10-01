import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//import vertexShader from './shaders/surface.vert';
//import fragmentShader from './shaders/surface.frag';

//import vertexShader from './s0/shader.vert';
//import fragmentShader from './s0/shader.frag';

//import vertexShader from './s2/shader.vert';
//import fragmentShader from './s2/shader.frag';

import vertexShader from './s3/shader.vert';
import fragmentShader from './s3/shader.frag';

function _rnd() {
  return Math.random();
}

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
  sz = 1024;

  const canvas = document.getElementById("three-canvas");
  const renderer = new  THREE.WebGLRenderer({canvas: canvas, antialias: true});
  renderer.setSize(sz, sz, false);
  g_info["renderer"] = renderer;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  g_info["scene"] = scene;

  // Camera
  const near = -8000;
  const far = 8000;
  const width = 512;
  const height = 512;
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
  //planeSize = 4;
  //planeSegments = 4;
  let geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, planeSegments, planeSegments);

  // Plane material
  //const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(0x333333) });

  // s0
  //const material = new THREE.ShaderMaterial({
  //  vertexShader: vertexShader,
  //  fragmentShader: fragmentShader
  //});

  // s1
  /*
  const material = new THREE.ShaderMaterial({
    uniforms: { amplitude: { type: 'f', value: 0 } },
    //attributes: { displacement: { type: 'f', value: [] } },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  */

  // s2
  let tex = create_texture();
  const material = new THREE.ShaderMaterial({
    uniforms: { tex: { type: 'f', value: tex } },
    //attributes: { displacement: { type: 'f', value: [] } },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
  });

  //const material = new THREE.MeshBasicMaterial({
  //  map: create_texture(),
  //  side: THREE.DoubleSide
  //});

  // Plane mesh
  const plane = new THREE.Mesh(geometry, material);

  //plane.rotateX(-Math.PI / 2.);
  //plane.position.y = -100;
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
  let W = 512;
  let H = 512;

  let canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = W;

  let n = Math.floor(Math.sqrt(W*H));
  n = Math.floor(W*H/10);

  let ctx = canvas.getContext('2d');
  let x, y;

  let p = [0,0];

  ctx.fillStyle = '#ccc';
  ctx.fillRect(0,0,W,H);

  let dx = 5,
      dy = 5,
      ds = (0.65*dx)/2,
      jitxy = 1.75;

  let ix,iy,
      nx = Math.floor(W/dx)+2,
      ny = Math.floor(W/dx)+2;

  ctx.fillStyle = '#bbb';
  for (ix=-1; ix<nx; ix++) {
    for (iy=-1; iy<ny; iy++) {
      let ux = (dx*ix) + (_rnd()-0.5)*jitxy;
      let uy = (dy*iy) + (_rnd()-0.5)*jitxy;
      if ((iy%2)==0) { ux += dx/2; }
      ctx.beginPath();
      ctx.arc(ux, uy, ds, 0, 2*Math.PI, false);
      ctx.fill();
    }
  }

  //ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#444';
  for (let ii=0; ii<n; ii++) {
    x = _rnd()*W;
    y = _rnd()*H;

    p[0] = x/W;
    p[1] = y/H;

    //let sz = 8*(1-p[1]);
    let sz = 8*p[1];
    ctx.fillRect(x, y, sz,sz);
  }

  /// fill ctx
  //

  let texture = new THREE.CanvasTexture( canvas );
  return texture;
}


init();
console.log("...??");


