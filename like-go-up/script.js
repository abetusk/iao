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

// NOTE (to self):
//
// can play with _g_h param (denom from 2 to 16)
// can play with _g_w param (denom from 2 to 8);
// color palette
// size
// symmetry
// light placement
//
// mouse interaction (point light)

// palette candidates:
// * dt01
// * dt02
// * dt11
// * dt12
// * dt13
// * jung_wolf
// * rohlfs_1G
// * rohlfs_1R
// * system.#02
// * system.#05
// * exposito
// * exposito_sub3
// * tundra1
// * tundra3
// * jud_playground (?)
// * verena (colorful, pastel)
// * ducci_d
// * iiso_zeitung
// * nowak (maybe with darker background)
// * rag-virupaksha
// * butterfly
// * sprague
// * spatial01
// * spatial02i
// * spatial03i
// * yuma_punk
// * cc245
// * present-correct
// * tsu_akasaka
// * florida_citrus
// * winter.night
// * rag-mysore
// * kov_07
//
// on the fence about:
// * cc232
// * exposito_sub3
// * iiso_daily
// * floratopia
// * book
// * one-dress
// * ducci_i
// * ducci_x
// * olympia
// * cako2_sub1
// * hersche
// * dt03 (with a modified black)
//



var g_info = {
  "PROJECT" : "like go up",
  "VERSION" : "0.1.0",

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "ready": false,

  "paused":false,

  "quiet":false,
  "grid_size": 8,

  "boundary_condition": "z",

  "download_filename":"like_go_up.png",

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

  "mesha" : [],
  "meshN" : 6,

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

  "t_rot": 0,
  "t_mov": 0,

  "tri_scale" : 100,

  "save_count": 0,

  "iter": 0,
  "iter_update": 10,
  "max_iter" : -1,

  "fudge": 1/1024,

  "mouse_x": -1000,
  "mouse_y": -1000,

  "_palette": [
    { 
      "name" : "monochrome",
      "colors" : [ "#111111", "#eeeeee" ],
      "background": "#777777"
    }
  ],

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

  "palette_idx": -1,
  "inverted_bg": false,
  "background_color": 0,

  "distribution_type": 0,
  "place_type" : 0,
  "place_size": 64,

  "speed_factor" : 1/(2*4096),

  "tile_width_denom_weight": {
    //"2": 1,
    //"3": 2,
    "4": 4,
    "5": 3,
    "6": 2,
    "7": 1,
    "8": 1
  },
  "tile_width": 1/4,

  "tile_height_denom_weight": {
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 5,
    "10": 4,
    "11": 3,
    "12": 2
    //"13": 1,
    //"14": 1,
    //"15": 1,
    //"16": 1
  },
  "tile_height": 1/8,

  "grid_weight" : {
    //DEBUG
     //"4":  1, "5":  1,


     "6": 30,
     //"6": 300000,
     "7": 30,
     //"7": 300000,
     "8": 30,
     //"8": 3000000,

    "9": 25,
    "10": 20,
    //"10": 20000,
    "11": 10,
    "12":  9, "13":  8, "14":  7, "15":  6,
    "16":  5, "17":  4, "18":  3, "19":  2,
    "20":  1
  },

  "view_counter" : 1,
  "view_counter_n" : 3,

  "view_prv" : 0,
  "view_nxt" : 1,
  "time_prv": -1,

  "data": {
    "grid": [],
    "info": [],
    "tri": {}
  },

  "n_point_light": 4,

  "debug_line": false,
  "debug_cube": [],
  "debug_cube_pos": [],

  "debug_level": 0,

  "material_type" : "toon"

};

// template tiles.
// These will be rotated to build the whole tile library.
// The endpoints are there so that we can weed out duplicates
// (from our brute force rotate) and so we can see how each
// tile can join with the others.
//
let g_template = {

  "admissible_pos" : [
    { "dv_key" : "-1:0:0" , "dv": [-1,  0,  0] },
    { "dv_key" : "1:0:0"  , "dv": [ 1,  0,  0] },

    { "dv_key" : "0:-1:0" , "dv": [ 0, -1,  0] },
    { "dv_key" : "0:1:0"  , "dv": [ 0,  1,  0] },

    { "dv_key" : "0:0:-1" , "dv": [ 0,  0, -1] },
    { "dv_key" : "0:0:1"  , "dv": [ 0,  0,  1] }
  ],

  "oppo" :  {
    "-1:0:0" :  "1:0:0",
    "1:0:0"  : "-1:0:0",

    "0:-1:0" :  "0:1:0",
    "0:1:0"  : "0:-1:0",

    "0:0:-1" : "0:0:1",
    "0:0:1"  : "0:0:-1"
  },

  "weight": {
    //"d": 0,
    ".": 1,
    "|": 1,
    "+": 1,
    "T": 1,
    "r": 1,
    "p": 1,
    "^": 1
  },

  "pdf":  {
    //"d": -1,
    ".": -1,
    "|": -1,
    "+": -1,
    "T": -1,
    "r": -1,
    "p": -1,
    "^": -1
  },

  "cdf": [],

  // enpoints tell how we can connect to the other tiles
  //
  // these are flush with the interface plane but in a rectangular pattern, so
  // four points to an interface.
  //
  // The null ('.') and debug ('d') tiles don't have any interfaces
  //
  "endpoint": {},

  "|" : [],
  "p" : [],
  "r" : [],
  "^" : [],
  "+" : [],
  "T" : []

};

function weight2pd(w) {
  let S = 0.0;
  let pdf = {};
  let cdf = [];

  for (key in w) { S += w[key]; }

  let cdf_s = 0.0;
  for (key in w) {
    pdf[key] = w[key] / S;

    cdf_s += pdf[key];
    cdf.push( {"key": key, "s": cdf_s} );
  }

  return { "pdf": pdf, "cdf": cdf, "w": w };
}

function rnd_cdf(cdf, p) {
  p = ((typeof p === "undefined") ? fxrand() : p);
  for (let ii=0; ii<cdf.length; ii++) {
    if (p<cdf[ii].s) {
      return cdf[ii].key;
    }
  }
  return cdf[ cdf.length-1 ].key;
}

// the geometry for some of the more copmlex shapes is a little
// too involved to list out statically so do it here.
//
function init_template() {

  let _g_w = g_info.tile_width;
  let _g_h = g_info.tile_height;

  let _g_epd = 0;
  let _plat_del = 0;
  let _p_w = _g_w + _plat_del;


  let S = 0;
  for (let _tsn in g_template.weight) {
    S += g_template.weight[_tsn];
  }

  let cdf_s = 0;
  for (let _tsn in g_template.weight) {
    g_template.pdf[_tsn] = g_template.weight[_tsn]/S;
    cdf_s += g_template.pdf[_tsn];
    g_template.cdf.push( { "tile_code": _tsn, "s": cdf_s } );
  }
  g_template.cdf[ g_template.cdf.length-1 ].s = 1.01;

  // enpoints tell how we can connect to the other tiles
  //
  // these are flush with the interface plane but in a rectangular pattern, so
  // four points to an interface.
  //
  // The null ('.') and debug ('d') tiles don't have any interfaces
  //
  g_template["endpoint"] = {

    ".": [],

    //"d": [],

    "|": [
      [ -_g_w/2, -1/2, -_g_h/2 ], [ _g_w/2, -1/2, -_g_h/2 ],
      [ -_g_w/2, -1/2, +_g_h/2 ], [ _g_w/2, -1/2, +_g_h/2 ],

      [ -_g_w/2,  1/2, -_g_h/2 ], [  _g_w/2,  1/2, -_g_h/2 ],
      [ -_g_w/2,  1/2, +_g_h/2 ], [  _g_w/2,  1/2, +_g_h/2 ]
    ],

    "p": [
      [ -_g_w/2, -1/2, -_g_h/2 ], [  _g_w/2, -1/2, -_g_h/2 ],
      [ -_g_w/2, -1/2, +_g_h/2 ], [  _g_w/2, -1/2, +_g_h/2 ]
    ],

    "r": [
      [ -_g_w/2, -1/2, -_g_h/2 ], [  _g_w/2, -1/2, -_g_h/2 ],
      [ -_g_w/2, -1/2, +_g_h/2 ], [  _g_w/2, -1/2, +_g_h/2 ],

      [  1/2,  _g_w/2, -_g_h/2 ], [  1/2, -_g_w/2, -_g_h/2 ],
      [  1/2,  _g_w/2, +_g_h/2 ], [  1/2, -_g_w/2, +_g_h/2 ]
    ],

    "+": [
      [ -_g_w/2,  1/2, -_g_h/2 ], [  _g_w/2,  1/2, -_g_h/2 ],
      [ -_g_w/2,  1/2, +_g_h/2 ], [  _g_w/2,  1/2, +_g_h/2 ],

      [ -_g_w/2, -1/2, -_g_h/2 ], [  _g_w/2, -1/2, -_g_h/2 ],
      [ -_g_w/2, -1/2, +_g_h/2 ], [  _g_w/2, -1/2, +_g_h/2 ],

      [  1/2,  _g_w/2, -_g_h/2 ], [  1/2, -_g_w/2, -_g_h/2 ],
      [  1/2,  _g_w/2, +_g_h/2 ], [  1/2, -_g_w/2, +_g_h/2 ],

      [ -1/2,  _g_w/2, -_g_h/2 ], [ -1/2, -_g_w/2, -_g_h/2 ],
      [ -1/2,  _g_w/2, +_g_h/2 ], [ -1/2, -_g_w/2, +_g_h/2 ]
    ],

    "T": [
      [  _g_w/2, -1/2, -_g_h/2 ], [ -_g_w/2, -1/2, -_g_h/2 ],
      [  _g_w/2, -1/2, +_g_h/2 ], [ -_g_w/2, -1/2, +_g_h/2 ],

      [ -1/2,  _g_w/2, -_g_h/2 ], [ -1/2, -_g_w/2, -_g_h/2 ],
      [ -1/2,  _g_w/2, +_g_h/2 ], [ -1/2, -_g_w/2, +_g_h/2 ],

      [  1/2,  _g_w/2, -_g_h/2 ], [  1/2, -_g_w/2, -_g_h/2 ],
      [  1/2,  _g_w/2, +_g_h/2 ], [  1/2, -_g_w/2, +_g_h/2 ]
    ],

    "^": [
      [  _g_w/2, -1/2, -_g_h/2 ], [ -_g_w/2, -1/2, -_g_h/2 ],
      [  _g_w/2, -1/2, +_g_h/2 ], [ -_g_w/2, -1/2, +_g_h/2 ],

      [  _g_w/2,  +_g_h/2,  1/2 ], [ -_g_w/2, +_g_h/2,  1/2 ],
      [  _g_w/2,  -_g_h/2,  1/2 ], [ -_g_w/2, -_g_h/2,  1/2 ]

    ]

  };

  // simple plane for debuging
  //
  let debug_plane = false;
  if (debug_plane) {
    g_template["d"] = [
      -1/2,  1/2, 0,  -1/2, -1/2, 0,    1/2,  1/2, 0,
      -1/2, -1/2, 0,   1/2, -1/2, 0,    1/2,  1/2, 0,
      -1/2,  1/2, 0,   1/2,  1/2, 0,   -1/2, -1/2, 0,
      -1/2, -1/2, 0,   1/2,  1/2, 0,    1/2, -1/2, 0
    ];
  }

  g_template["|"] = [

    // front panel
    //
    -_g_w/2,  1/2, -_g_h/2,  _g_w/2,  1/2, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,
     _g_w/2,  1/2, -_g_h/2,  _g_w/2, -1/2, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,

    // back panel
    //
    -_g_w/2,  1/2, +_g_h/2, -_g_w/2, -1/2, +_g_h/2,   _g_w/2,  1/2, +_g_h/2,
     _g_w/2,  1/2, +_g_h/2, -_g_w/2, -1/2, +_g_h/2,   _g_w/2, -1/2, +_g_h/2,

    // left side stripe
    //
    -_g_w/2,  1/2, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,  -_g_w/2, -1/2, +_g_h/2,
    -_g_w/2,  1/2, -_g_h/2,   -_g_w/2, -1/2, +_g_h/2,  -_g_w/2,  1/2, +_g_h/2,

    // right side stripe
    //
     _g_w/2,  1/2, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,  _g_w/2, -1/2, -_g_h/2,
     _g_w/2,  1/2, -_g_h/2,   _g_w/2,  1/2, +_g_h/2,  _g_w/2, -1/2, +_g_h/2,

    // back cap (optional)
    //
    -_g_w/2,  1/2, -_g_h/2,   -_g_w/2,  1/2, +_g_h/2,   _g_w/2,  1/2, -_g_h/2,
     _g_w/2,  1/2, -_g_h/2,   -_g_w/2,  1/2, +_g_h/2,   _g_w/2,  1/2, +_g_h/2,

    // front cap (optional)
    //
    -_g_w/2, -1/2, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,    -_g_w/2, -1/2, +_g_h/2,
     _g_w/2, -1/2, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,    -_g_w/2, -1/2, -_g_h/2

  ];


  g_template["p"] =  [

    // front panel
    //
    -_p_w/2,    0, -_g_h/2,  _p_w/2,    0, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,
     _p_w/2,    0, -_g_h/2,  _g_w/2, -1/2, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,

    // back panel
    //
    -_p_w/2,    0, +_g_h/2, -_g_w/2, -1/2, +_g_h/2,   _p_w/2,    0, +_g_h/2,
     _p_w/2,    0, +_g_h/2, -_g_w/2, -1/2, +_g_h/2,   _g_w/2, -1/2, +_g_h/2,

    // left side stripe
    //
    -_p_w/2,    0, -_g_h/2,   -_g_w/2, -1/2, -_g_h/2,  -_g_w/2, -1/2, +_g_h/2,
    -_p_w/2,    0, -_g_h/2,   -_g_w/2, -1/2, +_g_h/2,  -_p_w/2,    0, +_g_h/2,

    // right side stripe
    //
     _p_w/2,    0, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,  _g_w/2, -1/2, -_g_h/2,
     _p_w/2,    0, -_g_h/2,   _p_w/2,    0, +_g_h/2,  _g_w/2, -1/2, +_g_h/2,

    // back cap (not optional anymore);
    //
    -_p_w/2,    0, -_g_h/2,   -_p_w/2,    0, +_g_h/2,   _p_w/2,    0, -_g_h/2,
     _p_w/2,    0, -_g_h/2,   -_p_w/2,    0, +_g_h/2,   _p_w/2,    0, +_g_h/2,

    // front cap (optional)
    //
    -_g_w/2, -1/2, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,    -_g_w/2, -1/2, +_g_h/2,
     _g_w/2, -1/2, -_g_h/2,   _g_w/2, -1/2, +_g_h/2,    -_g_w/2, -1/2, -_g_h/2

  ];



  // 'r'
  // top
  //

  // bottom square
  //
  let fr = [];
  let tri = [];
  tri.push( [ -_g_w/2, -1/2,    -_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] );
  tri.push( [  _g_w/2, -1/2,    -_g_h/2 ] );
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -_g_h/2 ] );
  tri.push( [ -_g_w/2, -_g_w/2, -_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_g_w/2, -_g_w/2, -_g_h/2 ] );
  tri.push( [  _g_w/2,  _g_w/2, -_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -_g_h/2 ] )
  tri.push( [  1/2,     _g_w/2, -_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  1/2,    -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, -_g_h/2 ] )
  fr.push(tri);

  //--

  // bottom
  //

  // bottom square
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2,    +_g_h/2 ] );
  tri.push( [  _g_w/2, -1/2,    +_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, +_g_h/2 ] );
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    +_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, +_g_h/2 ] );
  tri.push( [ -_g_w/2, -_g_w/2, +_g_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_g_w/2, -_g_w/2, +_g_h/2 ] );
  tri.push( [  _g_w/2, -_g_w/2, +_g_h/2 ] );
  tri.push( [  _g_w/2,  _g_w/2, +_g_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_g_w/2, +_g_h/2 ] )
  tri.push( [  1/2,     _g_w/2, +_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  1/2,    -_g_w/2, +_g_h/2 ] )
  tri.push( [  _g_w/2,  _g_w/2, +_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, +_g_h/2 ] )
  fr.push(tri);

  //--

  // front edge
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2, +_g_h/2 ] )
  tri.push( [ -_g_w/2, -1/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2, +_g_h/2 ] )
  fr.push(tri);

  // front right edge
  //
  tri = [];
  tri.push( [  _g_w/2, -1/2,    -_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -1/2,    +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _g_w/2, -1/2,    +_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2, -_g_w/2, +_g_h/2 ] )
  fr.push(tri);

  // front left edge
  //
  tri = [];
  tri.push( [ -_g_w/2, -1/2,    -_g_h/2 ] )
  tri.push( [ -_g_w/2, -1/2,    +_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, -_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_g_w/2, -1/2,    +_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, +_g_h/2 ] )
  tri.push( [ -_g_w/2, -_g_w/2, -_g_h/2 ] )
  fr.push(tri);

  //---

  // right edge
  //
  tri = [];
  tri.push( [ 1/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ 1/2, -_g_w/2, +_g_h/2 ] )
  tri.push( [ 1/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,  _g_w/2, +_g_h/2 ] )
  fr.push(tri);


  // right up edge
  //
  tri = [];
  tri.push( [ 1/2,     _g_w/2, -_g_h/2 ] )
  tri.push( [ _g_w/2,  _g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,     _g_w/2, +_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ _g_w/2,  _g_w/2, -_g_h/2 ] )
  tri.push( [ _g_w/2,  _g_w/2, +_g_h/2 ] )
  tri.push( [ 1/2,     _g_w/2, +_g_h/2 ] )
  fr.push(tri);

  // right down edge
  //
  tri = [];
  tri.push( [ 1/2,    -_g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,    -_g_w/2, +_g_h/2 ] )
  tri.push( [ _g_w/2, -_g_w/2, -_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ _g_w/2, -_g_w/2, -_g_h/2 ] )
  tri.push( [ 1/2,    -_g_w/2, +_g_h/2 ] )
  tri.push( [ _g_w/2, -_g_w/2, +_g_h/2 ] )
  fr.push(tri);

  // diagnoal connecting edge
  //
  tri = [];
  tri.push( [ -_g_w/2,  -_g_w/2, -_g_h/2 ] )
  tri.push( [  _g_w/2,   _g_w/2, +_g_h/2 ] )
  tri.push( [  _g_w/2,   _g_w/2, -_g_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _g_w/2,   _g_w/2, +_g_h/2 ] )
  tri.push( [ -_g_w/2,  -_g_w/2, -_g_h/2 ] )
  tri.push( [ -_g_w/2,  -_g_w/2, +_g_h/2 ] )
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



  //TODO
  //---
  //
  // stairs (^)
  //
  //     ^
  //     |           x-
  //     z         .xx-
  //     |         xxx
  //     ._y_>    -xx.
  //    /         -x
  //   x
  //  /
  // L

  let parity = 1;

  let st = [];
  let _st_n = Math.floor( (2/_g_h) + _g_h );
  let _st_m = Math.floor( (1/_g_h) + _g_h );

  let _st_ds = 1/_st_n;
  let _st_dy = 1/_st_n;
  let _st_dz = 1/_st_n;

  let _r = {};
  let dx=0, dy=0, dz=0;

  // front facing step
  //
  for (let i=0; i<(_st_m-1); i++) {
    dx = 0;
    dy = -0.5 + (i*_st_ds);
    dz = ((3/2)*_st_ds) + (i*_st_ds);
    _r = _3rect_xz( _g_w, _st_ds,
      dx, dy, dz, 1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // up facing top step
    //
    dx = 0;
    dy = -0.5 + ((1/2)*_st_ds) + (i*_st_ds);
    dz = (2*_st_ds) + (i*_st_ds);
    _r = _3rect_xy( _g_w, _st_ds,
      dx, dy, dz, 1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // right side stair
    //
    dx = _g_w/2;
    dy = -0.5 + _st_ds/2 + i*_st_ds;
    dz = +_st_ds/2 + i*_st_ds;
    _r = _3rect_zy(
      3*_st_ds, _st_ds,
      dx, dy, dz,
      parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // left side stair 
    //
    dx = -_g_w/2;
    dy = -0.5 + _st_ds/2 + i*_st_ds;
    dz = +_st_ds/2 + i*_st_ds;
    _r = _3rect_zy(
      3*_st_ds, _st_ds,
      dx, dy, dz,
      1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  }

  for (let i=0; i<(_st_m+1); i++) {

    // back facing step
    //
    dx = 0;
    dy = -0.5 + _st_ds + (i*_st_ds);
    dz =  - ((1/2)*_st_ds) + (i*_st_ds);
    _r = _3rect_xz( _g_w, _st_ds,
      dx, dy, dz, parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // bottom facing bottom step
    //
    dx = 0;
    dy = -0.5 + ((1/2)*_st_ds) + (i*_st_ds);
    dz =  - (_st_ds) + (i*_st_ds);
    _r = _3rect_xy( _g_w, _st_ds,
      dx, dy, dz, parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  }

  // right side stair
  //
  dx = _g_w/2;
  dy =  - (_st_ds/2);
  dz = 0.5 - _st_ds;
  _r = _3rect_zy(
    2*_st_ds, _st_ds,
    dx, dy, dz,
    parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  dx = _g_w/2;
  dy =  + (_st_ds/2);
  dz = 0.5 - (_st_ds/2);
  _r = _3rect_zy(
    1*_st_ds, _st_ds,
    dx, dy, dz,
    parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  // left side stair
  //
  dx = -_g_w/2;
  dy = - (_st_ds/2);
  dz = 0.5 - _st_ds;
  _r = _3rect_zy(
    2*_st_ds, _st_ds,
    dx, dy, dz,
    1-parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  dx = -_g_w/2;
  dy = + (_st_ds/2);
  dz = 0.5 - (_st_ds/2);
  _r = _3rect_zy(
    1*_st_ds, _st_ds,
    dx, dy, dz,
    1-parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }


  // optional end caps
  //
  let _st_endcap = true;
  if (_st_endcap) {
    let _r = {};
    let dx=0, dy=0, dz=0;

    // front endcap
    //
    _r = _3rect_xz( _g_w, _g_h,
      0, -0.5, 0, 0);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // top endcap
    //
    _r = _3rect_xy( _g_w, _g_h,
      0, 0, 0.5, 0);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }
  }


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

  _r = _3rect_xy( 1, _g_w, 0, 0, -_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy( 1, _g_w, 0, 0, +_g_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, +_g_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // bottom and top
  //
  _r = _3rect_xz( _g_w, _g_h, 0, -1/2, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_xz( 1, _g_h, 0, _g_w/2, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // left and right
  //
  _r = _3rect_zy( _g_h, _g_w, 1/2, 0, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_zy( _g_h, _g_w,-1/2, 0, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // inner caps
  //
  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -1/2+(1-_g_w)/4, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -1/2+(1-_g_w)/4, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xz( (1-_g_w)/2, _g_h, -1/2+(1-_g_w)/4, -_g_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xz( (1-_g_w)/2, _g_h,  1/2-(1-_g_w)/4, -_g_w/2, 0, 0);
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

  _r = _3rect_xy( 1, _g_w, 0, 0, -_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, -_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0,  1/2 - (1-_g_w)/4, -_g_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy( 1, _g_w, 0, 0, +_g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0, -1/2 + (1-_g_w)/4, +_g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xy(_g_w, (1-_g_w)/2, 0,  1/2 - (1-_g_w)/4, +_g_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // bottom and top
  //
  _r = _3rect_xz( _g_w, _g_h, 0, -1/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( _g_w, _g_h, 0,  1/2, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // left and right
  //
  _r = _3rect_zy( _g_h, _g_w,  1/2, 0, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _g_h, _g_w, -1/2, 0, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // middle caps
  //
  let _mc = (1/2) - ((1-_g_w)/4);
  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2, -_mc, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2, -_mc, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _g_h, (1-_g_w)/2, -_g_w/2,  _mc, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _g_h, (1-_g_w)/2,  _g_w/2,  _mc, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //--

  _r = _3rect_xz( (1-_g_w)/2, _g_h, -_mc, -_g_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_g_w)/2, _g_h,  _mc, -_g_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xz( (1-_g_w)/2, _g_h, -_mc,  _g_w/2, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_g_w)/2, _g_h,  _mc,  _g_w/2, 0, 1);
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
  if (!g_info.quiet) {
    console.log("WARNING: USING BUILT-IN Math.random() INSTEAD OF fxrand()");
  }

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
function _rndpow(s, x0, x1) {
  if ((typeof x0 !== "undefined") && (typeof x1 === "undefined")) {
    x1 = x0;
    x0 = 0;
  }
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
  //console.log(" p   - pause");
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

  let bg = parseInt('070707', 16);
  if ("background" in g_info.palette_choice) {
    bg = g_info.palette_choice.background;
    /*
    if ((g_info.palette[ g_info.palette_idx].background != '#fff') &&
        (g_info.palette[ g_info.palette_idx].background != '#ffffff')) {
      bg = parseInt(g_info.palette[ g_info.palette_idx ].background.slice(1), 16);
    }
    */
  }
  if (fxrand() < 0.5) {
    //let pal = g_info.palette[ g_info.palette_idx
    //let bg_pal_idx _irnd( g_info.pal
    //bg = 
  }

  //if (g_info.inverted_bg) { bg = parseInt('ffffff', 16) - bg; }
  g_info.background_color = bg;

  //DEBUG
  //bg = parseInt('0a0a0a', 16);

  g_info.scene.background = new THREE.Color( bg );
  g_info.scene.fog = new THREE.Fog( bg, 16, 1024);

  g_info.renderer = new THREE.WebGLRenderer({ "antialias": true });
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;

  let directional_light = false;
  if (directional_light) {
    //g_info.light.push(new THREE.DirectionalLight( 0xffffff, 1.5 ));
    g_info.light.push(new THREE.DirectionalLight( 0xffffff, 1.5 ));
    g_info.light[0].position.set( 1, 1, 1 ).normalize();

    // SHADOW
    //
    let shadow = false;
    if (shadow) {
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
    }

    g_info.scene.add( g_info.light[0] );
  }

  //
  let sz = g_info.renderer.getDrawingBufferSize( new THREE.Vector2() );
  //let _wglrt = new THREE.WebGLRenderTarget( sz.width, sz.height, { "samples":2 } );
  let _wglrt = new THREE.WebGLRenderTarget( sz.width, sz.height, { "samples": 2} );


  let composer = new POSTPROCESSING.EffectComposer(g_info.renderer, _wglrt);

  let renderpass = new POSTPROCESSING.RenderPass(g_info.scene, g_info.camera);

  let bloom_opt = {
    //"height": h/2,
    //"width": w/2,
    "intensity": 1,
    "kernelSize": 2
  };

  let fxaa_opt = {
    //"subpixelQuality": 1,
    //"samples": 4
  }

  let vignette_opt = {

    // how sharp the falloff is (1 hard cutoff, 0 no cutoff)
    //
    "offset": 0.5,

    // how dark it gets at edges (1 full, 0 none);
    //
    "darkness": 0.5
  }

                                              // strength, kernel size, sigma, blur rendertarget resolution
  //let bloomeffect = new POSTPROCESSING.BloomEffect(100, 205, 40, 2056);
  let bloomeffect = new POSTPROCESSING.BloomEffect(bloom_opt);
  let bloompass = new POSTPROCESSING.EffectPass(g_info.camera, bloomeffect);
  g_info.bloom_effect = bloomeffect;
  g_info.bloom_pass = bloompass;

  let fxaaeffect = new POSTPROCESSING.FXAAEffect(fxaa_opt);
  let fxaapass = new POSTPROCESSING.EffectPass(g_info.camera, fxaaeffect);
  g_info.fxaa_effect = fxaaeffect;
  g_info.fxaa_pass = fxaapass;

  let vignette_effect = new POSTPROCESSING.VignetteEffect(vignette_opt);
  let vignette_pass = new POSTPROCESSING.EffectPass(g_info.camera, vignette_effect);
  g_info.vignette_effect = vignette_effect;
  g_info.vignette_pass = vignette_pass;

  composer.addPass(renderpass);
  composer.addPass(bloompass);
  composer.addPass(fxaapass);

  composer.addPass(vignette_pass);

  g_info.composer = composer;
  g_info.render_pass = renderpass;

  g_info.container.appendChild( g_info.renderer.domElement );

  window.addEventListener( 'resize', window_resize );
  window.addEventListener( 'mousemove', mouse_move );
  window.addEventListener( 'wheel', mouse_wheel );
}

function threejs_scene_init() {


  //---

  //let intensity_range = 3.75;
  //let intensity_max = 4;

  let intensity_max_val = [
    4,4,4,4,
    4,3,2,2,1.5];

  //let intensity_max = 2;
  let intensity_max = intensity_max_val[ g_info.n_point_light ];
  let intensity_min = 0.75;
  let intensity_range = intensity_max - intensity_min;

  let point_light = [];

  //let n_point_light = 8;
  //let n_point_light = _irnd(4,8);
  let n_point_light = g_info.n_point_light;
  let _ldist = 4*g_info.tri_scale * g_info.grid_size;
  //let ds = [1600,1600,3200];
  //let ds = [800,800,800];
  //let ds = [200,200,1000];
  let _B = g_info.tri_scale * g_info.grid_size;
  let ds = [ 2*_B, 2*_B, 2*_B ];
  //let ds = [8000, 8000, 8000];
  let pld = [],
      pli = [],
      plc = [],
      plld = [];
  for (let ii=0; ii<n_point_light; ii++) {
    pld.push( [ (fxrand()-0.5)*ds[0], (fxrand()-0.5)*ds[1], (fxrand()-0.5)*ds[2] ] );
    //pli.push( (3/n_point_light) - (fxrand()/n_point_light) );

    //WIP
    //pli.push( intensity_min + fxrand()*intensity_range );
    //pli.push( _rndpow(0.5, intensity_min, intensity_min + intensity_range) );
    pli.push( __rndpow(3)*intensity_range + intensity_min );

    plld.push(_ldist);
    plc.push(0xffffff);
  }
  //pli[0] = 3;
  //pld.push([0,0,0]);

  //let pld = [ [ds, 0, 0], [0, ds, 0], [0, 0, ds], [0.25, 1.5,1.5] ];
  //let plc = [ 0xff0000, 0x00ff00, 0x0000ff, 0xffffff ];
  //let plc = [ 0x20357e, 0xf44242, 0xffffff, 0xffffff ]
  //let plc = [ 0xffffff, 0xffffff, 0xffffff, 0xffffff ]
  //let pli = [ 8, 8, 1, 1 ];
  //let pli = [ 2, 2, 2, 1 ];
  //let pll = [ dl, dl, dl, 100 ];


  for (let ii=0; ii<pld.length; ii++) {
    point_light.push(new THREE.PointLight( plc[ii], pli[ii], plld[ii], 2));
    point_light[ii].position.set( pld[ii][0], pld[ii][1], pld[ii][2] );
    g_info.scene.add( point_light[ii] );
  }

  g_info["point_light"] = point_light;
  g_info["point_light_info"]  = { "pos": pld, "intensity": pli, "color": plc, "dist": plld };

  /*
  point_light[0].position.set( ds, 0, 0 );
  g_info.scene.add( point_light[0] );

  point_light.push(new THREE.PointLight( 0x00ff00, 4, 1000 ));
  point_light[1].position.set( 0, ds, 0 );
  g_info.scene.add( point_light[1] );

  point_light.push(new THREE.PointLight( 0x0000ff, 4, 1000 ));
  point_light[2].position.set( 0, 0, ds );
  g_info.scene.add( point_light[2] );

  point_light.push(new THREE.PointLight( 0xffffff, 1, 1000 ));
  point_light[3].position.set( 0, 0, 0 );
  g_info.scene.add( point_light[3] );
  */

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

  let pal = g_info.palette[ g_info.palette_idx ];
  let color_idx = _irnd(pal.colors.length);

  //const d = 12,
  const d = g_info.tri_scale,
        d2 = 0;
        //d2 = d/2;
  for (let idx=0; idx<tri_vf.length; idx++) {

    //let pal = g_info.palette[ g_info.palette_idx ];
    //let color_hex = pal.colors[ _irnd(pal.colors.length) ];

    color_idx = g_info.data.tri_color_idx[idx] % pal.colors.length;
    let color_hex = pal.colors[ color_idx ];

    //DEBUG
    //color_hex = '#ffffff';

    let rgb = _hex2rgb(color_hex );
    color.setRGB( rgb.r/255, rgb.g/255, rgb.b/255 );

    let alpha = 1;

    for ( let i = 0; i < tri_vf[idx].length; i += 9 ) {

      //const x = -200;
      //const y = -200;
      //const z = -200;

      const x = 0;
      const y = 0;
      const z = 0;


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

  /*
  g_info.renderer = new THREE.WebGLRenderer({ "antialias": true });
  g_info.renderer.setPixelRatio( window.devicePixelRatio );
  g_info.renderer.setSize( window.innerWidth, window.innerHeight );
  g_info.renderer.outputEncoding = THREE.sRGBEncoding;
  */

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

  // wip
  //
  if (g_info.boundary_condition != 'n') {
    for (let ii=0; ii<g_info.meshN; ii++) {
      g_info.mesha.push( new THREE.Mesh( g_info.geometry, g_info.material ) );
      g_info.scene.add( g_info.mesha[ii] );
    }
  }

  /*

  //WIP
  //
  let sz = g_info.renderer.getDrawingBufferSize( new THREE.Vector2() );
  //let _wglrt = new THREE.WebGLRenderTarget( sz.width, sz.height, { "samples":2 } );
  let _wglrt = new THREE.WebGLRenderTarget( sz.width, sz.height, { "samples":4 } );


  let composer = new POSTPROCESSING.EffectComposer(g_info.renderer, _wglrt);

  let renderpass = new POSTPROCESSING.RenderPass(g_info.scene, g_info.camera);

  let bloomeffect = new POSTPROCESSING.BloomEffect(100, 205, 40, 2056);
  let bloompass = new POSTPROCESSING.EffectPass(g_info.camera, bloomeffect);

  let fxaaeffect = new POSTPROCESSING.FXAAEffect();
  let fxaapass = new POSTPROCESSING.EffectPass(g_info.camera, fxaaeffect);

  composer.addPass(renderpass);
  composer.addPass(bloompass);
  composer.addPass(fxaapass);

  g_info.composer = composer;
  g_info.render_pass = renderpass;
  g_info.bloom_effect = bloomeffect;
  g_info.bloom_pass = bloompass;
  g_info.fxaa_effect = fxaaeffect;
  g_info.fxaa_pass = fxaapass;

  g_info.container.appendChild( g_info.renderer.domElement );

  window.addEventListener( 'resize', window_resize );
  window.addEventListener( 'mousemove', mouse_move );
  window.addEventListener( 'wheel', mouse_wheel );
  */
}

// mouse_x and mouse_y renomarlized to be +-1 of each
// dimension.
//
//          1
//  -1            1
//         -1
//  
function mouse_move(ev) {
  ev.preventDefault();

  if (!g_info.ready) { return; }

  g_info.mouse_x =  ((ev.clientX / window.innerWidth)  * 2) - 1;
  g_info.mouse_y = -((ev.clientY / window.innerHeight) * 2) + 1;

  if (g_info.point_light.length>0) {
    g_info.point_light[0].position.x = g_info.mouse_x *1000;
    g_info.point_light[0].position.y = g_info.mouse_y *1000;
    g_info.point_light[0].position.z = 400;
  }
}

function mouse_wheel(ev) {
  //ev.preventDefault();

  if (!g_info.ready) { return; }

  if (g_info.point_light.length>0) {
    let _del_i = -ev.deltaY/500;
    let _intensity = g_info.point_light[0].intensity;
    let min_intensity = 0.125;
    let max_intensity = 4;
    _intensity += _del_i;
    if ((_intensity > min_intensity) &&
        (_intensity < max_intensity)) {
      g_info.point_light[0].intensity = _intensity;

    }
  }


}

function window_resize() {

  g_info.aspect = window.innerWidth / window.innerHeight;

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


}

//---

function animate() {

  render();
  requestAnimationFrame( animate );

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

function render_n() {



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

  //fiddling
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
      //D = 1.75;
      //D = 1.387;

      if (view_prv == 0) {
        mp0 = m4.xRotation((1-_t_rem)*Math.PI/D);
        mp1 = m4.yRotation((1-_t_rem)*Math.PI/D);
      }

    //!!!!
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


    //let mr = m4.multiply(mrp, mrn);

    g_info.t_mov += (1/2048);
    g_info.t_rot += (1/8192)*Math.PI;

    if (g_info.t_rot > (2*Math.PI)) { g_info.t_rot -= 2*Math.PI; }

    let mZ = m4.zRotation( g_info.t_rot );
    //let mZs = m4.t2( 0, 0, g_info.t_rot*1000 );
    let mZs = m4.t2(0,0,0);
    //let mZs = m4.translation( 0, 0, g_info.t_rot*30);
    let mr = m4.multiply( mZs, m4.multiply( mZ, m4.multiply(mrp, mrn) ) );

    let m = new THREE.Matrix4();
    m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
           mr[ 4], mr[ 5], mr[ 6], mr[ 7],
           mr[ 8], mr[ 9], mr[10], mr[11],
           mr[12], mr[13], mr[14], mr[15] );


    g_info.mesh.position.x = 0;
    g_info.mesh.position.y = 0;
    g_info.mesh.position.z = 0;
    g_info.mesh.rotation.x = 0;
    g_info.mesh.rotation.y = 0;
    g_info.mesh.rotation.z = 0;
    g_info.mesh.applyMatrix4(m);

    for (let ii=0; ii<g_info.mesha.length; ii++) {

      //EXPERIMENTAL
      //
      let _di = ( ((ii%2) == 0) ? ((ii/2)+1) : ( -((ii-1)/2) - 1) );
      //let _sz = 12.7;
      let _sz = 15.6;
      //let _sz = 17;
      let _scale = 100;
      //let mmov = m4.t2(0, 0, (ii+1)*(_sz*_scale));
      let mmov = m4.t2(0, 0, _di*(_sz*_scale));
      let mm = m4.multiply( mmov, mr );
      let _m = new THREE.Matrix4();
      _m.set( mm[ 0], mm[ 1], mm[ 2], mm[ 3],
              mm[ 4], mm[ 5], mm[ 6], mm[ 7],
              mm[ 8], mm[ 9], mm[10], mm[11],
              mm[12], mm[13], mm[14], mm[15] );

      g_info.mesha[ii].position.x = 0;
      g_info.mesha[ii].position.y = 0;
      g_info.mesha[ii].position.z = 0;
      g_info.mesha[ii].rotation.x = 0;
      g_info.mesha[ii].rotation.y = 0;
      g_info.mesha[ii].rotation.z = 0;
      g_info.mesha[ii].applyMatrix4(_m);

    }

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

    g_info.light[i].position.set( _x, _y, _z ).normalize();
  }


  if ("composer" in g_info) {
    g_info.composer.render();
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

function render_zy() {
  render_z();
}

function render_z() {

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
      //D = 1.75;
      //D = 1.387;

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


    //let mr = m4.multiply(mrp, mrn);

    g_info.t_mov += (1/2);
    if (g_info.t_mov > (g_info.grid_size*g_info.tri_scale)) {
      g_info.t_mov -= (g_info.grid_size*g_info.tri_scale);
    }

    g_info.t_rot += (1/8192)*Math.PI;
    if (g_info.t_rot > (2*Math.PI)) {
      g_info.t_rot -= 2*Math.PI;
    }

    let mZ = m4.zRotation( g_info.t_rot );
    let mZs = m4.t2( 0, 0, g_info.t_mov);
    let mr = m4.multiply( mZs, m4.multiply( mZ, m4.multiply(mrp, mrn) ) );

    let m = new THREE.Matrix4();
    m.set( mr[ 0], mr[ 1], mr[ 2], mr[ 3],
           mr[ 4], mr[ 5], mr[ 6], mr[ 7],
           mr[ 8], mr[ 9], mr[10], mr[11],
           mr[12], mr[13], mr[14], mr[15] );


    g_info.mesh.position.x = 0;
    g_info.mesh.position.y = 0;
    g_info.mesh.position.z = 0;
    g_info.mesh.rotation.x = 0;
    g_info.mesh.rotation.y = 0;
    g_info.mesh.rotation.z = 0;
    g_info.mesh.applyMatrix4(m);

    for (let ii=0; ii<g_info.mesha.length; ii++) {

      //EXPERIMENTAL
      //
      let _di = ( ((ii%2) == 0) ? ((ii/2)+1) : ( -((ii-1)/2) - 1) );
      //let _sz = 12.7;
      let _sz = g_info.grid_size;
      //let _sz = 17;
      let _scale = g_info.tri_scale;
      //let _scale = 100;
      //let mmov = m4.t2(0, 0, (ii+1)*(_sz*_scale));
      let mmov = m4.t2(0, 0, _di*(_sz*_scale));
      let mm = m4.multiply( mmov, mr );
      let _m = new THREE.Matrix4();
      _m.set( mm[ 0], mm[ 1], mm[ 2], mm[ 3],
              mm[ 4], mm[ 5], mm[ 6], mm[ 7],
              mm[ 8], mm[ 9], mm[10], mm[11],
              mm[12], mm[13], mm[14], mm[15] );

      g_info.mesha[ii].position.x = 0;
      g_info.mesha[ii].position.y = 0;
      g_info.mesha[ii].position.z = 0;
      g_info.mesha[ii].rotation.x = 0;
      g_info.mesha[ii].rotation.y = 0;
      g_info.mesha[ii].rotation.z = 0;
      g_info.mesha[ii].applyMatrix4(_m);

    }

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

    g_info.light[i].position.set( _x, _y, _z ).normalize();
  }


  if ("composer" in g_info) {
    g_info.composer.render();
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

function render() {

  if (!g_info.ready) {
    if ("composer" in g_info) { g_info.composer.render(); }
    else { g_info.renderer.render( g_info.scene, g_info.camera ); }
    return;
  }


  if (g_info.boundary_condition == 'z') {
    render_z();
  }
  else if (g_info.boundary_condition == 'zy') {
    render_zy();
  }
  else {
    render_n();
  }

}

//---

function init_param() {

  // palette choice
  //
  g_info.palette_idx = _irnd( g_info.palette.length );
  g_info.features["Palette"] = g_info.palette[ g_info.palette_idx ].name;

  //g_info.inverted_bg = (fxrand() < 0.5);
  //g_info.features["Inverted Background"] = (g_info.inverted_bg ? "True" : "False" );

  //--

  let grid_weight = g_info.grid_weight;
  /*
  let grid_weight = {
    "4": 2, "5": 10, "6":30, "7":30, "8":30, "9":25, "10":20, "11":10, "12":9,
    "13":8, "14":7, "15":6, "16":5, "17":4, "18":3, "19":2,
    "20": 1
  };
  */
  let grid_pd = weight2pd(grid_weight);

  g_info.grid_size = rnd_cdf(grid_pd.cdf);
  g_info.features["Grid Size"] = g_info.grid_size;

  //--

  let boundary_condition = ["n", "z"];
  g_info.boundary_condition = boundary_condition[ _irnd(2) ];

  if (g_info.boundary_condition == 'n') {
    g_info.features["Boundary Condition"] = "None";
  }
  else {
    g_info.features["Boundary Condition"] = "Z";
  }

  //---

  //g_info.n_point_light = _irnd(4,8);
  g_info.n_point_light = _irnd(4,4);
  g_info.features["Light Count"] = g_info.n_point_light;

  //---

  let _sf_d = _irnd(1,16);
  g_info.speed_factor = 1/(_sf_d*4096);

  //DEBUG 
  //g_info.speed_factor = 1/8192;
  g_info.speed_factor = 1/(32*1024);

  g_info.features["Speed Factor"] = g_info.speed_factor;

  //---

  let width_pd = weight2pd( g_info.tile_width_denom_weight );
  let width_d = rnd_cdf(width_pd.cdf);
  g_info.tile_width = 1 / width_d;
  g_info.features["Tile Width"] = g_info.tile_width;

  let _gh_weight = {};
  for (let key in g_info.tile_height_denom_weight) {
    //if (parseInt(key) <= width_d) { continue; }
    if (parseInt(key) <= (parseInt(width_d)+2)) { continue; }
    _gh_weight[key] = g_info.tile_height_denom_weight[key];
  }
  let height_pd = weight2pd( _gh_weight );
  let height_d = rnd_cdf(height_pd.cdf);
  g_info.tile_height = 1/height_d;
  g_info.features["Tile Height"] = g_info.tile_height;

  //--

  let tile_weight_profile_info = {
    "0": { "tile": { "|" : 100 } },
    "1": { "tile": { "+" : 100 } },
    "2": { "tile": { "T" : 100 } },
    "3": { "tile": { "r" : 100 } },
    "4": { "tile": { "^" : 100 } },

    "5": { "tile": { "|": 100, "+": 100 } },
    "6": { "tile": { "|": 100, "T": 100 } },
    "7": { "tile": { "|": 100, "r": 100 } },
    "8": { "tile": { "|": 100, "^": 100 } },

    "9": { "tile": { "+": 100, "T": 100 } },
    "10": { "tile": { "+": 100, "r": 100 } },
    "11": { "tile": { "+": 100, "^": 100 } },

    "12": { "tile": { "T": 100, "r": 100 } },
    "13": { "tile": { "T": 100, "^": 100 } },

    "14": { "tile": { "r": 100, "^": 100 } },

    "15": { "tile": {} }
  };

  let twpi_idx = _irnd(16);

  let profile_desc = ((twpi_idx == 15) ? "Uniform": "");

  let tile_w = tile_weight_profile_info[twpi_idx].tile;
  for (let tile_type in tile_w) {
    g_template.weight[tile_type] = tile_w[tile_type]; 
    if (profile_desc.length > 0) { profile_desc += ","; }
    profile_desc += tile_type;
  }

  g_info.features["Tile Weight Profile"] = profile_desc;

  //--

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
    //if (_dist3(v, va[i]) <= _eps) { return true; }
    if (_dist3(v, va[i]) <= _eps) { return i; }
  }
  //return false;
  return -1;
}

// by using the endpoint library,
// build a list of all rotations of the endpoints (raw_lib),
// a map of equivalent representations (equiv_lib),
// a map that has the representative of each rotational class (repr_map),
// a 'tile_attach' list of tiles that can attach to each other (based off
// of the endpoint)
//
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

  // *all* admissible nieghbors
  //
  let admissible_tile_pos = {};
  let admissible_pos_tile = {};
  let admissible_nei = {};

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
          if (_v_in(_type_a[i][k], _type_a[j])<0) { break; }
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
      uniq_repr[repr_id] = {"count":0, "attach_dv": {}, "pos_tile_attach":{} };
    }
    uniq_repr[repr_id].count++;
  }



  let tile_attach = {};

  // now for each representative, test every other tile to see if can
  // be joined
  //
  for (let anchor_key in uniq_repr) {
    if ((anchor_key.charAt(0) == '.') ||
        (anchor_key.charAt(0) == 'd')) { continue; }
    for (let test_key in uniq_repr) {
      if ((test_key.charAt(0) == '.') ||
          (test_key.charAt(0) == 'd')) { continue; }

      // anchor_key is at the 'center' where test_key
      // is shifted around the 3x3x3 cube, excluding the
      // center point.
      //
      for (let dx=-1; dx<2; dx++) {
        for (let dy=-1; dy<2; dy++) {
          for (let dz=-1; dz<2; dz++) {

            // test_key can't be at center because that's where the
            // anchor_key is
            //
            if ((dx==0) && (dy==0) && (dz==0)) { continue; }

            //---

            let anch_endp = raw_lib[anchor_key];
            let test_endp = raw_lib[test_key];

            let endp_group = -1;
            let endp_count = 0;
            for (let idx=0; idx<test_endp.length; idx++) {
              let tv = [ test_endp[idx][0] + dx, test_endp[idx][1] + dy, test_endp[idx][2] + dz ];
              let _anch_endp_pos = _v_in(tv, anch_endp);
              if (_anch_endp_pos >= 0) {
                endp_count++;
                endp_group = Math.floor(_anch_endp_pos/4);
              }

            }

            if (endp_count==4) {
              if (!(anchor_key in tile_attach)) { tile_attach[anchor_key] = {}; }
              if (!(test_key in tile_attach[anchor_key])) {
                tile_attach[anchor_key][test_key] = { "anchor": anchor_key, "attach": test_key, "dv": [], "endpoint_group": [] };
              }
              tile_attach[anchor_key][test_key].dv.push( [dx, dy, dz ] );
              tile_attach[anchor_key][test_key].endpoint_group.push( endp_group );

              dv_key = dx.toString() + ":" + dy.toString() + ":" + dz.toString();
              uniq_repr[anchor_key].attach_dv[ dv_key ] = [ dx, dy, dz ];

              if (!(dv_key in uniq_repr[anchor_key].pos_tile_attach)) {
                uniq_repr[anchor_key].pos_tile_attach[dv_key] = {};
              }
              uniq_repr[anchor_key].pos_tile_attach[dv_key][test_key] = true;
            }

          }
        }
      }
    }

  }

  // easy access to endpoint group count
  //
  for (let key in uniq_repr) {
    let n_endpoint_group = 0;
    for (let _dvkey in uniq_repr[key].attach_dv) {
      n_endpoint_group++;
    }
    uniq_repr[key].n_endpoint_group = n_endpoint_group;
  }

  /*
  let admissible_pos = [
    { "dv_key" : "-1:0:0" , "dv": [-1,  0,  0] },
    { "dv_key" : "1:0:0"  , "dv": [ 1,  0,  0] },

    { "dv_key" : "0:-1:0" , "dv": [ 0, -1,  0] },
    { "dv_key" : "0:1:0"  , "dv": [ 0,  1,  0] },

    { "dv_key" : "0:0:-1" , "dv": [ 0,  0, -1] },
    { "dv_key" : "0:0:1"  , "dv": [ 0,  0,  1] }
  ];

  let oppo = {
    "-1:0:0" :  "1:0:0",
    "1:0:0"  : "-1:0:0",

    "0:-1:0" :  "0:1:0",
    "0:1:0"  : "0:-1:0",

    "0:0:-1" : "0:0:1",
    "0:0:1"  : "0:0:-1"
  }
  */

  let admissible_pos = g_template.admissible_pos;
  let oppo  = g_template.oppo;

  // tile_attach only has actual connections
  // use it to fill out the admissible_attach
  // hash with *all* valid neighboring tile pairs
  //
  for (let key_anchor in uniq_repr) {

    if (!(key_anchor in admissible_nei)) {
      admissible_nei[key_anchor] = {};
    }

    for (let key_nei in uniq_repr) {

      if (!(key_nei in admissible_nei)) {
        admissible_nei[key_nei] = {};
      }

      for (let ii=0; ii<admissible_pos.length; ii++) {
        let dv_anch = admissible_pos[ii].dv_key;
        let dv_nei = oppo[dv_anch];

        if ((dv_anch in uniq_repr[key_anchor].pos_tile_attach) &&
            (dv_nei  in uniq_repr[key_nei].pos_tile_attach)) {
          if (key_nei in uniq_repr[key_anchor].pos_tile_attach[dv_anch]) {

            if (!(key_nei in admissible_nei[key_anchor])) {
              admissible_nei[key_anchor][key_nei] = {};
            }
            if (!(dv_anch in admissible_nei[key_anchor][key_nei])) {
              admissible_nei[key_anchor][key_nei][dv_anch] = {};
            }
            if (!(dv_anch in admissible_nei[key_anchor])) {
              admissible_nei[key_anchor][dv_anch] = {};
            }


            if (!(key_anchor in admissible_nei[key_nei])) {
              admissible_nei[key_nei][key_anchor] = {};
            }
            if (!(key_anchor in admissible_nei[key_nei][key_anchor])) {
              admissible_nei[key_nei][key_anchor][dv_nei] = {};
            }
            if (!(dv_nei in admissible_nei[key_nei])) {
              admissible_nei[key_nei][dv_nei] = {};
            }


            admissible_nei[key_anchor][key_nei][dv_anch] = {"conn": true};
            admissible_nei[key_nei][key_anchor][dv_nei] = {"conn": true};

            admissible_nei[key_anchor][dv_anch][key_nei] = {"conn": true};
            admissible_nei[key_nei][dv_nei][key_anchor] = {"conn": true};
          }
        }

        if ((!(dv_anch in uniq_repr[key_anchor].pos_tile_attach)) &&
            (!(dv_nei  in uniq_repr[key_nei].pos_tile_attach))) {

          if (!(key_nei in admissible_nei[key_anchor])) {
            admissible_nei[key_anchor][key_nei] = {};
          }
          if (!(dv_anch in admissible_nei[key_anchor][key_nei])) {
            admissible_nei[key_anchor][key_nei][dv_anch] = {};
          }
          if (!(dv_anch in admissible_nei[key_anchor])) {
            admissible_nei[key_anchor][dv_anch] = {};
          }

          if (!(key_anchor in admissible_nei[key_nei])) {
            admissible_nei[key_nei][key_anchor] = {};
          }
          if (!(key_anchor in admissible_nei[key_nei][key_anchor])) {
            admissible_nei[key_nei][key_anchor][dv_nei] = {};
          }
          if (!(dv_nei in admissible_nei[key_nei])) {
            admissible_nei[key_nei][dv_nei] = {};
          }

          admissible_nei[key_anchor][key_nei][dv_anch] = {"conn": false};
          admissible_nei[key_nei][key_anchor][dv_nei] = {"conn": false};

          admissible_nei[key_anchor][dv_anch][key_nei] = {"conn": false};
          admissible_nei[key_nei][dv_nei][key_anchor] = {"conn": false};
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

  g_template["admissible_nei"] = admissible_nei;


  // restrict undesirable combinations
  //
  filter_steeple(admissible_nei);

}

function filter_steeple() {
  let _eps = 1/(1024*1024);

  let admissible_nei  = g_template.admissible_nei;
  let admissible_pos  = g_template.admissible_pos;
  let oppo            = g_template.oppo;
  let raw_lib         = g_template.raw_lib;

  let delete_list = [];

  for (let key_anchor in admissible_nei) {
    if (key_anchor.charAt(0) != '^') { continue; }

    let anc_p_repr = [0,0,0];
    let endp = raw_lib[key_anchor];
    for (let ii=0; ii<endp.length; ii++) {
      anc_p_repr[0] += endp[ii][0];
      anc_p_repr[1] += endp[ii][1];
      anc_p_repr[2] += endp[ii][2];
    }
    //anc_p_repr[0] /= endp.length;
    //anc_p_repr[1] /= endp.length;
    //anc_p_repr[2] /= endp.length;

    for (let posidx=0; posidx<admissible_pos.length; posidx++) {
      let dv_anc_key = admissible_pos[posidx].dv_key;
      let dv_nei_key = oppo[dv_anc_key];

      let dv_anc = admissible_pos[posidx].dv;
      let dv_nei = [ -dv_anc[0], -dv_anc[1], -dv_anc[2] ];

      for (let key_nei in admissible_nei[key_anchor][dv_anc_key]) {
        if (key_nei.charAt(0) != '^') { continue; }
        if (!admissible_nei[key_anchor][dv_anc_key][key_nei].conn) { continue; }

        let nei_p_repr = [0,0,0];
        let endp = raw_lib[key_nei];
        for (let ii=0; ii<endp.length; ii++) {
          nei_p_repr[0] += endp[ii][0];
          nei_p_repr[1] += endp[ii][1];
          nei_p_repr[2] += endp[ii][2];
        }

        let anc_v = [
          anc_p_repr[0] - 2*dv_anc[0],
          anc_p_repr[1] - 2*dv_anc[1],
          anc_p_repr[2] - 2*dv_anc[2]
        ];

        let nei_v = [
          nei_p_repr[0] - 2*dv_nei[0],
          nei_p_repr[1] - 2*dv_nei[1],
          nei_p_repr[2] - 2*dv_nei[2]
        ];

        //console.log(">>", key_anchor , "=>", key_nei,
        //  "(a:", dv_anc_key, "::", anc_v.toString(), ")",
        //  "(n:", dv_nei_key, "::", nei_v.toString(), ")");

        let de = Math.abs(nei_v[0] - anc_v[0] + nei_v[1] - anc_v[1] + nei_v[2] - anc_v[2]);
        if (de < _eps) {
          delete_list.push( [ key_anchor, key_nei, dv_anc_key ] );
          delete_list.push( [ key_anchor, dv_anc_key, key_nei ] );
        }
      }

    }
  }

  for (let ii=0; ii<delete_list.length; ii++) {
    let a = delete_list[ii][0];
    let b = delete_list[ii][1];
    let c = delete_list[ii][2];

    delete admissible_nei[a][b][c];
  }

}



function grid_clear(gr) {

  // clear
  //
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          gr[z][y][x][ii].processed=false;
          //gr[z][y][x].d = 0;
        }

      }
    }
  }

}

// grid elements contain array of objects.
// Each object:
//   name       - tile name
//   valid      - still a candidate
//   processed  - processed or not
//

// This proceeds in steps
// - First cull tiles on the edge.
//   If tiles need a connection that's on the edge,
//   it can never be satisfied so remove it
// - Choose a tile to force
//   This is some 'entropy' heuristic
//   (currently min options > 1)
// - Once this tile is forced, start a
//   'needs_visit' structure that marks
//   neighbors that need to be looked at to
//   see if they still have valid tiles.
//   For each position under consideration,
//   each tile is made sure that it has neighbor
//   tile options that can fill it's "endpoing group".
//
//

function grid_cull_boundary(gr) {

  // cull edge
  //

  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;
  let oppo = g_template.oppo;

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        if (_oob(gr, x,y,z)) { continue; }

        if (gr[z][y][x].length==0) {
          return {"status":"error", "state":"finished", "msg":"found 0 entries at " + _pos_keystr(x,y,z) };
        }

        let idx=0;
        while (idx < gr[z][y][x].length) {

          let key_anchor = gr[z][y][x][idx].name;

          // each 'key_anchor' has attach points grouped in
          // 'endpoint_group'.
          // If a key_anchor can't satisfy the endpoint_group,
          // because it's near the boundary, it can be culled.
          //

          let cull_tile = false;

          for (let apos_idx=0; apos_idx<admissible_pos.length; apos_idx++) {
            let dv_key = admissible_pos[apos_idx].dv_key;
            let dv = admissible_pos[apos_idx].dv;

            let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
            let ux = _p[0],
                uy = _p[1],
                uz = _p[2];

            if (!_oob(gr, ux,uy,uz)) { continue; }

            if (!(dv_key in admissible_nei[key_anchor])) { continue; }

            for (let key_nei in admissible_nei[key_anchor][dv_key]) {
              if (cull_tile) { break; }
              if (admissible_nei[key_anchor][dv_key][key_nei].conn) {
                cull_tile = true;
              }
            }

            if (cull_tile) { break; }
          }

          if (cull_tile) {
            gr[z][y][x][idx] = gr[z][y][x][ gr[z][y][x].length-1 ];
            gr[z][y][x].pop();

            if (gr[z][y][x].length==0) {
              return {"status":"error",
                      "state":"finished",
                      "msg":"found 0 entries at " + _pos_keystr(x,y,z) + " after culling edge tile " + key_anchor };
            }

            continue;
          }

          idx++;
        }

      }
    }
  }

  return {"status":"success",
          "state":"processing",
          "msg":"boundary cull"};
}

function grid_cull_collapse_one(gr) {
  let _eps = 1/(1024*1024);

  let tile_attach = g_template.tile_attach;

  // create candidate to 'collapse' list...
  //
  // go through each grid cell (that isn't
  // already fixed) and calculate
  // the entropy given the remaining tile choices.
  //
  // record the minimul entropy (in `min_val`)
  // so we can filter it after the fact.
  //

  let min_val = -1;
  let candidate_coord = [];

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let gr_cell = gr[z][y][x];
        if (gr_cell.length<2) { continue; }

        let s = 0.0;
        for (let cidx=0; cidx<gr_cell.length; cidx++) {
          let tile_name = gr[z][y][x][cidx].name;
          let tile_type = tile_name.charAt(0);
          let p = g_template.pdf[tile_type];

          if (p < _eps) { continue; }

          s -= p*Math.log(p);
        }

        if (min_val<0) { min_val = s; }
        if (min_val<s) { min_val = s; }

        candidate_coord.push({ "x":x, "y":y, "z":z, "s":s });

      }
    }
  }

  if (min_val==-1) {
    return { "status":"success", "state":"finished", "msg":"no more candidates found"};
  }

  // remove entries in candidate list that aren't close
  // enough to the minimum entropy calculate from above
  //
  let idx=0;
  while (idx < candidate_coord.length) {

    if (Math.abs(candidate_coord[idx].s - min_val) >= _eps) {
      candidate_coord[idx] = candidate_coord[ candidate_coord.length-1 ];
      candidate_coord.pop();
      continue;
    }

    idx++;
  }

  let r_idx = Math.floor(fxrand()*candidate_coord.length);
  let r_ele = candidate_coord[r_idx];

  // Now that we have a candidate list,
  // choose one based on the probability of each tile type.
  // This only maks tiles in the cell as invalid, save
  // for the kept tile, with the assumption that
  // the function that called it will clean up
  // the cell and go through the implications.
  //

  let cand_coord = gr[ r_ele.z ][ r_ele.y ][ r_ele.x ];

  let R = 0.0;
  let _cdf = [];
  let gr_cell = gr[r_ele.z][r_ele.y][r_ele.x];
  for (let ii=0; ii<gr_cell.length; ii++) {
    let tile_type = gr_cell[ii].name.charAt(0);
    let v = g_template.pdf[tile_type];
    _cdf.push(v);
    R += v;
  }

  for (let ii=0; ii<_cdf.length; ii++) {
    _cdf[ii] /= R;
  }

  let cand_coord_idx = _cdf.length-1;
  let p = fxrand();
  for (let ii=0; ii<_cdf.length; ii++) {
    if (p<_cdf[ii]) {
      cand_coord_idx = ii;
      break;
    }
  }

  // Sweep through, mark each as invalid.
  // After the fact, mark the chosen tile as valid.
  //
  // Again, the higher level function will remove the
  // invalid entries in this cell and will propagate
  // implications.
  //
  let _n = gr[r_ele.z][r_ele.y][r_ele.x].length;
  for (let i=0; i<_n; i++) {
    gr[r_ele.z][r_ele.y][r_ele.x][i].valid = false;
  }
  gr[r_ele.z][r_ele.y][r_ele.x][ cand_coord_idx ].valid = true;

  let tile_name = gr[r_ele.z][r_ele.y][r_ele.x][ cand_coord_idx ].name;

  return { "status":"success", "state":"processing", "msg":"...", "data":{ "pos": [ r_ele.x, r_ele.y, r_ele.z ], "tile": tile_name }};
}

function grid_cull_remove_invalid(gr) {
  let _ret = { "status": "success", "state":"done", "msg":"...", "data": []};

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let idx = 0;
        while (idx < gr[z][y][x].length) {
          if (!(gr[z][y][x][idx].valid)) {
            let u = gr[z][y][x][idx].name;
            gr[z][y][x][idx] = gr[z][y][x][ gr[z][y][x].length-1 ];
            gr[z][y][x].pop();

            _ret.state = "processing";
            _ret.data.push( {"name":u, "pos":[x,y,z] });
            continue;
          }
          idx++;
        }

      }
    }
  }

  return _ret;

}

function _fill_accessed(gr, accessed, x,y,z) {
  let admissible_pos = g_template.admissible_pos;

  accessed[ _pos_keystr(x,y,z) ] = [x,y,z];

  for (let posidx=0; posidx<admissible_pos.length; posidx++) {
    let dv = admissible_pos[posidx].dv;

    let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
    let ux = _p[0],
        uy = _p[1],
        uz = _p[2];

    if (_oob(gr, ux, uy, uz)) { continue; }

    accessed[ _pos_keystr(ux, uy, uz) ] = [ ux, uy, uz ];
  }

}

function grid_cull_propagate_opt(gr, accessed, debug) {
  let _ret = { "status": "success", "state":"processing", "msg":"..." };

  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;
  let oppo = g_template.oppo;

  let new_accessed = accessed;

  if (debug) {
    console.log("grid_cull_propagate_opt.i:");
    for (let k in accessed) {
      console.log("::", k, accessed[k]);
    }
  }

  let still_processing = true;
  while (still_processing) {

    accessed = new_accessed;
    new_accessed = {};
    //let new_accessed = {};

    still_processing = false;

    let _rrp = grid_cull_remove_invalid(gr);
    if (_rrp.status != "success") {
      _ret.status = "error";
      _ret.msg = "grid_cull_remove_invalid:" + _rrp.msg;
      continue;
    }

    for (let access_poskey in accessed) {

      accessed_cell = accessed[access_poskey];
      let x = accessed_cell[0],
          y = accessed_cell[1],
          z = accessed_cell[2];

      let gr_cell = gr[z][y][x];
      for (let cidx=0; cidx<gr_cell.length; cidx++) {
        let key_anchor = gr_cell[cidx].name;

        let tile_valid = true;

        for (let posidx=0; posidx<admissible_pos.length; posidx++) {
          let dv_key = admissible_pos[posidx].dv_key;
          let dv = admissible_pos[posidx].dv;

          /*
          let ux = x + dv[0],
              uy = y + dv[1],
              uz = z + dv[2];
              */
          let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
          let ux = _p[0],
              uy = _p[1],
              uz = _p[2];

          if (!(dv_key in admissible_nei[key_anchor])) { continue; }

          // oob check
          //
          for (let key_nei in admissible_nei[key_anchor][dv_key]) {
            if (admissible_nei[key_anchor][dv_key][key_nei].conn) {

              /*
              if ((uz < 0) || (uz >= gr.length) ||
                  (uy < 0) || (uy >= gr[z].length) ||
                  (ux < 0) || (ux >= gr[z][y].length)) {
                  */

              if (_oob(gr, ux, uy, uz)) {
                tile_valid = false;

                _fill_accessed(gr, new_accessed, x,y,z);

                if (debug) {
                  console.log("CULL.oob: anch:", key_anchor, "@(", x,y,z, ") has connecting outside of boundary");
                }

                break;
              }
            }
          }

          if (!(tile_valid)) {
            _fill_accessed(gr, new_accessed, x,y,z);

            gr_cell[cidx].valid = false;
            still_processing = true;
            break;;
          }

          /*
          if ((uz < 0) || (uz >= gr.length) ||
              (uy < 0) || (uy >= gr[z].length) ||
              (ux < 0) || (ux >= gr[z][y].length)) {
          */
          if (_oob(gr, ux,uy,uz)) {
            continue;
          }

          let anchor_has_valid_conn = false;

          let gr_nei = gr[uz][uy][ux];
          for (let nei_idx=0; nei_idx<gr_nei.length; nei_idx++) {
            let dv_nei_key = oppo[dv_key];
            let key_nei = gr_nei[nei_idx].name;

            // if anchor has hvaid connection to at least one
            // tile ...
            //
            if (key_nei in admissible_nei[key_anchor][dv_key]) {
              let dv_nei_key = oppo[dv_key];
              if (admissible_nei[key_anchor][dv_key][key_nei].conn == admissible_nei[key_nei][dv_nei_key][key_anchor].conn) {
                anchor_has_valid_conn = true;

                break;
              }
            }

          }

          //if (!tile_valid) {

          if (!anchor_has_valid_conn) {
            tile_valid = false;

            _fill_accessed(gr, new_accessed, x,y,z);

            if (debug) {
              console.log("CULL.c: anch:", key_anchor, "@(", x,y,z, ") has no possible connections to neighbors");
            }

            gr_cell[cidx].valid = false;
            still_processing = true;
            break;
          }

        }

      }

    }

  }

  return _ret;
}

function grid_cull_propagate(gr, debug) {
  let _ret = { "status": "success", "state":"processing", "msg":"..." };

  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;
  let oppo = g_template.oppo;

  let still_processing = true;
  while (still_processing) {

    still_processing = false;

    let _rrp = grid_cull_remove_invalid(gr);
    if (_rrp.status != "success") {
      _ret.status = "error";
      _ret.msg = "grid_cull_remove_invalid:" + _rrp.msg;
      continue;
    }

    for (let z=0; z<gr.length; z++) {
      for (let y=0; y<gr[z].length; y++) {
        for (let x=0; x<gr[z][y].length; x++) {


          let gr_cell = gr[z][y][x];
          for (let cidx=0; cidx<gr_cell.length; cidx++) {
            let key_anchor = gr_cell[cidx].name;

            let tile_valid = true;

            for (let posidx=0; posidx<admissible_pos.length; posidx++) {
              let dv_key = admissible_pos[posidx].dv_key;
              let dv = admissible_pos[posidx].dv;

              /*
              let ux = x + dv[0],
                  uy = y + dv[1],
                  uz = z + dv[2];
                  */
              let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
              let ux = _p[0],
                  uy = _p[1],
                  uz = _p[2];

              if (!(dv_key in admissible_nei[key_anchor])) { continue; }

              // oob check
              //
              for (let key_nei in admissible_nei[key_anchor][dv_key]) {
                if (admissible_nei[key_anchor][dv_key][key_nei].conn) {

                  /*
                  if ((uz < 0) || (uz >= gr.length) ||
                      (uy < 0) || (uy >= gr[z].length) ||
                      (ux < 0) || (ux >= gr[z][y].length)) {
                  */

                  if (_oob(gr, ux,uy,uz)) {
                    tile_valid = false;

                    //if (debug) { console.log("CULL.oob: anch:", key_anchor, "@(", x,y,z, ") has connecting outside of boundary"); }

                    break;
                  }
                }
              }

              if (!(tile_valid)) {
                gr_cell[cidx].valid = false;
                still_processing = true;
                break;;
              }

              /*
              if ((uz < 0) || (uz >= gr.length) ||
                  (uy < 0) || (uy >= gr[z].length) ||
                  (ux < 0) || (ux >= gr[z][y].length)) {
              */
              if (_oob(gr, ux,uy,uz)) {
                continue;
              }

              let anchor_has_valid_conn = false;

              let gr_nei = gr[uz][uy][ux];
              for (let nei_idx=0; nei_idx<gr_nei.length; nei_idx++) {
                let dv_nei_key = oppo[dv_key];
                let key_nei = gr_nei[nei_idx].name;

                // if anchor has hvaid connection to at least one
                // tile ...
                //
                if (key_nei in admissible_nei[key_anchor][dv_key]) {
                  let dv_nei_key = oppo[dv_key];
                  if (admissible_nei[key_anchor][dv_key][key_nei].conn == admissible_nei[key_nei][dv_nei_key][key_anchor].conn) {
                    anchor_has_valid_conn = true;

                    break;
                  }
                }

              }

              //if (!tile_valid) {

              if (!anchor_has_valid_conn) {
                tile_valid = false;

                //if (debug) { console.log("CULL.c: anch:", key_anchor, "@(", x,y,z, ") has no possible connections to neighbors"); }

                gr_cell[cidx].valid = false;
                still_processing = true;
                break;
              }

            }

          }

        }
      }
    }

  }

  return _ret;
}


function _gen_debug_name_list(gr_list) {
  let a = [];
  for (let i=0; i<gr_list.length; i++) {
    a.push( gr_list[i].name );
  }
  return a.join(",");

}

// slow checker to see if neighbor has any match in the anchor list
//
function _valid_neighbor(anchor_a, neighbor_key, nei_dx, nei_dy, nei_dz) {

  //console.log("_valid_neighbor:", anchor_a, neighbor_key, nei_dx, nei_dy, nei_dz);

  for (let i=0; i<anchor_a.length; i++) {
    let anchor_key = anchor_a[i].name;

    // ignore blank ('.') and debug ('d') tiles
    //
    if (!(anchor_key in g_template.tile_attach)) { continue; }

    let _tam = g_template.tile_attach[anchor_key];
    if (!(neighbor_key in _tam)) { continue; }

    let _dv = _tam[neighbor_key].dv;
    for (let j=0; j<_dv.length; j++) {
      if ((_dv[0] == nei_dx) &&
          (_dv[1] == nei_dy) &&
          (_dv[2] == nei_dz)) {
        return true;
      }
    }
  }

  return false;
}

function _pos_keystr(x,y,z) {
  return x.toString() + ":" + y.toString() + ":" + z.toString();
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

          if ("cgroup" in gr[z][y][x][ii]) {
            sfx += "[g" + gr[z][y][x][ii].cgroup.toString() + "]";
          }
          if (valid_count>0) { u += ","; }
          //u += ',' + gr[z][y][x][ii].n + sfx;
          u += gr[z][y][x][ii].name + sfx;
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
    for (let y=0; y<pgr[z].length; y++) {
      for (let x=0; x<pgr[z][y].length; x++) {

        let u = '.';
        for (let ii=0; ii<pgr[z][y][x].length; ii++) {
          if (!pgr[z][y][x][ii].valid) { continue; }
          u = pgr[z][y][x][ii].name;
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

function grid_consistency(gr) {
  let _ret = { "status": "success", "state":"finished", "msg":"ok", "data":{} };

  let admissible_pos = [
    { "dv_key" : "-1:0:0" , "dv": [-1,  0,  0] },
    { "dv_key" : "1:0:0"  , "dv": [ 1,  0,  0] },

    { "dv_key" : "0:-1:0" , "dv": [ 0, -1,  0] },
    { "dv_key" : "0:1:0"  , "dv": [ 0,  1,  0] },

    { "dv_key" : "0:0:-1" , "dv": [ 0,  0, -1] },
    { "dv_key" : "0:0:1"  , "dv": [ 0,  0,  1] }
  ];

  let oppo = {
    "-1:0:0" :  "1:0:0",
    "1:0:0"  : "-1:0:0",

    "0:-1:0" :  "0:1:0",
    "0:1:0"  : "0:-1:0",

    "0:0:-1" : "0:0:1",
    "0:0:1"  : "0:0:-1"
  }

  let admissible_nei = g_template.admissible_nei;

  // zero occupancy test
  //
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        if (gr[z][y][x].length == 0) {
          _ret.status = "fail";
          _ret.data[ _pos_keystr(x, y, z) ] = [x,y,z];
          _ret.msg = "no tiles at cell " + _pos_keystr(x,y,z);
          return _ret;
        }

        let gr_cell = gr[z][y][x];
        for (let cell_idx=0; cell_idx<gr_cell.length; cell_idx++) {

          let key_anchor = gr_cell[cell_idx].name;

          for (let posidx=0; posidx<admissible_pos.length; posidx++) {
            let dv_key = admissible_pos[posidx].dv_key;
            let dv = admissible_pos[posidx].dv;

            let ux = x + dv[0],
                uy = y + dv[1],
                uz = z + dv[2];

            if (!(dv_key in admissible_nei[key_anchor])) { continue; }

            for (let key_nei in admissible_nei[key_anchor][dv_key]) {

              //--

              // oob check
              //
              if (admissible_nei[key_anchor][dv_key][key_nei].conn) {
                if ((uz < 0) || (uz >= gr.length) ||
                    (uy < 0) || (uy >= gr[z].length) ||
                    (ux < 0) || (ux >= gr[z][y].length)) {
                  _ret.status = "fail";
                  _ret.data[ _pos_keystr(x, y, z) ] = [x,y,z];
                  _ret.msg = key_anchor + "@(" + _pos_keystr(x,y,z) + ") has connection over edge boundary:  "+
                    _pos_keystr(ux,uy,uz) + " (" + dv_key + ")";
                  return _ret;
                }
              }

              //--

            }

            if (!((uz < 0) || (uz >= gr.length) ||
                  (uy < 0) || (uy >= gr[z].length) ||
                  (ux < 0) || (ux >= gr[z][y].length))) {

              let tile_valid = false;
              let gr_nei = gr[uz][uy][ux];
              for (let nei_idx=0; nei_idx<gr_nei.length; nei_idx++) {
                let dv_nei_key = oppo[dv_key];
                let key_nei = gr_nei[nei_idx].name;
                if ((key_nei in admissible_nei[key_anchor][dv_key]) &&
                    (!(key_anchor in admissible_nei[key_nei][dv_nei_key]))) {
                  _ret.status = "fail";
                  _ret.msg = key_anchor + "@(" + _pos_keystr(x,y,z) + ") does not have entry for  "+
                    key_nei + "@(" + _pos_keystr(ux,uy,uz) + ") dv(" + dv_key + ") but neighbor " +
                    "has connection to anchor";
                  return _ret;
                }
                if ((!(key_nei in admissible_nei[key_anchor][dv_key])) &&
                    (key_anchor in admissible_nei[key_nei][dv_nei_key])) {
                  _ret.status = "fail";
                  _ret.msg = key_anchor + "@(" + _pos_keystr(x,y,z) + ") has entry for  "+
                    key_nei + "@(" + _pos_keystr(ux,uy,uz) + ") dv(" + dv_key + ") but neighbor " +
                    "does not have connection to anchor";
                  return _ret;
                }


                if (key_nei in admissible_nei[key_anchor][dv_key]) {
                  if (admissible_nei[key_anchor][dv_key][key_nei].conn == admissible_nei[key_nei][dv_nei_key][key_anchor].conn) {
                    tile_valid = true;
                    break;
                  }
                }

              }

              if (!tile_valid) {
                _ret.status = "fail";
                _ret.msg = key_anchor + "@(" + _pos_keystr(x,y,z) + ") could not find valid neighbor "+
                  "@(" + _pos_keystr(ux,uy,uz) + ") dv(" + dv_key + ")";
                return _ret;
              }

            }

          }

        }

      }
    }
  }



  return _ret;
}

function grid_occupancy_count(pgr) {
  let c_gr = [];
  for (let z=0; pgr.length; z++) {
    c_gr.push([]);
    for (let y = 0; z<pgr[z].length; y++) {
      c_gr[z].push([]);
      for (let x=0; x<pgr[z][y].length; x++) {
        c_gr[z][y].push( pgr[z][y][x].length );
      }
    }
  }
  return c_gr;
}

function processing_update(iter) {
  if (g_info.debug_level > 0) {
    console.log(">>>iter:", iter);
  }

  //if ((iter%100)==0) {
    render();
  //  console.log("...");
  //}
}

function grid_wfc_opt(gr) {

  let debug = false;
  let n_iter = g_info.max_iter;
  let iter = 0;

  if (g_info.debug_level > 0) { debug = true; }

  let check_consistency = false;

  grid_cull_boundary(gr);

  if (debug) {
    console.log("BOUNDARY CULL GRID>>>");
    console.log("grid:\n>>>>>>>>>>>>");
    debug_print_gr(gr);
    console.log(">>>>>>>>>>>>");
  }

  let _r_c = {};

  let r = grid_cull_propagate(gr, debug);
  if (debug) {
    console.log("GOT>>>", r);
    console.log("grid:\n>>>>>>>>>>>>");
    debug_print_gr(gr);
    console.log(">>>>>>>>>>>>");
  }

  if (r.state == "finished") {
    console.log("0!!", r.status);
    return r;
  }

  g_info["iter"] = 0;

  let _rgr = { "state":"finished", "status": "error", "msg":"error occured" };

  let culling = true;
  while (culling) {

    // we want to give the potential to show pgoress at a higher level,
    // so provide this 'callback' to allow for screen updates
    //
    if ((g_info.iter%g_info.iter_update)==0) {
      processing_update(g_info.iter);
    }
    g_info.iter++;

    if (check_consistency) {
      let _rgr = grid_consistency(gr);
      console.log("CONSISTENCY.B:", _rgr.msg);
    }

    grid_clear(gr);

    if (debug) {
      console.log("========================");
      console.log("iter", iter, "/", n_iter);
      console.log("========================");
    }

    r = grid_cull_collapse_one(gr, debug);
    if (r.state == "finished") {
      _rgr = r;
      break;
    }
    else {
      if (debug) {
        console.log("collapse one:", r.data.tile, r.data.pos);
      }
    }

    if (check_consistency) {
      _r_c = grid_consistency(gr);
      console.log("CONSISTENCY.1:", _r_c.msg);
    }


    let ix = r.data.pos[0]
        iy = r.data.pos[1],
        iz = r.data.pos[2];
    accessed = {};
    _fill_accessed(gr, accessed, ix, iy, iz);

    r = grid_cull_propagate_opt(gr, accessed, debug);
    if (r.state == "finished") {
      _rgr = r;
      break;
    }

    if (debug) {
      console.log("ENDOFLOOP:\n=================");
      debug_print_gr(gr);
      console.log("=================");
    }

    if (check_consistency) {
      _r_c = grid_consistency(gr);
      console.log("CONSISTENCY.2:", _r_c.msg);
    }

    iter++;
    if (n_iter > 0) {
      if (iter>=n_iter) { break; }
    }
  }

  if (debug) {
    console.log("grid_wfc ending>>>");
    console.log("grid:\n>>>>>>>>>>>>");
    debug_print_gr(gr);
    console.log(">>>>>>>>>>>>");
  }


  if (check_consistency) {
    let _rgr = grid_consistency(gr);
    console.log("consistency:", _rgr.msg);
  }

  return _rgr;
}

function grid_wfc(gr) {

  let debug = false;
  let n_iter = 1000;
  let iter = 0;

  let check_consistency = true;

  grid_cull_boundary(gr);

  if (debug) {
    console.log("BOUNDARY CULL GRID>>>");
    console.log("grid:\n>>>>>>>>>>>>");
    debug_print_gr(gr);
    console.log(">>>>>>>>>>>>");
  }

  let _r_c = {};

  let culling = true;
  while (culling) {

    if (check_consistency) {
      let _rgr = grid_consistency(gr);
      console.log("CONSISTENCY.B:", _rgr.msg);
    }

    grid_clear(gr);

    console.log("========================");
    console.log("iter", iter, "/", n_iter);
    console.log("========================");

    let r = grid_cull_propagate(gr, debug);

    if (debug) {
      console.log("GOT>>>", r);
      console.log("grid:\n>>>>>>>>>>>>");
      debug_print_gr(gr);
      console.log(">>>>>>>>>>>>");
    }

    if (r.state == "finished") {
      console.log("0!!", r.status);
      break;
    }

    if (check_consistency) {
      _r_c = grid_consistency(gr);
      console.log("CONSISTENCY.0:", _r_c.msg);
    }

    r = grid_cull_collapse_one(gr, debug);
    if (r.state == "finished") {
      console.log("1!!", r.status, r.msg);
      break;
    }
    else {
      if (debug) {
        console.log("collapse one:", r.data.tile, r.data.pos);
      }
    }

    if (check_consistency) {
      _r_c = grid_consistency(gr);
      console.log("CONSISTENCY.1:", _r_c.msg);
    }


    r = grid_cull_propagate(gr, debug);
    if (r.state == "finished") {
      console.log("2!!", r.status, r.msg);
      break;
    }

    if (debug) {
      console.log("ENDOFLOOP:\n=================");
      debug_print_gr(gr);
      console.log("=================");
    }

    if (check_consistency) {
      _r_c = grid_consistency(gr);
      console.log("CONSISTENCY.2:", _r_c.msg);
    }

    iter++;
    if (iter>=n_iter) { break; }
  }

  if (debug) {
    console.log("grid_wfc ending>>>");
    console.log("grid:\n>>>>>>>>>>>>");
    debug_print_gr(gr);
    console.log(">>>>>>>>>>>>");
  }

  let _rgr = grid_consistency(gr);
  console.log("consistency:", _rgr.msg);

}

function init_pgr(pgr_dim) {
  let pgr = [];
  for (let z=0; z<pgr_dim[2]; z++) {
    pgr.push([]);
    for (let y=0; y<pgr_dim[1]; y++) {
      pgr[z].push([]);
      for (let x=0; x<pgr_dim[0]; x++) {

        pgr[z][y].push([]);
        for (let tile_name in g_template.uniq_repr) {

          // name - tile name
          // valid - still a candidate
          // processed - processed or not
          //
          pgr[z][y][x].push( {"name":tile_name, "valid": true, "processed":false, "cgroup":-1});
        }

      }
    }
  }


  return pgr;
}

// pos boundary conditions:
//
// Position of x,y,z after boundary conditions are imposed.
// That is, loop z if we have 'z' boundary conditions,
// loop 'y' also if we have 'zy' boundary condition.
// Otherwise, just return the x,y,z position
//
function _posbc(gr, x,y,z) {
  if (g_info.boundary_condition == "z") {
    z = (z + gr.length)%gr.length;
  }
  if (g_info.boundary_condition == "zy") {
    z = (z + gr.length)%gr.length;
    y = (y + gr[0].length)%gr.length[0];
  }
  return [x, y, z];
}

// out of bounds:
// true - x,y,z out of bounds (subject to bounary conditions
// false - in bounds (subject to boundary conditions)
//
function _oob(gr, x,y,z) {
  if (g_info.boundary_condition == "z") {
    let p = _posbc(gr, x,y,z);
    if ((y < 0) || (y >= gr[p[2]].length) ||
        (x < 0) || (x >= gr[p[2]][y].length)) {
      return true;
    }
  }
  else if (g_info.boundary_condition == "zy") {
    let p = _posbc(gr, x,y,z);
    if ((x < 0) || (x >= gr[p[2]][p[1]].length)) {
      return true;
    }
  }
  else {
    if ((z < 0) || (z >= gr.length) ||
        (y < 0) || (y >= gr[z].length) ||
        (x < 0) || (x >= gr[z][y].length)) {
      return true;
    }
  }
  return false;
}

function decorate_pgr_cgroup(pgr, x,y,z, cgroup, lvl) {
  lvl = ((typeof lvl === "undefined") ? 0 : lvl);

  if (_oob(pgr, x,y,z)){ return; }
  if (pgr[z][y][x][0].processed) { return; }

  pgr[z][y][x][0].cgroup = cgroup;
  pgr[z][y][x][0].processed = true;

  let key_anchor = pgr[z][y][x][0].name;

  let admissible_nei = g_template.admissible_nei;
  let dva = g_template.admissible_pos;
  for (let dvidx=0; dvidx<dva.length; dvidx++) {

    let dv_key = dva[dvidx].dv_key;
    let dv = dva[dvidx].dv;

    let _p = _posbc(pgr, x+dv[0], y+dv[1], z+dv[2]);
    let ux = _p[0],
        uy = _p[1],
        uz = _p[2];

    if (_oob(pgr, ux, uy, uz)) { continue; }

    let key_nei = pgr[uz][uy][ux][0].name;
    if (!(key_nei in admissible_nei[key_anchor][dv_key])) { continue; }
    if (!admissible_nei[key_anchor][dv_key][key_nei].conn) { continue; }

    decorate_pgr_cgroup(pgr, ux,uy,uz, cgroup, lvl+1);
  }

}

function decorate_pgr(pgr) {

  let admissible_nei = g_template.admissible_nei;

  let cur_cgroup = 0;

  for (let z=0; z<pgr.length; z++) {
    for (let y=0; y<pgr[z].length; y++) {
      for (let x=0; x<pgr[z][y].length; x++) {
        pgr[z][y][x][0]["cgroup"] = -1;
        pgr[z][y][x][0]["processed"] = false;
      }
    }
  }

  let dva = g_template.admissible_pos;

  for (let z=0; z<pgr.length; z++) {
    for (let y=0; y<pgr[z].length; y++) {
      for (let x=0; x<pgr[z][y].length; x++) {
        if (pgr[z][y][x][0].processed) { continue; }

        pgr[z][y][x][0].processed = true;
        pgr[z][y][x][0].cgroup = cur_cgroup;

        let key_anchor = pgr[z][y][x][0].name;

        for (let dvidx=0; dvidx<dva.length; dvidx++) {
          let dv_key = dva[dvidx].dv_key;
          let dv = dva[dvidx].dv;

          /*
          let ux = x + dv[0],
              uy = y + dv[1],
              uz = z + dv[2];
          */
          let _p = _posbc(pgr, x+dv[0], y+dv[1], z+dv[2]);
          let ux = _p[0],
              uy = _p[1],
              uz = _p[2];

          if (_oob(pgr, ux,uy,uz)) { continue; }

          let key_nei = pgr[uz][uy][ux][0].name;
          if (!(key_nei in admissible_nei[key_anchor][dv_key])) { continue; }
          if (!admissible_nei[key_anchor][dv_key][key_nei].conn) { continue; }

          decorate_pgr_cgroup(pgr, ux,uy,uz, cur_cgroup);

        }

        cur_cgroup++;

      }
    }
  }

}

function pgr_stat(pgr) {
  let _stat = {
    "group_size": {},
    "tile_count": {}
  };

  for (let z=0; z<pgr.length; z++) {
    for (let y=0; y<pgr[z].length; y++) {
      for (let x=0; x<pgr[z][y].length; x++) {

        for (let cidx=0; cidx<pgr[z][y][x].length; cidx++) {
          let _name = pgr[z][y][x][cidx].name;
          if (_name.length == 0) { continue; }

          let cname = _name.charAt(0);
          if (!(cname in _stat.tile_count)) {
            _stat.tile_count[cname] = 0;
          }
          _stat.tile_count[cname]++;

          if (cname == '.') { continue; }

          if (!("cgroup"in pgr[z][y][x][cidx])) { continue; }
          let cgroup = pgr[z][y][x][cidx].cgroup;
          if (!(cgroup in _stat.group_size)) {
            _stat.group_size[cgroup] = 0;
          }
          _stat.group_size[cgroup]++;
        }

      }
    }
  }

  return _stat;
}

function pgr_filter(pgr, filt) {

  for (let z=0; z<pgr.length; z++) {
    for (let y=0; y<pgr[z].length; y++) {
      for (let x=0; x<pgr[z][y].length; x++) {

        for (let cidx=0; cidx<pgr[z][y][x].length; cidx++) {
          if (!("cgroup" in pgr[z][y][x][cidx])) { continue; }
          let _name = pgr[z][y][x][cidx].name;
          if (_name.length == 0) { continue; }

          let cgroup = pgr[z][y][x][cidx].cgroup;
          if (cgroup in filt) {
            pgr[z][y][x][cidx].name = ".000";
          }


        }

      }
    }
  }


}

function pgr_blank(pgr, x0, y0, z0, dx, dy, dz) {

  for (let z=z0; z<(z0+dz); z++) {
    for (let y=y0; y<(y0+dy); y++) {
      for (let x=x0; x<(x0+dx); x++) {

        if (_oob(pgr, x,y,z)) { continue; }
        pgr[z][y][x] = [{ "name": ".000", "valid": true, "processed": false }];
      }
    }
  }
}

function realize_grid() {
  let debug = false;

  init_template();
  _build_tile_library( g_template.endpoint );

  //DEBUG
  let uniq_count = 0;
  for (let key in g_template.tile_attach) { uniq_count++; }
  g_info["uniq_tile_count"] = uniq_count;

  //---

  let M = g_info.grid_size;
  let pgr = init_pgr([M,M,M]);

  let S=4;
  let T=4;
  S=T=0;
  if (S>0) {
    pgr_blank(pgr, S, S, S, M-2*S, M-2*S, M-2*S);
  }
  if (T>0) {
    pgr_blank(pgr, T, T, 0, M-2*T, M-2*T, M);
    pgr_blank(pgr, T, 0, T, M-2*T, M, M-2*T);
    pgr_blank(pgr, 0, T, T, M, M-2*T, M-2*T);
  }

  g_info.data["pgr"] = pgr;

  let _r = grid_wfc_opt(pgr);

  if (g_info.debug_level>2) {
    console.log(">>", _r, pgr);
  }

  g_template["debug"] = pgr;

  decorate_pgr(pgr);

  if (g_info.debug_level>0) {
    console.log("=============");
    console.log("== BEFORE  ==");
    console.log("=============");
    debug_print_gr(pgr);
    console.log("=============");
  }

  let _stat = pgr_stat(pgr);
  g_info["_stat"] = _stat;


  let filt_group = {};
  let thresh = M;
  for (let group_name in _stat.group_size) {
    if (_stat.group_size[group_name] < thresh) {
      filt_group[group_name] = true;
    }
  }

  pgr_filter(pgr, filt_group);

  if (g_info.debug_level>0) {
    console.log("=============");
    console.log("== BEFORE  ==");
    console.log("=============");
    debug_print_gr(pgr);
    console.log("=============");
  }

  //realize_tri_from_sp_grid(pgr);
  //return;

  let fin_gr = gen_simple_grid(pgr);
  realize_tri_from_grid(fin_gr, pgr);

  g_info.data["grid"] = fin_gr;

}

function realize_tri_from_grid(gr, pgr, show_debug) {
  show_debug = ((typeof show_debug === "undefined") ? false : show_debug);
  g_info.debug = gr;
  g_info.data.tri = [];
  g_info.data.tri_color_idx = [];

  let M = gr.length;
  let S = 1;
  let tx = g_info.cx,
      ty = g_info.cy,
      tz = g_info.cz;

  let n = gr.length;

  tx = -S*((M-1)/2);
  ty = -S*((M-1)/2);
  tz = -S*((M-1)/2);

  color_idx=0;

  let mM = [];

  for (let zidx=0; zidx<gr.length; zidx++) {
    for (let yidx=0; yidx<gr[zidx].length; yidx++) {
      for (let xidx=0; xidx<gr[zidx][yidx].length; xidx++) {

        let u = gr[zidx][yidx][xidx];
        let template_u = u[0];
        if (template_u == '.') { continue; }

        if ((!show_debug) && (template_u == 'd')) { continue; }

        let ent = g_template.rot_lib[u];

        let _rx = Math.PI*ent.r[0]/2;
        let _ry = Math.PI*ent.r[1]/2;
        let _rz = Math.PI*ent.r[2]/2;

        let _tri = _template_rot_mov(g_template[template_u], _rx, _ry, _rz, xidx, yidx, zidx);
        _p_mul_mov(_tri, S, tx, ty, tz);
        g_info.data.tri.push(_tri);

        for (let ii=0; ii<_tri.length; ii+=3) {
          if (mM.length==0) {
            mM.push(_tri[ii]);
            mM.push(_tri[ii]);
            mM.push(_tri[ii+1]);
            mM.push(_tri[ii+1]);
            mM.push(_tri[ii+2]);
            mM.push(_tri[ii+2]);
          }

          if (mM[0] > _tri[ii+0]) { mM[0] = _tri[ii+0]; }
          if (mM[1] < _tri[ii+0]) { mM[1] = _tri[ii+0]; }

          if (mM[2] > _tri[ii+1]) { mM[2] = _tri[ii+1]; }
          if (mM[3] < _tri[ii+1]) { mM[3] = _tri[ii+1]; }

          if (mM[4] > _tri[ii+2]) { mM[4] = _tri[ii+2]; }
          if (mM[5] < _tri[ii+2]) { mM[5] = _tri[ii+2]; }

        }

        if ("cgroup" in pgr[zidx][yidx][xidx][0]) {
          g_info.data.tri_color_idx.push( pgr[zidx][yidx][xidx][0].cgroup );
        }
        else {
          g_info.data.tri_color_idx.push(color_idx);
          color_idx++;
        }

        if (g_info.debug_level > 3) {
          console.log(u, template_u);
        }
      }
    }
  }


  if (g_info.debug_level>2) {
    console.log("tri xX:", mM[0], mM[1]);
    console.log("tri yY:", mM[2], mM[3]);
    console.log("tri zZ:", mM[4], mM[5]);
  }

}

function realize_tri_from_sp_grid(gr, restrict_tile_h) {
  restrict_tile_h = ((typeof restrict_tile_h === "undefined") ? {} : restrict_tile_h);
  g_info.debug = gr;
  g_info.data.tri = [];

  //let S = 60;
  let S = 160;
  let tx = g_info.cx,
      ty = g_info.cy,
      tz = g_info.cz;

  for (let zidx=0; zidx<gr.length; zidx++) {
    for (let yidx=0; yidx<gr[zidx].length; yidx++) {
      for (let xidx=0; xidx<gr[zidx][yidx].length; xidx++) {

        let m = gr[zidx][yidx][xidx].length;
        let _fac = Math.pow( (1/3), Math.floor(m/27)+1 );

        for (let cidx=0; cidx<m; cidx++) {
          let u = gr[zidx][yidx][xidx][cidx].name;
          let template_u = u.charAt(0);
          if (template_u == '.') { continue; }

          if (template_u in restrict_tile_h) { continue; }
          if (u in restrict_tile_h) { continue; }

          let _f = 0.125;

          let __x = fxrand()*_f;
          let __y = fxrand()*_f;
          let __z = fxrand()*_f;
          //__x = 0; __y = 0; __z = 0;

          let dx = _f*(cidx%3) + __x;
          let dy = _f*(Math.floor(cidx/3)%3) + __y;
          let dz = _f*(Math.floor(cidx/9)%3) + __z;


          let ent = g_template.rot_lib[u];

          //console.log("u?", u, template_u, ent);

          //rot_lib[ukey] = { "m": [mx, my, mz], "r": [xidx, yidx, zidx ] };

          let _rx = Math.PI*ent.r[0]/2;
          let _ry = Math.PI*ent.r[1]/2;
          let _rz = Math.PI*ent.r[2]/2;

          let tu = [];
          for (let ii=0; ii<g_template[template_u].length; ii++) {
            tu.push( g_template[template_u][ii] );
          }
          let vv = _p_mul_mov(tu, _fac, dx, dy, dz);

          //let _tri = _template_rot_mov(g_template[template_u], _rx, _ry, _rz, xidx, yidx, zidx);
          let _tri = _template_rot_mov(vv, _rx, _ry, _rz, xidx, yidx, zidx);
          _p_mul_mov(_tri, S, tx + dx, ty + dy, tz + dz);
          g_info.data.tri.push(_tri);


          if (g_info.debug_level > 3) {
            console.log(u, template_u);
          }
        }
      }
    }
  }


}


function palette_load_json(txt) {
  let dat = JSON.parse(txt);
  g_info.palette = dat.pal;

  palette_load();
}

function palette_load() {
  g_info.palette_choice = _arnd( g_info.palette );

  if ("background" in g_info.palette_choice) {
    let n = g_info.palette_choice.colors.length;

    let distinct = true;
    for (let i=0; i<n; i++) {
      if (g_info.palette_choice.colors[i] == g_info.palette_choice.background) {
        distinct = false;
        break;
      }
    }

    if (distinct) {
      g_info.bg_color = g_info.palette_choice.background;
    }

  }

  // EXPERIMENT
  /*
  let pal = g_info.palette_choice.colors;
  for (let ii=0; ii<pal.length; ii++) {
    let _rgb = _hex2rgb( pal[ii] );
    let b = _brightness( _rgb.r, _rgb.g, _rgb.b );
    let rgb = [ _rgb.r, _rgb.g, _rgb.b ];
    if ( _brightness( rgb[0], rgb[1], rgb[2]) < 0.015) {
      let dc = 10;
      pal[ii] = _rgb2hex( rgb[0]+dc, rgb[1]+dc, rgb[2]+dc );
    }
  }
  */

  //g_info.bg_color = '#fefefe';

  //init_fin();
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


function init_fin() {

  //init_param();

  // SCALE

  let _wh = window.innerHeight;
  let _ww = window.innerWidth;
  let _F = ((_wh < _ww) ? _wh : _ww);
  //_F = _wh;

  //g_info.tri_scale = 1 + Math.ceil( 1.5*_F / g_info.grid_size );
  //g_info.tri_scale = 1 + Math.ceil( 1.25*_F / g_info.grid_size );
  //g_info.tri_scale = Math.ceil( 1.25*_F / g_info.grid_size );
  g_info.tri_scale = Math.ceil( 2*_F / g_info.grid_size );


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
    //else if (ev.key == 'p') {
    //  g_info.paused = !g_info.paused;
    //}
  });

  realize_grid();

  g_info.ready = true;

  threejs_scene_init();
  animate();
}

function pre_init() {
  init_param();
  threejs_init();
  //animate();
  render();
}

function init() {
  loadjson("./chromotome.json", function(dat) { palette_load_json(dat); pre_init(); init_fin(); } );
  //init_fin();
}

//-----------------------------------
//-----------------------------------
//-----------------------------------
//-----------------------------------
//-----------------------------------
//-----------------------------------


function _ok() {
  let admissible_nei = g_template.admissible_nei;
  let uniq_repr = g_template.uniq_repr;

  for (let x in uniq_repr) {
    console.log(">>", x);
  }
}

function _main() {

  init_template();
  _build_tile_library( g_template.endpoint );

  //let pgr = init_pgr([4,4,4]);
  //let pgr = init_pgr([4,4,4]);
  let pgr = init_pgr([5,5,1]);

  let _ret = grid_cull_boundary(pgr);
  if (_ret.status != "success") { console.log("error"); return; }
  debug_print_gr(pgr);

  let _r = grid_wfc_opt(pgr);
  console.log("got>>", _r);
  let fin_gr = gen_simple_grid(pgr);
  console.log(fin_gr);

}

if (typeof module !== "undefined") {
  var m4 = require("./m4.js");
  _main();
}
