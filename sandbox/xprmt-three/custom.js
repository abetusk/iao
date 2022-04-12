
var g_info = {

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "container": {},
  "camera": {},
  "scene": {},
  "renderer": {},
  "mesh": {},
  "radius" : 500,
  "frustumSize" : 1500,
  "aspect": 1,
  "light": [],

  "geometry": {},
  "material": {},

  "cx": 15,
  "cy": 15,
  "cz": 0,

  //"rotx": Math.PI/5,
  //"roty": Math.PI/4,
  "rotx": 0,
  "roty": 0,
  "rotz": 0,

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
      "colors": ["#c47c2b", "#5f5726", "#000000", "#7e8a84"],
      "stroke": "#7e8a84",
      "background": "#ecddc5"
    },
    {  
      "name": "dt03",
      //"colors": ["#000000", "#a7a7a7"],
      "colors": ["#222", "#a7a7a7"],
      "stroke": "#000000",
      "background": "#0a5e78"
    },

    { 
      "name" : "monochrome",
      "colors" : [ "#111", "#eee" ],
      "background": "#777"
    }

  ],

  "palette_idx": 1,

  "data": {
    "vadfad": {},
    "tri": {}
  },

  "debug_line": false,

  "material_type" : "toon"
  //"material_type" : "phong"
};


if (typeof fxrand === "undefined") {
  var fxrand = Math.random;
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

function _rndpow(s) {
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







//----

function vadfad_gen(base_idx) {
  base_idx = ((typeof base_idx === "undefined") ? 1 : base_idx);
  let grid = [];

  let H = [ { "v":6, "p":0.1 }, { "v":7, "p":0.1 }, {"v":8, "p":0.8} ];
  let W = [ { "v":7, "p":0.05 }, { "v":8, "p":0.3 }, {"v":9, "p":0.3}, {"v":10, "p":0.3}, {"v":11, "p":.05}, {"v":15, "p":1/64.0}];

  // eye_choice:
  //
  // 0 - horizontal (2 pixel wide, 1 high) 
  // 1 - vertical (1 pixel wide , 2 hight)
  // 2 - single (1x1 pixel each)
  //
  let eye_choice = Math.floor(_mrnd()*3);

  let fill_corner = ((_mrnd() < 0.5) ? true : false);

  let h = H[ Math.floor(_mrnd()*H.length) ].v;
  let w = W[ Math.floor(_mrnd()*W.length) ].v;

  for (let iy=0; iy<h; iy++) {
    grid.push([]);
    for (let ix=0; ix<w; ix++)  {
      grid[iy].push(0);
    }
  }

  let le, re;
  if ((w%2)==0) {
    le = Math.floor((w-1)/2)-1;
    re = Math.floor((w+1)/2)+1;
  }
  else {
    le = Math.floor((w)/2)-1;
    re = Math.floor((w)/2)+1;
  }

  let dh_eye = Math.floor(_mrnd()*2) + 2;
  let dw_eye = 1;

  let eye_h, eye_w;

  grid[dh_eye][le] = -base_idx;
  grid[dh_eye][re] = -base_idx;

  let idx = base_idx;

  if (eye_choice == 0) {
    eye_w = 2;
    eye_h = 1;
    grid[dh_eye][le-1] = -base_idx-1;
    grid[dh_eye][re+1] = -base_idx-1;

    grid[dh_eye][le-2] = idx;
    grid[dh_eye][re+2] = idx;
    idx++;

    grid[dh_eye][re-1] = idx;
    grid[dh_eye][le+1] = idx;
    idx++;

    for (let i=0; i<4; i++) {

      grid[dh_eye+1][le-2+i] = idx;
      grid[dh_eye+1][re+2-i] = idx;
      idx++;

      grid[dh_eye-1][le-2+i] = idx;
      grid[dh_eye-1][re+2-i] = idx;
      idx++;
    }

  }
  else if (eye_choice ==1 ) {
    eye_w = 1;
    eye_h = 2;
    grid[dh_eye+1][le] = -base_idx-1;
    grid[dh_eye+1][re] = -base_idx-1;

    grid[dh_eye-1][le] = idx;
    grid[dh_eye-1][re] = idx;
    idx++;

    grid[dh_eye+2][le] = idx;
    grid[dh_eye+2][re] = idx;
    idx++;

    for (let i=0; i<4; i++) {
      grid[dh_eye-1+i][le-1] = idx;
      grid[dh_eye-1+i][re+1] = idx;
      idx++;

      grid[dh_eye-1+i][le+1] = idx;
      grid[dh_eye-1+i][re-1] = idx;
      idx++;
    }

  }
  else if (eye_choice == 2) {
    eye_w = 1;
    eye_h = 1;

    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        if ((i==1) && (j==1)) { continue; }
        grid[dh_eye-1+i][le-1+j] = idx;
        grid[dh_eye-1+i][re+1-j] = idx;
        idx++;
      }
    }

  }

  let mid_offset = 1-(w%2);

  for (let i=0; i<(h); i++) {
    for (let j=0; j<(w/2); j++) {
      if (grid[i][j] != 0) { continue; }
      if (_mrnd() < 0.5) {
        grid[i][j] = idx;
        grid[i][w-1-j] = idx;
        idx++;
      }
    }
  }

  // effective height and width
  //
  let mw=w,Mw=0;
  let mh=h,Mh=0;
  for (let i=0; i<h; i++) {
    for (let j=0; j<w; j++) {
      if ((j  < mw) && (grid[i][j] > 0)) { mw = j; }
      if ((Mw <  j) && (grid[i][j] > 0)) { Mw = j; }

      if ((i  < mh) && (grid[i][j] > 0)) { mh = i; }
      if ((Mh <  i) && (grid[i][j] > 0)) { Mh = i; }
    }
  }

  let dw = Mw - mw + 1;
  let dh = Mh - mh + 1;

  return grid;
}

function vadfad_triangle1(vert, data) {
  vert = ((typeof vert === "undefined") ? [] : vert);

  for (let r=0; r<data.length; r++) {
    for (let c=0; c<data[r].length; c++) {

      let _x = data[r][c].x;
      let _y = data[r][c].y;
      let _z = data[r][c].z;
      let ds = data[r][c].s;

      // top
      //

      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);

      // bottom
      //

      vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

      // edge (top)
      //

      vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);

      vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);

      // edge (bottom)
      //

      vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

      // edge (left)
      //

      vert.push(_x   ); vert.push(_y   ); vert.push(_z   );
      vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );

      vert.push(_x   ); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x   ); vert.push(_y+ds); vert.push(_z   );


      // edge (right)
      //

      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z   );

      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z   );
      vert.push(_x+ds); vert.push(_y+ds); vert.push(_z+ds);
      vert.push(_x+ds); vert.push(_y   ); vert.push(_z+ds);

    }
  }

  return vert;
  //return new Float32Array(vert);
}


function vadfad_triangle(vert, data, cx, cy, cz, ds) {
  cx = ((typeof cx === "undefined") ? 0 : cx);
  cy = ((typeof cy === "undefined") ? 0 : cy);
  cz = ((typeof cz === "undefined") ? 0 : cz);
  ds = ((typeof ds === "undefined") ? g_info.ds : ds);

  vert = ((typeof vert === "undefined") ? [] : vert);

  //let ds = g_info.ds;
  //let data = g_info.vadfad_data;
  //console.log(data);

  //let vert = [];

  for (let r=0; r<data.length; r++) {
    for (let c=0; c<data[r].length; c++) {
      let _x = c*ds + cx;
      let _y = r*ds + cy;
      let _z = r*ds + cy;

      if (data[r][c]>0) {

        // top
        //

        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y   ); vert.push(cz+ds);

        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz+ds);

        // bottom
        //

        vert.push(_x   ); vert.push(_y   ); vert.push(cz   );
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz   );

        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz   );

        // edge (top)
        //

        vert.push(_x   ); vert.push(_y   ); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y   ); vert.push(cz+ds);

        vert.push(_x   ); vert.push(_y   ); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);

        // edge (bottom)
        //

        vert.push(_x   ); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );

        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );

        // edge (left)
        //

        vert.push(_x   ); vert.push(_y   ); vert.push(cz   );
        vert.push(_x   ); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );

        vert.push(_x   ); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x   ); vert.push(_y+ds); vert.push(cz   );


        // edge (right)
        //

        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz   );

        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz   );
        vert.push(_x+ds); vert.push(_y+ds); vert.push(cz+ds);
        vert.push(_x+ds); vert.push(_y   ); vert.push(cz+ds);

      }

    }
  }

  return vert;
  //return new Float32Array(vert);
}


var m4 = {

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
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

function vadfad_place(vf, plane, x, y, z, s) {

  s = ((typeof s === "undefined") ? 1 : s);

  let pos = [];

  for (let r=0; r<vf.length; r++) {
    pos.push([]);
    for (let c=0; c<vf[r].length; c++) {

      if (vf[r][c] > 0) {

        if (plane == "xy") {
          pos[r].push( { "x": x+ s*c, "y": y + s*r, "z": z, "s": s } );
        }
        else if (plane == "xz") {
          pos[r].push( { "x": x+ s*c, "z": y + s*r, "y": z, "s": s } );
        }
        else if (plane == "yz") {
          pos[r].push( { "y": x+ s*c, "z": y + s*r, "x": z, "s": s } );
        }
        if (plane == "yx") {
          pos[r].push( { "x": y+ s*c, "y": x + s*r, "z": z, "s": s } );
        }
        else if (plane == "zx") {
          pos[r].push( { "x": y+ s*c, "z": x + s*r, "y": z, "s": s } );
        }
        else if (plane == "zy") {
          pos[r].push( { "y": y+ s*c, "z": x + s*r, "x": z, "s": s } );
        }
      }

    }
  }

  return pos;
}

function quad_intersect(q0, q1) {
  if (q1.x >= (q0.x + q0.width))   { return false; }
  if (q1.y >= (q0.y + q0.height))  { return false; }
  if (q0.x >= (q1.x + q1.width))   { return false; }
  if (q0.y >= (q1.y + q1.height))  { return false; }

  //console.log("????", q0, q1);

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

function vadfad_init() {

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;

  let qtree = new Quadtree( {"x":-80, "y": -80, "width": 160, "height": 160} );

  let placed_list = [];

  let dxy = 64;
  let vf = [];
  let tri_vf = [];
  for (let i=0; i<2048; i++) {

    console.log(">>", i);

    let vf_data = vadfad_gen();

    //let _scale = _rndpow(1.25) + 0.0125;
    //let _scale = _rndpow(0.25) + 0.5;
    let _scale = _expow(2.25) + 1/32;
    //let _scale = 0.5;
    let _dx = cx + _irnd(-dxy,dxy);
    let _dy = cy + _irnd(-dxy,dxy);
    let _dz = cz + _irnd(-dxy,dxy);

    //let plane = [ "xy", "xz", "yz", "yx", "zx", "zy" ][_irnd(6)];
    //let planes = [ "xy", "xz", "yz", "yx", "zx", "zy" ];
    let planes = [ "xy", "xz", "yz" ];
    let plane = planes[ _irnd(planes.length) ];
    let vf_candidate = vadfad_place(vf_data, plane, _dx, _dy, _dz, _scale);


    //let vf_candidate = vadfad_place(vf_data, "xy", _dx, _dy, _dz, _scale);

    //console.log("got:", vf_candidate);

    let _accept = true;

    /*
    for (let _r=0; _r<vf_candidate.length; _r++) {
      for (let _c=0; _c<vf_candidate[_r].length; _c++) {
        //let xy2d = iso_project("xy",  vf_candidate[_r][_c].x, vf_candidate[_r][_c].y, vf_candidate[_r][_c].z , vf_candidate[_r][_c].s );
        let xy2d = iso_project(plane,  vf_candidate[_r][_c].x, vf_candidate[_r][_c].y, vf_candidate[_r][_c].z , vf_candidate[_r][_c].s );
        let _w = _scale * vf_data[0].length;
        let _h = _scale * vf_data.length;

        _w = (Math.sqrt(3)/4 - 1/128)*_scale;
        _h = (3/4 - 1/128)*_scale;

        //console.log(">>>", xy2d, _w, _h);

        let _q = {"x": xy2d.x, "y": xy2d.y, "width": _w, "height": _h };

        let _res = qtree.retrieve(_q);
        for (let ii=0; ii<_res.length; ii++) {

          if (quad_intersect( _q, _res[ii])) {
            //console.log("!!!!", ii, _res[ii], _q, "...", _r, _c, vf_candidate[_r][_c]);
          }


          //console.log("??", _res[ii], _q);
        }
      }
    }
    */

    //if (slo_intersect(placed_list, vf_candidate)) { _accept = false; }
    //console.log(">>>", slo_intersect( placed_list, vf_candidate));

    //if (fst_intersect(placed_list, vf_candidate)) { _accept = false; }
    //console.log(">>>", fst_intersect( placed_list, vf_candidate));

    if (_accept) {

      //console.log("accept");

      vf.push( vf_data );

      let tri = [];
      //vadfad_triangle(tri, vf_data, _dx, _dy, _dz, _scale);

      vadfad_triangle1(tri, vf_candidate);
      for (let _r=0; _r<vf_candidate.length; _r++) {
        for (let _c=0; _c<vf_candidate[_r].length; _c++) {
          //let xy2d = iso_project("xy",  vf_candidate[_r][_c].x, vf_candidate[_r][_c].y, vf_candidate[_r][_c].z , vf_candidate[_r][_c].s );
          let xy2d = iso_project(plane,  vf_candidate[_r][_c].x, vf_candidate[_r][_c].y, vf_candidate[_r][_c].z , vf_candidate[_r][_c].s );
          let _w = _scale * vf_data[0].length;
          let _h = _scale * vf_data.length;

          _w = (Math.sqrt(3)/4 - 1/128)*_scale;
          _h = (3/4 - 1/128)*_scale;

          let _q = {"x": xy2d.x, "y": xy2d.y, "width": _w, "height": _h };
          let _res = qtree.insert(_q);
        }
      }

      tri_vf.push(tri);

      placed_list.push( vf_candidate );
    }
    else {
      //console.log("REJECTING");
    }

  }

  //g_info.data

  g_info.data.vadfad = vf;
  g_info.data.tri = tri_vf;

  console.log(">>>", vf.length);

}

function init() {
  vadfad_init();
  threejs_init();
  animate();
}

function threejs_init() {

  g_info.container = document.getElementById( 'container' );

  //

  //camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );

  g_info.aspect = window.innerWidth / window.innerHeight;
  g_info.camera = new THREE.OrthographicCamera(-g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize * g_info.aspect/2,
                                                g_info.frustumSize/2,
                                               -g_info.frustumSize/2,
                                                -1000,
                                                8000);

  //camera.position.z = 2750;
  g_info.camera.position.z = 1000;

  g_info.scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0x050505 );
  g_info.scene.background = new THREE.Color( 0x0a0a0a );
  g_info.scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

  //

  //g_info.scene.add( new THREE.AmbientLight( 0x444444 ) );

  //g_info.light.push(new THREE.DirectionalLight( 0xffffff, 0.5 ));
  g_info.light.push(new THREE.DirectionalLight( 0xffffff, 1.5 ));
  //const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  //light1.position.set( 1, 1, 1 );
  g_info.light[0].position.set( 1, 1, 1 ).normalize();
  g_info.scene.add( g_info.light[0] );


  /*
  //g_info.light.push( new THREE.DirectionalLight( 0xffffff, 1.5 ) );
  g_info.light.push( new THREE.DirectionalLight( 0xffffff, 1.0 ) );
  //light2.position.set( 0, - 1, 0 );
  g_info.light[1].position.set( 0, - 1, 0 ).normalize();
  g_info.scene.add( g_info.light[1] );
*/

  //

  let cx = g_info.cx;
  let cy = g_info.cy;
  let cz = g_info.cz;

  //------
  //------
  //------
  //
  g_info.line_geom = new THREE.BufferGeometry();

  let line_range = 1000;

  let line_material = new THREE.LineBasicMaterial( { "vertexColors": true } );
  let line_pos = [];
  let line_color = [];

  let _lr = 250;

  let _c = 0.75;

  line_pos.push(cx,cy,cz);
  line_pos.push(cx+_lr,cy+_lr,cz+_lr);

  line_pos.push(cx-_lr,cy+_lr,cz+_lr);
  line_pos.push(cx-_lr,cy-_lr,cz+_lr);
  line_pos.push(cx+_lr,cy-_lr,cz+_lr);
  line_pos.push(cx+_lr,cy+_lr,cz+_lr);

  line_pos.push(cx+_lr,cy+_lr,cz-_lr);
  line_pos.push(cx-_lr,cy+_lr,cz-_lr);
  line_pos.push(cx-_lr,cy-_lr,cz-_lr);
  line_pos.push(cx+_lr,cy-_lr,cz-_lr);
  line_pos.push(cx+_lr,cy+_lr,cz-_lr);

  for (let i=0; i<11; i++) {
    line_color.push(_c);
    line_color.push(_c);
    line_color.push(_c);
  }


  /*
  for (let i=0; i<20; i++) {

    let _x = _rnd(-line_range/2, line_range/2);
    let _y = _rnd(-line_range/2, line_range/2);
    let _z = _rnd(-line_range/2, line_range/2);

    line_pos.push(_x,_y,_z);

    line_color.push( (_x/line_range) + 0.5 );
    line_color.push( (_y/line_range) + 0.5 );
    line_color.push( (_z/line_range) + 0.5 );
  }
  */

  g_info.line_geom.setAttribute( 'position', new THREE.Float32BufferAttribute( line_pos, 3 ) );
  g_info.line_geom.setAttribute( 'color', new THREE.Float32BufferAttribute( line_color, 3 ) );
  //generateMorphTargets( g_info.line_geom );

  g_info.line_geom.computeBoundingSphere();
  g_info.tjs_line = new THREE.Line( g_info.line_geom, line_material );

  if (g_info.debug_line) {
    g_info.scene.add( g_info.tjs_line );
  }

  //
  //------
  //------
  //------

  //const n_triangles = 160000;
  const n_triangles = 640000;


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

  //let ok_tri = 0;

  /*
  //let dxy = 50;
  let dxy = 20;
  let vf = [];
  let tri_vf = [];
  for (let i=0; i<16; i++) {
    vf.push( vadfad_gen() );

    //let ss = _rndpow(1.25) + 0.0125;
    let _scale = 2;
    let _dx = cx + _irnd(-dxy,dxy);
    let _dy = cy + _irnd(-dxy,dxy);
    let _dz = cz + _irnd(-dxy,dxy);

    let tri = [];
    vadfad_triangle(tri, vf[i], _dx, _dy, _dz, _scale);

    tri_vf.push(tri);
  }
  */

  let tri_vf = g_info.data.tri;


  for (let idx=0; idx<tri_vf.length; idx++) {

    let pal = g_info.palette[ g_info.palette_idx ];

    let color_hex = pal.colors[ _irnd(pal.colors.length) ];
    let rgb = _hex2rgb(color_hex );
    color.setRGB( rgb.r/255, rgb.g/255, rgb.b/255 );

    let alpha = 1;

    for ( let i = 0; i < tri_vf[idx].length; i += 9 ) {

      // positions

      const x = -200;
      const y = -200;
      const z = -200;

      let ax = x + tri_vf[idx][i + 0]*d - d2;
      let ay = x + tri_vf[idx][i + 1]*d - d2;
      let az = x + tri_vf[idx][i + 2]*d - d2;

      let bx = x + tri_vf[idx][i + 3]*d - d2;
      let by = x + tri_vf[idx][i + 4]*d - d2;
      let bz = x + tri_vf[idx][i + 5]*d - d2;

      let cx = x + tri_vf[idx][i + 6]*d - d2;
      let cy = x + tri_vf[idx][i + 7]*d - d2;
      let cz = x + tri_vf[idx][i + 8]*d - d2;

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
  //g_info.renderer = new THREE.WebGLRenderer();
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;


  //---

  //var material;


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
    //let diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
    //let diffuseColor = new THREE.Color().setHSL( alpha, beta, gamma ).multiplyScalar( 1 - 0.2 );
    let diffuseColor = new THREE.Color().setHSL( alpha, beta, gamma );


    let format = ( g_info.renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

    /*
    //let alphaIndex = 8;
    let alphaIndex = 256;
    let colors = new Uint8Array( alphaIndex + 2 );
    for ( let c = 0; c <= colors.length; c ++ ) {
      colors[ c ] = ( c / colors.length ) * 256;
    }
    */
    //let alphaIndex = 128;
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



function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(fxrand()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}


var time_prv = -1;
var view_prv = 0;
var view_nxt = 0;

var ang0 = 0;
var ang1 = 0;

var view_counter = 0;

function render() {

  let _fac = 0.001;

  let _swap_upate = false;
  //const time = Date.now() * 0.001;
  const time = Date.now() * _fac;

  let _t_rem = time - Math.floor(time);
  if (time_prv < 0) { time_prv = time; }
  if ( Math.floor(time_prv) != Math.floor(time)) {
    time_prv = time;
    _swap_update = true;

    if (view_counter == 0) {
      view_prv = view_nxt;
      view_nxt = _irnd(3);

      if (view_nxt == view_prv) {
        view_nxt = (view_prv+1)%6;
      }


      //view_nxt = view_prv;
    }

    view_counter ++;
    view_counter %= 30;

    //view_parity = 1-view_parity;
  }

  //----
  //----
  //----

  //let tx = p_prv[0]*(1-_t_rem) + p_nxt[0]*_t_rem;
  //let ty = p_prv[1]*(1-_t_rem) + p_nxt[1]*_t_rem;
  //let tz = p_prv[2]*(1-_t_rem) + p_nxt[2]*_t_rem;

  //g_info.rotx = tx;
  //g_info.roty = ty;
  //g_info.rotz = tz;

  //g_info.rotx = 7*Math.PI/23;
  //g_info.roty = 0;
  //g_info.rotz = Math.PI/4;


  let theta_x = Math.sin(time*0.5)*0.125;
  let theta_y = time*0.5;

  theta_x = 0;
  theta_y = 0;

  //g_info.mesh.rotation.x = time * 0.25;
  //g_info.mesh.rotation.y = time * 0.5;

  let _euler = false;
  if (_euler) {
    g_info.mesh.rotation.x = g_info.rotx + theta_x;
    g_info.mesh.rotation.y = g_info.roty + theta_y;
    g_info.mesh.rotation.z = g_info.rotz;
  }
  else {


    let mp0 = m4.xRotation(0);
    let mp1 = m4.yRotation(0);

    let mn0 = m4.xRotation(0);
    let mn1 = m4.yRotation(0);


    if (view_counter != 0) {
      _t_rem = 0;
    }
    else {
    }

      if (view_prv == 0) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/4);
        mp1 = m4.yRotation((1-_t_rem)*Math.PI/4);
      }

      else if (view_prv == 1) {
        mp0 = m4.yRotation((1-_t_rem)*Math.PI/4);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/4);
      }
      else if (view_prv == 2) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/4);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/4);
      }

      else if (view_prv == 3) {
        mp0 = m4.yRotation(-(1-_t_rem)*Math.PI/4);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/4);
      }
      else if (view_prv == 4) {
        mp0 = m4.xRotation(-(1-_t_rem)*Math.PI/4);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/4);
      }

      
      if (view_nxt == 0 ) {
        mn0 = m4.xRotation(_t_rem*Math.PI/4);
        mn1 = m4.yRotation(_t_rem*Math.PI/4);
      }
      else if (view_nxt == 1) {
        mn0 = m4.yRotation((_t_rem)*Math.PI/4);
        mn1 = m4.zRotation((_t_rem)*Math.PI/4);
      }
      else if (view_nxt == 2) {
        mn0 = m4.xRotation((_t_rem)*Math.PI/4);
        mn1 = m4.zRotation((_t_rem)*Math.PI/4);
      }

      else if (view_nxt == 3) {
        mn0 = m4.yRotation(-(_t_rem)*Math.PI/4);
        mn1 = m4.zRotation((_t_rem)*Math.PI/4);
      }
      else if (view_nxt == 4) {
        mn0 = m4.xRotation(-(_t_rem)*Math.PI/4);
        mn1 = m4.zRotation((_t_rem)*Math.PI/4);
      }

    //}

    let mrp = m4.multiply(mp1, mp0);
    let mrn = m4.multiply(mn1, mn0);

    let mr = m4.multiply(mrp, mrn);

    /*
    let mr = [];
    for (let ii=0; ii<16; ii++) {
      mr.push( (mrp[ii] + mrn[ii]) / 2 );
      mr[ii] = mrn[ii];
    }
    */

    let m = new THREE.Matrix4();
    m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
           mr[ 4], mr[ 5], mr[ 6], mr[ 7],
           mr[ 8], mr[ 9], mr[10], mr[11],
           mr[12], mr[13], mr[14], mr[15] );


    g_info.mesh.rotation.x = 0;
    g_info.mesh.rotation.y = 0;
    g_info.mesh.rotation.z = 0;
    g_info.mesh.applyMatrix4(m);
  }

  g_info.tjs_line.rotation.x = g_info.rotx + theta_x;
  g_info.tjs_line.rotation.y = g_info.roty + theta_y;
  g_info.tjs_line.rotation.z = g_info.rotz;

  theta_x = Math.sin(time*0.5)*0.125;
  theta_y = time*0.5;

  /*
  for (let i=0; i<g_info.light.length; i++) {
    g_info.light[i].rotation.x = g_info.rotx + theta_x;
    g_info.light[i].rotation.y = g_info.roty + theta_y;
    g_info.light[i].rotation.z = g_info.rotz;

  }
  */

  for (let i=0; i<g_info.light.length; i++) {
    let _a = time/4 + i*Math.PI/2;
    let _x = Math.cos(_a);
    let _y = Math.sin(_a);
    let _z = Math.cos(_a)*Math.sin(_a);

    g_info.light[0].position.set( _x, _y, _z ).normalize();
  }


  g_info.renderer.render( g_info.scene, g_info.camera );

}
