//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
//
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

//
// Parts of this program are based off of the three.js examples and
// are used with permission under their MIT licensing terms. See
// LICENSE-three-js.txt files for details on the license.
// See https://github.com/mrdoob/three.js/ for further details.
//

//
// Care has been taken to make sure all third party libraries,
// whether parts used in this source file or used in external source
// files, are under a libre/free/open source license that allows
// for their use, alteration and redistribution, even for
// commercial purposes.
//

// notes:
// cores ~ 2bits
// color  ~ 4bits ( lg(6*3) ) (?)
// size   ~ 2bits
// align   ~ 1bits
// direction ~ 2bits
//
// one directoin only (~1bit)
// direction determines shape characteristic (~1bit)

var g_info = {
  "PROJECT" : "screenshot heist",
  "VERSION" : "1.0.0",

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "runtime_start":-1,
  "runtime_ms": 0,
  "preview_taken" : false,
  "trigger_preview_delay_ms" : 3000,

  "download_filename":"screenshot_heist_1gen.png",

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,

  "features": {},

  "container": {},
  "camera": {},
  "scene": {},
  "renderer": {},
  "mesh": {},
  "radius" : 500,
  "frustumSize" : 1500,
  "aspect": 1,
  "light": [],

  "take_screenshot_flag" : false,

  "geometry": {},
  "material": {},

  "cx": 35/2,
  "cy": 35/2,
  "cz": 35/2,

  "rotx": 0,
  "roty": 0,
  "rotz": 0,

  "save_count": 0,

  "fudge": 1/1024,

  "background_color": [ "#101010", "#070707", "#080808", "#fefefe" ],


  "palette": [

    /*
    { 
      "name": "yuma_punk",
      "colors": ["#f05e3b", "#ebdec4", "#ffdb00"],
      "stroke": "#ebdec4",
      "background": "#161616"
    },

    { 
      "name": "juxtapoz",
      "colors": ["#20357e", "#f44242", "#ffffff"],
      "stroke": "#000000",
      "background": "#cfc398"
    },


    { 
      "name": "ducci_i",
      "colors": ["#e9dcad", "#143331", "#ffc000"],
      "stroke": "#ffc000",
      "background": "#a74c02"
    },


    { 
      "name": "ducci_j",
      //"colors": ["#c47c2b", "#5f5726", "#000000", "#7e8a84"],
      "colors": ["#c47c2b", "#5f5726", "#1e1e1e", "#7e8a84"],
      "stroke": "#7e8a84",
      "background": "#ecddc5"
    },
    {  
      "name": "dt03",
      //"colors": ["#000000", "#a7a7a7"],
      "colors": ["#222222", "#a7a7a7"],
      "stroke": "#000000",
      "background": "#0a5e78"
    },
    */

    { 
      "name" : "monochrome",
      "colors" : [ "#111111", "#eeeeee" ],
      "background": "#777777"
    }

  ],

  "palette_idx": 1,

  "distribution_type": 0,
  "place_type" : 0,
  "place_size": 64,
  "n_rect": 10000,
  "speed_factor":  0.00075,
  "light_speed_factor":  1/4,

  "view_counter" : 18,
  "view_counter_n" : 20,

  "view_prv" : 0,
  "view_nxt" : 1,
  "time_prv": -1,
  "time_cp": -1,

  "data": {
    "info": [],
    "tri": {},

    "rot": [],
    "dv" : [],
    "pos" : []
  },

  //"initial_center_type_choice" : ["uniform", "core", "2core-vertical", "2core-horizontal"],
  "initial_center_type_choice" : ["uniform", "core" ],
  "initial_center_type" : "uniform",

  "rotation_option" : false,

  "_dimension_factor_profile" : [
    [2,12,72],  [2,10,50],  [2,8,32], [2,6,18],
    [1,6,36],   [1,5,25],   // [1,4,16], [1,3,9],
    [1,12,72],  [1,10,50],  [1,8,32], [1,6,18]
  ],
  "dimension_factor_profile" : [
    [3,18,108],  [6,30,150],  [3,12,48], [3,9,27],
    [2,12,72],   [2,10,50],
    [2,24,144],  [2,20,100],  [2,16,64], [2,12,36]
  ],
  "dimension_factor" : [ 1,1,1],

  "n_direction": 3,
  "direction": ['x', 'y',  'z'],
  "box_align": 0,

  "speed_modifier": 27,

  "smear_opt" : false,

  "debug_line": false,
  "debug_cube": [],
  "debug_cube_pos": [],

  "vertexShader" : //'attribute float size;\n' +
   //'varying vec3 vColor;\n' +
   'attribute vec3 pos;\n' +
   'varying vec4 vColor;\n' +
   //'varying vec4 vColor;\n' +
   'void main() {\n' +
   '  vColor = color;\n' +
   '  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );\n' +
   //'  gl_PointSize = size * ( 300.0 / -mvPosition.z );\n' +
   '  gl_Position = projectionMatrix * mvPosition;\n' +
   //'  gl_Position = vec4(1000.0, 100.0, 1000.0, 1.0);\n' +

   '}\n',

  "fragmentShader" : 'varying vec4 vColor;\n' +
    'void main() {\n' +
    //'  gl_FragColor = vec4( vColor,l 1.0 );\n' +
    '  gl_FragColor = vColor;\n' +
    '}\n',

  //"material_type" : "phong"
  "material_type" : "toon"

};


if (typeof fxrand === "undefined") {
  var fxrand = Math.random;
}

function _clamp(v, m, M) {
  if (v<m) { return m; }
  if (v>M) { return M; }
  return v;
}

function _mod1(v, m, M) {
  let D = (M-m);
  if ((m<v) && (v<M)) { return v; }

  let q = Math.floor(v / D);
  return v - (q*D);
}

function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(fxrand()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}


function _rnd(a,b) {
  if (typeof a === "undefined") { a = 1; }
  if (typeof b === "undefined") {
    b = a;
    a = 0;
  }
  return fxrand()*(b-a) + a;
}

function _irnd(a,b) {
  if (typeof a === "undefined") { a = 2; }
  if (typeof b === "undefined") {
    b = a;
    a = 0;
  }
  return Math.floor(fxrand()*(b-a) + a);
}

function _arnd(a) {
  let idx = _irnd(a.length);
  return a[idx];
}

function __rndpow(s) {
  return Math.pow(fxrand(), s);
}

function _expow(s) {
  return -Math.log(1 - fxrand()) / s;
}

// "memory" rand
// allows a 'memoization' of random
// for later re-use if need be.
//
function _mrnd() {
  let _rn;
  if (g_info.rnd_idx >= g_info.rnd.length) {
    _rn = fxrand();
    g_info.rnd.push( _rn );
  }
  else {
    _rn = g_info.rnd[ g_info.rnd_idx ];
  }

  g_info.rnd_idx++;

  return _rn;
}

// Choose from a 'probability distribution'
// array.
// array should have entries:
//
// v - value
// s - cumulative distribution
//
// Inefficient but simple (uses linear scan to
// find entry).
//
function _pdrnd(a, _rnf) {
  _rnf = ((typeof _rnf === "undefined") ? _mrnd : _rnf);

  let _x = _mrnd();

  for (let i=0; i<a.length; i++) {
    if (_x > a[i].s) { continue; }
    return a[i].v;
  }


  return undefined;
}

// Choose from a 'probability distribution'
// array with weights as values.
// Probability distribution is derived
// from weights (summed, renormalized).
//
// Array should have entries:
//
// v - value
// w - weight
//
function _pwrnd(a, _rnf) {

  let _N = 0;
  let _pd = [];
  for (let i=0; i<a.length; i++) {
    if (!("v" in a[i])) { continue; }
    let _w = 1;
    if ("w" in a[i]) { _w = a[i].w; }

    _N += _w;

    _pd.push( { "v": a[i].v, "s": _N } );
  }

  for (let i=0; i<_pd.length; i++) {
    _pd[i].s /= _N;
  }

  return _pdrnd(_pd, _rnf);
}

function loadjson(fn, cb) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", fn, true);
  xhr.onreadystatechange = function() {
    if ((xhr.readyState === 4) && (xhr.status === 200)) {
      cb(xhr.responseText);
    }
  }
  xhr.send(null);
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
// https://stackoverflow.com/users/96100/tim-down
//
function _tohex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function _rgb2hex(r, g, b) {
  if (typeof g === "undefined") {
    return "#" + _tohex(r.r) + _tohex(r.g) + _tohex(r.b);
  }
  return "#" + _tohex(r) + _tohex(g) + _tohex(b);
}


function _hex2rgb(rgb) {
  let s = 0;
  let d = 2;
  if (rgb[0] == '#') {
    rgb = rgb.slice(1);
  }
  if (rgb.length==3) { d = 1; }
  let hxr = rgb.slice(s,s+d);
  if (hxr.length==1) { hxr += hxr; }
  s += d;

  let hxg = rgb.slice(s,s+d);
  if (hxg.length==1) { hxg += hxg; }
  s += d;

  let hxb = rgb.slice(s,s+d);
  if (hxb.length==1) { hxb += hxb; }
  s += d;

  let v = { "r": parseInt(hxr,16), "g": parseInt(hxg,16), "b": parseInt(hxb,16) };
  return v;
}

function _hex_dhsv(hexstr, dh, ds, dv) {
  let hsv_c = _hex2hsv(hexstr);
  hsv_c.h = _clamp(hsv_c.h + dh, 0, 1);
  hsv_c.s = _clamp(hsv_c.s + ds, 0, 1);
  hsv_c.v = _clamp(hsv_c.v + dv, 0, 1);
  let rgb_c = HSVtoRGB(hsv_c.h, hsv_c.s, hsv_c.v);
  return _rgb2hex(rgb_c.r, rgb_c.g, rgb_c.b);
}

//  https://stackoverflow.com/a/17243070
// From user Paul S. (https://stackoverflow.com/users/1615483/paul-s)
//
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
 * 0 <= h,s,v, <=1
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) { s = h.s, v = h.v, h = h.h; }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
 *
 * 0 <= r,g,b <= 255
*/
function RGBtoHSV(r, g, b) {
  if (arguments.length === 1) { g = r.g, b = r.b, r = r.r; }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
    d = max - min,
    h,
    s = (max === 0 ? 0 : d / max),
    v = max / 255;

  switch (max) {
    case min: h = 0; break;
    case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
    case g: h = (b - r) + d * 2; h /= 6 * d; break;
    case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return { h: h, s: s, v: v };
}

function HSVtoHSL(h, s, v) {
  if (arguments.length === 1) { s = h.s, v = h.v, h = h.h; }
  var _h = h,
    _s = s * v, _l = (2 - s) * v;
  _s /= (_l <= 1) ? _l : 2 - _l;
  _l /= 2;
  return { h: _h, s: _s, l: _l };
}

function HSLtoHSV(h, s, l) {
  if (arguments.length === 1) { s = h.s, l = h.l, h = h.h; }
  var _h = h, _s, _v; l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  _v = (l + s) / 2;
  _s = (2 * s) / (l + s);
  return { h: _h, s: _s, v: _v };
}

function welcome() {
  let lines = [
    "  _           ",
    " (_)__ _ ___  ",
    " | / _` / _ \\ ",
    " |_\\__,_\\___/ ",
    "              "
  ];

  console.log(lines.join("\n"));
  console.log("Welcome, gentle programmer.");
  console.log("All code is libre/free. Please see individual files for license details.");
  console.log("");
  console.log("fxhash:", fxhash);
  console.log("Project:", g_info.PROJECT);
  console.log("Version", g_info.VERSION);


  console.log("");
  console.log("commands:");
  console.log("");
  console.log(" s   - save screenshot (PNG)");
  console.log(" a   - save animation (5s webm) (advanced usage)");
  console.log("");

  console.log("Features:");
  for (let key in g_info.features) {
    console.log(key + ":", g_info.features[key]);
  }

}

function screenshot_data(imguri) {
  if (typeof imguri === "undefined") { return; }
  let link = document.createElement("a");
  link.download = g_info.download_filename;
  link.href = imguri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}



//----

function _lookup_block_key(x,y,z) {
  let _x = Math.floor(x*2);
  let _y = Math.floor(y*2);
  let _z = Math.floor(z*2);

  return _x + ":" + _y + ":" + _z;
}

//----
// Parse of the following were taken from https://webglfundamentals.org/
// https://github.com/gfxfundamentals/webgl-fundamentals
// which are used with permission via a BSD-3 clause license.
//

/*
var m4 = {

  projection: function(width, height, depth) {

    // Note: This matrix flips the Y axis so 0 is at the top.
    //
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  _translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  tx,
       0,  1,  0,  ty,
       0,  0,  1,  tz,
       0,  0,  0,  1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },
  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};
*/

//
//----


//-----
//-----
//-----

function iso_project(plane,x,y,z,s) {
  plane = ((typeof plane === "undefined") ? "xy": plane);

  let s2 = Math.sqrt(2);
  let s3 = Math.sqrt(3);

  let basis = {
    "xy": [
      [ s3/2, -s3/2, 0 ],
      [ 0.5, 0.5, 1 ]
    ],
    "xz": [
      [ s3/2, 0, -s3/2 ],
      [ 0.5, 1, 0.5 ]
    ],
    "yz": [
      [ 0, s3/2, -s3/2 ],
      [ 1, 0.5, 0.5 ]
    ],

    "zx": [
      [ -s3/2, s3/2, 0 ],
      [ 0.5, 0.5, 1 ]
    ],
    "yx": [
      [ -s3/2, 0, s3/2 ],
      [ 0.5, 1, 0.5 ]
    ],
    "zy": [
      [ 0, -s3/2, s3/2 ],
      [ 1, 0.5, 0.5 ]
    ]

  };

  let b = basis[plane];

  let x2d = b[0][0]*x + b[0][1]*y + b[0][2]*z;
  let y2d = b[1][0]*x + b[1][1]*y + b[1][2]*z;

  return {"x": x2d, "y": y2d, "s": s, "width": s, "height": s };

}

function quad_intersect(q0, q1) {
  if (q1.x >= (q0.x + q0.width))   { return false; }
  if (q1.y >= (q0.y + q0.height))  { return false; }
  if (q0.x >= (q1.x + q1.width))   { return false; }
  if (q0.y >= (q1.y + q1.height))  { return false; }

  return true;
}

function debug() {
  //let xy2d = iso_project("xy",  vf_candidate[_r][_c].x, vf_candidate[_r][_c].y, vf_candidate[_r][_c].z , vf_candidate[_r][_c].s );
  //let _q = {"x": xy2d.x, "y": xy2d.y, "width": _w, "height": _h };
  let _w = 1;
  let _h = 1;

  let _ox = 0, _oy = 0, _oz = 10;
  let u = iso_project("xy", _ox, _oy, _oz, 1);
  let b = { "x":u.x, "y": u.y, "width": 1, "height": 1 };

  for (let x=0; x<10; x++) {
    for (let y=0; y<10; y++) {
      for (let z = 0; z<10; z++) {
        let xy2d = iso_project("xy",  x, y, z, 1 );

        //console.log("xyz:[", x, y, z, "] --> xy(", xy2d.x, xy2d.y, ")");

        let _q = {"x": xy2d.x, "y": xy2d.y, "width": _w, "height": _h };
        if (quad_intersect( _q, b)) {
          //console.log("!!!", x, y, z, _q, b);
        }
      }
    }
  }

}

function debug2() {
  let ok = {};
  let n = 200;
  for (let i=0; i<n; i++) {
    for (let j=0; j<n; j++) {
      for (let k=0; k<n; k++) {

        ok[i + ":" + j + ":" + k] = 1;
      }
    }
  }

  console.log("...");
}

function fst_intersect(placed,candidate) {
  let planes = ["xy", "xz", "yz", "yx", "zx", "zy" ];

  let qtree = new Quadtree( {"x":-80, "y": -80, "width": 160, "height": 160} );

  for (let pidx=0; pidx<planes.length; pidx++) {
    let plane = planes[pidx];
    for (let idx=0; idx<placed.length; idx++) {
      for (let ii=0; ii<placed[idx].length; ii++) {
        for (let jj=0; jj<placed[idx][ii].length; jj++) {
          let pxy = placed[idx][ii][jj];
          let pxy2d = iso_project(plane, pxy.x, pxy.y, pxy.z, pxy.s);

          let _q = {"x": pxy2d.x, "y": pxy2d.y, "width": pxy.s, "height": pxy.s };
          qtree.insert( _q );

        }
      }
    }
  }


  for (let pidx=0; pidx<planes.length; pidx++) {
    let plane = planes[pidx];
    for (let _r=0; _r<candidate.length; _r++) {
      for (let _c=0; _c<candidate[_r].length; _c++) {
        let xy = candidate[_r][_c];
        let xy2d = iso_project(plane,  candidate[_r][_c].x, candidate[_r][_c].y, candidate[_r][_c].z , candidate[_r][_c].s );

        let _q = {"x": xy2d.x, "y": xy2d.y, "width": xy.s, "height": xy.s };

        let ele = qtree.retrieve(_q);
        for (let ii=0; ii<ele.length; ii++) {
          if (quad_intersect(ele[ii], _q)) { return true; }
        }
      }
    }
  }

  return false;
}

function slo_intersect(placed,candidate) {
  let planes = ["xy", "xz", "yz", "yx", "zx", "zy" ];

  for (let pidx=0; pidx<planes.length; pidx++) {
    let plane = planes[pidx];
    for (let _r=0; _r<candidate.length; _r++) {
      for (let _c=0; _c<candidate[_r].length; _c++) {
        //let xy2d = iso_project("xy",  candidate[_r][_c].x, candidate[_r][_c].y, candidate[_r][_c].z , candidate[_r][_c].s );
        let xy2d = iso_project(plane,  candidate[_r][_c].x, candidate[_r][_c].y, candidate[_r][_c].z , candidate[_r][_c].s );

        for (let idx=0; idx<placed.length; idx++) {
          for (let ii=0; ii<placed[idx].length; ii++) {
            for (let jj=0; jj<placed[idx][ii].length; jj++) {
              let pxy = placed[idx][ii][jj];
              //let pxy2d = iso_project("xy", pxy.x, pxy.y, pxy.z, pxy.s);
              let pxy2d = iso_project(plane, pxy.x, pxy.y, pxy.z, pxy.s);

              //console.log("candidate", candidate[_r][_c].x, candidate[_r][_c].y, candidate[_r][_c].z , candidate[_r][_c].s, "->", xy2d.x, xy2d.y,
              //"placed", pxy.x, pxy.y, pxy.z, "->", pxy2d.x, pxy2d.y);

              if (quad_intersect(xy2d, pxy2d)) { return true; }
            }
          }
        }
      }
    }
  }
  return false;
}

function debug_ok() {
  let ds = 64;

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;


  for (let p=-ds; p<=ds; p++) {
    //debug_add(ds*p, ds*p, ds*p, ds);
    //
    debug_add(cx + p, cy + p, cz + p, 20);

    debug_add(cx - p, cy + p, cz + p, 20);

    debug_add(cx - p, cy - p, cz + p, 20);

    debug_add(cx + p, cy - p, cz - p, 20);

    debug_add(cx - p, cy + p, cz - p, 20);
  }
}

function debug_add(x,y,z,s){
  let cube_geom = new THREE.BoxGeometry( s, s, s );
  let cube_mat = new THREE.MeshPhongMaterial( {
     color: 0xaaaaaa, specular: 0xffffff, shininess: 0,
     side: THREE.DoubleSide, vertexColors: true, transparent: false
    });

  let cube = new THREE.Mesh( cube_geom, cube_mat);

  cube.position.copy(new THREE.Vector3());

  //let cube = new THREE.Mesh( cube_geom, g_info.material);

  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;

  //cube.position.copy( [x,y,z] );


  //cube.computeBoundingSphere();

  g_info.debug_cube.push(cube);
  g_info.debug_cube_pos.push( [x,y,z] );

  g_info.scene.add(cube);
}

function tri_rect(vert, dxyz, cxyz) {
  cxyz = ((typeof cxyz === "undefined") ? [0,0,0] : cxyz);

  let u = [ dxyz[0]/2, dxyz[1]/2, dxyz[2]/2 ];
  let c = [ cxyz[0], cxyz[1], cxyz[2] ];

  // xy -z
  //
  vert.push( -u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push( -u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );

  vert.push( -u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );

  // xy +z
  //
  vert.push( -u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );
  vert.push( -u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );

  vert.push( -u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );

  // xz +y
  //
  vert.push( -u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );
  vert.push( -u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );

  vert.push( -u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );

  // xz -y
  //
  vert.push( -u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push( -u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );

  vert.push( -u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );

  // yz -x
  //
  vert.push( -u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push( -u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push( -u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );

  vert.push( -u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push( -u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push( -u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );

  // yz +x
  //
  vert.push(  u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );

  vert.push(  u[0]+c[0], -u[1]+c[1],   u[2]+c[2] );
  vert.push(  u[0]+c[0], -u[1]+c[1],  -u[2]+c[2] );
  vert.push(  u[0]+c[0],  u[1]+c[1],  -u[2]+c[2] );

}

function rndscale() {
  let _scale = 1;

  if      (g_info.distribution_type == 0) { _scale = _expow(2.25) + 1/32; }
  //else if (g_info.distribution_type == 1) { _scale = _rndpow(-0.925, 1.25) + 1/32; }
  else if (g_info.distribution_type == 1) { _scale = _rndpow(-0.925, 1.5) + 1/3; }

  //else if (g_info.distribution_type == 2) { _scale = _rndpow(-0.5, 1.125) + 1/16; }
  else if (g_info.distribution_type == 2) { _scale = _rndpow(-0.5, 1.125) + 1/2; }
  //else if (g_info.distribution_type == 2) { _scale = _rndpow(-0.5, 3.05) + 1/8; }

  else if (g_info.distribution_type == 3) { _scale = _rndpow(0.75) + 1/32; }
  else if (g_info.distribution_type == 4) { _scale = _rndpow(1) + 1/32; }
  else if (g_info.distribution_type == 5) { _scale = _rndpow(1.25) + 1/32; }
  else if (g_info.distribution_type == 6) { _scale = _rndpow(1.5) + 1/32; }
  else if (g_info.distribution_type == 7) { _scale = _rndpow(1.75) + 1/32; }
  else if (g_info.distribution_type == 8) { _scale = _rndpow(2) + 1/32; }
  else if (g_info.distribution_type == 9) { _scale = _expow(1.75) + 1/32; }
  else if (g_info.distribution_type ==10) { _scale = _expow(2) + 1/32; }
  else { _scale = _rnd(2) + 1/32; }

  return _scale;

}

function sh_init() {

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;

  let qtree = new Quadtree( {"x":-80, "y": -80, "width": 160, "height": 160} );

  let placed_list = [];

  let dxy = g_info.place_size;
  let vf = [];
  let tri_sh = [];

  //g_info["n_rect"] = 40000;
  //g_info.n_rect = 1;
  //g_info.n_rect = 100;
  //g_info.n_rect = 8000;

  g_info.data.dr  = new Array( g_info.n_rect*3 );
  g_info.data.dv  = new Array( g_info.n_rect*3 );
  g_info.data.pos = new Array( g_info.n_rect*3 );
  g_info.data.rot = new Array( g_info.n_rect*3 );

  //g_info.data.dv = [];
  //g_info.data.pos = [];

  let dv = [0,0,0];
  let dv_min = 1;

  let dr = [0,0,0];

  /*
  "n_direction": 3,
  "direction": ['x', 'y',  'z'],
  "box_align": 0,

  rotation_option

  g_info.smear_opt = ((fxrand() < 0.5) ? true : false);

  */

  for (let i=0; i<g_info.n_rect; i++) {

    let tri = [];

    let _min = 0.25;
    let _dim = [ g_info.dimension_factor[0], g_info.dimension_factor[1], g_info.dimension_factor[2] ];

    _dim[0] *= rndscale();
    _dim[1] *= rndscale();
    _dim[2] *= rndscale();

    fisher_yates_shuffle(_dim);

    let u = [ fxrand()*_dim[0] + _min,
              fxrand()*_dim[1] + _min,
              fxrand()*_dim[2] + _min ];
    let u2 = [ u[0]/2, u[1]/2, u[2]/2 ];

    let idx_max = 0;
    if (u[1] > u[idx_max]) { idx_max = 1; }
    if (u[2] > u[idx_max]) { idx_max = 2; }

    let idx_min = 0;
    if (u[1] < u[idx_min]) { idx_min = 1; }
    if (u[2] < u[idx_min]) { idx_min = 2; }

    if (g_info.n_direction != 3) {
      let didx = _arnd( g_info.direction_idx );
      let t = u[idx_max];
      u[idx_max] = u[didx];
      u[didx] = t;

      idx_max = didx;
    }

    // force all rectangular cuboids to be in the same plane
    //
    if (g_info.box_align>0) {
      let idx1 = (idx_max+g_info.box_align)%3;
      let idx2 = (idx_max+2*g_info.box_align)%3;

      if (u[idx1] < u[idx2]) {
        let t = u[idx1];
        u[idx1] = u[idx2];
        u[idx2] = t;
      }
    }


    let _R = 1;
    let cxyz = [0,0,0];
    if (g_info.initial_center_type == "single_core") {
      _R = 1000;
      cxyz[0] =  _R*(fxrand()-0.5);
      cxyz[1] =  _R*(fxrand()-0.5);
      cxyz[2] =  _R*(fxrand()-0.5);
    }
    else if (g_info.initial_center_type == "core") {

      let cent = _arnd( g_info.core_center );
      _R = 800;
      cxyz[0] =  _R*(fxrand()-0.5) + cent[0];
      cxyz[1] =  _R*(fxrand()-0.5) + cent[1];
      cxyz[2] =  _R*(fxrand()-0.5) + cent[2];
    }
    else if (g_info.initial_center_type == "uniform") {
      _R = 4000;
      cxyz[0] =  _R*(fxrand()-0.5);
      cxyz[1] =  _R*(fxrand()-0.5);
      cxyz[2] =  _R*(fxrand()-0.5);
    }

    if (g_info.smear_opt) {
      cxyz[idx_max] += _rnd( -2.5*g_info.frustumSize, 2.5*g_info.frustumSize );
    }

    dv[0] = 0;
    dv[1] = 0;
    dv[2] = 0;

    dr[0] = 0;
    dr[1] = 0;
    dr[2] = 0;

    let _V = u[0]*u[1]*u[2];

    if (_V < (1/(1024*1024))) { _V = 1; console.log("bang");  }

    let _speed = g_info.speed_modifier;
    let _P = (_speed*rndscale())/(_V);
    let _Q = (rndscale())/(_V);

    let _dv_sgn = ((fxrand()<0.5) ? -1 : 1);
    let _dr_sgn = ((fxrand()<0.5) ? -1 : 1);

    if (g_info.direction_velocity[idx_max]!=0) {
      _dv_sgn = g_info.direction_velocity[idx_max];
    }

    dv[idx_max] = _dv_sgn*(_P + dv_min);

    if (g_info.rotatation_option) {
      //dr[idx_max] = _clamp(_dr_sgn*_Q*_P*8, 1.0/512.0, 1/32.0);
      dr[idx_max] = _clamp(_dr_sgn*_Q*_P*8,
        _rnd(1/512, 1/256),
        _rnd(1/64, 1/32.0) );
    }

    g_info.data.dv[3*i+0] = dv[0];
    g_info.data.dv[3*i+1] = dv[1];
    g_info.data.dv[3*i+2] = dv[2];

    g_info.data.pos[3*i+0] = cxyz[0];
    g_info.data.pos[3*i+1] = cxyz[1];
    g_info.data.pos[3*i+2] = cxyz[2];

    g_info.data.rot[3*i+0] = 0;
    g_info.data.rot[3*i+1] = 0;
    g_info.data.rot[3*i+2] = 0;

    if (g_info.rotation_option) {
      g_info.data.rot[3*i+idx_max] = fxrand()*Math.PI*2;
    }

    g_info.data.dr[3*i+0] = dr[0];
    g_info.data.dr[3*i+1] = dr[1];
    g_info.data.dr[3*i+2] = dr[2];

    tri_rect(tri, u);
    tri_sh.push(tri);

  }

  g_info.data.tri = tri_sh;

}

function tri_bound() {
  let first = true;
  let xx = [0,0], yy = [0,0], zz=[0,0];
  for (let i=0; i<g_info.data.tri.length; i++) {
    for (let j=0; j<g_info.data.tri[i].length; j+=3) {

      let _x = g_info.data.tri[i][j];
      let _y = g_info.data.tri[i][j+1];
      let _z = g_info.data.tri[i][j+2];

      if (first) {
        xx[0] = _x;
        xx[1] = _x;

        yy[0] = _y;
        yy[1] = _y;

        zz[0] = _z;
        zz[1] = _z;
        first = false;
      }

      if (xx[0] > _x) { xx[0] = _x; }
      if (xx[1] < _x) { xx[1] = _x; }

      if (yy[0] > _y) { yy[0] = _y; }
      if (yy[1] < _y) { yy[1] = _y; }

      if (zz[0] > _z) { zz[0] = _z; }
      if (zz[1] < _z) { zz[1] = _z; }

    }
  }

  console.log(xx,yy,zz);
}

function threejs_init() {

  g_info.container = document.getElementById( 'container' );

  //---

  g_info.aspect = window.innerWidth / window.innerHeight;
  g_info.camera = new THREE.OrthographicCamera(-g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize/2,
                                               -g_info.frustumSize/2,
                                                -8000,
                                                8000);

  g_info.camera.position.z = 0;

  g_info.scene = new THREE.Scene();

  let bg = parseInt(g_info.palette[ g_info.palette_idx ].background.slice(1), 16);

  g_info.scene.background = new THREE.Color( bg );
  g_info.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

  //---

  g_info.light.push(new THREE.DirectionalLight( 0xffffff, 1.5 ));
  g_info.light[0].position.set( 1, 1, 1 ).normalize();

  //SHADOW
  /*
  g_info.light[0].castShadow = true;
  g_info.light[0].shadow.camera.near  = -1000;
  g_info.light[0].shadow.camera.far   =  1000;
  g_info.light[0].shadow.camera.left  = -2500;
  g_info.light[0].shadow.camera.right =  2500;

  g_info.light[0].shadow.camera.top    =  2500;
  g_info.light[0].shadow.camera.bottom = -2500;

  g_info.light[0].shadow.mapSize.width = 512;
  g_info.light[0].shadow.mapSize.height = 512;

  g_info.light[0].shadow.radius = 4;
  g_info.light[0].shadow.bias = -0.0005;
  */

  //---

  g_info.scene.add( g_info.light[0] );

  //---

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;

  //
  //------
  //------
  //------
  g_info.renderer = new THREE.WebGLRenderer({ "antialias": true, "powerPreference": "high-performance" });
  //g_info.renderer = new THREE.WebGLRenderer();
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;

  if (g_info.material_type == "phong")  {
    g_info.material = new THREE.MeshPhongMaterial( {
     color: 0xaaaaaa, specular: 0xffffff, shininess: 0,
     //color: 0x000, specular: 0x000, shininess: 0,
     side: THREE.DoubleSide, vertexColors: true, transparent: false
    } );
  }
  else if (g_info.material_type == "toon") {
    let alpha = 0.0;
    let beta = 0.0;
    let gamma = 0.65;
    let diffuseColor = new THREE.Color().setHSL( alpha, beta, gamma );


    let format = ( g_info.renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

    let alphaIndex = 256;
    let colors = new Uint8Array( alphaIndex  );
    for ( let c = 0; c < colors.length; c ++ ) {
      colors[ c ] = ( c / (colors.length-1) ) * 255;
    }

    let gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
    gradientMap.needsUpdate = true;

    g_info.material = new THREE.MeshToonMaterial({
      vertexColors: true,
      color: diffuseColor,
      gradientMap: gradientMap
    });

    /*
    g_info.material = new THREE.ShaderMaterial({
      vertexShader: g_info.vertexShader,
      fragmentShader: g_info.fragmentShader,
      //color: diffuseColor,
      //gradientMap: gradientMap,
      vertexColors: true
    });
    */

  }

  let use_composer = true;
  if (use_composer) {
    let sz = g_info.renderer.getDrawingBufferSize( new THREE.Vector2() );
    let _wglrt = new THREE.WebGLRenderTarget( sz.width, sz.height, { "samples": 2} );
    let composer = new POSTPROCESSING.EffectComposer(g_info.renderer, _wglrt);
    g_info.composer = composer;

    let renderpass = new POSTPROCESSING.RenderPass(g_info.scene, g_info.camera);
    composer.addPass(renderpass);
    g_info.render_pass = renderpass;

    // bloom
    //

    let use_bloom = true;
    if (use_bloom) {
      let bloom_opt = {
        "intensity": 0.25,
        //"kernelSize": 2
        "kernelSize": 1.5
      };

      //if (g_info.background_brightness > 0.85) { bloom_opt.intensity = 0.25; }

      let bloomeffect = new POSTPROCESSING.BloomEffect(bloom_opt);
      let bloompass = new POSTPROCESSING.EffectPass(g_info.camera, bloomeffect);
      g_info.bloom_effect = bloomeffect;
      g_info.bloom_pass = bloompass;
      composer.addPass(bloompass);
    }


    let use_fxaa = true;
    if (use_fxaa) {
      let fxaa_opt = {
        //"subpixelQuality": 4,
        //"samples": 4
        "subpixelQuality": 1,
        "samples": 1
      }

      let fxaaeffect = new POSTPROCESSING.FXAAEffect(fxaa_opt);
      let fxaapass = new POSTPROCESSING.EffectPass(g_info.camera, fxaaeffect);
      g_info.fxaa_effect = fxaaeffect;
      g_info.fxaa_pass = fxaapass;
      g_info.composer.addPass(fxaapass);
    }

  }
  else {

    g_info.renderer = new THREE.WebGLRenderer({ "antialias": true });
    g_info.renderer.setPixelRatio( window.devicePixelRatio );
    g_info.renderer.setSize( window.innerWidth, window.innerHeight );
    g_info.renderer.outputEncoding = THREE.sRGBEncoding;

  }



  //---

  function disposeArray() { this.array = null; }

  //g_info.geometry = new THREE.BufferGeometry();

  //const positions = [];
  //const normals = [];
  //const colors = [];

  const color = new THREE.Color();

  //const n = 800, n2 = n / 2; // triangles spread in the cube

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();

  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  let tri_sh = g_info.data.tri;

  g_info["mesh_a"] = [];

  let positions = [];
  let rect_colors = [];
  let normals = [];

  let d = 12;
  let d2 = 0;
  for (let idx=0; idx<tri_sh.length; idx++) {

    const x = 0;
    const y = 0;
    const z = 0;

    let pal = g_info.palette[ g_info.palette_idx ];

    let color_hex = pal.colors[ _irnd(pal.colors.length) ];
    let rgb = _hex2rgb( color_hex );
    color.setRGB( rgb.r/255, rgb.g/255, rgb.b/255 );

    let alpha = 1;

    let _atten = [
      _rnd(0.95,1.05), 
      _rnd(0.95,1.05), 
      _rnd(0.95,1.05)
    ];

      //DEBUG
      let tx = (fxrand()-0.5)*200;
      let ty = (fxrand()-0.5)*200;
      let tz = (fxrand()-0.5)*200;


    //let colors = [];
    //let normals = [];
    //let rect_colors = [];
    //let positions = new Float32Array( tri_sh[idx].length );
    for ( let i = 0; i < tri_sh[idx].length; i += 9 ) {
      let ax = x + tri_sh[idx][i + 0]*d - d2;
      let ay = y + tri_sh[idx][i + 1]*d - d2;
      let az = z + tri_sh[idx][i + 2]*d - d2;

      let bx = x + tri_sh[idx][i + 3]*d - d2;
      let by = y + tri_sh[idx][i + 4]*d - d2;
      let bz = z + tri_sh[idx][i + 5]*d - d2;

      let cx = x + tri_sh[idx][i + 6]*d - d2;
      let cy = y + tri_sh[idx][i + 7]*d - d2;
      let cz = z + tri_sh[idx][i + 8]*d - d2;

      //DEBUG
      ax += tx;
      ay += ty;
      az += tz;

      bx += tx;
      by += ty;
      bz += tz;

      cx += tx;
      cy += ty;
      cz += tz;

      positions.push( ax, ay, az );
      positions.push( bx, by, bz );
      positions.push( cx, cy, cz );

      /*
      positions[i + 0] = ax;
      positions[i + 1] = ay;
      positions[i + 2] = az;

      positions[i + 3] = bx;
      positions[i + 4] = by;
      positions[i + 5] = bz;

      positions[i + 6] = cx;
      positions[i + 7] = cy;
      positions[i + 8] = cz;
      */

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

      let cc = { "r": _atten[0]*color.r, "g": _atten[1]*color.g, "b": _atten[2]*color.b };
      rect_colors.push( cc.r, cc.g, cc.b, alpha );
      rect_colors.push( cc.r, cc.g, cc.b, alpha );
      rect_colors.push( cc.r, cc.g, cc.b, alpha );

    }



  }

  g_info.positions = positions;

  let pp = new Float32Array( positions.length );
  for (let ii=0; ii<pp.length; ii++) {
    pp[ii] = positions[ii];
  }

  g_info.pp = pp;

  let geom = new THREE.BufferGeometry();
  //geom.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).onUpload( disposeArray )  );
  //geom.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray )  );
  //geom.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geom.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  //geom.setAttribute( 'pos', new THREE.Float32BufferAttribute( pp, 3 ).setUsage( THREE.DynamicDrawUsage ) );
  //geom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ).onUpload( disposeArray ) );
  //geom.setAttribute( 'color', new THREE.Float32BufferAttribute( rect_colors, 4 ).onUpload( disposeArray ) );
  //geom.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );

  geom.setAttribute( 'color', new THREE.Float32BufferAttribute( rect_colors, 4 ) );
  geom.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

  let mesh = new THREE.Mesh( geom, g_info.material );

  g_info.mesh_a.push(mesh);

  //---

  //SHADOW
  //g_info.renderer.shadowMap.enabled = true;
  //g_info.renderer.shadowMap.type = THREE.VSMShadowMap;


  //---

  //g_info.mesh = new THREE.Mesh( g_info.geometry, g_info.material );

  //SHADOW
  //g_info.mesh.castShadow = true;
  //g_info.mesh.receiveShadow = true;

  //g_info.scene.add( g_info.mesh );

  for (let ii=0; ii<g_info.mesh_a.length; ii++) {
    g_info.scene.add( g_info.mesh_a[ii] );
  }

  g_info.container.appendChild( g_info.renderer.domElement );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

  g_info.aspect = window.innerWidth / window.innerHeight;

  /*
  g_info.camera = new THREE.OrthographicCamera(-g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize/2,
                                               -g_info.frustumSize/2,
                                                -8000,
                                                8000);
  */

  g_info.camera.left    = -g_info.frustumSize * g_info.aspect/2;
  g_info.camera.right   =  g_info.frustumSize * g_info.aspect/2;
  g_info.camera.top     =  g_info.frustumSize /2;
  g_info.camera.bottom  = -g_info.frustumSize /2;
  g_info.camera.near    = -8000;
  g_info.camera.far     =  8000;

  g_info.camera.updateProjectionMatrix();
  g_info.camera.position.z = 0;

  g_info.renderer.setSize( window.innerWidth, window.innerHeight );

  if ("composer" in g_info) {
    g_info.composer.setSize( window.innerWidth, window.innerHeight );
  }

  g_info.camera.position.z = 0;
}

//---

var g_fps = {
  "counter": 0,
  "prv": -1,
  "cur": -1,
  "dt": 0
};

function animate() {

  g_fps.cur = Date.now();
  if (g_fps.prv < 0) { g_fps.prv = g_fps.cur; }

  g_fps.counter++;
  if ((g_fps.counter % 20)==0) {
    g_fps.dt = g_fps.cur - g_fps.prv;
    if (g_fps.dt>0) {
      console.log("fps:", 1000.0/g_fps.dt);
    }
  }
  g_fps.prv = g_fps.cur;


  if (g_info.runtime_start < 0) {
    g_info.runtime_start = Date.now();
  }
  g_info.runtime_ms = Date.now() - g_info.runtime_start;

  let B = 2.5*g_info.frustumSize ;
  let BBOX = [ -B, B, -B, B, -B, B ];

  g_info.debug_x = { "B":B, "BBOX":BBOX };

  //"trigger_preview_delay_ms" : 3000,
  if ((!g_info.preview_taken) && (g_info.runtime_ms > g_info.trigger_preview_delay_ms)) {
    fxpreview();
    g_info.preview_taken = true;
  }

  requestAnimationFrame( animate );

  /*
  for (let ii=0; ii<g_info.data.pos.length; ii++) {
    g_info.data.pos[3*ii+0] += g_info.data.dv[3*ii+0];
    g_info.data.pos[3*ii+1] += g_info.data.dv[3*ii+1];
    g_info.data.pos[3*ii+2] += g_info.data.dv[3*ii+2];
  }
  */

  if (!g_info.paused) {
    for (let ii=0; ii<g_info.n_rect; ii++) {
      g_info.data.pos[3*ii+0] += g_info.data.dv[3*ii+0];
      g_info.data.pos[3*ii+1] += g_info.data.dv[3*ii+1];
      g_info.data.pos[3*ii+2] += g_info.data.dv[3*ii+2];

      g_info.data.rot[3*ii+0] = _mod1(g_info.data.rot[3*ii+0] + g_info.data.dr[3*ii+0], -Math.PI, Math.PI);
      g_info.data.rot[3*ii+1] = _mod1(g_info.data.rot[3*ii+1] + g_info.data.dr[3*ii+1], -Math.PI, Math.PI);
      g_info.data.rot[3*ii+2] = _mod1(g_info.data.rot[3*ii+2] + g_info.data.dr[3*ii+2], -Math.PI, Math.PI);


      if      (g_info.data.pos[3*ii+0] < BBOX[0]) { g_info.data.pos[3*ii+0] += 2*B; }
      else if (g_info.data.pos[3*ii+0] > BBOX[1]) { g_info.data.pos[3*ii+0] -= 2*B; }

      else if (g_info.data.pos[3*ii+1] < BBOX[2]) { g_info.data.pos[3*ii+1] += 2*B; }
      else if (g_info.data.pos[3*ii+1] > BBOX[3]) { g_info.data.pos[3*ii+1] -= 2*B; }

      else if (g_info.data.pos[3*ii+2] < BBOX[4]) { g_info.data.pos[3*ii+2] += 2*B; }
      else if (g_info.data.pos[3*ii+2] > BBOX[5]) { g_info.data.pos[3*ii+2] -= 2*B; }
    }


    //let pos =  g_info.mesh_a[0].geometry.attributes.pos.array;
    let pos =  g_info.mesh_a[0].geometry.attributes.position.array;
    for (let ii=0, idx=0; ii<pos.length; ii+=(3*3*2*6), idx+=1) {
      let idx = Math.floor(ii/(3*3*2*6));

      for (jj=0; jj<(3*3*2*6); jj+=3) {
        pos[ii+jj+0] = g_info.pp[ii+jj+0] + g_info.data.pos[3*idx+0];
        pos[ii+jj+1] = g_info.pp[ii+jj+1] + g_info.data.pos[3*idx+1];
        pos[ii+jj+2] = g_info.pp[ii+jj+2] + g_info.data.pos[3*idx+2];

      }
    }
    //g_info.mesh_a[0].geometry.attributes.pos.needsUpdate = true;
    g_info.mesh_a[0].geometry.attributes.position.needsUpdate = true;
    /*
    g_info.mesh_a[0].geometry.attributes.normal.needsUpdate = true;
    g_info.mesh_a[0].geometry.attributes.position.needsUpdate = true;
    g_info.mesh_a[0].geometry.attributes.color.needsUpdate = true;
    */
    g_info.mesh_a[0].geometry.computeBoundingBox();
    g_info.mesh_a[0].geometry.computeBoundingSphere();

  }

  if (g_info.animation_capture) {
    g_info.capturer.capture( g_info.renderer.domElement );

    let _t = Date.now();

    console.log("!!", g_info.capture_end - _t);

    if (_t >= g_info.capture_end) {
      g_info.animation_capture = false;
      g_info.capturer.stop();
      g_info.capturer.save();
    }

  }

  render();

}

//----
//
// The following easing functions taken from https://github.com/ai/easings.net/
// and available under a GPLv3 license.
// See https://github.com/ai/easings.net/blob/master/LICENSE for details.
//
function easeInOutSine(x) {
  return -(Math.cos(Math.PI*x) - 1)/2;
}

function easeInOutQuad(x) {
  return ( (x<0.5) ? (2*x*x) : (1 - Math.pow(-2*x + 2,2)/2) );
}

function easeInOutCubic(x) {
  return ((x<0.5) ? (4*x*x*x) : (1 - Math.pow(-2*x + 2,3)/2) );
}

function easeInOutQuart(x) {
  return ((x < 0.5) ? (8*x*x*x*x) : (1 - Math.pow(-2*x + 2,4)/2) );
}
//
//----


var _g_count = 0;
function render() {

  _g_count++;
  if (_g_count > 300) { _g_count=0; }

  let time = Date.now() * g_info.speed_factor;
  let _t_rem_orig = time - Math.floor(time);

  if (g_info.paused) {
    time = g_info.time_cp;
  }
  else {
    g_info.time_cp = time;
  }


  // init
  //
  if (g_info.time_prv < 0) {
    g_info.time_prv = time;
    g_info.view_prv = _irnd(3);
    g_info.view_nxt = (_irnd(2) + g_info.view_prv + 1)%3;
  }

  if ( Math.floor(g_info.time_prv) != Math.floor(time)) {
    g_info.time_prv = time;

    if (g_info.view_counter == 0) {
      g_info.view_prv = g_info.view_nxt;
      g_info.view_nxt = _irnd(3);

      if (g_info.view_nxt == g_info.view_prv) {
        g_info.view_nxt = (g_info.view_prv+1)%6;
      }
    }

    g_info.view_counter++;
    g_info.view_counter %= g_info.view_counter_n;
  }

  //----
  //----
  //----

  let theta_x = Math.sin(time*0.5)*0.125;
  let theta_y = time*0.5;

  theta_x = 0;
  theta_y = 0;

  let view_prv = g_info.view_prv;
  let view_nxt = g_info.view_nxt;
  let view_counter = g_info.view_counter;

  //DEBUG
  view_prv = 0;
  view_nxt = 0;

  /*
  let _euler = false;
  if (_euler) {
    g_info.mesh.rotation.x = g_info.rotx + theta_x;
    g_info.mesh.rotation.y = g_info.roty + theta_y;
    g_info.mesh.rotation.z = g_info.rotz;
  }
  else {
  */

    let mp0 = m4.xRotation(0);
    let mp1 = m4.yRotation(0);

    let mn0 = m4.xRotation(0);
    let mn1 = m4.yRotation(0);

    let _t_rem = easeInOutSine(_t_rem_orig);

    //DEBUG
    _t_rem = 0;

    if (view_counter != 0) { _t_rem = 0; }
    else { }

    let D = 4;
    //D = 1.7

    if (view_prv == 0) {
      mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
      mp1 = m4.yRotation((1-_t_rem)*Math.PI/D);
    }

    else if (view_prv == 1) {
      mp0 = m4.yRotation((1-_t_rem)*Math.PI/D);
      mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
    }
    else if (view_prv == 2) {
      mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
      mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
    }

    else if (view_prv == 3) {
      mp0 = m4.yRotation(-(1-_t_rem)*Math.PI/D);
      mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
    }
    else if (view_prv == 4) {
      mp0 = m4.xRotation(-(1-_t_rem)*Math.PI/D);
      mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
    }

    
    if (view_nxt == 0 ) {
      mn0 = m4.xRotation(_t_rem*Math.PI/D);
      mn1 = m4.yRotation(_t_rem*Math.PI/D);
    }
    else if (view_nxt == 1) {
      mn0 = m4.yRotation((_t_rem)*Math.PI/D);
      mn1 = m4.zRotation((_t_rem)*Math.PI/D);
    }
    else if (view_nxt == 2) {
      mn0 = m4.xRotation((_t_rem)*Math.PI/D);
      mn1 = m4.zRotation((_t_rem)*Math.PI/D);
    }

    else if (view_nxt == 3) {
      mn0 = m4.yRotation(-(_t_rem)*Math.PI/D);
      mn1 = m4.zRotation((_t_rem)*Math.PI/D);
    }
    else if (view_nxt == 4) {
      mn0 = m4.xRotation(-(_t_rem)*Math.PI/D);
      mn1 = m4.zRotation((_t_rem)*Math.PI/D);
    }

    let mrp = m4.multiply(mp1, mp0);
    let mrn = m4.multiply(mn1, mn0);

    let _mr = m4.multiply(mrp, mrn);
    let m = new THREE.Matrix4();

    for (let ii=0; ii<g_info.mesh_a.length; ii++) {

      g_info.mesh_a[ii].position.x = 0;
      g_info.mesh_a[ii].position.y = 0;
      g_info.mesh_a[ii].position.z = 0;

      g_info.mesh_a[ii].rotation.x = 0;
      g_info.mesh_a[ii].rotation.y = 0;
      g_info.mesh_a[ii].rotation.z = 0;

      //let _mt = m4._translation( g_info.data.pos[3*ii+0],  g_info.data.pos[3*ii+1],  g_info.data.pos[3*ii+2]);
      let _mt = m4._translation( 0, 0, 0 );
      let _mrx = m4.xRotation(g_info.data.rot[3*ii+0]);
      let _mry = m4.yRotation(g_info.data.rot[3*ii+1]);
      let _mrz = m4.zRotation(g_info.data.rot[3*ii+2]);
      let _mlr = m4.multiply( _mrx, m4.multiply( _mry, _mrz ) );
      let mr = m4.multiply( m4.multiply(_mlr, _mt ), _mr);

      m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
             mr[ 4], mr[ 5], mr[ 6], mr[ 7],
             mr[ 8], mr[ 9], mr[10], mr[11],
             mr[12], mr[13], mr[14], mr[15] );

      g_info.mesh_a[ii].applyMatrix4(m);
    }

  theta_x = Math.sin(time*0.5)*0.125;
  theta_y = time*0.5;

  for (let i=0; i<g_info.light.length; i++) {
    let _a = time*g_info.light_speed_factor + i*Math.PI/2;
    let _x = Math.cos(_a);
    let _y = Math.sin(_a);
    let _z = Math.cos(_a)*Math.sin(_a);

    g_info.light[0].position.set( _x, _y, _z ).normalize();
  }


  //g_info.mesh_a[0].geometry.attributes.pos.needsUpdate = true;
  //g_info.mesh_a[0].geometry.attributes.position.needsUpdate = true;

  if ("composer" in g_info) {
    g_info.composer.render( g_info.scene, g_info.camera );
  }
  else {
    g_info.renderer.render( g_info.scene, g_info.camera );
  }

  if (g_info.take_screenshot_flag) {
    let imgdata = g_info.renderer.domElement.toDataURL();
    screenshot_data(imgdata);
    g_info.take_screenshot_flag = false;
  }

}

//---

function init_param() {

  // clumped together initially or spread out
  //
  g_info.smear_opt = ((fxrand() < 0.5) ? true : false);
  g_info.features["Smeared"] = (g_info.smear_opt ? "True" : "False");

  // rectcuboid speed
  //
  //g_info.speed_modifier = 27 + ((fxrand()-0.5)*10);
  g_info.speed_modifier = 10 + ((fxrand()-0.5)*10);
  g_info.features["Speed Modifier"] = g_info.speed_modifier;

  // direction
  //
  g_info.n_direction = _irnd(3) + 1;
  g_info.direction = ['x', 'y', 'z'];
  g_info.direction_idx = [ 0, 1, 2 ];
  fisher_yates_shuffle(g_info.direction_idx);
  g_info.direction_idx = g_info.direction_idx.slice(0, g_info.n_direction);

  let dir_descr = [];
  for (let ii=0; ii<g_info.direction_idx.length; ii++) {
    dir_descr.push( g_info.direction[ g_info.direction_idx[ii] ] );
  }
  //g_info.features["Axies"] = g_info.direction.join(",");
  g_info.features["Axies"] = dir_descr.join(",");

  // directoinal
  //
  let sgn_descr = [ "-", "+/-", "+" ];
  g_info.direction_velocity = [0,0,0];
  g_info.direction_velocity = [ _irnd(-1,2), _irnd(-1,2), _irnd(-1,2) ];

  let _vv = g_info.direction_velocity;

  let dir_vel_descr = [
    sgn_descr[_vv[0]+1] + "x",
    sgn_descr[_vv[1]+1] + "y" ,
    sgn_descr[_vv[2]+1] + "z"
  ]

  let dir_vel_descr_fin = [];
  for (let ii=0; ii<g_info.direction_idx.length; ii++) {
    dir_vel_descr_fin.push( dir_vel_descr[ g_info.direction_idx[ii] ] );
  }

  g_info.features["Directional Velocity"] = dir_vel_descr_fin.join(",");


  // cuboid alignment
  //
  //g_info.box_align = ((fxrand() < 0.5) ? true : false);
  //g_info.features["Box Align"] = ( g_info.box_align ? "True" : "False" );

  g_info.box_align = _irnd(3);
  g_info.features["Box Align"] = g_info.box_align;


  // dimensional factors
  //
  g_info.dimension_factor = _arnd(g_info.dimension_factor_profile);

  //DEBUG
  //g_info.dimension_factor = [1,4,16];

  g_info.features["Dimension Profile"] = g_info.dimension_factor.join(",");

  // rotation in-axis
  //
  g_info.rotation_option = ((fxrand() < (1/32)) ? true : false);
  g_info.features["Axis-Rotation"] = (g_info.rotation_option ? "True": "False");

  // initial center distribution
  //
  g_info.initial_center_type = _arnd(g_info.initial_center_type_choice);
  g_info.features["Center Distribution"] = g_info.initial_center_type;

  g_info.n_core = 0;

  if (g_info.initial_center_type == "core") {
    g_info.n_core = _irnd(1,5);
    g_info.core_center = [];

    for (let ii=0; ii<g_info.n_core; ii++) {
      let _R = 1000;
      g_info.core_center.push( [ _irnd(-_R,_R), _irnd(-_R,_R), _irnd(-_R,_R) ] ); 
    }

    g_info.features["NCore"] = g_info.n_core;
  }

  // n creatures
  //
  if (g_info.n_core < 2) {
    if (g_info.n_core == 0) {
      g_info.n_rect = _arnd( [10000, 20000, 30000, 40000] );
      //g_info.n_rect = _arnd( [8000, 10000, 20000 ]);
    }
    else {
      g_info.n_rect = _arnd( [10000, 20000, 30000, 40000 ] );
      //g_info.n_rect = _arnd( [6000, 8000, 10000, 20000]);
    }
  }
  else {
    g_info.n_rect = _arnd( [10000, 20000, 30000, 40000] );
    //g_info.n_rect = _arnd( [8000, 10000, 20000] );
  }

  //DEBUG
  //g_info.n_rect = 100;

  g_info.features["Rectangular Cuboid Count"] = g_info.n_rect;

  // palette choice
  //
  //g_info.palette_idx = _irnd( g_info.palette.length );
  //let pidx = g_info.palette_idx;

  //g_info.features["Palette"] = g_info.palette[pidx].name;

  //DEBUG
  g_info.palette_idx = g_info.palette.length;
  g_info.palette.push( g_info.random_palette );

  // distribution type
  //

  let dist_name = [ "Exponential (#0)", "Exponential (#1)", "Exponential (#2)", "Power Law (#0)", "Power Law (#1)" ];
  let dist_id = [0, 9, 10, 1, 2] ;

  let idx = _irnd( dist_id.length );

  //DEBUG
  //idx = 4;

  g_info.distribution_type = dist_id[idx];

  g_info.features["Distribution"] = dist_name[idx];

  //DEBUG
  g_info.distribution_type = _irnd(11);
  g_info.features["Distribution"] = g_info.distribution_type;


  // speed factor
  //
  g_info.speed_factor  = _rnd(1/2048, 1/512); //0.00075,
  g_info.speed_factor  = _rnd(1/(2048*8), 1/(512*8)); //0.00075,

  //g_info.features["Speed Factor"] = g_info.speed_factor;

  window.$fxhashFeatures = g_info.features;
}

function _init_random_palette() {
  let pal = [];
  pal.push( chroma.random().hex() );
  pal.push( chroma.random().hex() );
  pal.push( chroma.random().hex() );
  g_info.random_palette = {
    "name": "random",
    "colors": pal,
    "stroke": "#777777",
    "background": "#333333"
  };
}

function init_random_palette() {
  let p0 = [ (fxrand()-0.5)*2, (fxrand()-0.5)*2 ];
  let p1 = [ (fxrand()-0.5)*2, (fxrand()-0.5)*2 ];

  let d0 = Math.sqrt(p0[0]*p0[0] + p0[1]*p0[1]);
  let d1 = Math.sqrt(p1[0]*p1[0] + p1[1]*p1[1]);

  p0[0] /= d0; p0[1] /= d0;
  p1[0] /= d1; p1[1] /= d1;

  let dv10 = [ p1[0] - p0[0], p1[1] - p0[1] ];
  let dv10_r = [ dv10[1], -dv10[0] ];

  let r0 = fxrand() + 0.5;
  let r1 = fxrand() + 0.5;
  let r2 = fxrand() + 0.5;

  p0[0] *= r0; p0[1] *= r0;
  p1[0] *= r1; p1[1] *= r1;
  dv10_r[0] *= r2; dv10_r[1] *= r2;

  let p2 = [ p1[0] + dv10_r[0], p1[1] + dv10_r[1] ];

  //console.log( p0.join(":"), p1.join(":"), p2.join(":") );

  let theta0 = Math.atan2(p0[1], p0[0]);
  let theta1 = Math.atan2(p1[1], p1[0]);
  let theta2 = Math.atan2(p2[1], p2[0]);

  let l0 = Math.sqrt(p0[0]*p0[0] + p0[1]*p0[1]);
  let l1 = Math.sqrt(p1[0]*p1[0] + p1[1]*p1[1]);
  let l2 = Math.sqrt(p2[0]*p2[0] + p2[1]*p2[1]);

  //l0 = 0.5; l1 = 0.75; l2 = 0.95; 

  l0 = _rnd(0.7,1);
  l1 = l0 - 0.05 - fxrand()*0.2;
  l2 = l1 - 0.05 - fxrand()*0.2;

  l0 = _rnd(0.8,1);
  l1 = l0 - 0.05 - fxrand()*0.4;
  l2 = l1 - 0.05 - fxrand()*0.4;

  let cmin = 0.05;
  let cmax = 0.5;

  cmin = 0.1;
  cmax = 0.85;


  let chroma0 = fxrand()*(cmax-cmin) + cmin;
  let chroma1 = fxrand()*(cmax-cmin) + cmin;
  let chroma2 = fxrand()*(cmax-cmin) + cmin;

  /*
  l0 *= 120;
  l1 *= 120;
  l2 *= 120;
  chroma0 *= 120;
  chroma1 *= 120;
  chroma2 *= 120;
  */

  l0 *= 130;
  l1 *= 130;
  l2 *= 130;

  chroma0 *= 130;
  chroma1 *= 130;
  chroma2 *= 130;

  //console.log("0:", l0, chroma0, 360*theta0);
  //console.log("1:", l1, chroma1, 360*theta1);
  //console.log("2:", l2, chroma2, 360*theta2);

  let c0 = chroma.lch(l0, chroma0, 360*theta0).hex();
  let c1 = chroma.lch(l1, chroma1, 360*theta1).hex();
  let c2 = chroma.lch(l2, chroma2, 360*theta2).hex();

  let pal = [ c0, c1, c2 ];

  //let u = _irnd(256);
  //let bghex = _rgb2hex( u, u, u );

  //let bg_choice = [ "#101010", "#070707", "#080808", "#777777", "#fefefe" ]
  let bg_choice = g_info.background_color;
  let bghex = _arnd(bg_choice);

  g_info.random_palette = {
    "name": "random",
    "colors": pal,
    "stroke": "#777777",
    "background": bghex
  };

  return pal;

}

function init() {

  init_random_palette();

  init_param();

  welcome();

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 's') {
      g_info.take_screenshot_flag=true;
    }
    else if (ev.key == 'a') {
      if (g_info.animation_capture) { console.log("already capturing!"); return; }
      g_info.capturer = new CCapture({"format":"webm"});
      g_info.capturer.start();
      g_info.animation_capture = true;

      g_info.capture_start = Date.now();
      g_info.capture_end = g_info.capture_start + g_info.capture_dt;

      console.log(">>>", g_info.capture_start, g_info.capture_end, g_info.capture_dt);
    }
    else if (ev.key == 'p') {
      g_info.paused = (g_info.paused ? false : true);
    }
  });

  sh_init();
  threejs_init();
  animate();
}


