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
// Some portions have been copied from other sources, like StackOverflow.
// and WebGL Fundamentals (https://webglfundamentals.org/,
// https://github.com/gfxfundamentals/webgl-fundamentals).
// Where appropriate, these have been laballed with their corresponding
// license, attribution and link to the original source.

//
// Care has been taken to make sure all third party libraries,
// whether parts used in this source file or used in external source
// files, are under a libre/free/open source license that allows
// for their use, alteration and redistribution, even for
// commercial purposes.
//

// params:
//  width / height - portrait, landscape, square all have different aesthetics
//  tube width - skinnier vs. fatter
//  step range - how dense it is
//  # squiggles - ...
//  symmetry ?
//  # y count?

var g_info = {
  "PROJECT" : "kettle",
  "VERSION" : "0.0.0",

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "download_filename":"kettle.png",

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

  "palette": [
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
  "speed_factor":  0.00075,
  "light_speed_factor":  1/4,

  "view_counter" : 18,
  "view_counter_n" : 20,

  "view_prv" : 0,
  "view_nxt" : 1,
  "time_prv": -1,

  "data": {
    "info": [],
    "tri": []
  },

  "debug_line": false,
  "debug_cube": [],
  "debug_cube_pos": [],

  //"tube_width": 25,
  //"tube_width_choice" : [20, 25, 30, 35, 40, 45, 50],
  "tube_width_choice" : [20, 25, 30, 35 ],
  "tube_width": 50,

  "collision_width_choice": [2, 2.25, 2.5, 2.75, 3],
  "collision_width": [3, 3],

  "stride": 1,
  "min_jump": 5,
  "jump_range": 20,

  //"material_type" : "phong"
  "material_type" : "toon"

};


if (typeof fxrand === "undefined") {
  var fxrand = Math.random;
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

// from https://stackoverflow.com/questions/918736/random-number-generator-that-produces-a-power-law-distribution
// CC-BY-SA gnovice (https://stackoverflow.com/users/52738/gnovice
//
function _rndpow(s, x1) {
  x0 = ((typeof x0 === "undefined") ? 0 : x0 );
  x1 = ((typeof x1 === "undefined") ? 1 : x1 );
  let y = fxrand();

  let x1p = Math.pow(x1, s+1);
  let x0p = Math.pow(x0, s+1);

  let x = Math.pow(((x1p - x0p)*y + x0p), 1/(s+1));
  return x;
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

// https://stackoverflow.com/a/596243 CC-BY-SA
// https://stackoverflow.com/users/61574/anonymous
//
function _brightness(r, g, b) {
  return ((r/255.0)*0.299) + (0.587*(g/255.0)) + (0.114*(b/255.0));
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

function kettle_triangle(vert, data) {
  vert = ((typeof vert === "undefined") ? [] : vert);


  let block_lookup = {};

  /*
  for (let r=0; r<data.length; r++) {
    for (let c=0; c<data[r].length; c++) {
      let ds = data[r][c].s;
      let _x = data[r][c].x;
      let _y = data[r][c].y;
      let _z = data[r][c].z;


      let key = _lookup_block_key(_x, _y, _z);

      block_lookup[key] = true;
    }
  }
  */

  for (let r=0; r<data.length; r++) {
    for (let c=0; c<data[r].length; c++) {

      let _x = data[r][c].x;
      let _y = data[r][c].y;
      let _z = data[r][c].z;
      let ds = data[r][c].s;

      let key;

      // top
      //

      key = _lookup_block_key( _x, _y, _z+ds );
      if (!(key in block_lookup)) {
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
      }
      else { g_info.save_count+=2; }

      // bottom
      //

      key = _lookup_block_key( _x, _y, _z-ds );
      if (!(key in block_lookup)) {
        vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );
      }
      else { g_info.save_count+=2; }

      // edge (top)
      //

      key = _lookup_block_key( _x, _y-1, _z );
      if (!(key in block_lookup)) {
        vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

        vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      }
      else { g_info.save_count+=2; }

      // edge (bottom)
      //

      key = _lookup_block_key( _x, _y+1, _z );
      if (!(key in block_lookup)) {
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
      }
      else { g_info.save_count+=2; }

      // edge (left)
      //

      key = _lookup_block_key( _x-1, _y, _z );
      if (!(key in block_lookup)) {
        vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
        vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

        vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
      }
      else { g_info.save_count+=2; }


      // edge (right)
      //

      key = _lookup_block_key( _x+1, _y, _z );
      if (!(key in block_lookup)) {
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
        vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
        vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      }
      else { g_info.save_count+=2; }

    }
  }

  return vert;
}


//----
// Parst of the following were taken from https://webglfundamentals.org/
// https://github.com/gfxfundamentals/webgl-fundamentals
// which are used with permission via a BSD-3 clause license.
//

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
                                                -80000,
                                                80000);

  g_info.camera.position.z = 0;

  g_info.scene = new THREE.Scene();

  let bg = parseInt(g_info.palette[ g_info.palette_idx ].background.slice(1), 16);

  g_info.scene.background = new THREE.Color( bg );
  //g_info.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

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

  g_info.scene.add( g_info.light[0] );

  //---

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;

  //---
  //---
  //---

  g_info.geometry = new THREE.BufferGeometry();

  const positions = [];
  const normals = [];
  const colors = [];

  const color = new THREE.Color();

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();

  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  let tri = g_info.data.tri;

  const d = 1, d2 = 0;
        //d2 = d/2;
  for (let idx=0; idx<tri.length; idx++) {

    let pal = g_info.palette[ g_info.palette_idx ];

    let color_hex = pal.colors[ _irnd(pal.colors.length) ];
    let rgb = _hex2rgb(color_hex );
    color.setRGB( rgb.r/255, rgb.g/255, rgb.b/255 );

    let alpha = 1;

    for ( let i = 0; i < tri[idx].length; i += 9 ) {

      const x = 0;
      const y = 0;
      const z = 0;

      let ax = x + tri[idx][i + 0]*d - d2;
      let ay = y + tri[idx][i + 1]*d - d2;
      let az = z + tri[idx][i + 2]*d - d2;

      let bx = x + tri[idx][i + 3]*d - d2;
      let by = y + tri[idx][i + 4]*d - d2;
      let bz = z + tri[idx][i + 5]*d - d2;

      let cx = x + tri[idx][i + 6]*d - d2;
      let cy = y + tri[idx][i + 7]*d - d2;
      let cz = z + tri[idx][i + 8]*d - d2;

      positions.push( ax, ay, az );
      positions.push( bx, by, bz );
      positions.push( cx, cy, cz );

      // flat face normals
      //
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

      colors.push( color.r, color.g, color.b, alpha );
      colors.push( color.r, color.g, color.b, alpha );
      colors.push( color.r, color.g, color.b, alpha );

    }

  }

  function disposeArray() { this.array = null; }

  g_info.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ).onUpload( disposeArray ) );

  g_info.geometry.computeBoundingSphere();

  //---

  g_info.renderer = new THREE.WebGLRenderer({ "antialias": true });
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;

  g_info.renderer.autoClear = false;



  //SHADOW
  //g_info.renderer.shadowMap.enabled = true;
  //g_info.renderer.shadowMap.type = THREE.VSMShadowMap;


  //---

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

  }

  g_info.mesh = new THREE.Mesh( g_info.geometry, g_info.material );

  //SHADOW
  //g_info.mesh.castShadow = true;
  //g_info.mesh.receiveShadow = true;

  g_info.scene.add( g_info.mesh );

  g_info.container.appendChild( g_info.renderer.domElement );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

  g_info.aspect = window.innerWidth / window.innerHeight;
  g_info.camera = new THREE.OrthographicCamera(-g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize/2,
                                               -g_info.frustumSize/2,
                                                -8000,
                                                8000);
  g_info.camera.updateProjectionMatrix();
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );

  g_info.camera.position.z = 0;
}

//---

function animate() {
  requestAnimationFrame( animate );
  render();

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

function render() {

  const time = Date.now() * g_info.speed_factor;
  let _t_rem_orig = time - Math.floor(time);

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

    g_info.view_counter ++;
    g_info.view_counter %= g_info.view_counter_n;
  }

  //----
  //----
  //----


  //----

  let theta_x = Math.sin(time*0.5)*0.125;
  let theta_y = time*0.5;

  //g_info.mesh.rotation.x = theta_x;
  //g_info.mesh.rotation.y = theta_y;


  for (let i=0; i<g_info.light.length; i++) {
    let _a = time*g_info.light_speed_factor + i*Math.PI/2;
    let _x = Math.cos(_a);
    let _y = Math.sin(_a);
    let _z = Math.cos(_a)*Math.sin(_a);

    g_info.light[0].position.set( _x, _y, _z ).normalize();
  }


  g_info.renderer.render( g_info.scene, g_info.camera );

  if (g_info.take_screenshot_flag) {
    let imgdata = g_info.renderer.domElement.toDataURL();
    screenshot_data(imgdata);
    g_info.take_screenshot_flag = false;
  }

}

//---

function __cube_x(vert, _x, _y, _z, ds, face) {
  vert = ((typeof vert === "undefined") ? [] : vert);
  face = ((typeof face === "undefined") ? [1,1,1,1,1,1] : face);

  // top
  //
  if (face[0]) {
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
  }

  // bottom
  //
  if (face[1]) {
    vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );
  }

  // edge (top)
  //
  if (face[2]) {
    vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

    vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
  }

  // edge (bottom)
  //
  if (face[3]) {
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
  }

  // edge (left)
  //
  if (face[4]) {
    vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
    vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

    vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
  }

  // edge (right)
  //
  if (Face[5]) {
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
    vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
    vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
  }

  return vert;
}

function __cube(_x, _y, _z, ds, face) {
  let verts = [];
  let vert = [ [], [], [], [] ];
  face = ((typeof face === "undefined") ? [1,1,1,1,1,1] : face);

  _x -= ds/2;
  _y -= ds/2;
  _z -= ds/2;

  // top
  //
  if (face[0]) {
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);

    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
  }

  // bottom
  //
  if (face[1]) {
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);

    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
  }

  // edge (top)
  //
  if (face[2]) {
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);

    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
  }

  // edge (bottom)
  //
  if (face[3]) {
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);

    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
  }

  // edge (left)
  //
  if (face[4]) {
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);

    vert[0].push(_x   ); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x   ); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
  }

  // edge (right)
  //
  if (face[5]) {
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z   ); vert[3].push(1);

    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z   ); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y+ds); vert[2].push(_z+ds); vert[3].push(1);
    vert[0].push(_x+ds); vert[1].push(_y   ); vert[2].push(_z+ds); vert[3].push(1);
  }

  return vert;
}

function homogenize(A) {
  let b = [];
  for (let i=0; i<A.length; i++) {
    b.push(A[i]);
    if ((i>0) && ((i%3)==0)) { b.push(0); }
  }
  b.push(1);
  return b;
}

function _xrotate(a) {
  let c = Math.cos(a);
  let s = Math.sin(a);
  return [
    [ 1,  0, 0, 0 ],
    [ 0,  c, s, 0 ],
    [ 0, -s, c, 0 ],
    [ 0,  0, 0, 1 ]
  ];
}

function _yrotate(a) {
  let c = Math.cos(a);
  let s = Math.sin(a);
  return [
    [ c,  0, s, 0 ],
    [ 0,  1, 0, 0 ],
    [-s,  0, c, 0 ],
    [ 0,  0, 0, 1 ]
  ];
}

function _zrotate(a) {
  let c = Math.cos(a);
  let s = Math.sin(a);
  return [
    [ c,  s, 0, 0 ],
    [-s,  c, 0, 0 ],
    [ 0,  0, 1, 0 ],
    [ 0,  0, 0, 1 ]
  ];
}

function _translate(x,y,z) {
  return [
    [ 1, 0, 0, x ],
    [ 0, 1, 0, y ],
    [ 0, 0, 1, z ],
    [ 0, 0, 0, 1 ]
  ];
}

function _project(w,h,d) {
  return [
    [ 2/w, 0, 0, 0 ],
    [ 0, -2/h, 0, 0 ],
    [ 0, 0, 2/d, 0 ],
    [ -1, 2, 0, 1 ]
  ];
}

function kettle_init(vert) {
  let ds = g_info.tube_width;
  let dn = (ds)*Math.sqrt(2)/2;

  let face_full  = [1,0,0,1,0,1];
  let face_tuber = [0,0,0,1,0,1]
  let face_tubel = [1,0,0,1,0,0]
  let face_tubeu = [1,0,0,0,0,1]

  let nop = [0,0];

  let up_right  = [ dn, ds/2,0];
  let up_left   = [-dn, ds/2,0];
  let up        = [  0, dn,0];

  let down        = [  0, -dn,0 ];
  let down_right  = [ dn, -ds/2,0];
  let down_left   = [-dn, -ds/2,0];

  let collision_test = [ true, true, true];

  let n = 1024;
  //let n = 2;

  //let collision_width = 2.125;
  //let collision_width = 2.5;
  //let collision_width_p = 2.5;

  let collision_width = g_info.collision_width[0];
  let collision_width_p = g_info.collision_width[0]

  let dir_choice = [
    [ 'u', 'd' ],
    [ 'l', 'L', 'r', 'R' ]
  ];

  let end_pnt = [];
  let all_end_pnt = [];
  let collision_pnt = [];
  let line_pnt = [];

  let tot_count = 0;
  let _reject_count = 0;

  let _coll_stat = [0,0,0];

  let pnt_id = 0;

  let n_squiggle = 4;
  let squiggle = [];
  let offset = [ -16*ds, -8*ds, 8*ds, 16*ds  ];
  for (let sidx=0; sidx<n_squiggle; sidx++) {
    let sx = offset[sidx];
    let sy = 0;

    let pos = [sx,sy];

    end_pnt.push([pos[0],pos[1]]);
    all_end_pnt.push( [pos[0],pos[1], -1, -1, -1, -1 ] );
    collision_pnt.push( [pos[0],pos[1]] );

    squiggle.push({ "sched": ['.'], "path": [ [offset[sidx], 0, -1, pnt_id] ], "dir_prv":1 });

    pnt_id++;
  }

  for (let pidx=0; pidx<n; pidx++) {

    let sidx = _irnd(squiggle.length);
    let _sched = squiggle[sidx].sched;
    let dir_prv = squiggle[sidx].dir_prv;
    let _pos_idx = squiggle[sidx].path.length-1;
    let prv_id = squiggle[sidx].path[_pos_idx][2];
    let pos = [ squiggle[sidx].path[_pos_idx][0], squiggle[sidx].path[_pos_idx][1] ];

    //let _sched = ['.'];


    let _width2 = 2048/2;
    let _height2 = 1424/2;

    let stride = g_info.stride;
    let min_jump = g_info.min_jump;
    let jump_range = g_info.jump_range;

    //let sx = 0;
    //let sy = 8*ds*sidx;

    //let offset = [ -8*ds, 8*ds ];
    //let offset = [ -16*ds, -8*ds, 8*ds, 16*ds  ];

    //console.log(pos[0], pos[1]);

    //let dir_prv = 1;
    //for (let _idx=0; _idx<n; _idx++) {

      let dir_cur = 1-dir_prv;

      let _step_count = min_jump + (stride*_irnd(jump_range));
      let _idir = _irnd( dir_choice[dir_cur].length );

      let _dir = dir_choice[dir_cur][_idir];

      let dpos = [0,0];

      if      (_dir == 'u') { dpos[1] += dn; }
      else if (_dir == 'd') { dpos[1] -= dn; }
      else if (_dir == 'L') { dpos[0] -= dn; dpos[1] += ds/2; }
      else if (_dir == 'l') { dpos[0] -= dn; dpos[1] -= ds/2; }
      else if (_dir == 'R') { dpos[0] += dn; dpos[1] += ds/2; }
      else if (_dir == 'r') { dpos[0] += dn; dpos[1] -= ds/2; }

      dpos[0] *= _step_count;
      dpos[1] *= _step_count;

      // edge check
      //
      if (collision_test[0]) {
        if ( (Math.abs(pos[0] + dpos[0]) > _width2) ||
             (Math.abs(pos[1] + dpos[1]) > _height2) ) {
          //console.log("bang!");
          _reject_count++;

          _coll_stat[0]++;

          continue;
        }
        //console.log("???????????", pos, dpos, _width2, _height2, (Math.abs(pos[0] + dpos[0]) , _width2), (Math.abs(pos[1] + dpos[1]) , _height2) );
      }

      // make sure endpoint doesn't land on a line
      //

      if (collision_test[1]) {
        let _ok = true;
        for (let j=0; j<collision_pnt.length; j++) {
          let _dx = collision_pnt[j][0] - (pos[0] + dpos[0]);
          let _dy = collision_pnt[j][1] - (pos[1] + dpos[1]);
          let _l = Math.sqrt( _dx*_dx + _dy*_dy );
          if (_l < (collision_width*ds)) {

            //console.log("dir:", _dir, "rejected for pos", pos, "+dpos", dpos, "because of", collision_pnt[j], "(", j, ")");

            _ok = false;
            break;
          }
        }
        //_ok = true;
        if (!_ok) {
          //console.log("bang bang");
          _reject_count++;

          _coll_stat[1]++;

          continue;
        }
      }

      // make sure line under consideration doesn't
      // cross any joints (endpoints)
      //

      //let _path_collision = true;
      //_path_collision=false;
      if (collision_test[2]) {
        let _subfac = 0.25;
        let _dlen = Math.sqrt( dpos[0]*dpos[0] + dpos[1]*dpos[1] );
        let _dv = [ _subfac*ds*dpos[0]/_dlen, _subfac*ds*dpos[1]/_dlen ];
        let _n = Math.ceil( _dlen/(_subfac*ds) + 0 );

        let _s = Math.ceil(collision_width_p/(_subfac) + 2);
        //console.log("_s:", _s);

        //for (i=_s; i<_n; i++) {
        for (i=_s; i<_n; i++) {
          let _p = [ pos[0] + i*_dv[0], pos[1] + i*_dv[1] ];
          _ok = true;
          //let _cmp_list = collision_pnt;
          let _cmp_list = all_end_pnt;
          for (let j=0; j<(_cmp_list.length); j++) {
            let _dx = _cmp_list[j][0] - _p[0];
            let _dy = _cmp_list[j][1] - _p[1];
            let _l = Math.sqrt( _dx*_dx + _dy*_dy );
            if (_l < (collision_width_p*ds)) {

              /*
              if (sidx==1) {
                console.log("sidx:", sidx, "pidx:", pidx,
                    "path collision, p:", _p[0], _p[1],
                    "collision_pnt:", j, collision_pnt[j][0], collision_pnt[j][1],
                    "ds:", ds);
              }
              */

              _coll_stat[2]++;

              _ok = false; break;
            }
          }
          if (!_ok) {
            //console.log("bang bang");
            break;
          }
        }
        if (!_ok) {
          _reject_count++;
          continue;
        }

      }


      //console.log("pos:", pos, "dpos:", dpos);


      _ok = true;
      for (let j=0; j<(end_pnt.length-1); j++) {
        let _dx = end_pnt[j][0] - (pos[0] + dpos[0]);
        let _dy = end_pnt[j][1] - (pos[1] + dpos[1]);

        //console.log("...", j, _dx, _dy, 2*ds);

        if (Math.abs(_dy) < (1.0*ds)) { _ok = false; break; }
        if (Math.abs(_dx) < (1.0*ds)) { _ok = false; break; }
        continue;
        if ((_dir == 'u') || (_dir == 'd')) {
        if (Math.abs(_dy) < (2*ds)) { _ok = false; break; }
        }
        else {
          if (Math.abs(_dx) < (2*ds)) { _ok = false; break; }
        }
      }
      _ok = true;
      if (!_ok) {
        _reject_count++;
        //console.log("bang bang bang");
        continue;
      }

      for (let j=0; j<_step_count; j++) {
        _sched.push( _dir );
      }

      let _subfac = 0.25;
      let _dlen = Math.sqrt( dpos[0]*dpos[0] + dpos[1]*dpos[1] );
      let _dv = [ _subfac*ds*dpos[0] / _dlen, _subfac*ds*dpos[1] / _dlen ];
      let _n = Math.ceil( _dlen/(_subfac*ds) );
      //console.log("dlen:", _dlen, "n:", _n);
      for (let i=0; i<_n; i++) {
        collision_pnt.push( [ pos[0] + i*_dv[0], pos[1] + i*_dv[1], pnt_id ] );

        //if ((i>1) && (i<(_n-1))) {
        //  line_pnt.push( [ pos[0] + i*_dv[0], pos[1] + i*_dv[1], pnt_id ] );
        //}
      }

      dir_prv = dir_cur;
      pos[0] += dpos[0];
      pos[1] += dpos[1];

      end_pnt.push( [pos[0], pos[1], pnt_id] );
      all_end_pnt.push( [pos[0], pos[1], prv_id, pnt_id, sidx, squiggle[sidx].path.length ] );

      let _ii = squiggle[sidx].path.length-1;
      squiggle[sidx].path[_ii][3] = pnt_id;

      squiggle[sidx].dir_prv = dir_cur;
      squiggle[sidx].path.push( [ pos[0], pos[1], pnt_id, -1 ] );

      pnt_id++;
    //}

    //console.log(">>>", _sched.join(""));
    //console.log("end_pnt.length:", end_pnt.length);

    tot_count++;

  }

  for (let sidx=0; sidx<squiggle.length; sidx++) {
    _kettle_init(vert, squiggle[sidx].sched.join(""), squiggle[sidx].path[0][0], squiggle[sidx].path[0][1]);
  }

  for (let sidx=0; sidx<squiggle.length; sidx++) {
    let _path = squiggle[sidx].path;
    for (let pidx=1; pidx<_path.length; pidx++) {

      let p_prv = _path[pidx-1];
      let p_cur = _path[pidx];

      let id_prv = p_prv[2];
      let id_cur = p_cur[2];

      let dx = p_cur[0] - p_prv[0];
      let dy = p_cur[1] - p_prv[1];

      let _subfac = 0.25;
      let _dlen = Math.sqrt(dx*dx + dy*dy);
      let _dv = [ _subfac*ds*dx/_dlen, _subfac*ds*dy/_dlen ];
      let _dvlen = Math.sqrt( _dv[0]*_dv[0] + _dv[1]*_dv[1] );
      let _n = Math.ceil( _dlen / (_subfac*ds) );

      for (let i=0; i<_n; i++) {
        let _t = i;
        line_pnt.push( [ p_prv[0] + _t*_dv[0], p_prv[1] + _t*_dv[1], id_prv, id_cur, sidx, pidx ] );
      }

    }
  }

  let bad_list = [];

  let bad_count=0;
  for (let i=0; i<all_end_pnt.length; i++) {
    let is_ok = true;
    for (let j=0; j<line_pnt.length; j++) {
      if (line_pnt[j][2] == all_end_pnt[i][3]) { continue; }
      if (line_pnt[j][3] == all_end_pnt[i][3]) { continue; }

      let dx = all_end_pnt[i][0] - line_pnt[j][0];
      let dy = all_end_pnt[i][1] - line_pnt[j][1];
      let dlen = Math.sqrt( dx*dx + dy*dy );
      if ( dlen < (2.5*ds) ) {
        is_ok=false;
        bad_count++;

        //bad_list.push( { "sidx": line_pnt[j][4], "pidx": line_pnt[j][5] } );
        bad_list.push( { "sidx": all_end_pnt[i][4], "pidx": all_end_pnt[i][5] } );
        
        break;
      }
    }
    if (!is_ok) { continue; }
  }
  console.log("bad_count:", bad_count, bad_list);

  console.log("_reject_count:", _reject_count, _coll_stat);
  console.log("tot_count:", tot_count);

  g_info["debug_endpoint"] = all_end_pnt;
  g_info["debug_line"] = line_pnt;
  g_info["bad_list"] = bad_list;
  g_info["squiggle"] = squiggle;
}

function debug_bad() {
  for (let i=0; i<g_info.bad_list.length; i++) {
    let sidx = g_info.bad_list[i].sidx;
    let pidx = g_info.bad_list[i].pidx;

    if ((sidx<0) || (pidx<0)) { continue; }

    let p = g_info.squiggle[sidx].path[pidx];

    debug_add(p[0], p[1], 5000, 50);
  }
}

function kettle_init_0(vert) {
  let ds = g_info.tube_width;
  let dn = (ds)*Math.sqrt(2)/2;

  let face_full  = [1,0,0,1,0,1];
  let face_tuber = [0,0,0,1,0,1]
  let face_tubel = [1,0,0,1,0,0]
  let face_tubeu = [1,0,0,0,0,1]

  let nop = [0,0];

  let up_right  = [ dn, ds/2,0];
  let up_left   = [-dn, ds/2,0];
  let up        = [  0, dn,0];

  let down        = [  0, -dn,0 ];
  let down_right  = [ dn, -ds/2,0];
  let down_left   = [-dn, -ds/2,0];

  let n = 1024;
  //let n = 2;

  //let collision_width = 2.125;
  let collision_width = 2;
  let collision_width_p = 2;

  let dir_choice = [
    [ 'u', 'd' ],
    [ 'l', 'L', 'r', 'R' ]
  ];

  let all_end_pnt = [];
  let collision_pnt = [];

  let _reject_count = 0;

  let _coll_stat = [0,0,0];

  let n_squiggle = 4;
  for (let sidx=0; sidx<n_squiggle; sidx++) {
    let _sched = ['.'];

    let _width2 = 1024/2;
    let _height2 = 1024/2;

    let stride = 1;
    let min_jump = 5;
    let jump_range = 20;

    //let sx = 0;
    //let sy = 8*ds*sidx;

    //let offset = [ -8*ds, 8*ds ];
    let offset = [ -16*ds, -8*ds, 8*ds, 16*ds  ];

    let sx = offset[sidx];
    let sy = 0;

    let pos = [sx,sy];

    let end_pnt = [ [pos[0],pos[1]] ];
    all_end_pnt.push( [pos[0],pos[1]] );
    collision_pnt.push( [pos[0],pos[1]] );

    //console.log(pos[0], pos[1]);

    let dir_prv = 1;
    for (let _idx=0; _idx<n; _idx++) {
      let dir_cur = 1-dir_prv;

      let _step_count = min_jump + (stride*_irnd(jump_range));
      let _idir = _irnd( dir_choice[dir_cur].length );

      let _dir = dir_choice[dir_cur][_idir];

      let dpos = [0,0];

      if      (_dir == 'u') { dpos[1] += dn; }
      else if (_dir == 'd') { dpos[1] -= dn; }
      else if (_dir == 'L') { dpos[0] -= dn; dpos[1] += ds/2; }
      else if (_dir == 'l') { dpos[0] -= dn; dpos[1] -= ds/2; }
      else if (_dir == 'R') { dpos[0] += dn; dpos[1] += ds/2; }
      else if (_dir == 'r') { dpos[0] += dn; dpos[1] -= ds/2; }

      dpos[0] *= _step_count;
      dpos[1] *= _step_count;

      // edge check
      //
      if ( (Math.abs(pos[0] + dpos[0]) > _width2) ||
           (Math.abs(pos[1] + dpos[1]) > _height2) ) {
        //console.log("bang!");
        _reject_count++;

        _coll_stat[0]++;

        continue;
      }

      let _ok = true;
      for (let j=0; j<collision_pnt.length; j++) {
        let _dx = collision_pnt[j][0] - (pos[0] + dpos[0]);
        let _dy = collision_pnt[j][1] - (pos[1] + dpos[1]);
        let _l = Math.sqrt( _dx*_dx + _dy*_dy );
        if (_l < (collision_width*ds)) { _ok = false; break; }
      }
      if (!_ok) {
        //console.log("bang bang");
        _reject_count++;

        _coll_stat[1]++;

        continue;
      }

      let _path_collision = true;
      if (_path_collision) {
        let _subfac = 0.25;
        let _dlen = Math.sqrt( dpos[0]*dpos[0] + dpos[1]*dpos[1] );
        let _dv = [ _subfac*ds*dpos[0]/_dlen, _subfac*ds*dpos[1]/_dlen ];
        let _n = Math.ceil( _dlen/(_subfac*ds) + 0 );

        let _s = Math.ceil(collision_width_p/(_subfac));

        //for (i=_s; i<_n; i++) {
        for (i=_s; i<_n; i++) {
          let _p = [ pos[0] + i*_dv[0], pos[1] + i*_dv[1] ];
          _ok = true;
          //let _cmp_list = collision_pnt;
          let _cmp_list = all_end_pnt;
          for (let j=0; j<(_cmp_list.length); j++) {
            let _dx = _cmp_list[j][0] - _p[0];
            let _dy = _cmp_list[j][1] - _p[1];
            let _l = Math.sqrt( _dx*_dx + _dy*_dy );
            if (_l < (collision_width_p*ds)) {

              //console.log("path collision, p:", _p, "collision_pnt:", j, collision_pnt[j], "ds:", ds);

              _coll_stat[2]++;

              _ok = false; break;
            }
          }
          if (!_ok) {
            //console.log("bang bang");
            break;
          }
        }
        if (!_ok) {
          _reject_count++;
          continue;
        }

      }


      //console.log("pos:", pos, "dpos:", dpos);


      _ok = true;
      for (let j=0; j<(end_pnt.length-1); j++) {
        let _dx = end_pnt[j][0] - (pos[0] + dpos[0]);
        let _dy = end_pnt[j][1] - (pos[1] + dpos[1]);

        //console.log("...", j, _dx, _dy, 2*ds);

        if (Math.abs(_dy) < (1.0*ds)) { _ok = false; break; }
        if (Math.abs(_dx) < (1.0*ds)) { _ok = false; break; }
        continue;
        if ((_dir == 'u') || (_dir == 'd')) {
        if (Math.abs(_dy) < (2*ds)) { _ok = false; break; }
        }
        else {
          if (Math.abs(_dx) < (2*ds)) { _ok = false; break; }
        }
      }
      _ok = true;
      if (!_ok) {
        _reject_count++;
        //console.log("bang bang bang");
        continue;
      }

      for (let j=0; j<_step_count; j++) {
        _sched.push( _dir );
      }

      let _subfac = 0.25;
      let _dlen = Math.sqrt( dpos[0]*dpos[0] + dpos[1]*dpos[1] );
      let _dv = [ _subfac*ds*dpos[0] / _dlen, _subfac*ds*dpos[1] / _dlen ];
      let _n = Math.ceil( _dlen/(_subfac*ds) );
      //console.log("dlen:", _dlen, "n:", _n);
      for (let i=0; i<_n; i++) {
        collision_pnt.push( [ pos[0] + i*_dv[0], pos[1] + i*_dv[1] ] );
      }

      dir_prv = dir_cur;
      pos[0] += dpos[0];
      pos[1] += dpos[1];

      end_pnt.push( [pos[0], pos[1] ] );
      all_end_pnt.push( [pos[0], pos[1] ] );
    }

    //console.log(">>>", _sched.join(""));
    //console.log("end_pnt.length:", end_pnt.length);

    _kettle_init(vert, _sched.join(""), sx, sy);
  }


  console.log("_reject_count:", _reject_count, _coll_stat);
}

function _kettle_init(vert, c_sched, sx, sy) {
  vert = ((typeof vert === "undefined") ? [] : vert);

  sx = ((typeof sx === "undefined") ? 0 : sx);
  sy = ((typeof sy === "undefined") ? 0 : sy);

  //console.log("ok:", sx, sy);

  let ds = g_info.tube_width;
  let dn = (ds)*Math.sqrt(2)/2;

  let face_full  = [1,0,0,1,0,1];
  let face_tuber = [0,0,0,1,0,1]
  let face_tubel = [1,0,0,1,0,0]
  let face_tubeu = [1,0,0,0,0,1]

  let nop = [0,0];

  let up_right  = [ dn, ds/2,0];
  let up_left   = [-dn, ds/2,0];
  let up        = [  0, dn,0];

  let down        = [  0, -dn,0 ];
  let down_right  = [ dn, -ds/2,0];
  let down_left   = [-dn, -ds/2,0];

  //let c_sched = ".uuuuRRRrrrdddllLLLLL";
  //let c_sched = ".uuuuRRRrrrddddLEEEEEEEllldddddddddRRRIRu";
  
  if (typeof c_sched === "undefined") {
  //        " +++      --         -
  //             ++++++  ---------
  c_sched = ".uuuuRRRrrrdddLEEEEEllld++i-ii";
  c_sched = ".uuuRRRddd";
  //let c_sched = "E";
  }

  let sched = [];

  for (let i=0; i<c_sched.length; i++) {
    let ch = c_sched.charAt(i);

    if      (ch == '.') { sched.push(nop); }
    else if (ch == "u") { sched.push(up); }
    else if (ch == "d") { sched.push(down); }

    else if (ch == "r") { sched.push(down_right); }
    else if (ch == "i") { sched.push(down_right); }

    else if (ch == "l") { sched.push(down_left); }
    else if (ch == "e") { sched.push(down_left); }

    else if (ch == "R") { sched.push(up_right); }
    else if (ch == 'I') { sched.push(up_right); }

    else if (ch == "L") { sched.push(up_left); }
    else if (ch == 'E') { sched.push(up_left); }

    else if (ch == '-') { sched.push(nop); }
    else if (ch == '+') { sched.push(nop); }

  }

  let count_x = [0];
  let count_y = [0,0];

  //console.log(">>> _kettle_init");
  //console.log(c_sched, sched);

  let V = [];

  let m0 = _yrotate(-Math.PI/4);
  let m1 = _xrotate(-Math.PI/4);

  let cur_x = sx,
      cur_y = sy,
      cur_z = 0;
  for (let i=0; i<sched.length; i++) {

    let ch = c_sched.charAt(i);

    if      (ch == '.') { }
    else if (ch == '-') { }
    else if (ch == "u") { count_y[1]++; }
    else if (ch == "d") { count_y[1]--; }

    else if (ch == "r") { count_x[0]++; count_y[0]--; }
    else if (ch == 'i') { count_x[0]++; count_y[0]--; }

    else if (ch == "l") { count_x[0]--; count_y[0]--; }
    else if (ch == "e") { count_x[0]--; count_y[0]--; }

    else if (ch == "R") { count_x[0]++; count_y[0]++; }
    else if (ch == 'I') { count_x[0]++; count_y[0]++; }

    else if (ch == "L") { count_x[0]--; count_y[0]++; }
    else if (ch == 'E') { count_x[0]--; count_y[0]++; }

    let dv = sched[i];

    cur_x += dv[0];
    cur_y += dv[1];

    //cur_x = count_x[0]*dn;
    //cur_y = count_y[0]*ds/2 + count_y[1]*dn;

    //console.log(count_x, count_y, cur_x, cur_y);

    let _face = face_full;
    if (ch == 'E') {
      cur_z = 800;
      _face = face_tubel;
    }

    else if (ch == 'e') {
      _face = face_tubel;
    }

    else if (ch == 'i') {
      cur_z -= 1200;
      _face = face_tubel;
    }

    else if (ch == 'I') {
      cur_z = 00;
      _face = face_tuber;
    }

    else if (ch == '-') {
      cur_z -= 800;
      continue;
    }

    else if (ch == '+') {
      cur_z += 800;
      continue;
    }

    if ((ch == 'R') || (ch=='d') || (ch=='L')) {
      cur_z -= ds;
    }
    else {
      cur_z += ds;
    }

    let _c = __cube(0,0,0,ds, _face);
    let M = numeric.dot(_translate(cur_x,cur_y,cur_z), numeric.dot(m1, m0));
    V.push(numeric.dot(M, _c));

  }

  let _z = [];
  for (let i=0; i<V.length; i++) {

    let _m = V[i][0].length;
    for (let j=0; j<_m; j++) {
      _z.push( V[i][0][j] );
      _z.push( V[i][1][j] );
      _z.push( V[i][2][j] );
    }

  }

  g_info.data.tri.push(_z);
  //g_info.data.tri = [_z];
}


function kettle_init_bak(vert) {
  vert = ((typeof vert === "undefined") ? [] : vert);

  //console.log(">>> kettle_init");

  let _vert = [];

  _vert.push( __cube( 0, 0, 0, 200) );
  _vert.push( __cube( 0, 0, 0, 200) );
  _vert.push( __cube( 0, 0, 0, 200) );

  /*
  //let mp0 = m4.xRotation(Math.PI/4);
  let mp0 = m4.xRotation(Math.PI/4);
  let mp1 = m4.yRotation(-Math.PI/4);
  let mr = m4.multiply(mp1, mp0);

  let m = new THREE.Matrix4();
  m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
         mr[ 4], mr[ 5], mr[ 6], mr[ 7],
         mr[ 8], mr[ 9], mr[10], mr[11],
         mr[12], mr[13], mr[14], mr[15] );

  let M = [
    [ mr[ 0], mr[ 1], mr[ 2], mr[ 3] ],
    [ mr[ 4], mr[ 5], mr[ 6], mr[ 7] ],
    [ mr[ 8], mr[ 9], mr[10], mr[11] ],
    [ mr[12], mr[13], mr[14], mr[15] ]
  ];

  console.log("mr:", mr);


  */

  let ds = 200;
  let dn = (ds/2)*Math.sqrt(2)/2;

  let m0 = _yrotate(-Math.PI/4);
  let m1 = _xrotate(-Math.PI/4);


  let M0 = numeric.dot(_translate(0,0,0), numeric.dot(m1, m0));
  //let M0 = numeric.dot(numeric.dot(m1, m0), _translate(800, 1000, 0));

  //let M1 = numeric.dot(_translate(Math.sqrt(2)*100,100,-400), numeric.dot(m1,m0));
  //let M2 = numeric.dot(_translate(0,200,-800), numeric.dot(m1,m0));


  let M1 = numeric.dot(_translate(0,2*dn,200), numeric.dot(m1,m0));
  let M2 = numeric.dot(_translate(0,4*dn,400), numeric.dot(m1,m0));

  let V = [];

  V.push(numeric.dot(M0, _vert[0]));
  V.push(numeric.dot(M1, _vert[1]));
  V.push(numeric.dot(M2, _vert[2]));

  let _z = [];

  for (let i=0; i<V.length; i++) {

    let _m = V[i][0].length;
    for (let j=0; j<_m; j++) {
      _z.push( V[i][0][j] );
      _z.push( V[i][1][j] );
      _z.push( V[i][2][j] );
    }

  }

  g_info.data.tri = [_z];

}

function init_param() {

  // palette choice
  //
  g_info.palette_idx = _irnd( g_info.palette.length );
  let pidx = g_info.palette_idx;

  g_info.features["Palette"] = g_info.palette[pidx].name;

  // distribution type
  //

  let dist_name = [ "Exponential (#0)", "Exponential (#1)", "Exponential (#2)", "Power Law (#0)", "Power Law (#1)" ];
  let dist_id = [0, 9, 10, 1, 2] ;
  let idx = _irnd( dist_id.length );
  g_info.distribution_type = dist_id[idx];

  g_info.features["Distribution"] = dist_name[idx];

  // speed factor
  //
  g_info.speed_factor  = _rnd(1/2048, 1/512); //0.00075,

  g_info.features["Speed Factor"] = g_info.speed_factor;

  // width
  //
  idx = _irnd( g_info.tube_width_choice.length );
  g_info.tube_width = g_info.tube_width_choice[idx];

  g_info.features["Channel Width"] = g_info.tube_width;

  // collision width
  //
  idx = _irnd( g_info.collision_width_choice.length );
  g_info.collision_width[0] = g_info.collision_width_choice[idx];

  g_info.features["Collision Width"] = g_info.collision_width[0];

  // jump range
  //
  g_info.jump_range = _irnd(10) + 10;

  g_info.features["Jump Range"] = g_info.jump_range;

  //----
  //----
  //----

  window.$fxhashFeatures = g_info.features;

}

function init() {

	init_param();

  welcome();

  kettle_init();

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
  });

  threejs_init();
  animate();
}


