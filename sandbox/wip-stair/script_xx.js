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

//
// Care has been taken to make sure all third party libraries,
// whether parts used in this source file or used in external source
// files, are under a libre/free/open source license that allows
// for their use, alteration and redistribution, even for
// commercial purposes.
//

var g_info = {
  "PROJECT" : "xxx",
  "VERSION" : "0.0.0",

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "download_filename":"xxx.png",

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

  //"view_counter" : 18,
  //"view_counter_n" : 20,

  "view_counter" : 1,
  "view_counter_n" : 3,

  "view_prv" : 0,
  "view_nxt" : 1,
  "time_prv": -1,

  "data": {
    "info": [],
    "tri": {}
  },

  "debug_line": false,
  "debug_cube": [],
  "debug_cube_pos": [],

  "debug_level": 2,

  "material_type" : "toon"

};

//let _g_w = 1/2;
let _g_w = 1/4;
//let _g_h = 2/8;
let _g_h = 1/8;

//DEBUG
//_g_h = 0.25;
//_g_h = 0.5;

//let _g_epd = 1/8;
let _g_epd = 0;

// template tiles.
// These will be rotated to build the whole tile library.
// The endpoints are there so that we can weed out duplicates
// (from our brute force rotate) and so we can see how each
// tile can join with the others.
//
let g_template = {

  "endpoint": {
    ".": [],

    "d": [],

    "|": [  [ -_g_w/2,  1/2 + _g_epd, -1/2 ], [  _g_w/2,  1/2 + _g_epd, -1/2 ],
            [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ] ],

    "r": [  [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ],
            [ 1/2 + _g_epd,  _g_w/2, -1/2 ], [ 1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "+": [  [ -_g_w/2,  1/2 + _g_epd, -1/2 ], [  _g_w/2,  1/2 + _g_epd, -1/2 ],
            [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ],
            [ -1/2 - _g_epd,  _g_w/2, -1/2 ], [ -1/2 - _g_epd, -_g_w/2, -1/2 ],
            [  1/2 + _g_epd,  _g_w/2, -1/2 ], [  1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "T": [  [  _g_w/2, -1/2 - _g_epd, -1/2 ], [ -_g_w/2, -1/2 - _g_epd, -1/2 ],
            [ -1/2 - _g_epd,  _g_w/2, -1/2 ], [ -1/2 - _g_epd, -_g_w/2, -1/2 ],
            [  1/2 + _g_epd,  _g_w/2, -1/2 ], [  1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "^": [  [  _g_w/2, -1/2 , -1/2 - _g_epd ], [ -_g_w/2, -1/2 , -1/2 - _g_epd ],
            [  _g_w/2,  1/2 ,  1/2 + _g_epd ], [ -_g_w/2,  1/2 ,  1/2 + _g_epd ] ]
  },

  ":" : [],

  "d": [
    -1/2,  1/2, -1/2,  -1/2, -1/2, -1/2,    1/2,  1/2, -1/2,
    -1/2, -1/2, -1/2,   1/2, -1/2, -1/2,    1/2,  1/2, -1/2,


    -1/2,  1/2, -1/2,   1/2,  1/2, -1/2,   -1/2, -1/2, -1/2,
    -1/2, -1/2, -1/2,   1/2,  1/2, -1/2,    1/2, -1/2, -1/2
  ],

  "|" : [

    // front panel
    //
    -_g_w/2,  1/2, -1/2-_g_h/2,  _g_w/2,  1/2, -1/2-_g_h/2,   -_g_w/2, -1/2, -1/2-_g_h/2,
     _g_w/2,  1/2, -1/2-_g_h/2,  _g_w/2, -1/2, -1/2-_g_h/2,   -_g_w/2, -1/2, -1/2-_g_h/2,

    // back panel
    //
    -_g_w/2,  1/2, -1/2+_g_h/2, -_g_w/2, -1/2, -1/2+_g_h/2,   _g_w/2,  1/2, -1/2+_g_h/2,
     _g_w/2,  1/2, -1/2+_g_h/2, -_g_w/2, -1/2, -1/2+_g_h/2,   _g_w/2, -1/2, -1/2+_g_h/2,

    // left side stripe
    //
    -_g_w/2,  1/2, -1/2-_g_h/2,   -_g_w/2, -1/2, -1/2-_g_h/2,  -_g_w/2, -1/2, -1/2+_g_h/2,
    -_g_w/2,  1/2, -1/2-_g_h/2,   -_g_w/2, -1/2, -1/2+_g_h/2,  -_g_w/2,  1/2, -1/2+_g_h/2,

    // right side stripe
    //
     _g_w/2,  1/2, -1/2-_g_h/2,   _g_w/2, -1/2, -1/2+_g_h/2,  _g_w/2, -1/2, -1/2-_g_h/2,
     _g_w/2,  1/2, -1/2-_g_h/2,   _g_w/2,  1/2, -1/2+_g_h/2,  _g_w/2, -1/2, -1/2+_g_h/2,

    // top panel
    //
    -_g_w/2,  1/2, -1/2-_g_h/2,   -_g_w/2,  1/2, -1/2+_g_h/2,   _g_w/2,  1/2, -1/2-_g_h/2,
     _g_w/2,  1/2, -1/2-_g_h/2,   -_g_w/2,  1/2, -1/2+_g_h/2,   _g_w/2,  1/2, -1/2+_g_h/2,

    // bottom panel
    //
    -_g_w/2, -1/2, -1/2-_g_h/2,   _g_w/2, -1/2, -1/2+_g_h/2,    -_g_w/2, -1/2, -1/2+_g_h/2,
     _g_w/2, -1/2, -1/2-_g_h/2,   _g_w/2, -1/2, -1/2+_g_h/2,    -_g_w/2, -1/2, -1/2-_g_h/2

  ],

  // by hand is too much, these will be done via init_template()
  //
  "r"  : [],
  "^"   : [],
  "+"   : [],
  "T"   : []

};

function init_template() {

  // top
  //

  // bottom square
  //
  let fr = [];
  let tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2-_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] );
  tri.push( [  _g_w/2, -1/2,    -1/2-_g_h/2 ] );
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2-_g_h/2 ] );
  tri.push( [ -_g_w/2, -_g_w/2, -1/2-_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_g_w/2, -_g_w/2, -1/2-_g_h/2 ] );
  tri.push( [  _g_w/2,  _g_w/2, -1/2-_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  1/2,     _g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  1/2,    -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  //--

  // bottom
  //

  // bottom square
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2+_g_h/2 ] );
  tri.push( [  _g_w/2, -1/2,    -1/2+_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2+_g_h/2 ] );
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2+_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2+_g_h/2 ] );
  tri.push( [ -_g_w/2, -_g_w/2, -1/2+_g_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_g_w/2, -_g_w/2, -1/2+_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -1/2+_g_h/2 ] );
  tri.push( [  _g_w/2,  _g_w/2, -1/2+_g_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_g_w/2, -1/2 +_g_h/2 ] )
  tri.push( [  1/2,     _g_w/2, -1/2 +_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -1/2 +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  1/2,    -_g_w/2, -1/2+_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -1/2+_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  //--

  // front edge
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2, -1/2+_g_h/2 ] )
  tri.push( [ -_g_w/2, -1/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  // front right edge
  //
  tri = [];
  tri.push( [  _g_w/2, -1/2,    -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2,    -1/2+_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _g_w/2, -1/2,    -1/2+_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  // front left edge
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2-_g_h/2 ] )
  tri.push( [ -_g_w/2, -1/2,    -1/2+_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -1/2+_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  //---

  // right edge
  //
  tri = [];
  tri.push( [ 1/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ 1/2, -_g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ 1/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);


  // right up edge
  //
  tri = [];
  tri.push( [ 1/2,     _g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ _g_w/2,  _g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,     _g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ _g_w/2,  _g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ _g_w/2,  _g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ 1/2,     _g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  // right down edge
  //
  tri = [];
  tri.push( [ 1/2,    -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,    -_g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ _g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ _g_w/2, -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ 1/2,    -_g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ _g_w/2, -_g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  // diagnoal connecting edge
  //
  tri = [];
  tri.push( [ -_g_w/2,  -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [  _g_w/2,   _g_w/2, -1/2+_g_h/2 ] )
  tri.push( [  _g_w/2,   _g_w/2, -1/2-_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _g_w/2,   _g_w/2, -1/2+_g_h/2 ] )
  tri.push( [ -_g_w/2,  -_g_w/2, -1/2-_g_h/2 ] )
  tri.push( [ -_g_w/2,  -_g_w/2, -1/2+_g_h/2 ] )
  fr.push(tri);

  let flat_fr = [];
  for (let i=0; i<fr.length; i++) {
    for (let j=0; j<fr[i].length; j++) {
      for (let k=0; k<fr[i][j].length; k++) {
        flat_fr.push( fr[i][j][k] );
      }
    }
  }

  g_template["r"] = flat_fr;



  //---
  // stairs
  //

  //let ds = 1/16;
  //ds = 1/2;
  //ds = _g_h;

  let parity = 1;

  //let n = 6;
  //let n = Math.floor( (1/ds) + 0.25 ) - 1;
  //let n = Math.floor( (1/ds) + 0.25 );

  let st = [];

  let _st_L = -1/2 - _g_h/2;
  let _st_U =  1/2 + _g_h/2;

  let n = Math.floor( ((_st_U - _st_L) / _g_h) + (_g_h/2) );

  let _st_height = _g_h;
  let _st_length = 2*_g_w;

  let _st_y_s = -(1/2) + (_st_length/2);
  let _st_y_e =  (1/2) - (_st_length/2);
  let _st_dy = (_st_y_e - _st_y_s)/(n-1);

  let _st_depth = _g_h/2;

  console.log("_st_y_s", _st_y_s, "st_y_e", _st_y_e, "st_dy", _st_dy, "st_depth", _st_depth, "n", n);

  let dx=0, dy=0, dz=0;

  for (let i=0; i<n; i++) {

    // top upper step
    //
    dx = 0;
    dy = -1/2 + i*_st_dy  + _st_dy/2;
    dz = i*_g_h  - 1/2 + _g_h/2 ;

    let _r = _3rect_xy( _g_w, _st_dy,
      dx, dy, dz,
      1-parity);

    if (i < (n-1)) {
      for (let j=0; j<_r.length; j++) { st.push(_r[j]); }
    }

    // up facing top stairs
    //
    dx = 0;
    dy = -1/2 + i*_st_dy + 2*_g_w;
    dz = _st_L + i*_g_h + _g_h/2;

    _r = _3rect_xz( _g_w, _g_h,
      dx, dy, dz,
      parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    //---
    //
    // bottom lower setp
    //
    dx = 0;
    dy = 1/2 - i*_st_dy + _st_dy/2;
    dz = 1/2 - i*_g_h + _g_h/2;

    _r = _3rect_xy( _g_w, _st_dy,
      dx, dy, dz,
      parity);
    if (i>0) {
      for (let j=0; j<_r.length; j++) { st.push(_r[j]); }
    }


    // bottom facing bottom steps
    //
    dx = 0;
    dy = -1/2 + i*_st_dy;
    dz = _st_L + i*_g_h + _g_h/2;

    _r = _3rect_xz( _g_w, _g_h,
      dx, dy, dz,
      1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }


    // left side face
    //
    dx = -_g_w/2;
    dz = _st_L + _g_h/2 + i*_g_h;
    dy = _st_y_s + i*_st_dy;

    _r = _3rect_zy(
      _st_height, _st_length,
      dx, dy, dz,
      1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }


    // right side face
    //
    dx =  _g_w/2;
    dy = _st_y_s + i*_st_dy;
    dz = _st_L + _g_h/2 + i*_g_h;

    _r = _3rect_zy(
      _st_height, _st_length,
      dx, dy, dz,
      parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  }


  // bottom platform
  //
  _r = _3rect_xy( _g_w, _st_length,
    0,
    -1/2+_st_length/2,
    -1/2-_g_h/2,
    parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  // top platform
  //
  _r = _3rect_xy( _g_w, _st_length,
    0,
    1/2-_st_length/2,
    1/2+_g_h/2,
    1-parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }




  let flat_st = [];
  for (let i=0; i<st.length; i++) {
    for (let j=0; j<st[i].length; j++) {
      for (let k=0; k<st[i][j].length; k++) {
        flat_st.push( st[i][j][k] );
      }
    }
  }

  g_template["^"] = flat_st;

  //---
  // T
  //

  // t faces (top and bottom)
  //
  let T = [];

  _r = _3rect_xy( 1, _g_w, 0, 0, -1/2-_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2-_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy( 1, _g_w, 0, 0, -1/2 + _g_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2 + _g_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // bottom and top
  //
  //_r = _3rect_xz( _g_w, _g_h, 0, -1/2, -1/2 + _g_h/2, 0);
  _r = _3rect_xz( _g_w, _g_h, 0, -1/2, -1/2 , 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  //_r = _3rect_xz( 1, _g_h, 0, _g_w/2, -1/2 + _g_h/2, 1);
  _r = _3rect_xz( 1, _g_h, 0, _g_w/2, -1/2 , 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // left and right
  //
  //_r = _3rect_zy( _g_h, _g_w, 1/2, 0, -1/2 + _g_h/2, 1);
  _r = _3rect_zy( _g_h, _g_w, 1/2, 0, -1/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  //_r = _3rect_zy( _g_h, _g_w,-1/2, 0, -1/2 + _g_h/2, 0);
  _r = _3rect_zy( _g_h, _g_w,-1/2, 0, -1/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // inner caps
  //
  //_r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, -1/2+_g_h/2, 0);
  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, -1/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  //_r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -1/2+(1-_g_w)/4, -1/2+_g_h/2, 1);
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -1/2+(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  //_r = _3rect_xz( (1-_g_w)/2, _g_h, -1/2+(1-_g_w)/4, -_g_w/2, -1/2 + _g_h/2, 0);
  _r = _3rect_xz( (1-_g_w)/2, _g_h, -1/2+(1-_g_w)/4, -_g_w/2, -1/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  //_r = _3rect_xz( (1-_g_w)/2, _g_h,  1/2-(1-_g_w)/4, -_g_w/2, -1/2 + _g_h/2, 0);
  _r = _3rect_xz( (1-_g_w)/2, _g_h,  1/2-(1-_g_w)/4, -_g_w/2, -1/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  let flat_T = [];
  for (let i=0; i<T.length; i++) {
    for (let j=0; j<T[i].length; j++) {
      for (let k=0; k<T[i][j].length; k++) {
        flat_T.push( T[i][j][k] );
      }
    }
  }

  g_template["T"] = flat_T;

  //---
  //+
  //

  // + faces (top and bottom)
  //
  let pl = [];
  //_r = _3rect_xy( 1, _g_w, 0, 0, -1/2, 1);
  _r = _3rect_xy( 1, _g_w, 0, 0, -1/2-_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + _g_w/2, -1/2, 1);
  //_r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2, 1);
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2-_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_xy(_g_w, _g_w, 0,  1/2 - _g_w/2, -1/2, 1);
  //_r = _3rect_xy(_g_w, (1-_g_w)/2, 0, 1/2 - (1-_g_w)/4, -1/2, 1);
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, 1/2 - (1-_g_w)/4, -1/2-_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_xy( 1, _g_w, 0, 0, -1/2 + _g_h, 0);
  _r = _3rect_xy( 1, _g_w, 0, 0, -1/2 + _g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_xy(_g_w, _g_w, 0, -1/2 + _g_w/2, -1/2 + _g_h, 0);
  //_r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2 + _g_h, 0);
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -1/2 + _g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  //_r = _3rect_xy(_g_w, _g_w, 0,  1/2 - _g_w/2, -1/2 + _g_h, 0);
  //_r = _3rect_xy(_g_w, (1-_g_w)/2, 0,  1/2 - (1-_g_w)/4, -1/2 + _g_h, 0);
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0,  1/2 - (1-_g_w)/4, -1/2 + _g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // bottom and top
  //
  //_r = _3rect_xz( _g_w, _g_h, 0, -1/2, -1/2 + _g_h/2, 0);
  _r = _3rect_xz( _g_w, _g_h, 0, -1/2, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_xz( _g_w, _g_h, 0,  1/2, -1/2 + _g_h/2, 1);
  _r = _3rect_xz( _g_w, _g_h, 0,  1/2, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // left and right
  //
  //_r = _3rect_zy( _g_h, _g_w, 1/2, 0, -1/2 + _g_h/2, 1);
  _r = _3rect_zy( _g_h, _g_w, 1/2, 0, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }


  //_r = _3rect_zy( _g_h, _g_w,-1/2, 0, -1/2 + _g_h/2, 0);
  _r = _3rect_zy( _g_h, _g_w, -1/2, 0, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }


  // middle caps
  //
  //_r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, -1/2+_g_h/2, 0);
  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //_r = _3rect_zy( _g_h, _g_w,  _g_w/2, -1/2+_g_w/2, -1/2+_g_h/2, 1);
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -1/2+(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2,  1/2-(1-_g_w)/4, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2,  1/2-(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -1/2+(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2,  1/2-(1-_g_w)/4, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2,  1/2-(1-_g_w)/4, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xz( (1-_g_w)/2, _g_h, -1/2+(1-_g_w)/4, -_g_w/2, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_g_w)/2, _g_h,  1/2-(1-_g_w)/4, -_g_w/2, -1/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xz( (1-_g_w)/2, _g_h, -1/2+(1-_g_w)/4,  _g_w/2, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_g_w)/2, _g_h,  1/2-(1-_g_w)/4,  _g_w/2, -1/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }


  let flat_pl = [];
  for (let i=0; i<pl.length; i++) {
    for (let j=0; j<pl[i].length; j++) {
      for (let k=0; k<pl[i][j].length; k++) {
        flat_pl.push( pl[i][j][k] );
      }
    }
  }

  g_template["+"] = flat_pl;


  //----

}

function _3rect_zy(w,h,x,y,z,o) {
  let tri_a = [];

  if (o) {
    let tri = [];
    tri.push( [ x, y+h/2, z-w/2 ] );
    tri.push( [ x, y+h/2, z+w/2 ] );
    tri.push( [ x, y-h/2, z-w/2 ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x, y+h/2, z+w/2 ] );
    tri.push( [ x, y-h/2, z+w/2 ] );
    tri.push( [ x, y-h/2, z-w/2 ] );
    tri_a.push(tri);
  }
  else {
    let tri = [];
    tri.push( [ x, y+h/2, z-w/2 ] );
    tri.push( [ x, y-h/2, z-w/2 ] );
    tri.push( [ x, y+h/2, z+w/2 ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x, y+h/2, z+w/2 ] );
    tri.push( [ x, y-h/2, z-w/2 ] );
    tri.push( [ x, y-h/2, z+w/2 ] );
    tri_a.push(tri);
  }

  return tri_a;
}

function _3rect_xz(w,h,x,y,z,o) {
  let tri_a = [];

  if (o) {
    let tri = [];
    tri.push( [ x-w/2, y, z+h/2 ] );
    tri.push( [ x+w/2, y, z+h/2 ] );
    tri.push( [ x-w/2, y, z-h/2 ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x+w/2, y, z+h/2 ] );
    tri.push( [ x+w/2, y, z-h/2 ] );
    tri.push( [ x-w/2, y, z-h/2 ] );
    tri_a.push(tri);
  }
  else {
    let tri = [];
    tri.push( [ x-w/2, y, z+h/2 ] );
    tri.push( [ x-w/2, y, z-h/2 ] );
    tri.push( [ x+w/2, y, z+h/2 ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x+w/2, y, z+h/2 ] );
    tri.push( [ x-w/2, y, z-h/2 ] );
    tri.push( [ x+w/2, y, z-h/2 ] );
    tri_a.push(tri);
  }

  return tri_a;
}

function _3rect_xy(w,h,x,y,z,o) {

  let tri_a = [];

  if (o) {
    let tri = [];
    tri.push( [ x-w/2, y+h/2, z ] );
    tri.push( [ x+w/2, y+h/2, z ] );
    tri.push( [ x-w/2, y-h/2, z ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x+w/2, y+h/2, z ] );
    tri.push( [ x+w/2, y-h/2, z ] );
    tri.push( [ x-w/2, y-h/2, z ] );
    tri_a.push(tri);
  }
  else {
    let tri = [];
    tri.push( [ x-w/2, y+h/2, z ] );
    tri.push( [ x-w/2, y-h/2, z ] );
    tri.push( [ x+w/2, y+h/2, z ] );
    tri_a.push(tri);

    tri = [];
    tri.push( [ x+w/2, y+h/2, z ] );
    tri.push( [ x-w/2, y-h/2, z ] );
    tri.push( [ x+w/2, y-h/2, z ] );
    tri_a.push(tri);
  }

  return tri_a;
}



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

  console.log(">>>", x,y , z, s);

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

  g_info.scene.add( g_info.light[0] );

  //---

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

  g_info.line_geom.setAttribute( 'position', new THREE.Float32BufferAttribute( line_pos, 3 ) );
  g_info.line_geom.setAttribute( 'color', new THREE.Float32BufferAttribute( line_color, 3 ) );

  g_info.line_geom.computeBoundingSphere();
  g_info.tjs_line = new THREE.Line( g_info.line_geom, line_material );

  if (g_info.debug_line) {
    g_info.scene.add( g_info.tjs_line );
  }

  //
  //------
  //------
  //------

  g_info.geometry = new THREE.BufferGeometry();

  const positions = [];
  const normals = [];
  const colors = [];

  const color = new THREE.Color();

  //const n = 800, n2 = n / 2; // triangles spread in the cube

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();

  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  let tri_vf = g_info.data.tri;

  //SCALE

  //const d = 12,
  const d = 5,
        d2 = d/2;
  for (let idx=0; idx<tri_vf.length; idx++) {

    let pal = g_info.palette[ g_info.palette_idx ];

    let color_hex = pal.colors[ _irnd(pal.colors.length) ];
    let rgb = _hex2rgb(color_hex );
    color.setRGB( rgb.r/255, rgb.g/255, rgb.b/255 );

    let alpha = 1;

    for ( let i = 0; i < tri_vf[idx].length; i += 9 ) {

      const x = -200;
      const y = -200;
      const z = -200;

      let ax = x + tri_vf[idx][i + 0]*d - d2;
      let ay = y + tri_vf[idx][i + 1]*d - d2;
      let az = z + tri_vf[idx][i + 2]*d - d2;

      let bx = x + tri_vf[idx][i + 3]*d - d2;
      let by = y + tri_vf[idx][i + 4]*d - d2;
      let bz = z + tri_vf[idx][i + 5]*d - d2;

      let cx = x + tri_vf[idx][i + 6]*d - d2;
      let cy = y + tri_vf[idx][i + 7]*d - d2;
      let cz = z + tri_vf[idx][i + 8]*d - d2;

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

  g_info.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions,  3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'normal',   new THREE.Float32BufferAttribute( normals,    3 ).onUpload( disposeArray ) );
  g_info.geometry.setAttribute( 'color',    new THREE.Float32BufferAttribute( colors,     4 ).onUpload( disposeArray ) );

  g_info.geometry.computeBoundingSphere();

  //---

  g_info.renderer = new THREE.WebGLRenderer({ "antialias": true });
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;

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

  let N = 3;

  // init
  //
  if (g_info.time_prv < 0) {
    g_info.time_prv = time;
    g_info.view_prv = _irnd(N);
    g_info.view_nxt = (_irnd(2) + g_info.view_prv + 1)%N;
  }

  if ( Math.floor(g_info.time_prv) != Math.floor(time)) {
    g_info.time_prv = time;

    if (g_info.view_counter == 0) {
      g_info.view_prv = g_info.view_nxt;
      g_info.view_nxt = _irnd(N);

      if (g_info.view_nxt == g_info.view_prv) {
        g_info.view_nxt = (g_info.view_prv+1)%N;
      }

    }

    g_info.view_counter ++;
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

    let _t_rem = easeInOutSine(_t_rem_orig);

    if (view_counter != 0) {
      _t_rem = 0;
    }
    else {
    }

      let D = 4;
      D = 1.75;
      D = 1.387;

      if (view_prv == 0) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.yRotation((1-_t_rem)*Math.PI/D);
      }
      else if (view_prv == 1) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
      }
      else if (view_prv == 2) {
        mp0 = m4.yRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
      }

      else if (view_prv == 3) {
        mp0 = m4.xRotation((_t_rem)*Math.PI/D);
        mp1 = m4.yRotation((1-_t_rem)*Math.PI/D);
      }
      else if (view_prv == 4) {
        mp0 = m4.xRotation((_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
      }
      else if (view_prv == 5) {
        mp0 = m4.yRotation((_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((1-_t_rem)*Math.PI/D);
      }

      
      if (view_nxt == 0 ) {
        mn0 = m4.xRotation(_t_rem*Math.PI/D);
        mn1 = m4.yRotation(_t_rem*Math.PI/D);
      }
      else if (view_nxt == 1) {
        mn0 = m4.xRotation((_t_rem)*Math.PI/D);
        mn1 = m4.zRotation((_t_rem)*Math.PI/D);
      }
      else if (view_nxt == 2) {
        mn0 = m4.yRotation((_t_rem)*Math.PI/D);
        mn1 = m4.zRotation((_t_rem)*Math.PI/D);
      }

      else if (view_nxt == 3) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.yRotation((_t_rem)*Math.PI/D);
      }
      else if (view_nxt == 4) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((_t_rem)*Math.PI/D);
      }
      else if (view_nxt == 5) {
        mp0 = m4.yRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.zRotation((_t_rem)*Math.PI/D);
      }

    //}

    let mrp = m4.multiply(mp1, mp0);
    let mrn = m4.multiply(mn1, mn0);

    let mr = m4.multiply(mrp, mrn);
    let m = new THREE.Matrix4();
    m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
           mr[ 4], mr[ 5], mr[ 6], mr[ 7],
           mr[ 8], mr[ 9], mr[10], mr[11],
           mr[12], mr[13], mr[14], mr[15] );


    g_info.mesh.rotation.x = 0;
    g_info.mesh.rotation.y = 0;
    g_info.mesh.rotation.z = 0;
    g_info.mesh.applyMatrix4(m);

    for (let i=0; i<g_info.debug_cube.length; i++) {
      g_info.debug_cube[i].position.x = g_info.debug_cube_pos[i][0];
      g_info.debug_cube[i].position.y = g_info.debug_cube_pos[i][1];
      g_info.debug_cube[i].position.z = g_info.debug_cube_pos[i][2];

      g_info.debug_cube[i].rotation.x = 0;
      g_info.debug_cube[i].rotation.y = 0;
      g_info.debug_cube[i].rotation.z = 0;
      g_info.debug_cube[i].applyMatrix4(m);

    }
  }

  g_info.tjs_line.rotation.x = g_info.rotx + theta_x;
  g_info.tjs_line.rotation.y = g_info.roty + theta_y;
  g_info.tjs_line.rotation.z = g_info.rotz;

  theta_x = Math.sin(time*0.5)*0.125;
  theta_y = time*0.5;

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

function init_param() {

  // palette choice
  //
  g_info.palette_idx = _irnd( g_info.palette.length );
  let pidx = g_info.palette_idx;

  g_info.features["Palette"] = g_info.palette[pidx].name;

  // speed factor
  //
  g_info.speed_factor  = _rnd(1/2048, 1/512); //0.00075,

  //DEBUG
  g_info.speed_factor = 1/2048;

  g_info.features["Speed Factor"] = g_info.speed_factor;

  //---

  window.$fxhashFeatures = g_info.features;
}

function _template_rot_mov(tplate, rx, ry, rz, tx, ty, tz) {

  let tri = [];

  let mx = m4.xRotation(rx);
  let my = m4.yRotation(ry);
  let mz = m4.zRotation(rz);

  let mr = m4.multiply( m4.multiply(mx, my), mz );

  for (let p=0; p<tplate.length; p+=3) {
    tri.push(tx); tri.push(ty); tri.push(tz);
    for (let _i=0; _i<3; _i++) {
      for (let _j=0; _j<3; _j++) {
        tri[p+_i] += tplate[p+_j]*mr[4*_i + _j];
      }
    }
  }

  return tri;
}

function _p_mul_mov(v, s, tx, ty ,tz) {
  for (let i=0; i<v.length; i++) {
    v[i] *= s;

    if ((i%3)==0) { v[i] += tx; }
    if ((i%3)==1) { v[i] += ty; }
    if ((i%3)==2) { v[i] += tz; }
  }

  return v;
}

function _m_v_mul(m, v) {
  let tx = 0;
  let ty = 0;
  let tz = 0;

  let tri = [];

  tri.push(tx);
  tri.push(ty);
  tri.push(tz);
  for (let _i=0; _i<3; _i++) {
    for (let _j=0; _j<3; _j++) {
      tri[_i] += m[4*_i + _j] * v[_j];
    }
  }

  return tri;
}

function _dist3(u,v) {
  let dsq = (u[0] - v[0])*(u[0] - v[0]) +
            (u[1] - v[1])*(u[1] - v[1]) +
            (u[2] - v[2])*(u[2] - v[2]);

  return Math.sqrt(dsq);
}

function _v_in(v, va, _eps) {
  _eps = ((typeof _eps === "undefined") ? (1/128.0) : _eps);

  for (let i=0; i<va.length; i++) {
    if (_dist3(v, va[i]) <= _eps) { return true; }
  }
  return false;
}

function _build_tile_library( _endp_lib ) {

  let raw_lib = {};
  let rot_lib = {};

  // equiv_map holds array of equivalent rotations
  //
  let _equiv_map = {};

  // repr map takes a single representation for all
  // equivalent rotations
  //
  let _repr_map = {};

  for (let pkey in _endp_lib) {

    let _endp = _endp_lib[pkey];

    let _type_a = [];
    let _type_a_key = [];

    for (let xidx=0; xidx<4; xidx++) {
      for (let yidx=0; yidx<4; yidx++) {
        for (let zidx=0; zidx<4; zidx++) {

          mx = m4.xRotation(xidx*Math.PI/2);
          my = m4.yRotation(yidx*Math.PI/2);
          mz = m4.zRotation(zidx*Math.PI/2);
          let mr = m4.multiply( m4.multiply(mx, my), mz );

          let ukey = pkey + xidx.toString() + yidx.toString() + zidx.toString();

          raw_lib[ukey] = [];

          // rotate endpoints around the various pi/2 rotations (x,y,z)
          // and put them in the 'raw' library
          //
          for (let ep_idx=0; ep_idx<_endp.length; ep_idx++) {
            let v = _m_v_mul(mr, _endp[ep_idx]);
            raw_lib[ukey].push(v);
          }

          _type_a.push( raw_lib[ukey] );
          _type_a_key.push(ukey);

          rot_lib[ukey] = { "m": [mx, my, mz], "r": [xidx, yidx, zidx ] };

        }
      }

    }


    // once in the library, go through and compare each
    // to see if they're equivalent by seeing if the endpoints
    // line up
    //
    for (let i=0; i<_type_a.length; i++) {
      for (let j=i+1; j<_type_a.length; j++) {

        let k=0;
        for (k=0; k<_type_a[i].length; k++) {
          if (!(_v_in(_type_a[i][k], _type_a[j]))) { break; }
        }

        if (k==_type_a[i].length) {
          if (!(_type_a_key[i] in _equiv_map)) { _equiv_map[_type_a_key[i]] = []; }
          if (!(_type_a_key[j] in _equiv_map)) { _equiv_map[_type_a_key[j]] = []; }
          _equiv_map[_type_a_key[i]].push( _type_a_key[j] );
          _equiv_map[_type_a_key[j]].push( _type_a_key[i] );
        }

      }
    }

    // once we've constructed the equiv_map, go through and pick out the
    // representative
    //
    for (let key in _equiv_map) {
      if (key in _repr_map) { continue; }
      _repr_map[key] = key;
      for (let ii=0; ii<_equiv_map[key].length; ii++) {
        _repr_map[_equiv_map[key][ii]] = key;
      }
    }

  }

  let uniq_repr = {};
  for (let key in _repr_map) {
    let repr_id = _repr_map[key];
    if (!(repr_id in uniq_repr)) {
      uniq_repr[repr_id] = {"count":0, "attach_dv": {} };
    }
    uniq_repr[repr_id].count++;
  }

  let tile_attach = {};

  // now for each representative, test every other tile to see if can
  // be joined
  //
  for (let anchor_key in uniq_repr) {
    for (let test_key in uniq_repr) {

      for (let dx=-1; dx<2; dx++) {
        for (let dy=-1; dy<2; dy++) {
          for (let dz=-1; dz<2; dz++) {
            if ((dx==0) && (dy==0) && (dz==0)) { continue; }

            let anch_endp = raw_lib[anchor_key];
            let test_endp = raw_lib[test_key];


            let count = 0;
            for (let idx=0; idx<test_endp.length; idx++) {
              let tv = [ test_endp[idx][0] + dx, test_endp[idx][1] + dy, test_endp[idx][2] + dz ];
              if (_v_in(tv, anch_endp)) { count++; }
            }

            // should only be two...
            //
            if (count>0) {
              //console.log(">>", dx, dy, dz, anchor_key, test_key, count);
              if (!(anchor_key in tile_attach)) { tile_attach[anchor_key] = {}; }
              if (!(test_key in tile_attach[anchor_key])) {
                tile_attach[anchor_key][test_key] = { "anchor": anchor_key, "attach": test_key, "dv": [] };
              }
              tile_attach[anchor_key][test_key].dv.push( [dx, dy, dz ] );

              dv_key = dx.toString() + ":" + dy.toString() + ":" + dz.toString();
              uniq_repr[anchor_key].attach_dv[ dv_key ] = [ dx, dy, dz ];
            }

          }
        }
      }
    }

  }


  g_template["raw_lib"] = raw_lib;
  g_template["equiv_map"] = _equiv_map;
  g_template["repr_map"] = _repr_map
  g_template["uniq_repr"] = uniq_repr;
  g_template["tile_attach"] = tile_attach;
  g_template["rot_lib"] = rot_lib;

}

function grid_clear(gr) {

  // clear
  //
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          gr[z][y][x].d = 0;
        }

      }
    }
  }

}

function grid_cull_one(gr) {

  let processed_count = 0;
  let tot_count = 0;

  // cull possbile grid tiles that don't have any neighbors
  // (bounds checking)
  // In addition, build 'attach_map' that collects number of neighbors
  // for each tile and grid position
  //
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        tot_count++;

        for (let ii=0; ii<gr[z][y][x].length; ii++) {


          let anch_ele = gr[z][y][x][ii];
          //if ((x==1) && (y==1) && (z==0) && (anch_ele.n == '|011')) {
          //  console.log("considering", x, y, z, ii, anch_ele.n, anch_ele.valid, anch_ele.processed);
          //}

          if (gr[z][y][x][ii].valid == false) { continue; }
          if (gr[z][y][x][ii].processed == true) {
            processed_count++;
            continue;
          }

          let anchor_name = gr[z][y][x][ii].n;

          let attach_map = {};
          for (let dv_key in g_template.uniq_repr[anchor_name].attach_dv) {
            attach_map[dv_key] = 0;
          }

          let ta = g_template.tile_attach[anchor_name];
          for (let nei_name in ta) {
            for (let dv_idx=0; dv_idx<ta[nei_name].dv.length; dv_idx++) {


              let dv = ta[nei_name].dv[dv_idx];
              let dv_key = dv[0].toString() + ":" + dv[1].toString() + ":" + dv[2].toString();

              //if ((x==1) && (y==1) && (z==0) && (anch_ele.n == '|011')) {
              //  console.log("  ", anch_ele.n, "nei:", nei_name, dv_key);
              //}

              let nx = x + dv[0];
              let ny = y + dv[1];
              let nz = z + dv[2];

              // neighbor is out of bounds, mark it for removal
              //
              if ((nx < 0) || (ny < 0) || (nz < 0) ||
                  (nx >= gr[z][y].length) ||
                  (ny >= gr[z].length) ||
                  (nz >= gr.length)) {
                gr[z][y][x][ii].d = -1;
                gr[z][y][x][ii].valid = false;

                //console.log("bound cull:", anchor_name, x,y,z);

                return { "p": [x,y,z], "n": anchor_name, "finished": false, "reason":"bound cull", "error": false  };
              }

              let found = false;
              for (let jj=0; jj<gr[nz][ny][nx].length; jj++) {
                let _ele = gr[nz][ny][nx][jj];
                if (_ele.n == nei_name) {
                  if (_ele.valid == true) {
                    attach_map[dv_key]++;
                    found = true;
                  }
                  break;
                }
              }

            }

          }

          //if ((x==2) && (y==1) && (z==0) && (anchor_name == 'r020')) {
          //  console.log("attach_map for", x, y, z, anchor_name, attach_map);
          //}

          for (let dv_key in attach_map) {
            if (attach_map[dv_key]==0) {

              //DEBUG
              //
              if (g_info.debug_level > 3) {
                console.log("culling", anchor_name, x, y, z, "(", dv_key, ")");
              }

              gr[z][y][x][ii].d = -1;
              gr[z][y][x][ii].valid = false;

              return { "p": [x,y,z], "n": anchor_name, "finished": false, "reason":"removing for lack of neighbors", "error": false };
            }
          }

          gr[z][y][x][ii]["attach_map"] = attach_map;
        }

      }
    }
  }

  if (processed_count == tot_count) {
    //console.log("final state");
    return { "finished": true, "error": false, "reason": "converged" };
  }

  //---
  // force processed
  //
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (gr[z][y][x][ii].valid == false) { continue; }
          if (gr[z][y][x][ii].processed == true) {

            let anchor_name = gr[z][y][x][ii].n;

            if (g_info.debug_level > 3) {
              console.log("x->", x,y,z,ii,anchor_name);
            }

            let keep_map = {};

            let ta = g_template.tile_attach[anchor_name];
            for (let nei_name in ta) {
              for (let dv_idx=0; dv_idx<ta[nei_name].dv.length; dv_idx++) {

                let dv = ta[nei_name].dv[dv_idx];
                let dv_key = dv[0].toString() + ":" + dv[1].toString() + ":" + dv[2].toString();

                let nx = x + dv[0];
                let ny = y + dv[1];
                let nz = z + dv[2];

                if ((nx < 0) || (ny < 0) || (nz < 0) ||
                    (nx >= gr[z][y].length) ||
                    (ny >= gr[z].length) ||
                    (nz >= gr.length)) {
                  gr[z][y][x][ii].d = -1;
                  gr[z][y][x][ii].valid = false;
                  return { "finished":true, "error": false, "reason":"processed tile contradiction",
                           "p": [x,y,z], "n": anchor_name };
                }

                if (!(dv_key in keep_map)) { keep_map[dv_key] = {}; }

                //console.log("++keep_map[", dv_key, "][", nei_name, "]: anchor:", anchor_name, "nei:", nei_name, "anch_pos:", x,y,z, "nei_pos:", nx, ny, nz);

                keep_map[dv_key][nei_name] = { "anchor":anchor_name, "nei": nei_name, "anchor_pos": [x,y,z], "nei_pos":[nx,ny,nz] };

              }
            }

            for (let dx=-1; dx<2; dx++) {
              for (let dy=-1; dy<2; dy++) {
                for (let dz=-1; dz<2; dz++) {
                  //dkey = (-dx).toString() + ":" + (-dy).toString() + ":" + (-dz).toString();
                  dkey = (dx).toString() + ":" + (dy).toString() + ":" + (dz).toString();
                  if (!(dkey in keep_map)) { continue; }

                  let nx = x + dx;
                  let ny = y + dy;
                  let nz = z + dz;

                  // neighbor is out of bounds, move on
                  //
                  if ((nx < 0) || (ny < 0) || (nz < 0) ||
                      (nx >= gr[z][y].length) ||
                      (ny >= gr[z].length) ||
                      (nz >= gr.length)) {
                    continue;
                  }

                  for (let jj=0; jj<gr[nz][ny][nx].length; jj++) {
                    if (gr[nz][ny][nx][jj].valid == false) { continue; }
                    let nam = gr[nz][ny][nx][jj].n;

                    //if (!(nam in keep_map[dkey])) { continue; }
                    if (nam in keep_map[dkey]) { continue; }

                    gr[nz][ny][nx][jj].d = -1;
                    gr[nz][ny][nx][jj].valid = false;

                    //DEBUG
                    if (g_info.debug_level > 3) {
                      console.log("forcing cull:", nx, ny, nz, nam, dkey, keep_map[dkey] );
                      console.log("dkey:", dkey);
                      console.log("keep_map:", keep_map);
                      debug_print_gr(gr);
                    }

                    let count = 0, latest_valid_idx = -1;
                    for (let _i=0; _i<gr[nz][ny][nx].length; _i++) {
                      if (gr[nz][ny][nx][_i].valid) {
                        latest_valid_idx = _i;
                        count++;
                      }
                    }
                    if (count==1) {

                      if (g_info.debug_level > 3) {
                        console.log("culled leaves", gr[nz][ny][nx][latest_valid_idx].n, "...marking");
                      }

                      gr[nz][ny][nx][latest_valid_idx].processed = true;
                    }

                    return { "finished":false, "error":false, "reason":"forced cull", "p": [nx,ny,nz], "n": nam };

                  }

                }
              }
            }

            break;
          }


        }

      }
    }
  }

  // at this point, all tiles that can be forced are and
  // the only remaining tiles are singletons, which we should
  // mark as processed, or have some choice.
  //

  // mark all single elements remaining in the grid list
  // as processed
  //
  let marked_count = 0;
  let marked_list = [];
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let last_valid_idx = -1;
        let valid_count = 0;
        ele = gr[z][y][x];
        for (let ii=0; ii<ele.length; ii++) {
          if (!ele[ii].valid) { continue; }
          valid_count++;
          last_valid_idx = ii;
        }


        if (valid_count == 1) {
          if (!ele[last_valid_idx].processed) {
            marked_count++;
            ele[last_valid_idx].processed = true;

            marked_list.push( { "p": [x,y,z], "n": ele[last_valid_idx].n } );
          }
        }
      }
    }
  }

  if (marked_count > 0) {

    if (g_info.debug_level > 3) {
      console.log("at least one marked as processed...", marked_list);
    }
    return { "finished": false, "error": false, "reason":"marked as processed", "data": marked_list, "error": false };
  }

  if (g_info.debug_level > 3) {
    console.log("cp0:");
    debug_print_gr(gr);
  }




  //---
  // if we get here, that means there are no hard constraints,
  // so we need to do some choice to move things along
  //

  let min_info = {
    "init": false,
    "v": [0,0,0],
    "idx":0,
    "name":"",
    "val":0
  };

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (gr[z][y][x][ii].valid == false) { continue; }
          if (gr[z][y][x][ii].processed == true) { continue; }

          let anchor_name = gr[z][y][x][ii].n;
          let attach_map = gr[z][y][x][ii].attach_map;

          for (let dv_key in attach_map) {

            let update_min_info = false;

            if (!min_info.init) { update_min_info=true; }
            if (attach_map[dv_key] < min_info.val) { update_min_info=true; }

            if (update_min_info) {
              min_info.init=true;
              min_info.v = [x,y,z];
              min_info.idx = ii;
              min_info.name = anchor_name;
              min_info.val = attach_map[dv_key];
            }

          }

        }

      }
    }
  }

  if (!min_info.init) { return { "finished": true, "error": true, "reason": "No candidate information for choice. Contradiction?" } ; };

  let min_choice = [];

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (gr[z][y][x][ii].valid == false) { continue; }
          let anchor_name = gr[z][y][x][ii].n;
          let attach_map = gr[z][y][x][ii].attach_map;

          for (let dv_key in attach_map) {

            if (attach_map[dv_key] == min_info.val) {
              min_choice.push( {"v": [x,y,z], "idx":ii, "name": anchor_name, "val": attach_map[dv_key] } );
            }
          }


        }



      }
    }
  }

  if (min_choice.length==0) { return { "finished": true, "error": true, "reason": "No choice for candidates. Contradiction? (1)" }; }

  let min_choice_idx = _irnd(min_choice.length);
  let _x    = min_choice[min_choice_idx].v[0];
  let _y    = min_choice[min_choice_idx].v[1];
  let _z    = min_choice[min_choice_idx].v[2];
  let idx   = min_choice[min_choice_idx].idx;
  let name  = min_choice[min_choice_idx].name
  for (let ii=0; ii<gr[_z][_y][_x].length; ii++) {
    if (ii!=idx) { gr[_z][_y][_x][ii].valid = false; continue; }
    gr[_z][_y][_x][ii].processed = true;

    if (g_info.debug_level > 3) {
      debug_print_gr(gr);
      console.log("MARKING", _x, _y, _z, ii, gr[_z][_y][_x][ii].n);
    }
  }

  if (g_info.debug_level > 3) {
    console.log("...");
    debug_print_gr(gr);
    console.log(">> min choice:", min_choice[min_choice_idx].name, _x, _y, _z);
  }

  return { "finished":false, "error": false, "p":[_x,_y,_z], "n": min_choice[min_choice_idx].name, "reason":"min choice" };

  //console.log("???", min_choice);
  //return { "finished": true, "error": false, "reason": "end" };
}

function debug_print() {
  let gr = g_template.debug;
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let u = '.';
        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (!gr[z][y][x][ii].valid) { continue; }
          u += ',' + gr[z][y][x][ii].n;
        }

        console.log(x,y,z,u);

      }

    }
  }
}

function debug_print_gr(gr) {
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let valid_count = 0;
        let u = '';
        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (!gr[z][y][x][ii].valid) { continue; }

          let sfx = (gr[z][y][x][ii].processed ? '*' : '');
          if (valid_count>0) { u += ","; }
          //u += ',' + gr[z][y][x][ii].n + sfx;
          u += gr[z][y][x][ii].n + sfx;
          valid_count++;
        }

        console.log(x,y,z,u);

      }

    }
  }
}

function gen_simple_grid(pgr) {
  let gr = [];

  let dim = [pgr[0][0].length, pgr[0].length, pgr.length];
  for (let z=0; z<pgr.length; z++) {
    gr.push([]);
    for (let y=0; y<pgr[z].length; y++) {
      gr[z].push([]);
      for (let x=0; x<pgr[z][y].length; x++) {
        gr[z][y].push('.');
      }
    }
  }

  if (g_info.debug_level > 3) {
    console.log(dim);
  }

  for (let z=0; z<pgr.length; z++) {
    //gr.push([]);
    for (let y=0; y<pgr[z].length; y++) {
      //gr[z].push([]);
      for (let x=0; x<pgr[z][y].length; x++) {
        //gr[z][y].push(".");

        let u = '.';
        for (let ii=0; ii<pgr[z][y][x].length; ii++) {
          if (!pgr[z][y][x][ii].valid) { continue; }
          u = pgr[z][y][x][ii].n;
          break;
        }

        if (g_info.debug_level > 3) {
          console.log(x,y,z, u);
        }

        gr[z][y][x] = u;

      }
    }
  }

  return gr;
}

var xxx = 0;
function grid_wfc(gr) {

  let debug_count = 0;

  let culling = true;
  while (culling) {
    xxx++;
    grid_clear(gr);
    let r = grid_cull_one(gr);

    if (r.finished) {
      if (g_info.debug_level > 0) {
        console.log(r);
      }

      if (g_info.debug_level > 1) {
        debug_print_gr(gr);
      }

      culling = false;
      continue;
    }

    if (g_info.debug_level > 3) {
      if ("n" in r) {
        if (r.n.charAt(0) == 'T') {
          if (r.reason != "bound cull") {
            console.log("???", r.p[0], r.p[1], r.p[2], r.n, r.reason);
          }
          //return { "p": [x,y,z], "n": anchor_name, "finished": false, "reason":"removing for lack of neighbors" };
          else if (r.reason == "removing for lack of neighbors") {
            console.log("xxx");
          }

        }
      }
    }

    //console.log(">>>", r);

    if (debug_count>4000) {
      culling = false;
    }

    if (g_info.debug_level > 0) {
      if ((debug_count %100)==0) {
        console.log("!!!", debug_count);
      }
    }
    debug_count++;
  }

}

function _init() {

  init_template();

  _build_tile_library( g_template.endpoint );

  //---

  let pgr = [];

  //let pgr_dim = [5,5,5];
  let pgr_dim = [4,3,2];
  for (let z=0; z<pgr_dim[2]; z++) {
    pgr.push([]);
    for (let y=0; y<pgr_dim[1]; y++) {
      pgr[z].push([]);
      for (let x=0; x<pgr_dim[0]; x++) {

        pgr[z][y].push([]);
        for (let tile_name in g_template.uniq_repr) {
          pgr[z][y][x].push( {"n":tile_name, "d":0, "valid": true, "processed":false });
        }

      }
    }
  }

  //grid_wfc(pgr);

  g_template["debug"] = pgr;

  let gr = [
    [
      [ ".",   "r003", "+000" ],
      [ "r003","+000", "|000" ],
      [ "r000","T000", "|000" ]
    ]
  ];

  gr = [
    [
      [ ".", "." ],
      [ ".", "." ],
      [ ".", "." ],
      [ ".", "." ],
      [ ".", "." ]
    ],
    [
      [ ".", "." ],
      [ "^100", "." ],
      [ "+000", "T001" ],
      [ "^102", "." ],
      [ ".", "." ]
    ],
    [
      [ "|000", "." ],
      [ ".", "." ],
      [ ".", "." ],
      [ ".", "." ],
      [ "|000", "." ]
    ],
  ];

  gr = [
    [
      [ "r003", "T002", "r002" ],
      [ "r000", "T000", "r001" ]
    ]
  ];

  gr = [
    [
      [ "r003", "|011", "r002" ],
      [ "r000", "|011", "r001" ]
    ]
  ];

  gr = [
    [
      [ ".", "r003", "r002" ],
      [ ".", ".", "r001" ]
    ]
  ];

  //gr = gen_simple_grid(pgr);

  gr = [
    [
      [ "^000" ]
    ]
  ];

  gr = [
    [
      [ "d000", "d001", "d002", "d003" ],
      [ "d010", "d011", "d012", "d013" ],
      [ "d020", "d021", "d022", "d023" ],
      [ "d030", "d031", "d032", "d033" ]
    ],

    [
      [ "^000", "^001", "^002", "^003" ],
      [ "^010", "^011", "^012", "^013" ],
      [ "^020", "^021", "^022", "^023" ],
      [ "^030", "^031", "^032", "^033" ]
    ],
    [
      [ "|000", "|001", "|002", "|003" ],
      [ "|010", "|011", "|012", "|013" ],
      [ "|020", "|021", "|022", "|023" ],
      [ "|030", "|031", "|032", "|033" ]
    ],
    [
      [ "+000", "+001", "+002", "+003" ],
      [ "+010", "+011", "+012", "+013" ],
      [ "+020", "+021", "+022", "+023" ],
      [ "+030", "+031", "+032", "+033" ]
    ],
    [
      [ "r000", "r001", "r002", "r003" ],
      [ "r010", "r011", "r012", "r013" ],
      [ "r020", "r021", "r022", "r023" ],
      [ "r030", "r031", "r032", "r033" ]
    ],
    [
      [ "T000", "T001", "T002", "T003" ],
      [ "T010", "T011", "T012", "T013" ],
      [ "T020", "T021", "T022", "T023" ],
      [ "T030", "T031", "T032", "T033" ]
    ]
  ];


  /*
    "|": [  [ -_g_w/2,  1/2 + _g_epd, -1/2 ], [  _g_w/2,  1/2 + _g_epd, -1/2 ],
            [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ] ],

    "r": [  [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ],
            [ 1/2 + _g_epd,  _g_w/2, -1/2 ], [ 1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "+": [  [ -_g_w/2,  1/2 + _g_epd, -1/2 ], [  _g_w/2,  1/2 + _g_epd, -1/2 ],
            [ -_g_w/2, -1/2 - _g_epd, -1/2 ], [  _g_w/2, -1/2 - _g_epd, -1/2 ],
            [ -1/2 - _g_epd,  _g_w/2, -1/2 ], [ -1/2 - _g_epd, -_g_w/2, -1/2 ],
            [  1/2 + _g_epd,  _g_w/2, -1/2 ], [  1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "T": [  [  _g_w/2, -1/2 - _g_epd, -1/2 ], [ -_g_w/2, -1/2 - _g_epd, -1/2 ],
            [ -1/2 - _g_epd,  _g_w/2, -1/2 ], [ -1/2 - _g_epd, -_g_w/2, -1/2 ],
            [  1/2 + _g_epd,  _g_w/2, -1/2 ], [  1/2 + _g_epd, -_g_w/2, -1/2 ] ],

    "^": [  [  _g_w/2, -1/2 , -1/2 - _g_epd ], [ -_g_w/2, -1/2 , -1/2 - _g_epd ],
            [  _g_w/2,  1/2 ,  1/2 + _g_epd ], [ -_g_w/2,  1/2 ,  1/2 + _g_epd ] ]
  },
  */



  gr = [
    [
      [ ".", ".", "." ],
      [ ".", "^020", "." ],
      [ ".", "^000", "." ],
      [ ".", ".", "." ]
    ],
    [
      [ ".", "r003", "r002" ],
      [ ".", ".", "|000" ],
      [ ".", ".", "|000" ],
      [ ".", "r000", "r001" ]
    ],
  ];


  //??
  //Array(3)]
  //0: Array(3)
  //0: (3) ['r003', 'T022', 'r021']
  //1: (3) ['T003', '+020', 'T021']
  //2: (3) ['r023', 'T020', 'r001']
  //length: 3

  //gr = [ [ [ "r003", "T022", "r021" ] ] ];

  g_info.debug = gr;

  g_info.data.tri = [];

  let S = 60;
  let tx = g_info.cx,
      ty = g_info.cy,
      tz = g_info.cz;

  for (let zidx=0; zidx<gr.length; zidx++) {
    for (let yidx=0; yidx<gr[zidx].length; yidx++) {
      for (let xidx=0; xidx<gr[zidx][yidx].length; xidx++) {
        let u = gr[zidx][yidx][xidx];
        let template_u = u[0];
        if (template_u == '.') { continue; }

        let ent = g_template.rot_lib[u];

        //rot_lib[ukey] = { "m": [mx, my, mz], "r": [xidx, yidx, zidx ] };

        let _rx = Math.PI*ent.r[0]/2;
        let _ry = Math.PI*ent.r[1]/2;
        let _rz = Math.PI*ent.r[2]/2;

        let _tri = _template_rot_mov(g_template[template_u], _rx, _ry, _rz, xidx, yidx, zidx);
        _p_mul_mov(_tri, S, tx, ty, tz);
        g_info.data.tri.push(_tri);


        if (g_info.debug_leve > 3) {
          console.log(u, template_u);
        }
      }
    }
  }

  /*
  let ok = _template_rot_mov(g_template["|"], 0, 0, 0, 0, 0, 0);
  let ok1 = _template_rot_mov(g_template["|"], 0, 0, 0, 0, 1, 0);
  let ok2 = _template_rot_mov(g_template["|"], Math.PI, 0, Math.PI/2, 0, 2, 0);

  _p_mul_mov(ok, 40, tx, ty, tz);
  _p_mul_mov(ok1, 40, tx, ty, tz);
  _p_mul_mov(ok2, 40, tx, ty, tz);

  g_info.data.tri = [ ok, ok1, ok2 ];
  */

  //---


}

function init() {

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
  });

  _init();
  threejs_init();
  animate();
}


