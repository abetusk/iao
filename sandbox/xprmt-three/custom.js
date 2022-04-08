
var g_info = {
  "container": {},
  "camera": {},
  "scene": {},
  "renderer": {},
  "mesh": {},
  "radius" : 500,
  "frustumSize" : 1000,
  "aspect": 1,
  "light": [],

  "geometry": {},
  "material": {},

  //"material_type" : "toon"
  "material_type" : "phong"
};


function init() {
  threejs_init();
  animate();
}

function threejs_init() {

  g_info.container = document.getElementById( 'container' );

  //

  //camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );

  g_info.aspect = window.innerWidth / window.innerHeight;
  g_info.camera = new THREE.OrthographicCamera( g_info.frustumSize * g_info.aspect / -2,
                                                g_info.frustumSize * g_info.aspect /  2,
                                                g_info.frustumSize / 2, g_info.frustumSize / - 2, 1, 2000 );

  //camera.position.z = 2750;
  g_info.camera.position.z = 1000;

  g_info.scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0x050505 );
  g_info.scene.background = new THREE.Color( 0x0a0a0a );
  g_info.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

  //

  g_info.scene.add( new THREE.AmbientLight( 0x444444 ) );

  g_info.light.push(new THREE.DirectionalLight( 0xffffff, 0.5 ));
  //const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  //light1.position.set( 1, 1, 1 );
  g_info.light[0].position.set( 1, 1, 1 ).normalize();
  g_info.scene.add( g_info.light[0] );

  g_info.light.push( new THREE.DirectionalLight( 0xffffff, 1.5 ) );
  //light2.position.set( 0, - 1, 0 );
  g_info.light[1].position.set( 0, - 1, 0 ).normalize();
  g_info.scene.add( g_info.light[1] );

  //

  const n_triangles = 160000;

  g_info.geometry = new THREE.BufferGeometry();

  const positions = [];
  const normals = [];
  const colors = [];

  const color = new THREE.Color();

  const n = 800, n2 = n / 2; // triangles spread in the cube
  const d = 12, d2 = d / 2; // individual triangle size

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();

  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  for ( let i = 0; i < n_triangles; i ++ ) {

    // positions

    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    const ax = x + Math.random() * d - d2;
    const ay = y + Math.random() * d - d2;
    const az = z + Math.random() * d - d2;

    const bx = x + Math.random() * d - d2;
    const by = y + Math.random() * d - d2;
    const bz = z + Math.random() * d - d2;

    const cx = x + Math.random() * d - d2;
    const cy = y + Math.random() * d - d2;
    const cz = z + Math.random() * d - d2;

    positions.push( ax, ay, az );
    positions.push( bx, by, bz );
    positions.push( cx, cy, cz );

    // flat face normals

    pA.set( ax, ay, az );
    pB.set( bx, by, bz );
    pC.set( cx, cy, cz );

    cb.subVectors( pC, pB );
    ab.subVectors( pA, pB );
    cb.cross( ab );

    cb.normalize();

    const nx = cb.x;
    const ny = cb.y;
    const nz = cb.z;

    normals.push( nx, ny, nz );
    normals.push( nx, ny, nz );
    normals.push( nx, ny, nz );

    // colors

    const vx = ( x / n ) + 0.5;
    const vy = ( y / n ) + 0.5;
    const vz = ( z / n ) + 0.5;

    color.setRGB( vx, vy, vz );

    const alpha = Math.random();

    colors.push( color.r, color.g, color.b, alpha );
    colors.push( color.r, color.g, color.b, alpha );
    colors.push( color.r, color.g, color.b, alpha );

  }

  function disposeArray() { this.array = null; }

  g_info.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ).onUpload( disposeArray ) );

  g_info.geometry.computeBoundingSphere();

  //---

  g_info.renderer = new THREE.WebGLRenderer();
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;


  //---

  //var material;


  if (g_info.material_type == "phong")  {
    g_info.material = new THREE.MeshPhongMaterial( {
     color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
     side: THREE.DoubleSide, vertexColors: true, transparent: true
    } );
  }
  else if (g_info.material_type == "toon") {
    let alpha = 0.5;
    let beta = 0.5;
    let gamma = 0.5;
    let diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );


    let format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
    let alphaIndex = 5;
    let colors = new Uint8Array( alphaIndex + 2 );
    for ( let c = 0; c <= colors.length; c ++ ) {
      colors[ c ] = ( c / colors.length ) * 256;
    }

    let gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
    gradientMap.needsUpdate = true;

    g_info.material = new THREE.MeshToonMaterial( {
      color: diffuseColor,
      gradientMap: gradientMap
    } );

  }

  g_info.mesh = new THREE.Mesh( g_info.geometry, g_info.material );
  g_info.scene.add( g_info.mesh );

  g_info.container.appendChild( g_info.renderer.domElement );

  //

  //stats = new Stats();
  //container.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {
  g_info.camera.aspect = window.innerWidth / window.innerHeight;
  g_info.camera.updateProjectionMatrix();
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
}

//---

function animate() {
  requestAnimationFrame( animate );
  render();
  //stats.update();
}

function render() {
  const time = Date.now() * 0.001;
  g_info.mesh.rotation.x = time * 0.25;
  g_info.mesh.rotation.y = time * 0.5;
  g_info.renderer.render( g_info.scene, g_info.camera );
}

console.log("ok");
