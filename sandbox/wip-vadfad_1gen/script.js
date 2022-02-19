//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var g_info = {
  "VERSION" : "1.0.0",
  "download_filename": "vadfad_1gen.png",
  "download_filename_svg": "vadfad_1gen.svg",
  "canvas": {},

  // sorry, I'm American, I have trouble thinking in
  // metric
  //
  "svg_width_in" : (36),
  "svg_height_in" : (36),
  "ppi" : 300,

  "debug": false,

  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "fps_debug": true,
  "fps": 0,
  "last_t":0,

  /*
  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,
  */

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "palette": {},
  "palette_choice": {},

  "rnd_idx" : 0,
  "rnd":[],

  "hist" : [],

  "max_level": 5,
  //"min_size" : 16,

  "use_shadow": true,

  "param": {},

  "shadow_color": "#444",
  "bg_color" : "#eee"
};

//-----
//-----

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

//---
//---
//---


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

  clpr.AddPaths( pgns, subjPolyType, true );
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


//---
//---
//---

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

function _hex2hsv(rgbhex) {
  let rgb = _hex2rgb(rgbhex);
  return RGBtoHSV(rgb.r, rgb.g, rgb.b);
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



//-----
//-----

function loading_screen() {

  // fps
  //
  let now_t = Date.now();
  let delta_t = (now_t - g_info.last_t);
  g_info.last_t = now_t;
  if (delta_t > 0) { g_info.fps = 1000/(delta_t); }
  if (g_info.fps_debug) {
    if ((g_info.tick%30)==0) {
      console.log(g_info.fps);
    }
  }
  //
  // fps


  let ctx = g_info.ctx;
  ctx.lineWidth = 0;

  let w2 = g_info.width / 2;
  let h2 = g_info.height / 2;

  ctx.fillStyle = '#444';

  ctx.beginPath();
  if ((Math.floor(g_info.tick/10) % 4) == 0) {
    ctx.fillRect(w2-30,h2-30,60,60);
  }
  else if ((Math.floor(g_info.tick/10) % 4) == 1) {
    ctx.moveTo(w2,h2);
    ctx.arc(w2,h2,30,0,Math.PI*2);
    ctx.fill();
  }

  else if ((Math.floor(g_info.tick/10) % 4) == 2) {
    ctx.moveTo(w2-30,h2-30);
    ctx.lineTo(w2+30,h2-30);
    ctx.lineTo(w2,h2+30);
    ctx.lineTo(w2-30,h2-30);
    ctx.fill();
  }

  else if ((Math.floor(g_info.tick/10) % 4) == 3) {
    ctx.save();
    ctx.translate(w2,h2-30*Math.sqrt(2));
    ctx.rotate(Math.PI/4);
    ctx.fillRect(0,0,60,60);
    ctx.translate(0,0);
    ctx.restore();
  }

}

let g_noise_pnt = [];

function noise_bg() {
  let _init = ( (g_noise_pnt.length == 0) ? true : false);
  let _ctx = g_info.ctx;

  if (_init) {

    let w = g_info.width;
    let h = g_info.height;

    let cell_s = 5;
    let pnt_s = 20;

    let N = 100000;


    //_ctx.fillStyle = "rgba(127, 127, 127, 0.165)";
    for (let i=0; i<N; i++) {
      //let _x = fxrand()*w;
      //let _y = fxrand()*h;

      let _x, _y;
      let dw = 1;
      let dh = 1;

      let _rn = fxrand();
      if (_rn < 0.4) {
        _y = Math.floor(fxrand()*h/cell_s)*cell_s;
        dw = fxrand()*pnt_s;

        _x = fxrand()*w;
      }
      else if (_rn < 0.8) {
        _x = Math.floor(fxrand()*w/cell_s)*cell_s;
        dh = fxrand()*pnt_s;

        _y = fxrand()*h;
      }
      else {
        _x = fxrand()*w;
        _y = fxrand()*h;
      }



      //_ctx.fillRect(_x, _y, dw, dh);

      g_noise_pnt.push( {"x":_x, "y":_y, "w":dw, "h":dh } );
    }
  }

  //_ctx.fillStyle = "rgba(127,127,127,0.165)";
  _ctx.fillStyle = "rgba(127,127,127,0.065)";
  for (let i=0; i<g_noise_pnt.length; i++) {
    let p = g_noise_pnt[i];
    _ctx.fillRect( p.x, p.y, p.w, p.h );
  }

  /*
  _ctx.fillStyle = "rgba(0, 0, 0, 0.165)";
  for (let i=0; i<N; i++) {
    let _x = fxrand()*w;
    let _y = fxrand()*h;
    _ctx.fillRect(_x, _y, 1.125, 1.125);
  }
  */

}

function anim() {

  // animation capture
  //
  /*
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
  */
  //
  // animation capture

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);

  //noise_bg();

  g_info.tick++;
  window.requestAnimationFrame(anim);

  if (!g_info.ready) {
    loading_screen();
    return;
  }

  ctx.lineWidth = 0;

  let w2 = _cw / 2;
  let h2 = _ch / 2;

  for (let i=0; i<g_info.hist.length; i++) {
    g_info.hist[i].f();
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

//----
//----
//----

function effective_size(grid) {
  let w = grid[0].length;
  let h = grid.length;
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

  return { "w": dw, "h": dh };
}


function trace_it(dat) {
  let n_row = dat.length;
  let n_col = dat[0].length;

  let _m = {};

  let pgns = [];

  let d = 1/128;

  for (let r=0; r<n_row; r++) {
    for (let c=0; c<n_col; c++) {

      if (dat[r][c] <= 0) { continue; }

      let _sq = [
        { "Y" : r-d,   "X": c-d   },
        { "Y" : r-d,   "X": c+1+d },
        { "Y" : r+1+d, "X": c+1+d },
        { "Y" : r+1+d, "X": c-d   }
      ];

      pgns.push(_sq);

    }
  }

  let rop = [];
  _clip_union(rop, pgns);

  return rop;
}


function gen_vadfad(base_idx) {
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
  let eye_choice = _irnd(3);

  let fill_corner = ((_rnd() < 0.5) ? true : false);

  //let h = H[_irnd(3)].v;
  //let w = W[_irnd(4)].v;

  let h = _arnd(H).v;
  let w = _arnd(W).v;

  if (base_idx == 1) {
    g_info.param["orig_height"] = h;
    g_info.param["orig_width"] = w;
    g_info.param["eye_choice"] = eye_choice;
  }

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

  let dh_eye = _irnd(2) + 2;
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
      if (_irnd(2) == 0) {
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

  //if ((dw != w) || (dh != h)) {
  //  console.log(">>>", w,h, mw, Mw, mh, Mh);
  //}

  return grid;
}

//----
//----
//----


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

// probably need the polytree representation to render
// properly...
//
function pgn2svgpath(pgn) {
  let path_lines = [];

  let ps = [];
  for (let i=0; i<pgn.length; i++) {
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ps.push("M " + pgn[i][j].X.toString() + " " + pgn[i][j].Y.toString());
      }
      else {
        ps.push("L " + pgn[i][j].X.toString() + " " + pgn[i][j].Y.toString());
      }
    }
  }
  ps.push("Z");

  return '<path d="' + ps.join(" ") + '"/>';
}

// WIP
//
function downloadsvg() {
  let ppi = g_info.ppi;
  let svg_w = g_info.svg_width;
  let svg_h = g_info.svg_height;

  let svg_lines = [];
  let svg_hdr = "data:img/svg+xml;utf8,";


  let wpx = (ppi*svg_w).toString();
  let hpx = (ppi*svg_h).toString();

  svg_lines.push('<svg viewBox="0 0 ' + wpx + ' ' + hpx + '" ' +
    ' width="' + wpx + '" height="' + hpx + '" ' +
    ' xmlns="http://www.w3.org/2000/svg">');


  
  let _test_path = trace_it(gen_vadfad(0));

  svg_lines.push(pgn2svgpath(_test_path));

  svg_lines.push("</svg>");

  let svg_txt = svg_hdr + svg_lines.join("");

  let link = document.createElement("a");
  link.download = g_info.download_filename_svg;
  link.href = svg_txt;
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
  g_info.size = Math.floor(dS - dS/3);
}

function init_fin() {
  g_info.ready = true;

  if (fxrand() < 0.5) {
    //g_info.use_shadow = false;
  }

  console.log(g_info.width, g_info.height);

  let border = 10;

  let w = g_info.width - 2*border;
  let h = g_info.height - 2*border;

  let w2 = w/2;
  let h2 = h/2;

  //gen_hist_r(0, 0, w, h, 0);

  /*
  gen_hist_r( 0,  0, w2, h2, 1);
  gen_hist_r(w2,  0, w2, h2, 1);
  gen_hist_r(w2, h2, w2, h2, 1);
  gen_hist_r( 0, h2, w2, h2, 1);
  */

  let state_weight = [
    { "w": 1, "v": [2,2] },
    { "w": 1, "v": [3,3] },
    { "w": 0, "v": [2,3] },
    { "w": 1, "v": [3,2] },
    { "w": 0, "v": [1,1] }
  ];

  let _rstate = _pwrnd(state_weight);

  console.log(">>>", _rstate);

  let _recur_n = _rstate[0];
  let _recur_m = _rstate[1];

  let w_n = w/_recur_n;
  let h_m = h/_recur_m;

  let x = border;
  let y = border;
  for (let i=0; i<_recur_n; i++) {
    for (let j=0; j<_recur_m; j++) {
      let _rx = w_n*i;
      let _ry = h_m*j;
      gen_hist_r( x + _rx, y + _ry, w_n, h_m, 1 );
    }
  }




}

function palette_load(txt) {

  let dat = JSON.parse(txt);
  g_info.palette = dat.pal;
  g_info.palette_choice = _arnd( g_info.palette );

  //DEBUG
  //g_info.palette_choice = { "colors": ["rgba(0,0,0,0.9)", "rgba(255,255,255,0.9)"] };
  //g_info.bg_color = "#777";

  console.log("pal:", g_info.palette_choice.name);

  if ("background" in g_info.palette_choice) {
    let n = g_info.palette_choice.colors.length;

    let distinct = true;
    for (let i=0; i<n; i++) {
      if (g_info.palette_choice.colors[i] == g_info.palette_choice.background) {
      //if (g_info.palette_choice.colors[i] == g_info.palette_choice.stroke) {
        distinct = false;
        break;
      }
    }

    if (distinct) {
      g_info.bg_color = g_info.palette_choice.background;
      //g_info.bg_color = g_info.palette_choice.stroke;
    }

  }

  if ("stroke" in g_info.palette_choice) {
    //g_info.shadow_color = g_info.palette_choice.stroke;
  }

  //g_info.bg_color = "#777";

  init_fin();
}

//function disp_vadfad(cx,cy,w,h,dat,c,no_eyes,no_shadow,no_overlap) {
function disp_vadfad(cx,cy,w,h,dat,opt) {
  let default_opt = {
    "no_eyes":false,
    "no_shadow":false,
    "no_overlap":false,
    "c": "rgba(0,0,0,0.9)",
    "shadow_color": g_info.shadow_color,
    "shadow_offset": 4
  };
  opt = ((typeof opt === "undefined") ? default_opt : opt);
  let c = ((typeof opt.c === "undefined") ? "rgba(0,0,0,0.9)" : opt.c);
  let no_eyes = ((typeof opt.no_eyes === "undefined") ? false : opt.no_eyes);
  let no_shadow = ((typeof opt.no_shadow === "undefined") ? false : opt.no_shadow);
  let no_overlap = ((typeof opt.no_overlap === "undefined") ? false : opt.no_overlap);
  let shadow_color = ((typeof opt.shadow_color === "undefined") ? g_info.shadow_color : opt.shadow_color);
  let shadow_offset = ((typeof opt.shadow_offset === "undefined") ? 4 : opt.shadow_offset);
  
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  //let shadow_color = '#444';
  //let shadow_color = g_info.shadow_color;

  if (g_info.debug) {
    ctx.strokeStyle = "rgba(255,100,100,0.5)";
    ctx.beginPath();
    ctx.rect(cx,cy,w,h);
    ctx.stroke();
  }

  let _h_w = effective_size(dat);


  ds = _min(w/(dat[0].length+1),h/(dat.length+1));
  //ds = _min(w/(_h_w.w + 1),h/(_h_w.h + 1));

  //let shadow_offset = 4;

  let _aw = (dat[0].length+1)*ds;
  let _ah = (dat.length+1)*ds;

  let _edx = 0, _edy = 0;
  if (w > _aw) { _edx = (w - _aw)/2; }
  if (h > _ah) { _edy = (h - _ah)/2; }


  let _o = 0.75;
  if (no_overlap) { _o = 0; }

  if (!no_shadow) {
    let _so = shadow_offset;
    for (let i=0; i<dat.length; i++) {
      for (let j=0; j<dat[i].length; j++) {
        let _x = cx + j*ds + ds/2 + _edx;
        let _y = cy + i*ds + ds/2 + _edy;

        if (dat[i][j] > 0) {
          //ctx.fillStyle = '#777';
          ctx.fillStyle = shadow_color;
          ctx.beginPath();
          ctx.fillRect(_x + _so,_y + _so, ds + _o, ds + _o);
        }

      }
    }
  }

  for (let i=0; i<dat.length; i++) {
    for (let j=0; j<dat[i].length; j++) {
      let _x = cx + j*ds + ds/2 + _edx;
      let _y = cy + i*ds + ds/2 + _edy;

      if ((dat[i][j] < 0) && (no_eyes)) { continue; }

      if (dat[i][j] != 0) {

        if (dat[i][j] > 0) {
          ctx.fillStyle = c;
        }
        else {
          ctx.fillStyle = "rgba(230,230,230,0.9)";
        }

        ctx.beginPath();
        ctx.fillRect(_x,_y, ds + _o, ds + _o);

      }
    }
  }

}



function gen_hist_r(x,y,w,h,lvl) {
  let do_recur = false;
  let p = _mrnd();

  /*
  let state_weight = [
    { "w": 1, "v": "stop" },
    { "w": 2, "v": "show" },
    { "w": 2, "v": "recur" },
    { "w": 2, "v": "show_recur" }
  ];
  */

  let state_weight = [
    { "w": 0, "v": "stop" },
    { "w": 1, "v": "show" },
    { "w": 3, "v": "recur" },
    { "w": 0, "v": "recur_1x2" },
    { "w": 0, "v": "recur_2x1" },
    { "w": 0, "v": "recur_3x3" },
    { "w": 0, "v": "recur_2x3" },
    { "w": 0, "v": "recur_3x2" },
    { "w": 0, "v": "show_recur" }
  ];

  let _recur_n = 2;
  let _recur_m = 2;

  let _rstate = _pwrnd(state_weight);
  if (lvl == g_info.max_level) { _rstate = "show"; }
  //if ((w < g_info.min_size) || (h < g_info.min_size)) { _rstate = "show"; }

  if (lvl > g_info.max_level) { return; }

  if (_rstate == "stop") {
    return;
  }

  else if (_rstate == "show") {

    let dat = gen_vadfad();
    //let c = g_info.palette_choice.colors[0];
    let c = _arnd( g_info.palette_choice.colors );

    g_info.hist.push( { "f": (function(_x,_y,_w,_h,_dat,_c,_shad,_lvl) {
      //return function() { disp_vadfad(_x,_y,_w,_h,_dat,_c, true, _shad); };
      let _so = g_info.max_level - _lvl+1;
      let opt = { "c": _c, "no_eyes": true, "no_shadow": _shad, "shadow_offset": _so };
      return function() { disp_vadfad(_x,_y,_w,_h,_dat,opt); };
    })(x,y,w,h,dat,c,!g_info.use_shadow,lvl) } );
  }

  else if (_rstate == "recur") {
    do_recur = true;
  }

  else if (_rstate == "recur_1x2") {
    do_recur = true;
    _recur_n = 1;
    _recur_m = 2;
  }

  else if (_rstate == "recur_2x1") {
    do_recur = true;
    _recur_n = 2;
    _recur_m = 1;
  }

  else if (_rstate == "recur_3x3") {
    do_recur = true;
    _recur_n = 3;
    _recur_m = 3;
  }

  else if (_rstate == "recur_2x3") {
    do_recur = true;
    _recur_n = 2;
    _recur_m = 3;
  }

  else if (_rstate == "recur_3x2") {
    do_recur = true;
    _recur_n = 3;
    _recur_m = 2;
  }

  else if (_rstate == "show_recur") {
    do_recur = true;

    let dat = gen_vadfad();
    //let c = g_info.palette_choice.colors[0];
    let c = _arnd( g_info.palette_choice.colors );

    g_info.hist.push( { "f": (function(_x,_y,_w,_h,_dat,_c,_shad,_lvl) {
      //return function() { disp_vadfad(_x,_y,_w,_h,_dat,_c, true,_shad); };
      let _so = g_info.max_level - _lvl+1;
      let opt = { "c": _c, "no_eyes": true, "no_shadow": _shad, "shadow_offset": _so };
      return function() { disp_vadfad(_x,_y,_w,_h,_dat,opt); };
    })(x,y,w,h,dat,c,!g_info.use_shadow,lvl) } );
  }

  //_recur_n =2;
  //_recur_m =2;
  if (do_recur) {
    let w_n = w/_recur_n;
    let h_m = h/_recur_m;

    for (let i=0; i<_recur_n; i++) {
      for (let j=0; j<_recur_m; j++) {
        let _rx = w_n*i;
        let _ry = h_m*j;
        gen_hist_r( x + _rx, y + _ry, w_n, h_m, lvl+1 );
      }
    }

    /*
    let w2 = w/2;
    let h2 = h/2;

    gen_hist_r(x,    y,    w2, h2, lvl+1);
    gen_hist_r(x+w2, y,    w2, h2, lvl+1);
    gen_hist_r(x+w2, y+h2, w2, h2, lvl+1);
    gen_hist_r(x,    y+h2, w2, h2, lvl+1);
    */
  }

}

function init() {
  let w = 400;
  let h = 400;

  // EXAMPLE INIT
  //

  //setTimeout(function() { init_fin(); }, 200);
  loadjson("./chromotome.json", palette_load);


  //
  // EXAMPLE INIT

}

function init_global_param() {
}

(()=>{

  console.log("fxhash:",fxhash);

  g_info.last_t = Date.now();

  init_global_param();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

  initCanvas();

  init();

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 'a') {
      /*
      if (g_info.animation_capture) { console.log("already capturing!"); return; }
      g_info.capturer = new CCapture({"format":"webm"});
      g_info.capturer.start();
      g_info.animation_capture = true;

      g_info.capture_start = Date.now();
      g_info.capture_end = g_info.capture_start + g_info.capture_dt;

      console.log(">>>", g_info.capture_start, g_info.capture_end, g_info.capture_dt);
      */
    }
    else if (ev.key == 's') {
      screenshot();
    }
    else if (ev.key == 'p') {
      g_info.pause = ((g_info.pause) ? false : true);
    }
    return false;
  });

  window.addEventListener('resize', function(ev) {
    initCanvas();
  });

  window.requestAnimationFrame(anim);

})();

//----
//----
//----


