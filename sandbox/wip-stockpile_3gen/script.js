//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
//
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

// requires jsclipper

var g_info = {
  "PROJECT" : "I Stockpile Dreams With Tragedies",
  "VERSION" : "2.0.0",
  "download_filename": "stockpile_dream_tragedy_2gen.png",
  "download_filename_svg": "stockpile_dream_tragedy_2gen.svg",

  "ready": false,
  "pause": false,

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,
  //"capture_dt":1000,

  "ppi" : 300,
  "svg_width_in" : 36,
  "svg_height_in" : 36,

  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,
  "anim": true,

  "phase0": false,

  "bg_color" : "#151515",

  "f_list_cur": [],
  "f_list": [
    { "group_name": "stripe", "p": [
      { "v": "stripe_45_square", "w":0.5 },
      { "v": "stripe_m45_square", "w":0.5 }
    ] },

    { "group_name": "stripe_gate", "p": [
      { "v": "stripe_gate:0", "w":0.5 },
      { "v": "stripe_gate:1", "w":0.5 }
    ] },

    { "group_name": "square_grid", "p": [
      { "v": "square_grid", "w":1 }
    ] },

    { "group_name": "hatching_grid", "p" : [
      { "v": "hatching_grid", "w":1 }
    ]},

    { "group_name": "square_square", "p":[
      { "v": "square_square", "w":1 }
    ]},

    { "group_name": "square_circle", "p":[
      { "v": "square_circle", "w":1 }
    ]},

    { "group_name": "circle_circle", "p":[
      { "v": "circle_circle", "w":1 }
    ]},

    { "group_name": "circle_square", "p":[
      { "v": "circle_square", "w":1 }
    ]},

    { "group_name": "circle_band", "p":[
      { "v": "circle_band", "w":1 },
      { "v": "circle_band:1", "w":1 }
    ]},

    { "group_name": "circle_half", "p":[
      { "v": "circle_half", "w":1 }
    ]},

    { "group_name": "circle_quarter", "p":[
      { "v": "circle_quarter:0", "w":0.25 },
      { "v": "circle_quarter:1", "w":0.25 },
      { "v": "circle_quarter:2", "w":0.25 },
      { "v": "circle_quarter:3", "w":0.25 }
    ]},

    { "group_name": "circle_invquarter", "p": [
      { "v": "circle_invquarter:0", "w":0.25 },
      { "v": "circle_invquarter:1", "w":0.25 },
      { "v": "circle_invquarter:2", "w":0.25 },
      { "v": "circle_invquarter:3", "w":0.25 }
    ]},

    { "group_name": "circle_drop", "p": [
      { "v": "circle_drop:0", "w":0.5 },
      { "v": "circle_drop:1", "w":0.5 }
    ]},

    { "group_name": "square_plus", "p": [
      { "v": "square_plus", "w":1 }
    ]},

    { "group_name": "square_band", "p": [
      { "v": "square_band", "w": 0.333 },
      { "v": "square_band:1", "w": 0.333 },
      { "v": "square_band:2", "w": 0.333 }
    ]}

  ],

  "rnd_hist_active": false,
  "rnd_hist": [],
  "rnd_hist_idx":0,

  "palette": [
  {
    "name": "kov_02",
    "colors": ["#e8dccc", "#e94641", "#eeaeae"],
    "stroke": "#e8dccc",
    "background": "#6c96be"
  },
  {
    "name": "cc239",
    "colors": ["#e3dd34", "#78496b", "#f0527f", "#a7e0e2"],
    "background": "#e0eff0"
  },
  {
    "name": "cc234",
    "colors": ["#ffce49", "#ede8dc", "#ff5736", "#ff99b4"],
    "background": "#f7f4ed"
  },
  {
    "name": "cc238",
    "colors": ["#553c60", "#ffb0a0", "#ff6749", "#fbe090"],
    "background": "#f5e9de"
  },
  {
    "name": "ducci_q",
    "colors": ["#4bae8c", "#d0c1a0", "#2d3538"],
    "stroke": "#2d3538",
    "background": "#d06440"
  },
  {
    "name": "ducci_h",
    "colors": ["#6b5c6e", "#4a2839", "#d9574a"],
    "stroke": "#d9574a",
    "background": "#ffc34b"
  },
  {
    "name": "ducci_x",
    "colors": ["#dd614a", "#f5cedb", "#1a1e4f"],
    "stroke": "#1a1e4f",
    "background": "#fbb900"
  },

  {
    "name": "dt04",
    "colors": ["#50978e", "#f7f0df"],
    "stroke": "#000000",
    "background": "#f7f0df"
  },
  {
    "name": "dt05",
    "colors": ["#ee5d65", "#f0e5cb"],
    "stroke": "#080708",
    "background": "#f0e5cb"
  },

  {
    "name": "yuma_punk",
    "colors": ["#f05e3b", "#ebdec4", "#ffdb00"],
    "stroke": "#ebdec4",
    "background": "#161616"
  },
  {
    "name": "yuma_punk2",
    "colors": ["#f2d002", "#f7f5e1", "#ec643b"],
    "stroke": "#19080e",
    "background": "#f7f5e1"
  },

  {
    "name": "spatial02",
    "colors": ["#ff5937", "#f6f6f4", "#f6f6f4"],
    "stroke": "#ff5937",
    "background": "#f6f6f4"
  },

  {
    "name": "spatial03i",
    "colors": ["#f6f6f4", "#4169ff", "#4169ff"],
    "stroke": "#f6f6f4",
    "background": "#4169ff"
  },

  {
    "name": "monochrom",
    "colors": ["#ffffff", "#eeeeee"]
  }

  ],
  "palette_choice": {},

  "n_row": 5,
  "n_col": 5,
  "symmetry_type": 0,

  "features": {},

  "f_hist":[]

};

//-----
// palette generation


//---
// https://stackoverflow.com/a/17946089
// CC-BY-SA MightyPork (https://stackoverflow.com/users/2180189/mightypork)
//
function _rgba2int(red,green,blue,alpha) {
  var r = red & 0xFF;
  var g = green & 0xFF;
  var b = blue & 0xFF;
  var a = alpha & 0xFF;

  var rgb = (r << 24) + (g << 16) + (b << 8) + (a);

  return rgb;
}
//
//---


function _li(x, sx, ex, a, b) {
  x = (x - sx) / (ex - sx);
  return x*(b-a) + a;
}

function lpnorm(x,y,p) {
  return Math.pow( Math.pow(Math.abs(x),p) + Math.pow(Math.abs(y),p), 1.0/p );
}
function hsl_wheel(x, y, _chrom) {
  let _hue = Math.atan2(y,x) + Math.PI;
  _hue = (_hue * 360) / (Math.PI*2);

  let _light = 1.0 - Math.sqrt( x*x + y*y );
  if (_light < 0) { _light = 0; }
  if (_light > 1) { _light = 1; }

  let c = chroma.hsl( _hue, _chrom, _light);
  let rgb = c.rgb();
  //let hx = jimp.rgbaToInt( rgb[0], rgb[1], rgb[2], 255 );
  let hx = _rgba2int( rgb[0], rgb[1], rgb[2], 255 );

  let _hex_s = _rgb2hex( rgb[0], rgb[1], rgb[2] );

  return { "hsl": [ _hue, _chrom, _light ], "rgb": rgb, "i" : hx, "hex": _hex_s };
}

function lch_wheel(x, y, _chrom) {
  let _hue = Math.atan2(y,x) + Math.PI;
  _hue = (_hue * 360) / (Math.PI*2);

  let _light = 1.0 - Math.sqrt( x*x + y*y );
  if (_light < 0) { _light = 0; }
  if (_light > 1) { _light = 1; }

  _light = _li(_light, 0, 1, -100, 150);
  _chrom = _li(_chrom, 0, 1, 0, 150);

  //let c = chroma.hsl( _hue, _chrom, _light);
  //let rgb = c.rgb();

  let c = chroma.lch( _light, _chrom, _hue );
  let rgb = c.rgb();
  //let hx = jimp.rgbaToInt( rgb[0], rgb[1], rgb[2], 255 );
  let hx = _rgba2int( rgb[0], rgb[1], rgb[2], 255 );

  let _hex_s = _rgb2hex( rgb[0], rgb[1], rgb[2] );

  return { "lch": [ _light, _chrom, _hue ], "rgb": rgb, "i" : hx, "hex": _hex_s };
}

// again trying to do random palettes
//
// * chose a random point in a circle
// * find the direction to center, get a length
//   of the line to draw
// * perturb the direction by a (small) random
//   angle
// * if it's bezier, find a control point to the left
//   or right
// * subdivide the line into n points
//
function palette_pal(_opt) {
  //_chrom = ((typeof _chrom === "undefined") ? 0.5 : _chrom);

  let _default_opt = {
    "f": "lch",
    "chroma" : 1,
    "li" : "bezier",
    "len": -1,
    "n": 5
  };

  _opt = ((typeof _opt === "undefined") ? _default_opt : _opt);
  for (var _key in _default_opt) {
    if (!(_key in _opt)) {
      _opt[_key] = _default_opt[_key];
    }
  }
  console.log(_opt);

  let _chrom = _opt.chroma;

  let _eps = 1.0 / (1024*1024);

  let _rtheta=0, _l0=0,
    p0 = [0,0], v=[0,0],
    d = 0;

  do {


    _rtheta = Math.PI * _rnd(-1, 1);
    //let _l0 = _rnd(0.25,1.25);
    _l0 = _rnd(0.45,0.55);

    //let p0 = [ _rnd(-1,0), _rnd(-1,1) ];
    p0 = [ Math.cos(_rtheta)*_l0, Math.sin(_rtheta)*_l0 ];
    v = [ -p0[0], -p0[1] ];
    d = Math.sqrt((v[0]*v[0]) + (v[1]*v[1]));
  } while (Math.abs(d) < _eps);

    /*
  while (Math.abs(d) < _eps) {
    p0 = [ _rnd(-1,0), _rnd(-1,0) ];
    v = [ -p0[0], -p0[1] ];
    d = Math.sqrt((v[0]*v[0]) + (v[1]*v[1]));
  }
  */


  v[0] = v[0]/d;
  v[1] = v[1]/d;
  // nudge v in some direction
  //
  let tv = [v[0], v[1]];
  let _va = Math.PI * _rnd(-0.125, 0.125);

  v = [
     Math.cos(_va)*v[0] + Math.sin(_va)*v[1],
    -Math.sin(_va)*v[0] + Math.cos(_va)*v[1],
  ];


  //let l = _rnd(0.125,0.65) + d;
  //let l = _rnd(0.45,0.55) + d;
  let _e1 = 1 - d - 0.05;
  let _s1 = _e1/2;
  let l = _opt.len;
  if (l<0) { l = _rnd(_s1,_e1) + d; }

  let p_end = [ p0[0] + v[0]*l, p0[1] + v[1]*l ];

  let pal = [];
  let n = _opt.n;

  console.log("p0:", p0);
  console.log("v:", v, "(orig:", tv, ")");
  console.log("p_end:", p_end, "{", _s1, _e1, "}");
  console.log("d:", d);
  console.log("l:", l, "(", d, "+ [", _s1, _e1, "])");
  console.log("_va:", _va);

  let dp = [ p_end[0] - p0[0], p_end[1] - p0[1] ];
  let dp_l = _rnd(-1/5,1/5);
  let mp = [ p0[0] + (dp[0]/2), p0[1] + (dp[1]/2) ];
  let pc = [ mp[0] - (dp_l*dp[1]), mp[1] + (dp_l*dp[0]) ];


  let bi = new Bezier(p0[0],p0[1], pc[0],pc[1], p_end[0],p_end[1]);

  for (let i=0; i<n; i++) {
    let x = 0, y = 0;


    if (_opt.li == "linear") {
      x = _li( i/(n-1), 0, 1, p0[0], p_end[0] );
      y = _li( i/(n-1), 0, 1, p0[1], p_end[1] );
    }
    else if (_opt.li == "bezier") {
      let _xy = bi.get( i/(n-1) );
      x = _xy.x;
      y = _xy.y;
    }

    console.log("i:", i, x, y);

    if (_opt.f == "hsl") {
      pal.push( hsl_wheel(x, y, _chrom) );
    }
    else {
      pal.push( lch_wheel(x, y, _chrom) );
    }
  }

  return pal;
}




//-----


// choose from a 'probability distribution'
// array.
// array should have entries:
//
// v - value
// s - cumulative distribution
//
// inefficient but simple
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

// choose from a 'probability distribution'
// array.
// array should have entries:
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

function _mrnd() {
  let _rn;
  if (g_info.rnd_hist_active) {
    if (g_info.rnd_hist.length <= g_info.rnd_hist_idx)  {
      g_info.rnd_hist.push( fxrand() );
    }
    _rn = g_info.rnd_hist[ g_info.rnd_hist_idx ];
    g_info.rnd_hist_idx++;
  }
  else {
    _rn = fxrand();
  }
  return _rn;
}



// some common helper functions
//

function _clamp(x,a,b) {
  if (x<a) { return a; }
  if (x>b) { return b; }
  return x;
}

function _max(a,b) {
  if (a>b) { return a; }
  return b;
}

function _min(a,b) {
  if (a<b) { return a; }
  return b;
}

function _mod1(a) {
  let q = Math.floor(a);
  return a - q;

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

function _rndpow(s) {
  return Math.pow(fxrand(), s);
}

function _arnd(a) {
  let n = a.length;
  let idx = _irnd(n);
  return a[idx];
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

function _hex2hsv(rgbhex) {
  let rgb = _hex2rgb(rgbhex);
  return RGBtoHSV(rgb.r, rgb.g, rgb.b);
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

// https://stackoverflow.com/a/596243 CC-BY-SA
// https://stackoverflow.com/users/61574/anonymous
//
function _brightness(r, g, b) {
  return ((r/255.0)*0.299) + (0.587*(g/255.0)) + (0.114*(b/255.0));
}


//----------------
//----------------
//
// jsclipper helper functions
//

// All coordinates are assumed to be integers (less than 100 bits).
// Floating point numbers need to be pre-scaled then reduced afterwards.
//

var example_paths0 = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
                    [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var example_paths1 = [[{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}],
                    [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]];


function _clip_union( rop_pgns, _pgns) {
  let clpr = new ClipperLib.Clipper();
  let joinType = ClipperLib.JoinType.jtRtound;
  let fillType = ClipperLib.PolyFillType.pftPositive;
  let subjPolyType = ClipperLib.PolyType.ptSubject;
  let clipPolyType = ClipperLib.PolyType.ptClip;
  let clipType = ClipperLib.ClipType.ctUnion;

  let scale = 16384;
  let sol_polytree= new ClipperLib.PolyTree();

  let pgns = [];
  for (let i=0; i<_pgns.length; i++) {
    let idx = pgns.length;
    pgns.push([]);
    for (let j=0; j<_pgns[i].length; j++) {
      pgns[idx].push( { "X": _pgns[i][j].X, "Y": _pgns[i][j].Y } );
    }
  }

  ClipperLib.JS.ScaleUpPaths(pgns, scale);

  clpr.AddPaths( pgns, subjPolyType );
  clpr.Execute( clipType, sol_polytree, fillType, fillType);

  let sol_paths = ClipperLib.Clipper.PolyTreeToPaths(sol_polytree);
  for (let i=0; i<sol_paths.length; i++) {
    let idx = rop_pgns.length;
    rop_pgns.push([]);
    for (let j=0; j<sol_paths[i].length; j++) {
      rop_pgns[idx].push( { "X": sol_paths[i][j].X / scale, "Y": sol_paths[i][j].Y / scale } );

    }
  }

  return rop_pgns;
}

function _copy_pgns(_pgns) {
  let pgns = [];
  for (let i=0; i<_pgns.length; i++) {
    let idx = pgns.length;
    pgns.push([]);
    for (let j=0; j<_pgns[i].length; j++) {
      pgns[idx].push( { "X": _pgns[i][j].X, "Y": _pgns[i][j].Y } );
    }
  }

  return pgns;
}

function _clip_intersect( rop_pgns, _pgnsA, _pgnsB ) {
  var clpr = new ClipperLib.Clipper();
  var joinType = ClipperLib.JoinType.jtRtound;
  var fillType = ClipperLib.PolyFillType.pftPositive;
  var subjPolyType = ClipperLib.PolyType.ptSubject;
  var clipPolyType = ClipperLib.PolyType.ptClip;
  var clipType = ClipperLib.ClipType.ctIntersection;

  let scale = 16384;
  let sol_polytree= new ClipperLib.PolyTree();

  let pgnsA = _copy_pgns(_pgnsA);
  let pgnsB = _copy_pgns(_pgnsB);

  ClipperLib.JS.ScaleUpPaths(pgnsA, scale);
  ClipperLib.JS.ScaleUpPaths(pgnsB, scale);

  clpr.AddPaths( pgnsA, subjPolyType, true );
  clpr.AddPaths( pgnsB, clipPolyType, true );
  clpr.Execute( clipType, sol_polytree, fillType, fillType );

  let sol_paths = ClipperLib.Clipper.PolyTreeToPaths(sol_polytree);
  for (let i=0; i<sol_paths.length; i++) {
    let idx = rop_pgns.length;
    rop_pgns.push([]);
    for (let j=0; j<sol_paths[i].length; j++) {
      rop_pgns[idx].push( { "X": sol_paths[i][j].X / scale, "Y": sol_paths[i][j].Y / scale } );

    }
  }

  return rop_pgns;
}

function _clip_difference ( rop_pgns, _pgnsA, _pgnsB ) {
  var clpr = new ClipperLib.Clipper();
  var joinType = ClipperLib.JoinType.jtRtound;
  var fillType = ClipperLib.PolyFillType.pftPositive;
  var subjPolyType = ClipperLib.PolyType.ptSubject;
  var clipPolyType = ClipperLib.PolyType.ptClip;
  var clipType = ClipperLib.ClipType.ctDifference;

  let scale = 16384;
  let sol_polytree= new ClipperLib.PolyTree();

  let pgnsA = _copy_pgns(_pgnsA);
  let pgnsB = _copy_pgns(_pgnsB);

  ClipperLib.JS.ScaleUpPaths(pgnsA, scale);
  ClipperLib.JS.ScaleUpPaths(pgnsB, scale);

  clpr.AddPaths( pgnsA, subjPolyType, true );
  clpr.AddPaths( pgnsB, clipPolyType, true );
  clpr.Execute( clipType, sol_polytree, fillType, fillType );

  let sol_paths = ClipperLib.Clipper.PolyTreeToPaths(sol_polytree);
  for (let i=0; i<sol_paths.length; i++) {
    let idx = rop_pgns.length;
    rop_pgns.push([]);
    for (let j=0; j<sol_paths[i].length; j++) {
      rop_pgns[idx].push( { "X": sol_paths[i][j].X / scale, "Y": sol_paths[i][j].Y / scale } );

    }
  }

  return rop_pgns;
}

function _clip_xor( rop_pgns, _pgnsA, _pgnsB ) {
  var clpr = new ClipperLib.Clipper();
  var joinType = ClipperLib.JoinType.jtRtound;
  var fillType = ClipperLib.PolyFillType.pftPositive;
  var subjPolyType = ClipperLib.PolyType.ptSubject;
  var clipPolyType = ClipperLib.PolyType.ptClip;
  var clipType = ClipperLib.ClipType.ctXor;

  let scale = 16384;
  let sol_polytree= new ClipperLib.PolyTree();

  let pgnsA = _copy_pgns(_pgnsA);
  let pgnsB = _copy_pgns(_pgnsB);

  ClipperLib.JS.ScaleUpPaths(pgnsA, scale);
  ClipperLib.JS.ScaleUpPaths(pgnsB, scale);

  clpr.AddPaths( pgnsA, subjPolyType, true );
  clpr.AddPaths( pgnsB, clipPolyType, true );
  clpr.Execute( clipType, sol_polytree, fillType, fillType );

  let sol_paths = ClipperLib.Clipper.PolyTreeToPaths(sol_polytree);
  for (let i=0; i<sol_paths.length; i++) {
    let idx = rop_pgns.length;
    rop_pgns.push([]);
    for (let j=0; j<sol_paths[i].length; j++) {
      rop_pgns[idx].push( { "X": sol_paths[i][j].X / scale, "Y": sol_paths[i][j].Y / scale } );

    }
  }

  return rop_pgns;

  /*
  clpr.AddPolygons( pgnsA, subjPolyType );
  clpr.AddPolygons( pgnsB, clipPolyType );

  clpr.Execute(clipType, rop_pgns, fillType, fillType );
  */

}

function _clip_offset( ofs_pgns, inp_pgns, ds ) {
  var joinType = ClipperLib.JoinType.jtRound;
  var miterLimit = 10;
  var autoFix = true;

  var clpr = new ClipperLib.Clipper();

  var t_pgns = clpr.OffsetPolygons( inp_pgns, ds, joinType, miterLimit, autoFix );

  for (var ind in t_pgns) {
    ofs_pgns.push(t_pgns[ind]);
  }

}

//----------------
//----------------

function polygon_with_holes(ctx, x, y, pgn, color) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  for (let i=0; i<pgn.length; i++) {
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ctx.moveTo(x + pgn[i][j].X, y + pgn[i][j].Y);
        continue;
      }
      ctx.lineTo(x + pgn[i][j].X, y + pgn[i][j].Y);
    }
  }

  ctx.fill();
}

function polygons(ctx, x, y, pgn, color) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  for (let i=0; i<pgn.length; i++) {
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ctx.moveTo(x + pgn[i][j].X, y + pgn[i][j].Y);
        continue;
      }
      ctx.lineTo(x + pgn[i][j].X, y + pgn[i][j].Y);
    }
  }
  ctx.fill();

}

function stripe_gate(ctx, x, y, width, phase, empty_width, stripe_width, color, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let opgn = [ [ {"X":0,"Y":0}, {"X":width,"Y":0}, {"X":width,"Y":width}, {"X":0,"Y":width} ] ];
  let epgn = [];

  let _s = empty_width + stripe_width;
  let n = Math.ceil( width / _s );

  // trailing _s/2 term fudged for superpause
  //

  for (i=-(n+3); i<(n+3); i++) {
    let _x = i*_s + phase*_s*2 + _s/2;
    epgn.push([
      { "X": _x, "Y":0 },
      { "X": _x + empty_width, "Y":0 },
      { "X": _x + empty_width, "Y":width },
      { "X": _x , "Y":width }
    ]);
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function stripe_gate_v(ctx, x, y, width, phase, empty_width, stripe_width, color, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let opgn = [ [ {"X":0,"Y":0}, {"X":width,"Y":0}, {"X":width,"Y":width}, {"X":0,"Y":width} ] ];
  let epgn = [];

  let _s = empty_width + stripe_width;
  let n = Math.ceil( width / _s );

  // trailing _s/2 term fudged for superpause
  //

  for (i=-(n+3); i<(n+3); i++) {
    let _y = i*_s + phase*_s*2 + _s/2;
    epgn.push([
      { "X": 0, "Y": _y },
      { "X": width, "Y": _y },
      { "X": width, "Y": _y + empty_width },
      { "X": 0, "Y": _y + empty_width }
    ]);
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }
}

function stripe_45_square(ctx, x, y, width, phase, empty_width, stripe_width, color, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let opgn = [ [ {"X":0,"Y":0}, {"X":width,"Y":0}, {"X":width,"Y":width}, {"X":0,"Y":width} ] ];
  let epgn = [];

  let _s = empty_width + stripe_width;
  let n = Math.ceil( width / _s );

  for (i=-(n+3); i<(n+3); i++) {
    let _x = i*_s + phase*_s*2;
    epgn.push([
      { "X": _x, "Y":0 },
      { "X": _x + empty_width, "Y":0 },
      { "X": _x - width + empty_width, "Y":width },
      { "X": _x - width, "Y":width }
    ]);
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function stripe_m45_square(ctx, x, y, width, phase, empty_width, stripe_width, color, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let opgn = [ [ {"X":0,"Y":0}, {"X":width,"Y":0}, {"X":width,"Y":width}, {"X":0,"Y":width} ] ];
  let epgn = [];

  let _s = empty_width + stripe_width;
  let n = Math.ceil( width / _s );


  for (i=-(n+3); i<(n+3); i++) {
    let _x = i*_s + phase*_s*2;
    epgn.push([
      { "X": _x, "Y":0 },
      { "X": _x + empty_width, "Y":0 },
      { "X": _x + width + empty_width, "Y":width },
      { "X": _x + width, "Y":width }
    ]);
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function square_grid(ctx, x, y, n, tot_width, small_square_width, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let _inset_width = tot_width - small_square_width;
  let _sw = small_square_width;
  let _ds = _inset_width / (n-1);

  let opgn = [ [ {"X":0,"Y":0}, {"X":tot_width,"Y":0}, {"X":tot_width,"Y":tot_width}, {"X":0,"Y":tot_width} ] ];
  let epgn = [];

  let _phase_x = small_square_width*2*(1.0 + Math.cos(Math.PI*2*phase))/2.0;
  let _phase_y = small_square_width*2*(1.0 + Math.sin(Math.PI*2*phase))/2.0;

  // the _sw/4 and _ds/2 + _sw/8 are fudged
  //

  for (let i=-3; i<(n+3); i++) {
    for (let j=-3; j<(n+3); j++) {
      let _x = i*_ds + _phase_x + _sw/4,
          _y = j*_ds + _phase_y - _ds/2 + _sw/8;

      epgn.push([
        {"X": _x,       "Y": _y },
        {"X": _x + _sw, "Y": _y },
        {"X": _x + _sw, "Y": _y + _sw},
        {"X": _x ,      "Y": _y + _sw},
      ]);

    }
  }

  let rop = [];
  _clip_intersect(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

// pretty hacky...might need to revisit
//
//  "working" parameters:
//
//  w = 200
//  hatching_grid(ctx, 410, 410, 4, w, w/6.25, "rgba(255,255,255,0.95)");
//
function hatching_grid(ctx, x, y, ndiag, tot_width, small_square_width, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase );
  let opgn = [ [ {"X":0,"Y":0}, {"X":tot_width,"Y":0}, {"X":tot_width,"Y":tot_width}, {"X":0,"Y":tot_width} ] ];
  let epgn = [];

  let _diag_len = tot_width / Math.sqrt(2.0);

  let _dr = small_square_width / Math.sqrt(2.0);

  let _cell_width_o = _diag_len / (ndiag-1.0);

  let _dx = _cell_width_o * Math.sqrt(2);
  let _dy = _cell_width_o * 3 / 2;

  let _phase_x = small_square_width*2*(1.0 + Math.cos(Math.PI*2*phase))/2.0;
  let _phase_y = small_square_width*2*(1.0 + Math.sin(Math.PI*2*phase))/2.0;

  // setup clipper polygons
  //
  let _by = -4;
  let m = ndiag+5;
  for (let i=-3; i<m; i++) {
    let _bx = ( ((i%2)==0) ? 0 : -(_dx/2) );
    _bx -= 0;
    for (let j=-3; j<m; j++) {
      let p = [];

      let _x = _bx + (j*_dx) + _phase_x;
      let _y = _by + (i*_dy/2) + _phase_y;

      p.push( {"X":_x + _dr, "Y":_y} );
      p.push( {"X":_x, "Y":_y + _dr} );
      p.push( {"X":_x-_dr, "Y":_y} );
      p.push( {"X":_x, "Y":_y-_dr} );

      epgn.push(p);

    }
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygon_with_holes(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function square_square(ctx, x, y, owidth, iwidth, color, ropt) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.lineTo(x + owidth, y);
  ctx.lineTo(x + owidth, y + owidth);
  ctx.lineTo(x, y + owidth);

  let _ds = (owidth - iwidth)/2;

  ctx.moveTo(x + _ds,y + _ds);
  ctx.lineTo(x + _ds , y + _ds + iwidth);
  ctx.lineTo(x + _ds + iwidth, y + _ds + iwidth);
  ctx.lineTo(x + _ds + iwidth, y + _ds);

  ctx.fill();

  if (typeof ropt !== "undefined") {
    let rop = [[
      { "X": 0, "Y": 0 },
      { "X": 0 + owidth, "Y": 0 },
      { "X": 0 + owidth, "Y": 0 + owidth },
      { "X": 0, "Y": owidth }
    ]];

    rop.push([
      { "X": _ds, "Y": _ds },
      { "X": _ds, "Y": _ds + iwidth },
      { "X": _ds + iwidth, "Y": _ds + iwidth },
      { "X": _ds + iwidth, "Y": _ds }
    ]);

    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function square_circle(ctx, x, y, owidth, ir, color, ropt) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.lineTo(x + owidth, y);
  ctx.lineTo(x + owidth, y + owidth);
  ctx.lineTo(x, y + owidth);

  let _ds = (owidth - 2*ir)/2;

  ctx.moveTo(x + owidth/2,y + owidth/2);
  ctx.arc( x + owidth/2, y + owidth/2, ir, 0, 2*Math.PI, true);

  ctx.fill();

  if (typeof ropt !== "undefined") {
    let rop = [[
      { "X": 0, "Y": 0 },
      { "X": 0 + owidth, "Y": 0 },
      { "X": 0 + owidth, "Y": 0 + owidth },
      { "X": 0, "Y": 0 + owidth }
    ]];

    let N = 128;
    let circ = [];
    for (let i=0; i<N; i++) {
      let _px = ir*Math.cos(Math.PI*2*(i/N));
      let _py = ir*Math.sin(Math.PI*2*(i/N));
      circ.push( {"X": owidth/2 + _px, "Y": owidth/2 + _py } );
    }
    rop.push(circ);

    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function square_plus(ctx, x, y, width, height, band_x, band_y, color, ropt) {

  let _dx0 = (width - band_x)/2;
  let _dx1 = (band_x + _dx0);
  let _dy0 = (height - band_y)/2;
  let _dy1 = (band_y + _dy0);

  let v = [[]];
  v[0].push( {"X": _dx0, "Y":0 });
  v[0].push( {"X": _dx1, "Y":0 });

  v[0].push( {"X": _dx1, "Y":_dy0 });
  v[0].push( {"X": width, "Y":_dy0 });

  v[0].push( {"X": width, "Y":_dy1 });
  v[0].push( {"X": _dx1, "Y":_dy1 });

  v[0].push( {"X": _dx1, "Y":height});
  v[0].push( {"X": _dx0, "Y":height});

  v[0].push( {"X": _dx0, "Y":_dy1});
  v[0].push( {"X": 0, "Y":_dy1});

  v[0].push( {"X": 0, "Y":_dy0});
  v[0].push( {"X": _dx0, "Y":_dy0});

  polygons(ctx, x, y, v, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = v;
    ropt["x"] = x;
    ropt["y"] = y;
  }

  //return v;
}



function circle_circle(ctx, x, y, outer_r, inner_r, color, ropt) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.arc( x, y, outer_r, 0, 2*Math.PI, false);

  ctx.moveTo(x,y);
  ctx.arc( x, y, inner_r, 0, 2*Math.PI, true);

  ctx.fill();

  if (typeof ropt !== "undefined") {
    let rop = [];

    let N = 128;
    let ocirc = [];
    for (let i=0; i<N; i++) {
      let _px = outer_r*Math.cos(Math.PI*2*(i/N));
      let _py = outer_r*Math.sin(Math.PI*2*(i/N));
      ocirc.push( {"X": _px, "Y": _py } );
    }
    rop.push(ocirc);

    let icirc = [];
    for (let i=0; i<N; i++) {
      let _px =  inner_r*Math.cos(Math.PI*2*(i/N));
      let _py = -inner_r*Math.sin(Math.PI*2*(i/N));
      icirc.push( {"X": _px, "Y": _py } );
    }
    rop.push(ocirc);


    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }


}

function circle_square(ctx, x, y, r, width, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0.0 : phase);
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.arc( x, y, r, 0, 2*Math.PI, false);

  let pnts = [
    [-width/2, -width/2],
    [-width/2,  width/2],
    [ width/2,  width/2],
    [ width/2, -width/2]
  ];

  let _c = Math.cos(2.0*Math.PI*phase);
  let _s = Math.sin(2.0*Math.PI*phase);
  for (let i=0; i<pnts.length; i++) {
    let _a = pnts[i][0], _b = pnts[i][1];
    pnts[i][0] =  _c*_a + _s*_b;
    pnts[i][1] = -_s*_a + _c*_b;
  }

  ctx.moveTo( x + pnts[0][0], y + pnts[0][1] );
  ctx.lineTo( x + pnts[1][0], y + pnts[1][1] );
  ctx.lineTo( x + pnts[2][0], y + pnts[2][1] );
  ctx.lineTo( x + pnts[3][0], y + pnts[3][1] );

  ctx.fill();

  if (typeof ropt !== "undefined") {
    let rop = [];

    let N = 128;
    let ocirc = [];
    for (let i=0; i<N; i++) {
      let _px = r*Math.cos(Math.PI*2*(i/N));
      let _py = r*Math.sin(Math.PI*2*(i/N));
      ocirc.push( {"X": _px, "Y": _py } );
    }
    rop.push(ocirc);

    let sq = [
      { "X": pnts[0][0], "Y": pnts[0][1] },
      { "X": pnts[1][0], "Y": pnts[1][1] },
      { "X": pnts[2][0], "Y": pnts[2][1] },
      { "X": pnts[3][0], "Y": pnts[3][1] }
    ];
    rop.push(sq);

    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }


}

function circle_invquarter(ctx, x, y, _r, ang, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let sq_pgn = [[]];
  let circle_pgn = [[]];

  let r = _r/2;

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*r/(_ds*2.0));

  let cx = -r;
  let cy = -r;

  sq_pgn[0].push( {"X":-r, "Y":-r} );
  sq_pgn[0].push( {"X": r, "Y":-r} );
  sq_pgn[0].push( {"X": r, "Y": r} );
  sq_pgn[0].push( {"X":-r, "Y": r} );

  let _cosa = Math.cos(ang);
  let _sina = Math.sin(ang);

  let _cx =  _cosa*cx + _sina*cy;
  let _cy = -_sina*cx + _cosa*cy;
  circle_pgn[0].push( {"X": _cx, "Y": _cy });
  for (let i=0; i<=_dn; i++) {
    let theta = Math.PI*i/(_dn*2);

    let p = [ Math.cos(theta)*r*2 + cx,  Math.sin(theta)*r*2 + cy ];

    circle_pgn[0].push({
      "X":  _cosa*p[0] + _sina*p[1],
      "Y": -_sina*p[0] + _cosa*p[1]
    });

  }

  let rop = [];
  _clip_difference(rop, sq_pgn, circle_pgn);

  polygons(ctx, x, y, rop, color);


  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function circle_drop(ctx, x, y, _r, ang, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let circle_pgn = [[]];
  let circle_pgn1 = [[]];

  let r = _r/2;

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*r/(_ds*2.0));

  let cx = -r;
  let cy = -r;

  let _cosa = Math.cos(ang);
  let _sina = Math.sin(ang);

  let _cx =  _cosa*cx + _sina*cy;
  let _cy = -_sina*cx + _cosa*cy;
  circle_pgn[0].push( {"X": _cx, "Y": _cy });
  for (let i=0; i<=_dn; i++) {
    let theta = Math.PI*i/(_dn*2);

    let p = [ Math.cos(theta)*r*2 + cx,  Math.sin(theta)*r*2 + cy ];

    circle_pgn[0].push({
      "X":  _cosa*p[0] + _sina*p[1],
      "Y": -_sina*p[0] + _cosa*p[1]
    });

  }

  _cosa = Math.cos(ang + Math.PI);
  _sina = Math.sin(ang + Math.PI);

  _cx =  _cosa*cx + _sina*cy;
  _cy = -_sina*cx + _cosa*cy;
  circle_pgn1[0].push( {"X": _cx, "Y": _cy });
  for (let i=0; i<=_dn; i++) {
    let theta = Math.PI*i/(_dn*2);

    let p = [ Math.cos(theta)*r*2 + cx,  Math.sin(theta)*r*2 + cy ];

    circle_pgn1[0].push({
      "X":  _cosa*p[0] + _sina*p[1],
      "Y": -_sina*p[0] + _cosa*p[1]
    });

  }

  let rop = [];
  _clip_intersect(rop, circle_pgn, circle_pgn1);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }


}

function circle_quarter(ctx, x, y, _r, ang, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let circle_pgn = [[]];
  let band_pgn = [];

  let r = _r/2;

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*r/(_ds*2.0));

  let cx = -r;
  let cy = -r;

  let _cosa = Math.cos(ang);
  let _sina = Math.sin(ang);

  let _cx =  _cosa*cx + _sina*cy;
  let _cy = -_sina*cx + _cosa*cy;
  circle_pgn[0].push( {"X": _cx, "Y": _cy });
  for (let i=0; i<=_dn; i++) {
    let theta = Math.PI*i/(_dn*2);

    let p = [ Math.cos(theta)*r*2 + cx,  Math.sin(theta)*r*2 + cy ];

    circle_pgn[0].push({
      "X":  _cosa*p[0] + _sina*p[1],
      "Y": -_sina*p[0] + _cosa*p[1]
    });

  }

  polygons(ctx, x, y, circle_pgn, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = circle_pgn;
    ropt["x"] = x;
    ropt["y"] = y;
  }


}

function circle_half(ctx, x, y, r, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let circle_pgn = [[]];
  let band_pgn = [];

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*2*r/_ds);

  for (let i=0; i<_dn; i++) {
    let theta = Math.PI*2.0*i/_dn;
    circle_pgn[0].push({"X": Math.cos(theta)*r, "Y": Math.sin(theta)*r});
  }

  let pnts = [
    [ -r-1, -r-1 ],
    [  0, -r-1 ],
    [  0, r+1 ],
    [ -r-1, r+1 ]
  ];
  let _c = Math.cos(phase);
  let _s = Math.sin(phase);
  for (let i=0; i<4; i++) {
    let _a = pnts[i][0], _b = pnts[i][1];
    pnts[i][0] =  _c*_a + _s*_b;
    pnts[i][1] = -_s*_a + _c*_b;
  }

  band_pgn.push( [
    {"X": pnts[0][0] , "Y": pnts[0][1] },
    {"X": pnts[1][0] , "Y": pnts[1][1] },
    {"X": pnts[2][0] , "Y": pnts[2][1] },
    {"X": pnts[3][0] , "Y": pnts[3][1] },
  ]);

  let rop = [];
  _clip_difference(rop, circle_pgn, band_pgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function circle_band(ctx, x, y, r, band_x, band_y, color, phase, ropt) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let circle_pgn = [[]];
  let band_pgn = [];

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*2*r/_ds);


  for (let i=0; i<_dn; i++) {
    let theta = Math.PI*2.0*i/_dn;
    circle_pgn[0].push({"X": Math.cos(theta)*r, "Y": Math.sin(theta)*r});
  }

  if (band_x > 0) {

    let pnts = [
      [ -band_x/2, -r ],
      [  band_x/2, -r ],
      [  band_x/2,  r ],
      [ -band_x/2,  r ]
    ];
    let _c = Math.cos(phase);
    let _s = Math.sin(phase);
    for (let i=0; i<4; i++) {
      let _a = pnts[i][0], _b = pnts[i][1];
      pnts[i][0] =  _c*_a + _s*_b;
      pnts[i][1] = -_s*_a + _c*_b;
    }

    band_pgn.push( [
      {"X": pnts[0][0] , "Y": pnts[0][1] },
      {"X": pnts[1][0] , "Y": pnts[1][1] },
      {"X": pnts[2][0] , "Y": pnts[2][1] },
      {"X": pnts[3][0] , "Y": pnts[3][1] },
    ]);

  }

  if (band_y > 0) {

    let pnts = [
      [ -r, -band_y/2 ],
      [  r, -band_y/2 ],
      [  r,  band_y/2 ],
      [ -r,  band_y/2 ]
    ];
    let _c = Math.cos(phase);
    let _s = Math.sin(phase);
    for (let i=0; i<4; i++) {
      let _a = pnts[i][0], _b = pnts[i][1];
      pnts[i][0] =  _c*_a + _s*_b;
      pnts[i][1] = -_s*_a + _c*_b;
    }

    band_pgn.push( [
      {"X": pnts[0][0] , "Y": pnts[0][1] },
      {"X": pnts[1][0] , "Y": pnts[1][1] },
      {"X": pnts[2][0] , "Y": pnts[2][1] },
      {"X": pnts[3][0] , "Y": pnts[3][1] },
    ]);

  }

  let rop = [];
  _clip_difference(rop, circle_pgn, band_pgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

function square_band(ctx, x, y, width, height, band_x, band_y, color, ropt) {
  let outer_pgn = [[]];
  let inner_pgn = [];


  outer_pgn[0].push({"X":0, "Y":0});
  outer_pgn[0].push({"X":width, "Y":0});
  outer_pgn[0].push({"X":width, "Y":height});
  outer_pgn[0].push({"X":0, "Y":height});

  if (band_x > 0) {
    let _x = width/2-band_x/2,
        _y = 0,
        _w = band_x,
        _h = width;
    inner_pgn.push( [
      {"X": _x      , "Y": _y},
      {"X": _x + _w , "Y": _y},
      {"X": _x + _w , "Y": _y + _h},
      {"X": _x      , "Y": _y + _h},
    ]);
  }

  if (band_y > 0) {
    let _x = 0,
        _y = width/2-band_y/2,
        _w = width,
        _h = band_y;
    inner_pgn.push( [
      {"X": _x      , "Y": _y},
      {"X": _x + _w , "Y": _y},
      {"X": _x + _w , "Y": _y + _h},
      {"X": _x      , "Y": _y + _h},
    ]);
  }

  let rop = [];
  _clip_difference(rop, outer_pgn, inner_pgn);

  polygons(ctx, x, y, rop, color);

  if (typeof ropt !== "undefined") {
    ropt["pgns"] = rop;
    ropt["x"] = x;
    ropt["y"] = y;
  }

}

//------------
//------------
//------------


function test_clipper() {

  let rop = {};

  rop = [];
  _clip_union( rop, [ example_paths0[0], example_paths0[1], example_paths1[0], example_paths1[1] ] );
  polygon_with_holes(ctx, 300, 300, rop, color);

  rop = [];
  _clip_intersect( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 450, 300, rop, color);

  rop = [];
  _clip_difference( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 300, 450, rop, color);

  rop = [];
  _clip_xor( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 450, 450, rop, color);

  console.log(">>>", rop);

}

function test_f(ctx) {
  let color = "rgba(255,255,255,0.95)";

  //                    x    y     w   p  e   f    c
  stripe_45_square(ctx, 100, 100, 100, 0, 10, 20, "rgba(255,255,255,0.95)");

  //                     x    y     w   p  e   f    c
  stripe_m45_square(ctx, 100, 200, 100, 5, 10, 20, "rgba(255,255,255,0.95)");

  //                x    y   n  w    sw   c
  square_grid(ctx, 200, 100, 5, 100, 10, "rgba(255,255,255,0.95)");


  //                  x    y   n  w    ew   c
  let w = 100;
  hatching_grid(ctx, 210, 210, 4, w, w/6.25, "rgba(255,255,255,0.95)");

  w = 200;
  hatching_grid(ctx, 410, 410, 4, w, w/6.25, "rgba(255,255,255,0.95)");

  //                  x    y    ow, ow
  square_square(ctx, 301, 101, 98, 50, color);

  square_circle(ctx, 301, 201, 98, 25, color);

  color = "rgba(255,255,255, 0.25)";
  circle_circle(ctx, 451, 151, 98/2, 50/2, color);
  circle_circle(ctx, 476, 176, 98/2, 50/2, color);

  color = "rgba(255,255,255, 0.95)";
  circle_square(ctx, 451, 251, 98/2, 50, color);

  circle_band(ctx, 151, 351, 98/2, 10, 0, color);
  circle_band(ctx, 251, 351, 98/2, 0, 15, color);
  circle_band(ctx, 351, 351, 98/2, 12, 12, color);

  square_band(ctx, 101, 401, 98, 98, 30, 0, color);
  square_band(ctx, 201, 401, 98, 98, 0, 35, color);
  square_band(ctx, 301, 401, 98, 98, 40, 40, color);
}

function disp(ctx, fname, x, y, w, c, phase, ropt) {

  if (typeof ropt !== "undefined") {
    ropt["c"] = c;
    ropt["x"] = x;
    ropt["y"] = y;
    ropt["w"] = w;
  }

  let v=1;

  if (fname == "stripe_45_square") {
    //                    x  y  w  p   e   f    c
    stripe_45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c, ropt);
  }
  else if (fname == "stripe_m45_square") {
    //                    x  y  w  p   e   f    c
    stripe_m45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c, ropt);
  }

  else if (fname == "stripe_gate:0") {
    //               x     y    w      p       e    f    c
    stripe_gate(ctx, x+v, y+v, w-2*v, phase, w/12, w/12, c, ropt);
  }
  else if (fname == "stripe_gate:1") {
    //               x     y    w      p       e    f    c
    stripe_gate_v(ctx, x+v, y+v, w-2*v, phase, w/12, w/12, c, ropt);
  }



  else if (fname == "square_grid") {
    //               x   y n  w   sw   c
    square_grid(ctx, x+v, y+v, 5, w-2*v, w/10, c, phase, ropt);
  }

  else if (fname == "hatching_grid") {
    //                  x    y   n  w    ew   c
    hatching_grid(ctx, x+v, y+v, 4, w-2*v, w/6.25, c, phase, ropt);
  }

  else if (fname == "square_square") {
    //                  x    y    ow, ow
    square_square(ctx, x+v, y+v, w-2*v, w/2, c, ropt, ropt);
  }

  else if (fname == "square_plus") {
    square_plus(ctx, x+v, y+v, w, w, w/3, w/3, c, ropt);
  }

  else if (fname == "square_circle") {
    square_circle(ctx, x+v, y+v, w-2*v, w/4, c, ropt);
  }

  else if (fname == "circle_circle") {
    circle_circle(ctx, x+w/2, y+w/2, w/2 - v, w/4, c, ropt);
  }

  else if (fname == "circle_square") {
    circle_square(ctx, x+w/2, y+w/2, w/2 - v, w/2, c, phase, ropt);
  }

  else if (fname == "circle_band") {
    circle_band(ctx, x+w/2, y+w/2, w/2 - v, w/3, 0, c, phase, ropt);
  }

  else if (fname == "circle_band:1") {
    circle_band(ctx, x+w/2, y+w/2, w/2 - v, w/3, w/3, c, phase, ropt);
  }

  else if (fname == "circle_half") {
    circle_half(ctx, x+w/2, y+w/2, w/2 - v, c, phase, ropt);
  }


  else if (fname == "circle_quarter:0") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, 0, c, phase, ropt);
  }
  else if (fname == "circle_quarter:1") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase, ropt);
  }
  else if (fname == "circle_quarter:2") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, Math.PI, c, phase, ropt);
  }
  else if (fname == "circle_quarter:3") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, 3*Math.PI/2, c, phase, ropt);
  }

  else if (fname == "circle_invquarter:0") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, 0, c, phase, ropt);
  }
  else if (fname == "circle_invquarter:1") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase, ropt);
  }
  else if (fname == "circle_invquarter:2") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, Math.PI, c, phase, ropt);
  }
  else if (fname == "circle_invquarter:3") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, 3*Math.PI/2, c, phase, ropt);
  }

  else if (fname == "circle_drop:0") {
    circle_drop(ctx, x+w/2, y+w/2, w - v, 0, c, phase, ropt);
  }
  else if (fname == "circle_drop:1") {
    circle_drop(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase, ropt);
  }

  else if (fname == "square_band") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, w/3, 0, c, ropt);
  }

  else if (fname == "square_band:1") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, 0, w/3, c, ropt);
  }

  else if (fname == "square_band:2") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, w/3, w/3, c, ropt);
  }

}


// x - upper left x position
// y - upper left y position
// w - width to draw in
// R - resize factor for object display
// sub_n - how man subdivisions for the next reucr level
// recur_level - current recursion level
// max_recur - maximum depth of recusion
// use_rnd_hist - use saved random numbers or now
// shape_idx - shape  index to use (position in f_list)
//

function gen_hist_r(ctx,opt) {
  let x = opt.x;
  let y = opt.y;
  let w = opt.w;
  let R = ((typeof opt.R === "undefined") ? 1.0 : opt.R);
  let sub_n = ((typeof opt.sub_n === "undefined") ? 2 : opt.sub_n);
  let recur_level = ((typeof opt.recur_level === "undefined") ? 0 : opt.recur_level);
  let max_recur = ((typeof opt.max_recur === "undefined") ? 1 : opt.max_recur);
  let use_rnd_hist = ((typeof opt.use_rnd_hist === "undefined") ? false : opt.use_rnd_hist);
  let shape_lib_name = ((typeof opt.shape_lib_name === "undefined") ? "" : opt.shape_lib_name);
  let palette_idx = ((typeof opt.palette_idx === "undefined") ? -1 : opt.palette_idx);

  if (typeof opt.f_hist  === "undefined") {
    opt.f_hist = [];
  }

  if (recur_level >= max_recur) { return; }

  let mx = x + w/sub_n;
  let my = y + w/sub_n;
  let subw = w/sub_n;

  let p;
  if (use_rnd_hist) {
    if (g_info.rnd_hist.length <= g_info.rnd_hist_idx)  {
      g_info.rnd_hist.push( fxrand() );
    }
    p = g_info.rnd_hist[ g_info.rnd_hist_idx ];
    g_info.rnd_hist_idx++;
  }
  else {
    p = fxrand();
  }

  // probability vector
  //
  let p_vec = [0, 0, 1,1];

  let do_recur = false;

  // both high and recur...
  //
  if (p < p_vec[0]) {
    do_recur = true;
  }

  else if (p < p_vec[1]) {
    do_recur = true;
  }

  // show object without further recurrance
  //
  else if (p < p_vec[2]) {
    let _f = -1;
    let _a = (1.0 - _mrnd()*0.125) ;

    if (shape_lib_name == "") {
      _f = _pwrnd( g_info.f_list_cur );
    }
    else {
      _f = shape_lib_name;
    }

    opt["shape_lib_name"] = _f;

    if (palette_idx < 0) {
      palette_idx = Math.floor(_mrnd()*g_info.palette_choice.colors.length);
    }
    opt["palette_idx"] = palette_idx;

    let rgb = _hex2rgb( g_info.palette_choice.colors[palette_idx] );
    let _c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + _a + ")"

    let _freq = 1.0 - _mrnd()*0.5;
    let _init_phase =  _mrnd();

    if (!g_info.anim) {
      _freq = 0;
      _init_phase = 0;
    }

    let _ds = w - R*w;

    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _p_F, _p_i_p) {
      return function(__s, _ropt) {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/512 + _p_i_p)))/2.0;
        if (typeof __s !== "undefined") { _phase = __s; }
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _phase, _ropt);
      };
    })(ctx, _f, x + _ds/2, y + _ds/2, w - _ds, _c, _freq, _init_phase);

    //g_info.f_hist.push( {"f": _func, "lvl": recur_level });
    opt.f_hist.push( {"f": _func, "lvl": recur_level });

  }

  // both show object and recur
  // higher level object has larger alpha
  //
  else {

    let _f = -1;
    let _a = (0.6 - _mrnd()*0.25) ;

    if (shape_lib_name == "") {
      _f = _pwrnd( g_info.f_list_cur );
    }
    else {
      _f = shape_lib_name;
    }

    opt["shape_lib_name"] = shape_lib_name;

    if (palette_idx < 0) {
      palette_idx = Math.floor(_mrnd()*g_info.palette_choice.colors.length);
    }
    opt["palette_idx"] = palette_idx;

    let rgb = _hex2rgb( g_info.palette_choice.colors[palette_idx] );
    let _c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + _a + ")"

    let _freq = 1.0 - _mrnd()*0.5;
    let _init_phase =  _mrnd();

    if (!g_info.anim) {
      _freq = 0;
      _init_phase = 0.0;
    }

    let ds = w - R*w;

    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _p_F, _p_i_p) {
      return function(__s, _ropt) {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/512 + _p_i_p)))/2.0;
        if (typeof __s !== "undefined") { _phase = __s; }
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _phase, _ropt);
      };
    })(ctx, _f, x - ds/2, y - ds/2, w - ds, _c, _freq, _init_phase);

    //g_info.f_hist.push( {"f": _func, "lvl": recur_level });
    opt.f_hist.push( {"f": _func, "lvl": recur_level });

    do_recur = true;
  }

  if (do_recur) {

    let sub_choice = [2,3];
    let nxt_sub_n = sub_choice[ Math.floor(_mrnd()*sub_choice.length) ];

    for (let i=0; i<sub_n; i++) {
      for (let j=0; j<sub_n; j++) {
        let _x = x + i*subw;
        let _y = y + j*subw;

        let _ropt = {
          "x": _x,
          "y": _y,
          "w": subw,
          "R": R,
          "sub_n": nxt_sub_n,
          "recur_level": recur_level+1+(sub_n-2),
          "max_recur": max_recur,
          "use_rnd_hist": use_rnd_hist
        };
        gen_hist_r(ctx, _ropt);
      }
    }

  }

  return opt;
}

function anim() {

  if (!g_info.pause) {
    g_info.tick++;
  }

  window.requestAnimationFrame(anim);
  if (g_info.animation_capture) {
    g_info.capturer.capture( g_info.canvas );

    let _t = Date.now();

    console.log("!!", g_info.capture_end - _t);

    if (_t >= g_info.capture_end) {
      g_info.animation_capture = false;
      g_info.capturer.stop();
      g_info.capturer.save();
    }

  }

  if (!g_info.ready) { return; }

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch);

  let _phase = undefined;
  if (g_info.phase0) { _phase = 0; }

  for (let i=0; i<g_info.f_hist.length; i++) {
    g_info.f_hist[i].f(_phase);
  }

}

function clear(ctx, clear_width, clear_height, bg_color) {
  ctx = ((typeof ctx === "undefined") ? g_info.ctx : ctx);
  clear_width  = ((typeof clear_width  === "undefined") ? g_info.canvas.width  : clear_width)
  clear_height = ((typeof clear_height === "undefined") ? g_info.canvas.height : clear_height)
  bg_color     = ((typeof bg_color === "undefined") ? g_info.bg_color : bg_color)

  ctx.clearRect(0, 0, clear_width, clear_height);
  ctx.fillStyle = bg_color;
  ctx.rect(0,0, clear_width, clear_height);
  ctx.fill();
}

// create a 'raw' svg path string (without any of the xml bits)
// from the polygons as returned by clipper lib
//
function polygons2svg_raw_path(pgns, scale, x, y) {
  let svg_ele = [];

  for (let i=0; i<pgns.length; i++) {
    let pgn = pgns[i];
    for (let j=0; j<pgn.length; j++) {
      if (j==0) {
        svg_ele.push("M " + (x + (pgn[j].X*scale)).toString() + " " + (y + (pgn[j].Y*scale)).toString());
      }
      else {
        svg_ele.push("L " + (x + (pgn[j].X*scale)).toString() + " " + (y + (pgn[j].Y*scale)).toString());
      }
    }
  }

  let sfx = "Z";

  return svg_ele.join(" ") + sfx;
}

function polygons2svgpath(pgns, scale, x, y, c) {

  let _fillc = "#777";
  let _opac = "1.0";

  if (c.match(/^rgba/)) {
    let tok = c.replace(/rgba|[\(\)]/g, '').split(",");
    let r = parseFloat(tok[0]);
    let g = parseFloat(tok[1]);
    let b = parseFloat(tok[2]);
    let alpha = parseFloat(tok[3]);
    
    _fillc = _rgb2hex(r,g,b);
    _opac = tok[3];
  }

  let _p = polygons2svg_raw_path(pgns, scale, x, y);
  let _sp = '<path d="' + _p + '" stroke="none" fill="' + _fillc + '" fill-opacity="' + _opac + '" stroke-width="0" />';
  return _sp;
}

// wip
//
function downloadsvg() {
  let ppi = g_info.ppi;
  let svg_w = g_info.svg_width_in;
  let svg_h = g_info.svg_height_in;

  let svg_lines = [];

  let wpx = (ppi*svg_w).toString();
  let hpx = (ppi*svg_h).toString();

  let scale = 1;
  //let offsetx = 0;
  //let offsety = 0;

  /*
  if (g_info.n_col > g_info.n_row) {
    scale = hpx / g_info.height;
  }
  else {
    scale = wpx / g_info.width;
  }
  */

  svg_lines.push('<svg viewBox="0 0 ' + wpx + ' ' + hpx + '" ' +
    ' width="' + wpx + '" height="' + hpx + '" ' +
    ' xmlns="http://www.w3.org/2000/svg">');

  let first = true;
  let minx = 0, miny = 0, maxx = 0, maxy = 0;

  let winsz = 0;

  for (let i=0; i<g_info.f_hist.length; i++) {
    let ropt = {};
    g_info.f_hist[i].f(0, ropt);

    let ds = ropt.w;
    let tx0 = ropt.x - ds/2;
    let ty0 = ropt.y - ds/2;

    let tx1 = ropt.x + ds/2;
    let ty1 = ropt.y + ds/2;

    if (first) {
      minx = tx0; miny = ty1;
      maxx = tx0; maxy = ty1;
      first = false;
    }

    if (tx0 < minx) { minx = tx0; }
    if (tx1 > maxx) { maxx = tx1; }
    if (ty0 < miny) { miny = ty0; }
    if (ty1 > maxy) { maxy = ty1; }

    winsz = ropt.w;
  }

  let offsetx = -minx;
  let offsety = -miny;

  let dx = 0;
  let dy = 0;

  let winpx = 0;

  // so hacky....
  //
  if (g_info.n_row == g_info.n_col) {
    scale = hpx / (maxy - miny);
    winpx = hpx*winsz / g_info.height;
    dx = (1-(g_info.n_col / g_info.n_row))*wpx/2 - winpx/8;
    dy = -winpx/8;
  }
  else if (g_info.n_row > g_info.n_col) {
    extrapx = hpx*10 / g_info.height;
    extrapx = 0;

    winpx = hpx*winsz / g_info.height;

    scale = hpx / (maxy - miny);

    dx = (1-(g_info.n_col / g_info.n_row))*wpx/2 - winpx/4 + extrapx;
    dy = -winpx/4 + extrapx;
  }
  else {
    extrapx = wpx*10 / g_info.width;
    extrapx = 0;

    winpx = wpx*winsz / g_info.width;

    scale = wpx / (maxx - minx);

    dx = -winpx/4 + extrapx;
    dy = (1-(g_info.n_row / g_info.n_col))*hpx/2 - winpx/4 + extrapx;
  }

  let bgpx_w = g_info.n_col * winpx;
  let bgpx_h = g_info.n_row * winpx;

  let bg_rect = '<rect width="' + wpx + '" height="' + hpx + '" style="stroke:none;stroke-width:0;fill:' + g_info.bg_color + '" />';
  svg_lines.push(bg_rect);

  for (let i=0; i<g_info.f_hist.length; i++) {
    let ropt = {};
    g_info.f_hist[i].f(0, ropt);
    let _svg_path = polygons2svgpath(ropt.pgns, scale, scale*(ropt.x + offsetx) + dx, scale*(ropt.y + offsety) + dy, ropt.c);
    svg_lines.push( _svg_path + "\n");
  }

  svg_lines.push("</svg>");

  let svg_hdr = "data:img/svg+xml;base64,";

  let svg_txt = svg_hdr + btoa(unescape(encodeURIComponent(svg_lines.join(""))));

  let link = document.createElement("a");
  link.download = g_info.download_filename_svg;
  link.href = svg_txt;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}



function screenshot() {
  let canvas = document.getElementById("canvas");
  let imguri = canvas.toDataURL(canvas);

  let link = document.createElement("a");
  link.download = g_info.download_filename;
  link.href = imguri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function initCanvas() {
  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  g_info.width = W;
  g_info.height = H;

  g_info.width = W;
  g_info.height = H;

  let dS = ((W<H) ? W : H);

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = dS;

  if (g_info.ready) { init_fin(); }
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
  console.log(" a   - save animation (webm)");
  console.log(" s   - save screenshot (PNG)");
  console.log(" S   - export SVG");
  console.log(" p   - pause");
  console.log(" P   - set phase to 0 and pause (good for screenshots)");
  console.log("");

  console.log("Features:");
  for (let key in g_info.features) {
    console.log(key + ":", g_info.features[key]);
  }

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

function init_param() {
  let sub_choice = [2,3];

  g_info.n_row = Math.floor(_mrnd()*5) + 5;
  g_info.n_col = Math.floor(_mrnd()*5) + 5;
  g_info.n_cell = g_info.n_row;

  g_info.symmetry_type = Math.floor(_mrnd()*2);

  let _group_prob = 0.75*_mrnd() + 0.25;

  g_info.group_probability = _group_prob;

  // choose subset of shapes to use
  //
  let f_name = [];
  for (let i=0; i<g_info.f_list.length; i++) {
    if ( _mrnd() < _group_prob) {
      for (let j=0; j<g_info.f_list[i].p.length; j++) {
        g_info.f_list_cur.push(g_info.f_list[i].p[j]);
        f_name.push(g_info.f_list[i].p[j].v);
      }
    }
  }

  // force something if we didn't choose anything
  //
  if (f_name.length == 0) {
    let idx = Math.floor(_mrnd()*g_info.f_list.length);
    for (let j=0; j<g_info.f_list[idx].p.length; j++) {
      g_info.f_list_cur.push(g_info.f_list[idx].p[j]);
      f_name.push(g_info.f_list[idx].p[j].v);
    }
  }
  f_name.sort();

  // choose palette
  //
  g_info.palette_choice = _arnd( g_info.palette );

  //EXPERIMENTAL
  let _cur_pal = {
    "name":"custom",
    "colors":[]
  };
  let _pal = palette_pal();
  for (let ii=0; ii<_pal.length; ii++) { _cur_pal.colors.push( _pal[ii].hex ); }
  g_info.palette_choice = _cur_pal;
  g_info._pal = _pal;

  g_info.features["Shape Library"] = f_name.join(", ");
  g_info.features["Color Palette"] = g_info.palette_choice.name;

  g_info.features["Columns"] = g_info.n_col;
  g_info.features["Rows"] = g_info.n_row;
  g_info.features["Symmetry Type"] = g_info.symmetry_type;

  g_info.features["Group Probability"] = _group_prob;

  window.$fxhashFeatures = g_info.features;
}

function reflect_v_shape(shape_name) {
  let tok = shape_name.split(":");

  if (tok[0] == "stripe_45_square") {
    return "stripe_m45_square";
  }
  else if (tok[0] == "stripe_m45_square") {
    return "stripe_45_square";
  }

  else if ((tok[0] == "circle_quarter") ||
           (tok[0] == "circle_invquarter")) {
    return tok[0] + ":" + ((3-parseInt(tok[1]))%4);
  }

  else if (tok[0] == "circle_drop") {
    return tok[0] + ":" + (1-parseInt(tok[1]));
  }

  return shape_name;
}

function reflect_h_shape(shape_name) {
  let tok = shape_name.split(":");

  if (tok[0] == "stripe_45_square") {
    return "stripe_m45_square";
  }
  else if (tok[0] == "stripe_m45_square") {
    return "stripe_45_square";
  }

  else if ((tok[0] == "circle_quarter") ||
           (tok[0] == "circle_invquarter")) {
    return tok[0] + ":" + ((3-parseInt(tok[1]) + 2 )%4);
  }

  else if (tok[0] == "circle_drop") {
    return tok[0] + ":" + (1-parseInt(tok[1]));
  }

  return shape_name;
}

function init_fin() {

  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  let dS = ((W<H) ? W : H);

  g_info.width = W;
  g_info.height = H;
  g_info.dS = dS;

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = dS - 25;
  g_info.tick = 0;

  g_info.f_hist = [];

  g_info.rnd_hist_active = true;
  g_info.rnd_hist_idx =0;


  let sym_type = g_info.symmetry_type;

  let nrow = g_info.n_row;
  let ncol = g_info.n_col;
  let ncell = ((nrow>ncol) ? nrow : ncol);

  let _winsz = dS / ncell;

  g_info.win_size = _winsz;

  if ((ncell*_winsz) > dS) {
    ncell = ((nrow>ncol) ? nrow : ncol);
  }

  //ncell = nrow;

  let _offx = (W - ncol*_winsz)/2;
  let _offy = (H - nrow*_winsz)/2;

  if (sym_type == 0) {

    for (let r=0; r<Math.ceil(nrow/2); r++) {
      for (let c=0; c<Math.ceil(ncol/2); c++) {

        let _x = c*_winsz + _offx;
        let _y = r*_winsz + _offy;

        let fwin = (fxrand() + 0.5);
        let dx = (fxrand()/12)*_winsz;
        let dy = (fxrand()/12)*_winsz;

        fwin = 1.0;
        dx = 0;
        dy = 0;

        let opt = {
          "f_hist": g_info.f_hist,
          "x": _x + dx,
          "y": _y + dy,
          "w": _winsz * fwin,
          "R": 0.95,
          "recur_level": 0,
          "max_recur": 1,
          "sub_n": 2,
          "use_rnd_hist": true
        }

        gen_hist_r(ctx, opt);

        let shape_name = opt.shape_lib_name;

        //if ( (c != Math.floor(ncol/2)) &&
        //     (r != Math.floor(nrow/2)) ) {
        if (r != Math.floor(nrow/2))  {
          opt.x = (c)*_winsz + _offx;
          opt.y = (nrow-r-1)*_winsz + _offy;
          opt.shape_lib_name = reflect_h_shape(shape_name);
          gen_hist_r(ctx, opt);
        }

        //if ( (c != Math.floor(ncol/2)) &&
        //     (r != Math.floor(nrow/2)) ) {
        if (c != Math.floor(ncol/2)) {
          opt.x = (ncol-c-1)*_winsz + _offx;
          opt.y = (r)*_winsz + _offy;
          opt.shape_lib_name = reflect_v_shape(shape_name);
          gen_hist_r(ctx, opt);
        }

        if ( (c != Math.floor(ncol/2)) &&
             (r != Math.floor(nrow/2)) ) {
          opt.x = (ncol-c-1)*_winsz + _offx;
          opt.y = (nrow-r-1)*_winsz + _offy;
          opt.shape_lib_name = reflect_h_shape(reflect_v_shape(shape_name));
          gen_hist_r(ctx, opt);
        }

      }

    }


  }

  else if (sym_type == 1) {

    // left/right column
    //
    for (let r=0; r<Math.ceil(nrow/2); r++) {
      let c = 0;
      let _x = c*_winsz + _offx;
      let _y = r*_winsz + _offy;

      let fwin = (fxrand() + 0.5);
      let dx = (fxrand()/12)*_winsz;
      let dy = (fxrand()/12)*_winsz;

      fwin = 1.0;
      dx = 0;
      dy = 0;

      let opt = {
        "f_hist": g_info.f_hist,
        "x": _x + dx,
        "y": _y + dy,
        //"w": _winsz,
        "w": _winsz * fwin,
        "R": 0.95,
        "recur_level": 0,
        "max_recur": 1,
        "sub_n": 2,
        "use_rnd_hist": true
      }

      gen_hist_r(ctx, opt);

      let shape_name = opt.shape_lib_name;;

      if ( c != Math.floor(ncol/2) ) {
        opt.x = (ncol-c-1)*_winsz + _offx;
        opt.y = r*_winsz + _offy;
        opt.shape_lib_name = reflect_v_shape(shape_name);
        gen_hist_r(ctx, opt);
      }

      if ( (c != Math.floor(ncol/2)) &&
           (r != Math.floor(nrow/2)) ) {
        opt.x = (ncol-c-1)*_winsz + _offx;
        opt.y = (nrow-r-1)*_winsz + _offy;
        opt.shape_lib_name = reflect_h_shape(reflect_v_shape(shape_name));
        gen_hist_r(ctx, opt);
      }

      if (r != Math.floor(nrow/2)) {
        opt.x = c*_winsz + _offx;
        opt.y = (nrow-r-1)*_winsz + _offy;
        opt.shape_lib_name = reflect_h_shape(shape_name);
        gen_hist_r(ctx, opt);
      }

    }

    // top row
    //
    for (let c=1; c<Math.ceil(ncol/2); c++) {
      let r = 0;
      let _x = c*_winsz + _offx;
      let _y = r*_winsz + _offy;

      let fwin = (fxrand() + 0.5);
      let dx = (fxrand()/12)*_winsz;
      let dy = (fxrand()/12)*_winsz;

      fwin = 1.0;
      dx = 0;
      dy = 0;

      let opt = {
        "f_hist": g_info.f_hist,
        "x": _x + dx,
        "y": _y + dy,
        //"w": _winsz,
        "w": _winsz * fwin,
        "R": 0.95,
        "recur_level": 0,
        "max_recur": 1,
        "sub_n": 2,
        "use_rnd_hist": true
      }

      gen_hist_r(ctx, opt);

      let shape_name = opt.shape_lib_name;;

      if ( c != Math.floor(ncol/2) ) {
        opt.x = (ncol-c-1)*_winsz + _offx;
        opt.y = r*_winsz + _offy;
        opt.shape_lib_name = reflect_v_shape(shape_name);
        gen_hist_r(ctx, opt);
      }

      if ( (c != Math.floor(ncol/2)) &&
           (r != Math.floor(nrow/2)) ) {
        opt.x = (ncol-c-1)*_winsz + _offx;
        opt.y = (nrow-r-1)*_winsz + _offy;
        opt.shape_lib_name = reflect_h_shape(reflect_v_shape(shape_name));
        gen_hist_r(ctx, opt);
      }

      if (r != Math.floor(nrow/2)) {
        opt.x = c*_winsz + _offx;
        opt.y = (nrow-r-1)*_winsz + _offy;
        opt.shape_lib_name = reflect_h_shape(shape_name);
        gen_hist_r(ctx, opt);
      }

    }

    // inner section
    for (let r=1; r<(nrow-1); r++) {
      for (let c=1; c<(ncol-1); c++) {
        let _x = c*_winsz + _offx;
        let _y = r*_winsz + _offy;

        let fwin = (fxrand() + 0.5);
        let dx = (fxrand()/12)*_winsz;
        let dy = (fxrand()/12)*_winsz;

        fwin = 1.0;
        dx = 0;
        dy = 0;

        let opt = {
          "f_hist": g_info.f_hist,
          "x": _x + dx,
          "y": _y + dy,
          //"w": _winsz,
          "w": _winsz * fwin,
          "R": 0.95,
          "recur_level": 0,
          "max_recur": 1,
          "sub_n": 2,
          "use_rnd_hist": true
        }

        if ((r==1) && (c==1)) {
          gen_hist_r(ctx, opt);
          let shape_name = opt.shape_lib_name;;
          if ( (c != Math.floor(ncol/2)) &&
               (r != Math.floor(nrow/2)) ) {
            opt.x = (ncol-c-1)*_winsz + _offx;
            opt.y = (nrow-r-1)*_winsz + _offy;
            opt.shape_lib_name = reflect_h_shape(reflect_v_shape(shape_name));
            gen_hist_r(ctx, opt);
          }
        }
        else if ((r==(nrow-2)) && (c==(ncol-2))) {
        }

        else if ((r==1) && (c==(ncol-2))) {
          gen_hist_r(ctx, opt);
          let shape_name = opt.shape_lib_name;;
          if (r != Math.floor(nrow/2)) {
            opt.x = (ncol-c-1)*_winsz + _offx;
            opt.y = (nrow-r-1)*_winsz + _offy;
            opt.shape_lib_name = reflect_h_shape(reflect_v_shape(shape_name));
            gen_hist_r(ctx, opt);
          }
        }
        else if ((r==(nrow-2)) && (c==1)) {
        }

        else {
          gen_hist_r(ctx, opt);
        }

      }
    }

  }

  g_info.f_hist.sort( function(a,b) { return b.lvl - a.lvl; } );

  for (let i=0; i<g_info.f_hist.length; i++) { g_info.f_hist[i].f(); }

  g_info.ready = true;
}

function __init() {
  g_info.ready = true;

  let n = 5;

  let base_l = _rnd(0.2,0.8);
  let base_c = _rnd(0.2,0.8);
  let base_hue = _rnd();

  console.log(base_l, base_c, base_hue);

  g_info.palette_choice = _arnd( g_info.palette );

  for (let i=(-n/2); i<(n/2); i++ ) {
    let xhue = _mod1( base_hue  + (i/n) ) * 360;
    let _rgb = chroma.oklch( base_l, base_c, xhue);

    let rgb = _rgb._rgb;


    g_info.palette_choice.color.push( { "r":rgb[0], "g":rgb[1], "b":rgb[2] } );

  }
}


function init() {
  init_fin();
}


(()=>{

  init_param();
  init();
  welcome();

  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  let dS = ((W<H) ? W : H);

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = dS - 25;
  g_info.tick = 0;

  g_info.width = canvas.width;
  g_info.height = canvas.height;

  window.requestAnimationFrame(anim);

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 's') {
      screenshot();
    }
    else if (ev.key == 'S') {
      downloadsvg();
    }
    else if (ev.key == 'p') {
      g_info.pause = ((g_info.pause) ? false : true);
    }
    else if (ev.key == 'P') {
      g_info.phase0 = !g_info.phase0;
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
    return false;
  });

  window.addEventListener('resize', function(ev) {
    initCanvas();
  });


})();
