
/*
//---- do not edit the following code (you can indent as you wish)
var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('');
var b58dec = str=>[...str].reduce((p,c)=>p*alphabet.length+alphabet.indexOf(c)|0, 0);
var fxhashTrunc = fxhash.slice(2);
var regex = new RegExp(".{" + ((fxhash.length/4)|0) + "}", 'g');
var hashes = fxhashTrunc.match(regex).map(h => b58dec(h));
var sfc32 = (a, b, c, d) => {
  return () => {
    a |= 0; b |= 0; c |= 0; d |= 0
    var t = (a + b | 0) + d | 0
    d = d + 1 | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = c << 21 | c >>> 11
    c = c + t | 0
    return (t >>> 0) / 4294967296
  }
};
var fxrand = sfc32(...hashes);
//var isFxpreview = new URLSearchParams(window.location.search).get('preview') === "1";
function fxpreview() { console.log("fxhash: TRIGGER PREVIEW") }
*/


var g_info = {
  "PROJECT" : "like go up",
  "VERSION" : "0.1.4",

  "rnd_idx": 0,
  "rnd": [],
  "ds": 5,

  "ready": false,
  "preview_available": false,

  "boundary_condition": 'n',


  "paused":false,

  "quiet":false,
  "grid_size": [8,8,8],
  "avg_grid_size": 8,

  "tile_width" : 1/4,
  "tile_height": 1/7

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
    //"p": 1,
    "^": 1
  },

  "_weight": {
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
    //"p": -1,
    "^": -1
  },

  "_pdf":  {
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
  //"p" : [],
  "r" : [],
  "^" : [],
  "+" : [],
  "T" : []

};

function _pos_keystr(x,y,z) {
  return x.toString() + ":" + y.toString() + ":" + z.toString();
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

    /*
    "p": [
      [ -_g_w/2, -1/2, -_g_h/2 ], [  _g_w/2, -1/2, -_g_h/2 ],
      [ -_g_w/2, -1/2, +_g_h/2 ], [  _g_w/2, -1/2, +_g_h/2 ]
    ],
    */

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


  /*
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

  */


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


// by using the endpoint library,
// build a list of all rotations of the endpoints (raw_lib),
// a map of equivalent representations (equiv_lib),
// a map that has the representative of each rotational class (repr_map),
// a 'tile_attach' list of tiles that can attach to each other (based off
// of the endpoint)
//
function build_tile_library( _endp_lib ) {
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


//-----
//-----
//-----
//-----


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

//
// m[t_idx][dv_Key] : {
//   val
//   dv
// }
//
function cell_renormalize( cell, t_idx ) {
  t_idx = ((typeof t_idx === "undefined") ? 0 : t_idx);
  let _eps = 1/(1024*1024*1024);

  let admissible_pos = g_template.admissible_pos;

  let R = {};

  for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
    let dv_key = admissible_pos[dv_idx].dv_key;
    R[dv_key] = 0;
  }

  for (let cell_idx=0; cell_idx < cell.length; cell_idx++) {
    for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
      let dv_key = admissible_pos[dv_idx].dv_key;
      R[dv_key] += cell[cell_idx].mu[t_idx][dv_key].val;
    }
  }

  for (let dv_key in R) {
    if (Math.abs(R[dv_key]) < _eps) { R[dv_key] = 1; }
  }

  for (let cell_idx=0; cell_idx < cell.length; cell_idx++) {
    for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
      let dv_key = admissible_pos[dv_idx].dv_key;
      cell[cell_idx].mu[t_idx][dv_key].val /= R[dv_key];
    }
  }

}

function grid_renormalize(gr, t_idx) {

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {
        cell_renormalize(gr[z][y][x], t_idx);
      }
    }
  }

}

function debug_cell_renorm(cell, t_idx) {
  t_idx = ((typeof t_idx === "undefined") ? 0 : t_idx);
  let _eps = 1/(1024*1024*1024);

  let admissible_pos = g_template.admissible_pos;

  let R = {};
  for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
    let dv_key = admissible_pos[dv_idx].dv_key;
    R[dv_key] = 0;
  }

  for (let cell_idx=0; cell_idx < cell.length; cell_idx++) {
    for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
      let dv_key = admissible_pos[dv_idx].dv_key;
      R[dv_key] += cell[cell_idx].mu[t_idx][dv_key].val;
    }
  }

  for (let dv_idx=0; dv_idx < admissible_pos.length; dv_idx++) {
    let dv_key = admissible_pos[dv_idx].dv_key;
    console.log(dv_key, R[dv_key]);
  }

}

function init_pgr(pgr_dim) {
  let admissible_pos = g_template.admissible_pos;

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
          let _info = {
            "name":tile_name,
            "valid": true,
            "processed":false,
            "mu": [ ],
            "cgroup":-1
          };

          for (let t=0; t<2; t++) {
            _info.mu.push({});
            for (let dvidx=0; dvidx<admissible_pos.length; dvidx++) {
              let dv_key = admissible_pos[dvidx].dv_key;
              _info.mu[t][dv_key] = {
                "val": ( (t==0) ? fxrand() : 0 ),
                "dv": admissible_pos[dvidx].dv
              };
            }
          }


          pgr[z][y][x].push( _info ); 
        }

        cell_renormalize( pgr[z][y][x] );


      }
    }
  }

  return pgr;
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

              let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
              let ux = _p[0],
                  uy = _p[1],
                  uz = _p[2];

              if (!(dv_key in admissible_nei[key_anchor])) { continue; }

              // oob check
              //
              for (let key_nei in admissible_nei[key_anchor][dv_key]) {
                if (admissible_nei[key_anchor][dv_key][key_nei].conn) {

                  if (_oob(gr, ux,uy,uz)) {
                    tile_valid = false;
                    break;
                  }
                }
              }

              if (!(tile_valid)) {
                gr_cell[cidx].valid = false;
                still_processing = true;
                break;;
              }

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

              if (!anchor_has_valid_conn) {
                tile_valid = false;

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


function is_admissible(h, anchor_tile_name, dv_key, nei_tile_name) {

  if (!(anchor_tile_name in h)) { return 0; }
  if (!(dv_key in h[anchor_tile_name])) { return 0; }
  if (!(nei_tile_name in h[anchor_tile_name][dv_key])) { return 0; }

  return 1;
}

function grid_belief(gr, t_idx) {
  t_idx = ((typeof t_idx==="undefined") ? 0 : t_idx);
  let _eps = (1/(1024*1024*1024*1024));
  let max_belief = {
    "v": [0,0,0],
    "tile": "",
    "belief":-1
  };


  let oppo = g_template.oppo;
  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;


  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let S = 0;
        let _belief = [];

        let gr_cell = gr[z][y][x];
        if (gr_cell.length < 2) { continue; }
        for (let i=0; i<gr_cell.length; i++) {

          _belief.push(1);
          for (let dv_idx=0; dv_idx<admissible_pos.length; dv_idx++) {
            let dv_key = admissible_pos[dv_idx].dv_key;
            let dv = admissible_pos[dv_idx].dv;

            let p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
            let ux = p[0],
                uy = p[1],
                uz = p[2];
            if (_oob(gr,ux, uy, uz)) { continue; }

            _belief[i] *= gr_cell[i].mu[t_idx][dv_key].val;
          }


          S += _belief[i];
        }

        if (S < _eps) { S=1; }

        for (let i=0; i<gr_cell.length; i++) {
          _belief[i] /= S;
        }

        for (let i=0; i<gr_cell.length; i++) {
          if (max_belief.belief < _belief[i]) {
            max_belief.belief = _belief[i];
            max_belief.tile = gr_cell[i].name;
            max_belief.v = [x,y,z];
          }
              
        }


      }
    }
  }

  return max_belief;
}

function grid_collapse_tile(gr, x,y,z, tile_name) {

  let gr_cell = gr[z][y][x];
  for (let i=0; i<gr_cell.length; i++) {
    gr_cell[i].valid = ((gr_cell[i].name == tile_name) ? true : false);
  }

  grid_cull_remove_invalid(gr);
}

function grid_bp_clear(gr, t) {
  let oppo = g_template.oppo;
  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let gr_cell = gr[z][y][x];
        for (let i=0; i<gr_cell.length; i++) {

          for (let pidx=0; pidx<admissible_pos.length; pidx++) {
            let dv_key = admissible_pos[pidx].dv_key;
            gr_cell[i].mu[t][dv_key].val = 0;
          }
        }

      }
    }
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

          let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
          let ux = _p[0],
              uy = _p[1],
              uz = _p[2];

          if (!(dv_key in admissible_nei[key_anchor])) { continue; }

          // oob check
          //
          for (let key_nei in admissible_nei[key_anchor][dv_key]) {
            if (admissible_nei[key_anchor][dv_key][key_nei].conn) {

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


function grid_bp(gr, t_cur) {
  t_cur = ((typeof t_cur === "undefined") ? 0 : t_cur);
  let _eps = 1/(1024*1024*1024*1024);

  t_nxt = (t_cur+1)%2;

  grid_bp_clear(gr, t_nxt);

  let oppo = g_template.oppo;
  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let anchor_cell = gr[z][y][x];

        for (let anchor_idx=0; anchor_idx<anchor_cell.length; anchor_idx++) {
          let anchor_tile = anchor_cell[anchor_idx];

          for (let dv_idx=0; dv_idx<admissible_pos.length; dv_idx++) {
            let anchor_dv_key = admissible_pos[dv_idx].dv_key;
            let dv = admissible_pos[dv_idx].dv;

            let p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
            let ux = p[0],
                uy = p[1],
                uz = p[2];
            if (_oob(gr,ux, uy, uz)) {
              anchor_tile.mu[t_nxt][anchor_dv_key].val = 0;
              continue;
            }

            let nei_cell = gr[uz][uy][ux];

            let mu_ij_b = 0;
            for (let nei_idx=0; nei_idx<nei_cell.length; nei_idx++) {
              let nei_tile = nei_cell[nei_idx];

              //
              //                       - 1 valid adjacency (connected or no)
              // f_{i,j}(nei,anch) = <
              //                       - 0 non-valid adjacency (cannot be placed together)
              //
              if (is_admissible(admissible_nei, anchor_tile.name, anchor_dv_key, nei_tile.name)==0) { continue; }

              //
              // g_i(nei) - assumed to be 1 (uniform)
              //

              //
              // \prod_{k\nN(i) \ j} \mu_{k,j}(a)
              //

              let _P_mu_kj_a = 1;
              for (let nei_dv_idx=0; nei_dv_idx<admissible_pos.length; nei_dv_idx++) {
                let nei_dv_key = admissible_pos[nei_dv_idx].dv_key;
                let nei_dv = admissible_pos[nei_dv_idx].dv;

                // in case we implement these boundary conditions or
                // degenerate caess?
                //
                if (!(nei_dv_key in nei_tile.mu[t_cur])) { continue; }
                if (_oob(gr, ux+nei_dv[0], uy+nei_dv[1], uz+nei_dv[2])) { continue; }

                // disallow msg back into where w're coming from (anchor)
                //
                let _bp_dv_key = oppo[nei_dv_key];
                if (_bp_dv_key == anchor_dv_key) { continue; }

                // running product of messages from neighbors of neighbor
                //
                _P_mu_kj_a *= nei_tile.mu[t_cur][nei_dv_key].val;

                /*
                if (debug) {
                  //let _s = ["mu_{(",ux,uy,uz,"),(", x,y,z,")(" + anchor_tile.name + ") +="].join(" ");
                  let _s = [ "mu_{:,(", x,y,z,")}(" + anchor_tile.name + "): R_{(", ux, uy, uz, ")}(" + nei_tile.name + ") *="].join(" ");
                  _s += ["  g_{(",ux,uy,uz,")}(" + nei_tile.name + ")", "(", nei_dv_key, ")", nei_tile.mu[t_cur][nei_dv_key].val].join(" ");
                  _s += [ " [", _P_mu_kj_a, "]" ].join(" ");
                  console.log(_s);
                  //console.log("mu_{(",ux,uy,uz,"),(", x,y,z,")(" + anchor_tile.name + ") +=");
                  //console.log("  ", anchor_tile.name + "(", x,y,z, ")", nei_tile.name + "(", nei_dv_key, ")", nei_tile.mu[t_cur][nei_dv_key].val);
                }
                */

              }

              //DEBUG
              //console.log("### mu_ij_b += ", _P_mu_kj_a);

              mu_ij_b += _P_mu_kj_a;

            }

            //DEBUG
            //console.log(anchor_tile.name, "[t:", t_nxt, "][", anchor_dv_key, "]=", mu_ij_b);

            anchor_tile.mu[t_nxt][anchor_dv_key].val = mu_ij_b;

          }
        }

      }
    }
  }

  //console.log("BEFORE RENORM:");
  //debug_print_p(gr, t_nxt, 6);

  // renormalize our newly calculated mu's
  //
  grid_renormalize(gr, t_nxt);

  //console.log("AFTER RENORM:");
  //debug_print_p(gr, t_nxt, 6);


  let max_diff = -1;
  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let anchor_cell = gr[z][y][x];
        for (let anchor_idx=0; anchor_idx<anchor_cell.length; anchor_idx++) {
          let anchor_tile = anchor_cell[anchor_idx];

          for (let dv_idx=0; dv_idx<admissible_pos.length; dv_idx++) {
            let anchor_dv_key = admissible_pos[dv_idx].dv_key;
            let dv = admissible_pos[dv_idx].dv;

            let p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
            let ux = p[0],
                uy = p[1],
                uz = p[2];
            if (_oob(gr, ux,uy,uz)) { continue; }

            let cur_val = anchor_tile.mu[t_cur][anchor_dv_key].val;
            let nxt_val = anchor_tile.mu[t_nxt][anchor_dv_key].val;
            if ((max_diff < 0) ||
                (Math.abs(cur_val - nxt_val) > max_diff)) {
              max_diff = Math.abs(cur_val - nxt_val);
            }

          }
        }
      }
    }
  }

  return max_diff;
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
          u += gr[z][y][x][ii].name + sfx;
          valid_count++;
        }

        console.log(x,y,z,u);

      }

    }
  }
}

function debug_print_p(gr, t_idx, _digit) {
  t_idx = ((typeof t_idx === "undefined") ? 0 : t_idx);
  _digit = ((typeof _digit == "undefined") ? 3 : _digit);

  let admissible_pos = g_template.admissible_pos;

  let space_width = 16;

  let B = Math.pow(10, _digit);

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        console.log(x,y,z);

        for (let ii=0; ii<gr[z][y][x].length; ii++) {
          if (!gr[z][y][x][ii].valid) { continue; }

          let tile = gr[z][y][x][ii];

          let count = 0;
          let sfx = "";
          for (let dvidx=0; dvidx<admissible_pos.length; dvidx++) {
            let dv_key = admissible_pos[dvidx].dv_key;
            if (dv_key in tile.mu[0]) {
              if (count>0) { sfx += " "; }
              let v = tile.mu[t_idx][dv_key].val;
              let vs = (Math.floor(v*B)/B).toString();

              if (vs == "0") { vs = "" ; }
              else { vs = "(" + vs + ")"; }
              let str_ele = dv_key + " " + vs  ;
              if (str_ele.length < space_width) {
                //str_ele = " ".repeat(space_width - str_ele.length) + str_ele;
                str_ele += " ".repeat(space_width - str_ele.length);
              }
              //sfx += dv_key + "(" + vs  + ")";
              sfx += str_ele;
              count++;
            }
          }


          console.log("  ", gr[z][y][x][ii].name, sfx);
        }

      }

    }
  }
}



//-----
//-----
//-----

function filter_gr(gr, x,y,z, tile_list) {
  let tile_map = {};
  for (let ii=0; ii<tile_list.length; ii++) {
    tile_map[ tile_list[ii] ] = true
  }

  let cell_list = gr[z][y][x];

  for (let ii=0; ii<cell_list.length; ii++) {
    let tile_name = cell_list[ii].name;

    if (!(tile_name in tile_map)) { continue; }
    cell_list[ii].valid = false;
  }

  grid_cull_remove_invalid(gr);
}

function grid_finished(gr) {

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        if (gr[z][y][x].length > 1) { return false; }

      }
    }
  }

  return true;

}

function grid_bpc(pgr) {
  let iter_stop_eps = (1/(1024*1024*1024*1024));
  iter_stop_eps = (1/(1024));
  let iter=0;
  let d = 0;
  let n_iter = 10000;
  let time_idx = 0;

  let _ret = {"msg":"?" };

  grid_renormalize(pgr);

  console.log("start");
  let processing = true;
  while (processing) {

    console.log("...");

    if (grid_finished(pgr)) { break; }

    for (iter=0; iter<n_iter; iter++) {
      if ((iter%10)==0) { console.log("### iter:", iter, "max_change:", d); }

      d = grid_bp(pgr, time_idx);
      time_idx=1-time_idx;
      if (d<iter_stop_eps) { break; }
    }

    let belief = grid_belief(pgr);

    console.log(">>>>", belief);

    grid_collapse_tile(pgr, belief.v[0], belief.v[1], belief.v[2], belief.tile);

    let accessed={};
    _fill_accessed(pgr, accessed, belief.v[0], belief.v[1], belief.v[2]);

    let r = grid_cull_propagate_opt(pgr, accessed);
    if (r.state == "finished") { _ret = r; break; }

    //debug_print_p(pgr, time_idx, 4);

  }

  console.log("end");


}

function init() {
  init_template();
  build_tile_library( g_template.endpoint );

  let dim = [12,12,3];
  let pgr = init_pgr(dim);

  g_info["grid"] = pgr;

  grid_cull_boundary(pgr);
  grid_cull_propagate(pgr);

  let r = grid_bpc(pgr);
  console.log(">>> bpc:", r);

  console.log(">>> consistency:", grid_consistency(pgr));

  debug_print_p(pgr);

  return;

  grid_renormalize(pgr);

  //debug_print_p(pgr);

  /*
  filter_gr(pgr, 0, 0, 0, [ 'p013', 'p012', 'r003', '^012' ]);
  filter_gr(pgr, 1, 0, 0, [ 'p011', 'p012', 'r003', '^011' ]);
  filter_gr(pgr, 0, 1, 0, [ 'p013', 'p010', '^013' ]);
  filter_gr(pgr, 1, 1, 0, [ 'p011', 'p010', '^010' ]);
  */

  /*
  let t = 0;
  grid_bp(pgr, t);
  t=1-t;
  grid_renormalize(pgr, t);
  */


  let t = 0;
  console.log("---------------------------- t=", t);
  debug_print_p(pgr, t);
  console.log("---");

  let iter_stop_eps = (1/(1024*1024*1024*1024));
  let iter=0;
  let n_iter = 10000;
  let d = 0;
  for (iter=0; iter<n_iter; iter++) {
    if ((iter%10)==0) { console.log("### iter:", iter, "max_change:", d); }

    d = grid_bp(pgr, t);
    t=1-t;

    //console.log("---------------------------- t=", t, d);
    //debug_print_p(pgr, t, 4);



    //console.log("...", d);
    if (d<iter_stop_eps) { break; }
  }

  let ele = grid_belief(pgr, t);
  console.log(">>>", ele);

  grid_collapse_tile(pgr, ele.v[0], ele.v[1], ele.v[2], ele.tile);

  for (iter=0; iter<n_iter; iter++) {
    if ((iter%10)==0) { console.log("### iter:", iter, "max_change:", d); }

    d = grid_bp(pgr, t);
    t=1-t;

    //console.log("---------------------------- t=", t, d);
    //debug_print_p(pgr, t, 4);



    //console.log("...", d);
    if (d<iter_stop_eps) { break; }
  }



  console.log("---------------------------- t=", t, "iter=", iter, "max_change=", d);
  debug_print_p(pgr, t, 4);



  //console.log("---------------------------- t=1");
  //debug_print_p(pgr, 1);

  //debug_cell_renorm(pgr[0][3][3]);
  
}


if (typeof module !== "undefined") {

  //                v5
  //                |
  // v0 - v1 - v3 - v4 - v6
  //      |
  //      v2

  var g_grid = {
    "v0": { "nei": { "v1": true }, "val": [] },
    "v1": { "nei": { "v0": true, "v2":true, "v3": true }, "val":[] },
    "v2": { "nei": { "v1": true }, "val": [] },
    "v3": { "nei": { "v2": true, "v4": true }, "val": [] },
    "v4": { "nei": { "v3": true, "v5": true, "v6": true }, "val": [] },
    "v5": { "nei": { "v4": true }, "val": [] },
    "v6": { "nei": { "v4": true }, "val": [] }
  };


  function main() {
    init();

    g_info.debug = {};
  }

  var m4 = require("./m4.js");

  if (typeof fxrand === "undefined") {
    if (!g_info.quiet) {
      console.log("WARNING: USING BUILT-IN Math.random() INSTEAD OF fxrand()");
    }

    var fxrand = Math.random;
  }

  module.exports["build_tile_library"] = build_tile_library;
  module.exports["template"] = g_template;

  module.exports["info"] = g_info;

  main();

}

