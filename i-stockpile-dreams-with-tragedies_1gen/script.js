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
  "VERSION" : "1.0.0",
  "download_filename": "stockpile_dream_tragedy_1gen.png",

  "ready": false,
  "pause": false,

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,
  //"capture_dt":1000,


  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,
  "anim": true,

  "bg_color" : "#111",

  "f_list_cur": [],
  "f_list": [
    { "v": "stripe_45_square", "w":0.5 },
    { "v": "stripe_m45_square", "w":0.5 },

    { "v": "stripe_gate:0", "w":0.5 },
    { "v": "stripe_gate:1", "w":0.5 },


    { "v": "square_grid", "w":1 },
    { "v": "hatching_grid", "w":1 },
    { "v": "square_square", "w":1 },
    { "v": "square_circle", "w":1 },
    { "v": "circle_circle", "w":1 },
    { "v": "circle_square", "w":1 },

    { "v": "circle_band", "w":1 },
    { "v": "circle_band:1", "w":1 },

    { "v": "circle_half", "w":1 },

    { "v": "circle_quarter:0", "w":0.25 },
    { "v": "circle_quarter:1", "w":0.25 },
    { "v": "circle_quarter:2", "w":0.25 },
    { "v": "circle_quarter:3", "w":0.25 },

    { "v": "circle_invquarter:0", "w":0.25 },
    { "v": "circle_invquarter:1", "w":0.25 },
    { "v": "circle_invquarter:2", "w":0.25 },
    { "v": "circle_invquarter:3", "w":0.25 },

    { "v": "circle_drop:0", "w":0.5 },
    { "v": "circle_drop:1", "w":0.5 },

    { "v": "square_plus", "w":1 },

    { "v": "square_band", "w": 0.333 },
    { "v": "square_band:1", "w": 0.333 },
    { "v": "square_band:2", "w": 0.333 }

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
  "isubdiv": -1,

  "features": {},

  "f_hist":[]

};

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


  clpr.AddPolygons( pgnsA, subjPolyType );
  clpr.AddPolygons( pgnsB, clipPolyType );

  clpr.Execute(clipType, rop_pgns, fillType, fillType );

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

function stripe_gate(ctx, x, y, width, phase, empty_width, stripe_width, color) {
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
      { "X": _x + empty_width, "Y":width },
      { "X": _x , "Y":width }
    ]);
  }

  let rop = [];
  _clip_difference(rop, opgn, epgn);

  polygons(ctx, x, y, rop, color);
}

function stripe_gate_v(ctx, x, y, width, phase, empty_width, stripe_width, color) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let opgn = [ [ {"X":0,"Y":0}, {"X":width,"Y":0}, {"X":width,"Y":width}, {"X":0,"Y":width} ] ];
  let epgn = [];

  let _s = empty_width + stripe_width;
  let n = Math.ceil( width / _s );

  for (i=-(n+3); i<(n+3); i++) {
    let _y = i*_s + phase*_s*2;
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
}

function stripe_45_square(ctx, x, y, width, phase, empty_width, stripe_width, color) {
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
}

function stripe_m45_square(ctx, x, y, width, phase, empty_width, stripe_width, color) {
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
}

function stripe_45_square_old(ctx, x, y, width, phase, empty_width, stripe_width, color) {
  phase = ((typeof phase === "undefined") ? 0 : phase);
  let p = [], q = [];

  phase=0;

  let _s = empty_width + stripe_width;

  if (phase < 0) {
    let q = -Math.floor(phase / _s) ;
    phase = phase + q*_s;
  }

  if (phase > _s) {
    let q = Math.floor(phase / _s) + 1;
    phase = phase - q*_s;
  }

  //console.log(phase);

  let z=phase;
  for ( ; z<width; z+=_s) {
    let _ze = z+stripe_width;
    if (_ze > width) { _ze = width; }

    let _zs = z;
    if (_zs < 0) { _zs = 0; }
    p.push([_zs, _ze]);
  }

  for ( z -= width; z<width; z+=_s) {
    let _ze = z+stripe_width;
    if (_ze > width) { _ze = width; }
    q.push([z, _ze]);
  }

  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i=0; i<p.length; i++) {
    ctx.moveTo( x + p[i][0], y );
    ctx.lineTo( x + p[i][1], y );
    ctx.lineTo( x , y + p[i][1] );
    ctx.lineTo( x , y + p[i][0] );
  }

  for (let i=0; i<q.length; i++) {
    ctx.moveTo( x + width, y + q[i][0] );
    ctx.lineTo( x + width, y + q[i][1] );
    ctx.lineTo( x + q[i][1], y + width );
    ctx.lineTo( x + q[i][0], y + width );
  }

  let _n = p.length-1;
  if (_n > 0) {
    let _e0 = p[ p.length-1 ][0] + stripe_width - width;

    if (_e0 > 0) {
      ctx.moveTo( x + width, y );
      ctx.lineTo( x + width, y + _e0 );
      ctx.lineTo( x + _e0, y + width );
      ctx.lineTo( x , y + width );
    }
  }

  ctx.fill();

}

function stripe_m45_square_old(ctx, x, y, width, phase, empty_width, stripe_width, color) {
  let p = [], q = [];

  let _s = empty_width + stripe_width;

  let z=phase;
  for ( ; z<width; z+=_s) {
    let _ze = z+stripe_width;
    if (_ze > width) { _ze = width; }
    p.push([z, _ze]);
  }

  //for ( z -= width; z<width; z+=_s) {
  for ( z = empty_width - phase; z<width; z+=_s) {
    let _zs = z;
    if (_zs < 0) { _zs = 0; }

    let _ze = z + stripe_width;
    if (_ze > width) { _ze = width; }
    q.push([_zs, _ze]);
  }

  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i=0; i<p.length; i++) {
    ctx.moveTo( x + p[i][0], y );
    ctx.lineTo( x + p[i][1], y );
    ctx.lineTo( x + width , y + width - p[i][1]  );
    ctx.lineTo( x + width , y + width - p[i][0]  );
  }

  for (let i=0; i<q.length; i++) {
    ctx.moveTo( x , y + q[i][0] );
    ctx.lineTo( x , y + q[i][1] );
    ctx.lineTo( x + width - q[i][1], y + width );
    ctx.lineTo( x + width - q[i][0], y + width );
  }

  let _n = p.length-1;

  if (p.length > 0) {
    let _e0 = p[0][0] - _s + stripe_width ;

    if (_e0 > 0) {
      ctx.moveTo( x , y );
      ctx.lineTo( x + _e0, y );
      ctx.lineTo( x + width , y + width - _e0);
      ctx.lineTo( x + width , y + width );
    }
  }

  ctx.fill();

}

function square_grid(ctx, x, y, n, tot_width, small_square_width, color, phase) {
  phase = ((typeof phase === "undefined") ? 0 : phase);

  let _inset_width = tot_width - small_square_width;
  let _sw = small_square_width;
  let _ds = _inset_width / (n-1);

  let opgn = [ [ {"X":0,"Y":0}, {"X":tot_width,"Y":0}, {"X":tot_width,"Y":tot_width}, {"X":0,"Y":tot_width} ] ];
  let epgn = [];

  let _phase_x = small_square_width*2*(1.0 + Math.cos(Math.PI*2*phase))/2.0;
  let _phase_y = small_square_width*2*(1.0 + Math.sin(Math.PI*2*phase))/2.0;

  for (let i=-3; i<(n+3); i++) {
    for (let j=-3; j<(n+3); j++) {
      let _x = i*_ds + _phase_x,
          _y = j*_ds + _phase_y;

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

}

// pretty hacky...might need to revisit
//
//  "working" parameters:
//
//  w = 200
//  hatching_grid(ctx, 410, 410, 4, w, w/6.25, "rgba(255,255,255,0.95)");
//
function hatching_grid(ctx, x, y, ndiag, tot_width, small_square_width, color, phase) {
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

}

function square_square(ctx, x, y, owidth, iwidth, color) {
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

}

function square_circle(ctx, x, y, owidth, ir, color) {
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
}

function square_plus(ctx, x, y, width, height, band_x, band_y, color) {

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

  return v;
}



function circle_circle(ctx, x, y, outer_r, inner_r, color) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.arc( x, y, outer_r, 0, 2*Math.PI, false);

  ctx.moveTo(x,y);
  ctx.arc( x, y, inner_r, 0, 2*Math.PI, true);

  ctx.fill();
}

function circle_square(ctx, x, y, r, width, color, phase) {
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
  return;

  let _x = x - r/2,
      _y = y - r/2;


  ctx.moveTo(_x,_y);
  ctx.lineTo(_x, _y + width);
  ctx.lineTo(_x + width, _y + width);
  ctx.lineTo(_x + width, _y);

  ctx.fill();
}

function circle_invquarter(ctx, x, y, _r, ang, color) {
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
}

function circle_drop(ctx, x, y, _r, ang, color) {
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
}

function circle_quarter(ctx, x, y, _r, ang, color) {
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
}

function circle_half(ctx, x, y, r, color, phase) {
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
}


function circle_band(ctx, x, y, r, band_x, band_y, color, phase) {
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
}

function square_band(ctx, x, y, width, height, band_x, band_y, color) {
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

function disp(ctx, fname, x, y, w, c, phase) {

  let v=1;

  if (fname == "stripe_45_square") {
    //                    x  y  w  p   e   f    c
    stripe_45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c);
  }
  else if (fname == "stripe_m45_square") {
    //                    x  y  w  p   e   f    c
    stripe_m45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c);
  }

  else if (fname == "stripe_gate:0") {
    //               x     y    w      p       e    f    c
    stripe_gate(ctx, x+v, y+v, w-2*v, phase, w/12, w/12, c);
  }
  else if (fname == "stripe_gate:1") {
    //               x     y    w      p       e    f    c
    stripe_gate_v(ctx, x+v, y+v, w-2*v, phase, w/12, w/12, c);
  }



  else if (fname == "square_grid") {
    //               x   y n  w   sw   c
    square_grid(ctx, x+v, y+v, 5, w-2*v, w/10, c, phase);
  }

  else if (fname == "hatching_grid") {
    //                  x    y   n  w    ew   c
    hatching_grid(ctx, x+v, y+v, 4, w-2*v, w/6.25, c, phase);
  }

  else if (fname == "square_square") {
    //                  x    y    ow, ow
    square_square(ctx, x+v, y+v, w-2*v, w/2, c);
  }

  else if (fname == "square_plus") {
    square_plus(ctx, x+v, y+v, w, w, w/3, w/3, c);
  }

  else if (fname == "square_circle") {
    square_circle(ctx, x+v, y+v, w-2*v, w/4, c);
  }

  else if (fname == "circle_circle") {
    circle_circle(ctx, x+w/2, y+w/2, w/2 - v, w/4, c);
  }

  else if (fname == "circle_square") {
    circle_square(ctx, x+w/2, y+w/2, w/2 - v, w/2, c, phase);
  }

  else if (fname == "circle_band") {
    circle_band(ctx, x+w/2, y+w/2, w/2 - v, w/3, 0, c, phase);
  }

  else if (fname == "circle_band:1") {
    circle_band(ctx, x+w/2, y+w/2, w/2 - v, w/3, w/3, c, phase);
  }

  else if (fname == "circle_half") {
    circle_half(ctx, x+w/2, y+w/2, w/2 - v, c, phase);
  }

  else if (fname == "circle_quarter:0") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, 0, c, phase);
  }
  else if (fname == "circle_quarter:1") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase);
  }
  else if (fname == "circle_quarter:2") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, Math.PI, c, phase);
  }
  else if (fname == "circle_quarter:3") {
    circle_quarter(ctx, x+w/2, y+w/2, w - v, 3*Math.PI/2, c, phase);
  }

  else if (fname == "circle_invquarter:0") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, 0, c, phase);
  }
  else if (fname == "circle_invquarter:1") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase);
  }
  else if (fname == "circle_invquarter:2") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, Math.PI, c, phase);
  }
  else if (fname == "circle_invquarter:3") {
    circle_invquarter(ctx, x+w/2, y+w/2, w - v, 3*Math.PI/2, c, phase);
  }

  else if (fname == "circle_drop:0") {
    circle_drop(ctx, x+w/2, y+w/2, w - v, 0, c, phase);
  }
  else if (fname == "circle_drop:1") {
    circle_drop(ctx, x+w/2, y+w/2, w - v, Math.PI/2, c, phase);
  }

  else if (fname == "square_band") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, w/3, 0, c);
  }

  else if (fname == "square_band:1") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, 0, w/3, c);
  }

  else if (fname == "square_band:2") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, w/3, w/3, c);
  }

}

function gen_hist_r(ctx, x, y, w, sub_n, recur_level, max_recur, use_rnd_hist) {
  use_rnd_hist = ((typeof use_rnd_hist === "undefined") ? false : use_rnd_hist);
  max_recur = ((typeof max_recur === "undefined") ? 6 : max_recur);

  if (recur_level >= max_recur) { return; }

  let mx = x + w/sub_n;
  let my = y + w/sub_n;
  let subw = w/sub_n;

  //let p = fxrand();
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

  let do_recur = false;

  // both high and recur...
  //
  if (p < (1.0/32.0)) {
    do_recur = true;
  }

  else if (p < 0.55) {
    do_recur = true;
  }

  // show object without further recurrance
  //
  else if (p < 0.75) {

    let _f = _pwrnd( g_info.f_list_cur ),
        _a = (1.0 - _mrnd()*0.125) ;

    let rgb = _hex2rgb( g_info.palette_choice.colors[Math.floor(_mrnd()*g_info.palette_choice.colors.length)] );
    let _c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + _a + ")"

    let _freq = 1.0 - _mrnd()*0.5;
    let _init_phase =  _mrnd();

    if (!g_info.anim) {
      _freq = 0;
      _init_phase = 0;
    }


    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _p_F, _p_i_p) {
      return function() {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/512 + _p_i_p)))/2.0;
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _phase);
      };
    })(ctx, _f, x, y, w, _c, _freq, _init_phase);

    g_info.f_hist.push( {"f": _func, "lvl": recur_level });

  }

  // both show object and recur
  // higher level object has larger alpha
  //
  else {

    let _f = _pwrnd( g_info.f_list_cur ),
        _a = (0.6 - _mrnd()*0.25) ;

    let rgb = _hex2rgb( g_info.palette_choice.colors[Math.floor(_mrnd()*g_info.palette_choice.colors.length)] );
    let _c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + _a + ")"

    let _freq = 1.0 - _mrnd()*0.5;
    let _init_phase =  _mrnd();

    if (!g_info.anim) {
      _freq = 0;
      _init_phase = 0.0;
    }

    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _p_F, _p_i_p) {
      return function() {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/512 + _p_i_p)))/2.0;
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c, _phase);
      };
    })(ctx, _f, x, y, w, _c, _freq, _init_phase);

    g_info.f_hist.push( {"f": _func, "lvl": recur_level });

    do_recur = true;
  }

  if (do_recur) {

    let sub_choice = [2,3];
    let nxt_sub_n = sub_choice[ Math.floor(_mrnd()*sub_choice.length) ];

    for (let i=0; i<sub_n; i++) {
      for (let j=0; j<sub_n; j++) {
        let _x = x + i*subw;
        let _y = y + j*subw;
        gen_hist_r(ctx, _x, _y, subw, nxt_sub_n, recur_level+1+(sub_n-2), max_recur, use_rnd_hist);
      }
    }

  }

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

  if (!g_info.ready) {
    return;
  }

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch);

  for (let i=0; i<g_info.f_hist.length; i++) {
    g_info.f_hist[i].f();
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

/*
function load_palette(txt) {
  g_info.palette = JSON.parse(txt);

  let idx = _irnd(g_info.palette.pal.length);
  g_info.palette_choice = g_info.palette.pal[idx];
  g_info.palette_idx = idx;

  console.log(">>", g_info.palette_choice.name);

  init_fin();
}
*/

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
  let isubdiv = sub_choice[ Math.floor(fxrand()*sub_choice.length) ];

  g_info.isubdiv = isubdiv;

  let f_name = [];

  for (let i=0; i<g_info.f_list.length; i++) {

    if ( fxrand() < 0.5 ) {
      g_info.f_list_cur.push(g_info.f_list[i]);

      f_name.push(g_info.f_list[i].v);
    }

  }

  f_name.sort();

  g_info.palette_choice = _arnd( g_info.palette );

  g_info.features["Shape Library"] = f_name.join(", ");
  g_info.features["Initial Subdivision"] = isubdiv;
  g_info.features["Color Palette"] = g_info.palette_choice.name;

  window.$fxhashFeatures = g_info.features;

  console.log(JSON.stringify( g_info.features, undefined, 2));
}

function init_fin() {

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

  let isubdiv = g_info.isubdiv;

  g_info.f_hist = [];

  g_info.rnd_hist_active = true;
  g_info.rnd_hist_idx =0;

  for (let i=0; i<isubdiv; i++) {
    for (let j=0; j<isubdiv; j++) {
      let _x = 10 + i*g_info.size/isubdiv;
      let _y = 10 + j*g_info.size/isubdiv;
      gen_hist_r(ctx, _x, _y, g_info.size/isubdiv, 2, 1 + (isubdiv-2), 7, true);
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
  //loadjson("./chromotome.json", load_palette)

  init_fin();
}


(()=>{

  console.log("fxhash:",fxhash);

  init_param();

  init();

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

  window.requestAnimationFrame(anim);

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 's') {
      screenshot();
    }
    else if (ev.key == 'p') {
      g_info.pause = ((g_info.pause) ? false : true);
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
