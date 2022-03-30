//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

// This is a basic "boilerplate" project that uses only the simple canvas
// to draw.
// This boilerplate provides:
//
// - resize functionality
// - init functions and callbacks so that the display can happen
//   after resource load
// - examples of drawing to a canvas
// - keyboard input for screenshot and stopping animations
//


var g_info = {
  "VERSION" : "0.1.0",
  "PROJECT" : "PROJECT",
  "download_filename": "BOILERPLATE.png",
  "canvas": {},
  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,

  "fps_debug": false,
  "fps": 0,
  "last_t":0,


  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "data": {},

  "rnd":[],

  "features" : {},

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

//--

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
  console.log("");

  console.log("Features:");
  for (let key in g_info.features) {
    console.log(key + ":", g_info.features[key]);
  }

}

//--

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


//--

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

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);
  g_info.tick++;
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
    loading_screen();
    return;
  }

  let m = 1;
  let ok = [];
  let n = g_info.geom_data.length;
  if (m>=n) { m=n; }
  for (let i=0; i<m; i++) {
    ok.push(g_info.geom_data[i]);
  }
  //console.log(ok);
  //polygons(ctx, _cw/2, _ch/4, ok, "rgba(127, 32, 32, 0.15)");

  for (let i=0; i<g_info.geom_data.length; i++) {
    polygons(ctx, _cw/4, _ch/4, [g_info.geom_data[i]], "rgba(127, 32, 32, 0.25)");
  }


}

function clear(ctx, clear_width, clear_height, bg_color) {
  ctx = ((typeof ctx === "undefined") ? g_info.ctx : ctx);
  clear_width  = ((typeof clear_width  === "undefined") ? g_info.canvas.width  : clear_width)
  clear_height = ((typeof clear_height === "undefined") ? g_info.canvas.height : clear_height)
  bg_color     = ((typeof bg_color === "undefined") ? g_info.bg_color : bg_color)

  ctx.beginPath();
  ctx.clearRect(0, 0, clear_width, clear_height);
  ctx.fillStyle = bg_color;
  ctx.fillRect(0,0, clear_width, clear_height);
  //ctx.fill();
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

//      _        _                     
//  ___| |_ __ _(_)_ __ ___   __ _ ____
// / __| __/ _` | | '_ ` _ \ / _` |_  /
// \__ \ || (_| | | | | | | | (_| |/ / 
// |___/\__\__,_|_|_| |_| |_|\__,_/___|
//                                     


function staimaz_init(n_row,n_col) {
  let _nod_pnt = [];
  for (let row=0; row<n_row; row++) {
    _nod_pnt.push([]);
    for (let col=0; col<n_col; col++) {
      _nod_pnt[row].push({ "r": row, "c": col, "h":0, "z": [] });
    }
  }
  return _nod_pnt;
}

function staimaz_consistency(_grid) {

  let nr = _grid.length;
  let nc = _grid[0].length;

  for (let r=0; r<nr; r++) {
    for (let c=0; c<nc; c++) {

      let _m = {};

      for (let z=0; z<_grid[r][c].z.length; z++) {
        let _key = _grid[r][c].z[z].h + ":" + _grid[r][c].z[z].dir;
        if (_key in _m) { return { "msg": "duplicate entry", "code": -1, "data": {"r": r, "c":c, "zidx":z }}; }
        _m[_key] = true;
      }
    }
  }
  return {"msg":"", "code":0};
}

function _transform(r,c,h) {
  let dh = 15;
  let dx = 15;
  let dy = 15;

  let S = 40;

  /*
  let s6 = Math.sqrt(6), s3 = Math.sqrt(3), s2 = Math.sqrt(2);
  let u3 = s3/s6, u2 = s2/s6;
  let u6 = 1/s6;
  let _m = [
    [ u3, 0, -u3 ],
    [ u6, 2*u6, u6 ],
    [ u2, -u2, u2 ]
  ];
  */

  let a0 = Math.PI/4;
  let _ca0 = Math.cos(a0);
  let _sa0 = Math.sin(a0);

  let a1 = Math.PI/4;
  let _ca1 = Math.cos(a1);
  let _sa1 = Math.sin(a1);

  let _m0 = [
    [  _ca0,  _sa0, 0 ],
    [ -_sa0,  _ca0, 0 ],
    [ 0, 0, 1]
  ];

  let _m1 = [
    [ 1, 0, 0 ],
    [ 0,  _ca1,  _sa1 ],
    [ 0, -_sa1,  _ca1 ]
  ];

  let _m = numeric.dot(_m1, _m0);

  let p = [c*S,r*S, h*S];

  let x = _m[0][0]*p[0] + _m[0][1]*p[1] + _m[0][2]*p[2];
  let y = _m[1][0]*p[0] + _m[1][1]*p[1] + _m[1][2]*p[2];
  let z = _m[2][0]*p[0] + _m[2][1]*p[1] + _m[2][2]*p[2];

  //x *= 20;
  //y *= 20;


  //y += dh*h;

  /*
  let dr = 20;
  let dc = 30;
  let d_diag = 25;
  let dh = 10;
  */

  //let x = r*d_diag + dc*c;
  //let y = r*dr + h*dh;

  return { "X" : x, "Y": y };
}

// 12.
// 0.3
// .54
//
function path_geom(r, c, h, dir) {

  let cx = c;
  let cy = r;

  let ds = 1/8;
  let dd = 1/8;

  let _geom = [];
  let rop = [];

  if (dir == 0) {

    _geom = [
      [ -1,      -ds ],
      //[ -1 - ds,   0 ],
      [ -1,       ds ],
      [      ds,  ds ],
      [      ds, -ds ]
    ];

  }

  else if (dir==3) {

    _geom = [
      [   -ds, -ds ],
      [   -ds,  ds ],
      [  1,  ds ],
      //[  1+ds,   0 ],
      [  1, -ds ]
    ];

  }

  else if (dir == 5) {

    _geom = [
      [ -ds,   -ds ],
      [ -ds,  1 ],
      //[   0,  1+ds ],
      [  ds,  1 ],
      [  ds,   -ds ]
    ];


  }

  else if (dir == 2) {

    _geom = [
      [ -ds,    ds ],
      [  ds,    ds ],
      [  ds, -1 ],
      //[   0, -1-ds ],
      [ -ds, -1 ]
    ];


  }

  else if (dir==1) {

    _geom = [
      [    -dd,    dd ],
      //[     dd,    dd ],
      [     dd,   -dd ],

      [  -1 + dd, -1 - dd ],
      //[  -1 - dd, -1 - dd ],
      [  -1 - dd, -1 + dd ]
    ];
  }

  else if (dir==4) {

    _geom = [
      [     dd,   -dd ],
      //[    -dd,   -dd ],
      [    -dd,    dd ],

      [   1 - dd,  1 + dd ],
      //[   1 + dd,  1 + dd ],
      [   1 + dd,  1 - dd ],
    ];
  }

  for (let i=0; i<_geom.length; i++) {
    let xy = _transform( cy + _geom[i][1], cx + _geom[i][0], h);
    rop.push({ "X": xy.X, "Y": xy.Y });
  }

  return rop;
}

function step_geom(r,c,h,dir) {
  let cx = c;
  let cy = r;

  let ds = 1/8;
  let dd = 1/8;

  let _geom = [];
  let rop = [];

  if (dir == 0) {

    _geom = [
      [ -1,      -ds ],
      [ -1 - ds,   0 ],
      [ -1,       ds ],
      [      ds,  ds ],
      [      ds, -ds ]
    ];

  }

  else if (dir == 1) { }
  else if (dir == 2) { }
  else if (dir == 3) { }
  else if (dir == 4) { }
  else if (dir == 5) { }


}

function staimaz_print(sm) {
  let g = [];

  let hcharmap = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // 12.
  // 0.3
  // .54

  console.log("| 12.");
  console.log("| 0.3");
  console.log("| .54");

  for (let r=0; r<sm.length; r++) {

    g.push([]);
    for (let c=0; c<sm[r].length; c++) {

      let tplate = [
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ]
      ];

      let hmax=0;
      let data = sm[r][c].z;
      for (let z=0; z<data.length; z++) {
        if (data[z].h > hmax) { hmax = data[z].h; }
      }

      for (let z=0; z<data.length; z++) {

        let n = hcharmap.length;

        //tplate[1][1] = '*';
        tplate[1][1] = hcharmap.charAt( hmax%n );

        if (data[z].type == "path") {
          if      (data[z].dir == 0) { tplate[1][0] = '-'; }
          else if (data[z].dir == 1) { tplate[0][0] = '\\'; }
          else if (data[z].dir == 2) { tplate[0][1] = '|'; }
          else if (data[z].dir == 3) { tplate[1][2] = '-'; }
          else if (data[z].dir == 4) { tplate[2][2] = '\\'; }
          else if (data[z].dir == 5) { tplate[2][1] = '|'; }
        }

        else if (data[z].type == "stair0") {
          //if      (data[z].dir == 0) { tplate[1][0] = '}'; }
          if      (data[z].dir == 0) { tplate[1][0] = 'v'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = '^'; }
          //else if (data[z].dir == 3) { tplate[1][2] = '}'; }
          else if (data[z].dir == 3) { tplate[1][2] = 'v'; }
          else if (data[z].dir == 4) { tplate[2][2] = 'z'; }
          else if (data[z].dir == 5) { tplate[2][1] = '^'; }
        }

        else if (data[z].type == "stair1") {
          //if      (data[z].dir == 0) { tplate[1][0] = '{'; }
          if      (data[z].dir == 0) { tplate[1][0] = '^'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = 'v'; }
          //else if (data[z].dir == 3) { tplate[1][2] = '{'; }
          else if (data[z].dir == 3) { tplate[1][2] = '^'; }
          else if (data[z].dir == 4) { tplate[2][2] = 'z'; }
          else if (data[z].dir == 5) { tplate[2][1] = 'v'; }
        }

      }

      g[r].push(tplate);

    }
  }
  for (let r=0; r<g.length; r++) {
    let s = '';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][0][z]; }
      //s += '.';
    }
    console.log(s);
    s='';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][1][z]; }
      //s += '.';
    }
    console.log(s);
    s='';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][2][z]; }
      //s += '.';
    }
    console.log(s);
  }
}



function staimaz_geom(_grid) {

  let nr = _grid.length;
  let nc = _grid[0].length;

  let pgns = [];

  for (let r=0; r<nr; r++) {
    for (let c=0; c<nc; c++) {

      let data = _grid[r][c].z;
      for (let z=0; z<data.length; z++) {
        //let _xy = _transform(r, c, data[z].h);
        let _type = data[z].type;
        let _dir = data[z].dir;

        let p = path_geom(r, c, data[z].h, _dir);

        pgns.push(p);

      }
    }
  }

  return pgns;
}

function staimaz_gen(_opt)  {
  let opt = {};
  if (typeof _opt !== "undefined") { opt = _opt; }

  let path_choice = [ "path", "stair0", "stair1" ];

  let n_row = opt.n_row;
  let n_col = opt.n_col;

  let min_l = ((typeof opt.min_step === "undefined") ? 2 : opt.min_step);
  let max_l = ((typeof opt.max_step === "undefined") ? 5 : opt.max_step);
  let n_it = ((typeof opt.max_iter === "undefined") ? 1 : opt.max_iter);


  let dir_lookup = [
    { "dr":  0, "dc": -1 },
    { "dr": -1, "dc": -1 },
    { "dr": -1, "dc":  0 },
    { "dr":  0, "dc":  1 },
    { "dr":  1, "dc":  1 },
    { "dr":  1, "dc":  0 },
  ];

  let opposite_dir_lookup = [ 3, 4, 5, 0, 1, 2 ];

  let _nod_pnt = staimaz_init(n_row, n_col);

  let _start_nod = [ {"r": n_row-1, "c": 0, "h": 0} ];

  let min_height = 0;

  for (let it=0; it<n_it; it++) {

    let _sn = _start_nod[ Math.floor(_rnd() * _start_nod.length) ];

    // starting point
    //
    let cur_r = _sn.r, cur_c = _sn.c;

    let _prv_dir = -1;
    let _cur_height = _sn.h;

    // trace out path
    //
    while ((cur_r >= 0) && (cur_c >= 0) &&
           (cur_r < n_row) && (cur_c < n_col)) {

      // check to see we still have a direction to
      // get out of
      //
      let dir_count=0;
      let za = _nod_pnt[cur_r][cur_c].z;
      for (let ii=0; ii<za.length; ii++) {
        if (za[ii].h != _cur_height) { continue; }
        dir_count++;
      }

      if (dir_count==6) { break; }

      let _dir = Math.floor(_rnd()*6);

      // don't backtrack (simple rejection method)
      //
      if (opposite_dir_lookup[_dir] == _prv_dir) { continue; }
      _prv_dir = _dir;

      let _len = Math.floor(_rnd()*(max_l-min_l)) + min_l;

      let _dir_del = dir_lookup[_dir];

      let _path_type = path_choice[ Math.floor( _rnd()*path_choice.length) ];


      //DEBUG
      _path_type = "path";


      let step = 0;
      for (step=0; step<_len; step++) {

        if ((cur_r < 0) || (cur_r >= n_row) ||
            (cur_c < 0) || (cur_c >= n_col)) { break; }

        let zidx=0;
        for (zidx=0; zidx<_nod_pnt[cur_r][cur_c].z.length; zidx++) {
          if ((_nod_pnt[cur_r][cur_c].z[zidx].h == _cur_height) &&
              (_nod_pnt[cur_r][cur_c].z[zidx].dir == _dir)) {
            break;
          }
        }
        if (zidx < _nod_pnt[cur_r][cur_c].z.length) { break; }

        let _dh=0;
        if      (_path_type == "stair0") { _dh =  1; }
        else if (_path_type == "stair1") { _dh = -1; }

        let _pt = "path";
        if (step>0) {
          _pt = _path_type;
        }

        _nod_pnt[cur_r][cur_c].z.push( {"type": _pt, "h": _cur_height, "dir": _dir });

        if (_cur_height < min_height) { min_height = _cur_height; }

        cur_r += _dir_del.dr;
        cur_c += _dir_del.dc;

        _cur_height += _dh;

      }

      if (step == _len) {
        _start_nod.push( {"r": cur_r, "c": cur_c, "h": _cur_height });
      }

    }
  }

  for (let r=0; r<_nod_pnt.length; r++) {
    for (let c=0; c<_nod_pnt[r].length; c++) {
      for (let z=0; z<_nod_pnt[r][c].z.length; z++) {
        _nod_pnt[r][c].z[z].h -= min_height;
      }
    }
  }
  return _nod_pnt;
}




//  _       _ _   
// (_)_ __ (_) |_ 
// | | '_ \| | __|
// | | | | | | |_ 
// |_|_| |_|_|\__|
//                


function initCanvas() {
  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  g_info.width = W;
  g_info.height = H;

  let dS = ((W<H) ? W : H);

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = Math.floor(dS - dS/3);
}

function init_fin() {
  g_info.ready = true;
}

function init() {

  // EXAMPLE INIT
  //

  //setTimeout(function() { init_fin(); }, 2000);
  init_fin();

  //
  // EXAMPLE INIT

}

function init_global_param() {

  g_info.data = staimaz_gen({"n_row": 16,"n_col":16, "max_iter": 10});

  g_info.geom_data = staimaz_geom( g_info.data );

}



(()=>{

  welcome();

  g_info.last_t = Date.now();

  init_global_param();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

  initCanvas();

  init();

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 'a') {
      if (g_info.animation_capture) { console.log("already capturing!"); return; }
      g_info.capturer = new CCapture({"format":"webm"});
      g_info.capturer.start();
      g_info.animation_capture = true;

      g_info.capture_start = Date.now();
      g_info.capture_end = g_info.capture_start + g_info.capture_dt;

      console.log(">>>", g_info.capture_start, g_info.capture_end, g_info.capture_dt);
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
