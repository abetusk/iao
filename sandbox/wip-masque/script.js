//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var g_info = {
  "VERSION" : "0.1.0",
  "PROJECT" : "WIP",
  "download_filename": "wip.png",
  "canvas": {},
  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "first":true,

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

function loading_anim() {

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

//---

function vec_ang( pa, pb, pc ) {
  let v0 = {"x": pb.x - pa.x, "y":pb.y - pa.y };
  let v1 = {"x": pc.x - pa.x, "y":pc.y - pa.y };

  let a0 = Math.atan2( v0.y, v0.x );
  let a1 = Math.atan2( v1.y, v1.x );

  return a1 - a0;
}

// 'normal' vector
//
function vecn( pa, pb, pc, l ) {
  l = ((typeof l === "undefined") ? 1 : l);

  let p0 = [ pb.x - pa.x, pb.y - pa.y ];
  let p1 = [ pc.x - pa.x, pc.y - pa.y ];

  let l0 = Math.sqrt( (p0[0]*p0[0]) + (p0[1]*p0[1]) );
  let l1 = Math.sqrt( (p1[0]*p1[0]) + (p1[1]*p1[1]) );

  let n0 = { "x": -0.5*l*(p0[0]/l0 + p1[0]/l1), "y": -0.5*l*(p0[1]/l0 + p1[1]/l1) };

  return n0;
}

// 'tangent' vector
//
function vect( pa, pb, pc, l ) {
  let n0 = vecn(pa,pb,pc,l);
  return {"x":n0.y, "y":-n0.x};
}

function vect_n(pa,pb,pc,l) {
  let t0 = vect(pa,pb,pc,l);
  t0.x = -t0.x;
  t0.y = -t0.y;
  return t0;
}

function vec_len(pa,pb) {
  if (typeof pb === "undefined") {
    return Math.sqrt( (pa.x)*(pa.x) + (pa.y)*(pa.y) );
  }
  return Math.sqrt( (pb.x - pa.x)*(pb.x - pa.x) + (pb.y - pa.y)*(pb.y - pa.y) );
}

function vec_add(a,b) {
  return {"x": a.x + b.x, "y": a.y + b.y };
}

function vec_mul(v,f) {
  return {"x": f*v.x, "y": f*v.y };
}

function vec_rot(a, theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return {"x": a.x*c + a.y*s, "y": -a.x*s + a.y*c };
}

function vec_norm(a) {
  let l = vec_len(a);
  return {"x":a.x/l, "y":a.y/l};
}

function vec_diff(a,b) {
  return {"x":a.x-b.x, "y":a.y-b.y};
}

function vec_lerp(p, q, t) {
  let d = vec_diff(q,p);
  return vec_add(p, vec_mul(d, t));
}

function _fat_func_semicircle(t) {
  if (t<0) { t=0; }
  if (t>1) { t=1; }

  return Math.sqrt(1 - (2*t - 1)*(2*t - 1));
}

function _fat_func_sin(t) {
  if (t<0) { t=0; }
  if (t>1) { t=1; }

  return Math.sin(t*Math.PI);
}

function fat_leaf(ctx, opt, lvl) {
  lvl = ((typeof lvl === "undefined") ? 1 : lvl);
  if (lvl == 0) { return; }

  let a0 = ((typeof opt.a0 === "undefined") ? (fxrand()*Math.PI/8) : opt.a0);
  let a1 = ((typeof opt.a1 === "undefined") ? (fxrand()*Math.PI/8) : opt.a1);

  let p0 = opt.p0;
  let p3 = opt.p3;

  let p1 = vec_add( p0, vec_rot( vec_diff( vec_lerp(p0, p3, 0.5), p0 ), a0 ) );
  let p2 = vec_add( p3, vec_rot( vec_diff( vec_lerp(p3, p0, 0.5), p3 ), a1 ) );

  let fat_fac = ((typeof opt.fat_fac === "undefined") ? (1/8) : opt.fat_fac);
  let len_fac = ((typeof opt.len_fac === "undefined") ? (1/3) : opt.len_fac);
  let sprout_a = ((typeof opt.sprout_a === "undefined") ? (Math.PI/4) : opt.sprout_a);
  let sprout_n = ((typeof opt.sprout_n === "undefined") ? (4) : opt.sprout_n);
  let sprout_t_fac = ((typeof opt.sprout_t_fac === "undefined") ? 1.0 : opt.sprout_t_fac);

  ctx.strokeStyle = "rgba(30, 230, 30, 0.5)";
  ctx.beginPath();
  ctx.moveTo( p0.x, p0.y );
  ctx.lineTo( p3.x, p3.y );
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(p1.x-2.5, p1.y-2.5, 5, 5);
  ctx.fillRect(p2.x-2.5, p2.y-2.5, 5, 5);

  let bez_spine = new Bezier([p0, p1, p2, p3]);
  let bez_spine_lut = bez_spine.getLUT(32);

  ctx.strokeStyle = "rgba(30, 30, 30, 0.5)";
  ctx.beginPath();
  ctx.moveTo(bez_spine_lut[0].x, bez_spine_lut[0].y);
  for (let i=1; i<bez_spine_lut.length; i++) {
    ctx.lineTo(bez_spine_lut[i].x, bez_spine_lut[i].y);
  }
  ctx.stroke();

  let lin_len = vec_len(p0,p3);

  let body_outline = [];
  let _tmp = [];

  body_outline.push( bez_spine_lut[0] );

  let _fat_func = _fat_func_semicircle;

  for (let i=1; i<bez_spine_lut.length; i++) {
    let _t = i/(bez_spine_lut.length-1);

    //let _m = fat_fac*Math.sin( (i/(bez_spine_lut.length-1)) * Math.PI )*lin_len;
    //let _m = fat_fac*lin_len*_fat_func(_t);
    let _m = 50*_fat_func(_t);
    let v = vec_add(bez_spine_lut[i], vec_mul(vec_rot(vec_norm(vec_diff( bez_spine_lut[i], bez_spine_lut[i-1] )),  Math.PI/2), _m));

    body_outline.push(v);

    let u = vec_add(bez_spine_lut[i], vec_mul(vec_rot(vec_norm(vec_diff( bez_spine_lut[i], bez_spine_lut[i-1] )), -Math.PI/2), _m));

    _tmp.push(u);
  }

  for (let i=(_tmp.length-1); i>=0; i--) {
    body_outline.push(_tmp[i]);
  }

  ctx.strokeStyle = "rgba(30,30,30,0.5)";
  ctx.beginPath();
  ctx.moveTo(body_outline[0].x, body_outline[0].y);
  for (let i=0; i<body_outline.length; i++) {
    ctx.lineTo(body_outline[i].x, body_outline[i].y);
  }
  ctx.lineTo(body_outline[0].x, body_outline[0].y);
  ctx.stroke();


  /*
  let n = 32;
  for (let i=0; i<n; i++) {
    let _t = i/(n-1);
    let _f = 50*_fat_func(_t);

    let w = bez_spine.get(_t);

    let v = vec_add(w, vec_mul(bez_spine.normal(_t), _f) );
    let u = vec_add(w, vec_mul(bez_spine.normal(_t), -_f) );

    ctx.strokeStyle = "rgba(20,20,230,0.5)";
    ctx.beginPath();
    ctx.moveTo( w.x, w.y );
    ctx.lineTo( v.x, v.y );
    ctx.stroke();

    ctx.strokeStyle = "rgba(20,20,230,0.5)";
    ctx.beginPath();
    ctx.moveTo( w.x, w.y );
    ctx.lineTo( u.x, u.y );
    ctx.stroke();
  }
  */

  for (let i=0; i<sprout_n; i++) {
    let _a = sprout_a;

    let idx = Math.floor((i+1)*bez_spine_lut.length/(sprout_n+1));

    let _t = sprout_t_fac*(i+1)/(sprout_n+1);

    let p0 = bez_spine.get(_t);

    let _l = len_fac*lin_len*Math.sin( _t * Math.PI );

    let p3 = vec_add(p0, vec_mul( vec_rot(bez_spine.normal(_t), Math.PI/2 - _a), _l));
    let r_opt = {
      "p0": p0,
      "p3": p3,
      "a0": a0,
      "a1": a1,
      "fat_fac": (fat_fac)
    };
    fat_leaf(ctx, r_opt, lvl-1);

    p3 = vec_add(p0, vec_mul( vec_rot(bez_spine.normal(_t), -Math.PI/2 +_a), -_l));
    r_opt = {
      "p0": p0,
      "p3": p3,
      "a0": -a0,
      "a1": -a1,
      "fat_fac": (fat_fac)
    };
    fat_leaf(ctx, r_opt, lvl-1);

  }

}

function skinny_leaf1(ctx, opt, lvl) {
  _debug = false;
  lvl = ((typeof lvl === "undefined") ? 1 : lvl);
  if (lvl == 0) { return; }

  let a0 = ((typeof opt.a0 === "undefined") ? (fxrand()*Math.PI/8) : opt.a0);
  let a1 = ((typeof opt.a1 === "undefined") ? (fxrand()*Math.PI/8) : opt.a1);

  let p0 = opt.p0;
  let p3 = opt.p3;

  let p1 = vec_add( p0, vec_rot( vec_diff( vec_lerp(p0, p3, 0.5), p0 ), a0 ) );
  let p2 = vec_add( p3, vec_rot( vec_diff( vec_lerp(p3, p0, 0.5), p3 ), a1 ) );

  let fat_fac = ((typeof opt.fat_fac === "undefined") ? (1/8) : opt.fat_fac);
  let len_fac = ((typeof opt.len_fac === "undefined") ? (1/3) : opt.len_fac);
  let sprout_a = ((typeof opt.sprout_a === "undefined") ? (Math.PI/4) : opt.sprout_a);
  let sprout_n = ((typeof opt.sprout_n === "undefined") ? (4) : opt.sprout_n);
  let sprout_t_fac = ((typeof opt.sprout_t_fac === "undefined") ? 1.0 : opt.sprout_t_fac);
  let t_start = ((typeof opt.t_start === "undefined") ? 0.0 : opt.t_start);

  let anch0 = opt.anchor[0];
  let anch1 = opt.anchor[1];

  let _len = len_fac * vec_len( vec_diff( anch1, anch0 ) );
  _len *=2;

  // debug
  //
  ctx.fillStyle = "rgba(0, 255, 255, 0.25)";

  let p = opt.anchor[0];
  ctx.fillRect( p.x - 2.5, p.y - 2.5, 5, 5 );

  ctx.fillStyle = "rgba(155, 255, 0, 0.25)";

  p = opt.anchor[1];
  ctx.fillRect( p.x - 2.5, p.y - 2.5, 5, 5 );


  let mp = vec_mul( vec_add( anch0, anch1 ), 0.5);
  //let ep = vec_add( vec_rot( vec_mul( vec_diff( anch1, anch0 ), 0.5), -Math.PI/2 ), mp);
  let ep = vec_add( vec_rot( vec_mul( vec_norm( vec_diff( anch1, anch0 ) ), _len), -Math.PI/2 + sprout_a ), mp);

  let cp1 = vec_add( vec_rot( vec_mul( vec_norm( vec_diff( anch1, anch0 ) ), _len), -Math.PI/2 + sprout_a ), anch0);
  let cp2 = vec_add( vec_rot( vec_mul( vec_norm( vec_diff( anch1, anch0 ) ), _len), Math.PI/2 + sprout_a  ), ep);

  if (g_info.first) {
    ctx.fillStyle = "rgba(255,50,50,0.8)";
    ctx.fillRect( ep.x, ep.y, 5, 5);

    ctx.fillStyle = "rgba(100,50,150,0.8)";
    ctx.fillRect( cp1.x, cp1.y, 5, 5);

    ctx.fillStyle = "rgba(100,50,150,0.8)";
    ctx.fillRect( cp2.x, cp2.y, 5, 5);
  }
  g_info.first = false;

  let bez_o = new Bezier([anch0, cp1, cp2, ep]);

  let n = 32;
  for (let i=1; i<n-1; i++) {
    let sp = ((i-1)/n);
    let sc = (i/n);
    let a = bez_o.get(sp);
    let b = bez_o.get(sc);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(127,127,127,0.9)";
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  cp1 = vec_add( vec_rot( vec_mul( vec_norm( vec_diff( anch1, anch0 ) ), _len), -Math.PI/2 + sprout_a ), anch1);
  cp2 = vec_add( vec_rot( vec_mul( vec_norm( vec_diff( anch1, anch0 ) ), _len), Math.PI/2 + sprout_a ), ep);

  bez_o = new Bezier([anch1, cp1, cp2, ep]);

  n = 32;
  for (let i=1; i<n-1; i++) {
    let sp = ((i-1)/n);
    let sc = (i/n);
    let a = bez_o.get(sp);
    let b = bez_o.get(sc);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(127,127,127,0.9)";
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }


}

function skinny_leaf(ctx, opt, lvl) {
  _debug = false;
  lvl = ((typeof lvl === "undefined") ? 1 : lvl);
  if (lvl == 0) { return; }

  let a0 = ((typeof opt.a0 === "undefined") ? (fxrand()*Math.PI/8) : opt.a0);
  let a1 = ((typeof opt.a1 === "undefined") ? (fxrand()*Math.PI/8) : opt.a1);

  let p0 = opt.p0;
  let p3 = opt.p3;

  let p1 = vec_add( p0, vec_rot( vec_diff( vec_lerp(p0, p3, 0.5), p0 ), a0 ) );
  let p2 = vec_add( p3, vec_rot( vec_diff( vec_lerp(p3, p0, 0.5), p3 ), a1 ) );

  let fat_fac = ((typeof opt.fat_fac === "undefined") ? (1/8) : opt.fat_fac);
  let len_fac = ((typeof opt.len_fac === "undefined") ? (1/3) : opt.len_fac);
  let sprout_a = ((typeof opt.sprout_a === "undefined") ? (Math.PI/4) : opt.sprout_a);
  let sprout_n = ((typeof opt.sprout_n === "undefined") ? (4) : opt.sprout_n);
  let sprout_t_fac = ((typeof opt.sprout_t_fac === "undefined") ? 1.0 : opt.sprout_t_fac);
  let t_start = ((typeof opt.t_start === "undefined") ? 0.0 : opt.t_start);

  if (_debug) {
    ctx.strokeStyle = "rgba(30, 230, 30, 0.5)";
    ctx.beginPath();
    ctx.moveTo( p0.x, p0.y );
    ctx.lineTo( p3.x, p3.y );
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(p1.x-2.5, p1.y-2.5, 5, 5);
    ctx.fillRect(p2.x-2.5, p2.y-2.5, 5, 5);
  }

  let bez_spine = new Bezier([p0, p1, p2, p3]);
  let bez_spine_lut = bez_spine.getLUT(32);

  let n_seg = 32;

  if (_debug) {
    ctx.strokeStyle = "rgba(30, 30, 30, 0.5)";
    ctx.beginPath();
    let _bp = bez_spine.get(t_start);
    ctx.moveTo(_bp.x, _bp.y);
    for (let i=1; i<n_seg;  i++) {
      let _t = t_start + ( (1-t_start)*(i/(n_seg-1)) );
      _bp = bez_spine.get(_t);
      ctx.lineTo(_bp.x, _bp.y);
    }
    ctx.stroke();
  }

  let lin_len = vec_len(p0,p3);

  let body_outline = [];
  let _tmp = [];

  let sprout_seg = sprout_n + 1;
  let border_pnt_0 = [],
      border_pnt_1 = [];
  for (let i=0; i<sprout_seg; i++) {
    //let _t = (i/(sprout_seg-1));
    let _t = t_start + ( (1-t_start)*(i/(sprout_seg-1)) );
    let _m = fat_fac*Math.sin( _t * Math.PI )*lin_len;
    let _p = bez_spine.get(_t);
    let _n = bez_spine.normal(_t);

    let _pp = vec_add(_p, vec_mul(_n, _m)) ;
    border_pnt_0.push( _pp );

    let _qp = vec_add(_p, vec_mul(_n, -_m)) ;
    border_pnt_1.push( _qp );
  }

  if (_debug) {
    for (let i=0; i<border_pnt_0.length; i++) {
      let p = border_pnt_0[i];
      ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
      ctx.fillRect( p.x-2.5, p.y -2.5, 5, 5);
    }


    for (let i=0; i<border_pnt_1.length; i++) {
      let p = border_pnt_1[i];
      ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
      ctx.fillRect( p.x-2.5, p.y -2.5, 5, 5);
    }
  }

  for (let i=1; i<n_seg; i++) {
    let _t = t_start + ( (1-t_start)*(i/(n_seg-1)) );

    let _p = bez_spine.get(_t);
    let _n = bez_spine.normal(_t);
    let _m = fat_fac*Math.sin( _t * Math.PI )*lin_len;

    let u = vec_add(_p, vec_mul(_n, _m));
    let v = vec_add(_p, vec_mul(_n, -_m));

    body_outline.push(u);
    _tmp.push(v);
  }

  for (let i=(_tmp.length-1); i>=0; i--) {
    body_outline.push(_tmp[i]);
  }

  ctx.strokeStyle = "rgba(30,30,30,0.5)";
  ctx.beginPath();
  ctx.moveTo(body_outline[0].x, body_outline[0].y);
  for (let i=0; i<body_outline.length; i++) {
    ctx.lineTo(body_outline[i].x, body_outline[i].y);
  }
  ctx.stroke();

  // debug
  //
  if ("anchor" in opt) {
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";

    let p = opt.anchor[0];
    ctx.fillRect( p.x - 2.5, p.y - 2.5, 5, 5 );

    p = opt.anchor[1];
    ctx.fillRect( p.x - 2.5, p.y - 2.5, 5, 5 );

  }

  for (let i=1; i<border_pnt_0.length; i++) {

    let _n0 = vec_mul( vec_rot( vec_norm(vec_diff( border_pnt_0[i], border_pnt_0[i-1] )), Math.PI/2 ), 30);
    let _n1 = vec_mul( vec_rot( vec_norm(vec_diff( border_pnt_0[i], border_pnt_0[i-1] )), -Math.PI/2 ), 30);
    let p0 = vec_add( vec_mul( vec_add( border_pnt_0[i], border_pnt_0[i-1] ), 0.5 ), _n0);
    let p3 = vec_add( vec_mul( vec_add( border_pnt_0[i], border_pnt_0[i-1] ), 0.5 ), _n1);


    if (_debug) {
      ctx.fillStyle = "rgba(0,0,255,0.5)";
      ctx.fillRect( p0.x-2.5, p0.y-2.5, 5, 5 );

      ctx.fillStyle = "rgba(0,0,255,0.5)";
      ctx.fillRect( p3.x-2.5, p3.y-2.5, 5, 5 );
    }

    let r_opt = {
      "anchor": [
        { "x":border_pnt_0[i-1].x, "y": border_pnt_0[i-1].y },
        { "x":border_pnt_0[i].x, "y": border_pnt_0[i].y }
      ],
      "p0": p0,
      "p3": p3,
      "a0": a0,
      "a1": a1,
      "t_start": 0.5,
      "fat_fac": (1.5*fat_fac)
    };
    skinny_leaf1(ctx, r_opt, lvl-1);

  }

  for (let i=1; i<border_pnt_1.length; i++) {

    let _n0 = vec_mul( vec_rot( vec_norm(vec_diff( border_pnt_1[i], border_pnt_1[i-1] )), -Math.PI/2 ), 30);
    let _n1 = vec_mul( vec_rot( vec_norm(vec_diff( border_pnt_1[i], border_pnt_1[i-1] )), Math.PI/2 ), 30);
    let p0 = vec_add( vec_mul( vec_add( border_pnt_1[i], border_pnt_1[i-1] ), 0.5 ), _n0);
    let p3 = vec_add( vec_mul( vec_add( border_pnt_1[i], border_pnt_1[i-1] ), 0.5 ), _n1);


    if (_debug) {
      ctx.fillStyle = "rgba(0,0,255,0.5)";
      ctx.fillRect( p0.x-2.5, p0.y-2.5, 5, 5 );

      ctx.fillStyle = "rgba(0,0,255,0.5)";
      ctx.fillRect( p3.x-2.5, p3.y-2.5, 5, 5 );
    }

    let r_opt = {
      "anchor": [
        { "x":border_pnt_1[i-1].x, "y": border_pnt_1[i-1].y },
        { "x":border_pnt_1[i].x, "y": border_pnt_1[i].y }
      ],
      "p0": p0,
      "p3": p3,
      "a0": -a0,
      "a1": -a1,
      "t_start": 0.5,
      "fat_fac": (1.5*fat_fac)
    };
    skinny_leaf1(ctx, r_opt, lvl-1);

  }

}

function _skinny_leaf(ctx, opt, lvl) {
  lvl = ((typeof lvl === "undefined") ? 1 : lvl);
  if (lvl == 0) { return; }

  let a0 = ((typeof opt.a0 === "undefined") ? (fxrand()*Math.PI/8) : opt.a0);
  let a1 = ((typeof opt.a1 === "undefined") ? (fxrand()*Math.PI/8) : opt.a1);

  let p0 = opt.p0;
  let p3 = opt.p3;

  let p1 = vec_add( p0, vec_rot( vec_diff( vec_lerp(p0, p3, 0.5), p0 ), a0 ) );
  let p2 = vec_add( p3, vec_rot( vec_diff( vec_lerp(p3, p0, 0.5), p3 ), a1 ) );

  let fat_fac = ((typeof opt.fat_fac === "undefined") ? (1/8) : opt.fat_fac);
  let len_fac = ((typeof opt.len_fac === "undefined") ? (1/3) : opt.len_fac);
  let sprout_a = ((typeof opt.sprout_a === "undefined") ? (Math.PI/4) : opt.sprout_a);
  let sprout_n = ((typeof opt.sprout_n === "undefined") ? (4) : opt.sprout_n);
  let sprout_t_fac = ((typeof opt.sprout_t_fac === "undefined") ? 1.0 : opt.sprout_t_fac);

  ctx.strokeStyle = "rgba(30, 230, 30, 0.5)";
  ctx.beginPath();
  ctx.moveTo( p0.x, p0.y );
  ctx.lineTo( p3.x, p3.y );
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(p1.x-2.5, p1.y-2.5, 5, 5);
  ctx.fillRect(p2.x-2.5, p2.y-2.5, 5, 5);

  let bez_spine = new Bezier([p0, p1, p2, p3]);
  let bez_spine_lut = bez_spine.getLUT(32);

  ctx.strokeStyle = "rgba(30, 30, 30, 0.5)";
  ctx.beginPath();
  ctx.moveTo(bez_spine_lut[0].x, bez_spine_lut[0].y);
  for (let i=1; i<bez_spine_lut.length; i++) {
    ctx.lineTo(bez_spine_lut[i].x, bez_spine_lut[i].y);
  }
  ctx.stroke();

  let lin_len = vec_len(p0,p3);

  let body_outline = [];
  let _tmp = [];

  body_outline.push( bez_spine_lut[0] );
  for (let i=1; i<bez_spine_lut.length; i++) {

    let _m = fat_fac*Math.sin( (i/(bez_spine_lut.length-1)) * Math.PI )*lin_len;
    let v = vec_add(bez_spine_lut[i], vec_mul(vec_rot(vec_norm(vec_diff( bez_spine_lut[i], bez_spine_lut[i-1] )),  Math.PI/2), _m));

    body_outline.push(v);

    let u = vec_add(bez_spine_lut[i], vec_mul(vec_rot(vec_norm(vec_diff( bez_spine_lut[i], bez_spine_lut[i-1] )), -Math.PI/2), _m));

    _tmp.push(u);
  }

  for (let i=(_tmp.length-1); i>=0; i--) {
    body_outline.push(_tmp[i]);
  }

  ctx.strokeStyle = "rgba(30,30,30,0.5)";
  ctx.beginPath();
  ctx.moveTo(body_outline[0].x, body_outline[0].y);
  for (let i=0; i<body_outline.length; i++) {
    ctx.lineTo(body_outline[i].x, body_outline[i].y);
  }
  ctx.lineTo(body_outline[0].x, body_outline[0].y);
  ctx.stroke();

  for (let i=0; i<sprout_n; i++) {
    let _a = sprout_a;

    let idx = Math.floor((i+1)*bez_spine_lut.length/(sprout_n+1));


    //DEBUG
    //
    //let _t = 0.6*(i+1)/(sprout_n+1);
    let _t = sprout_t_fac*(i+1)/(sprout_n+1);
    //let _t = (i+1)/(sprout_n+1);

    let p0 = bez_spine.get(_t);

    let _l = len_fac*lin_len*Math.sin( _t * Math.PI );
    //let _l = len_fac*lin_len;

    let p3 = vec_add(p0, vec_mul( vec_rot(bez_spine.normal(_t), Math.PI/2 - _a), _l));
    let r_opt = {
      "p0": p0,
      "p3": p3,
      "a0": a0,
      "a1": a1,
      "fat_fac": (1.5*fat_fac)
    };
    _skinny_leaf(ctx, r_opt, lvl-1);

    p3 = vec_add(p0, vec_mul( vec_rot(bez_spine.normal(_t), -Math.PI/2 +_a), -_l));
    r_opt = {
      "p0": p0,
      "p3": p3,
      "a0": -a0,
      "a1": -a1,
      "fat_fac": (1.5*fat_fac)
    };
    _skinny_leaf(ctx, r_opt, lvl-1);

  }

}

function dollop(ctx, x0, y0, x1, y1, d, a0, a1, opt) {
  let show_path = true;
  let show_cp = true;

  let cseq = [
    "rgba(255,0,0,0.5)",
    "rgba(0,255,0,0.5)",
    "rgba(0,0,255,0.5)",
    "rgba(255,255,0,0.5)",
    "rgba(0,255,255,0.5)",
    "rgba(255,0,255,0.5)",
    "rgba(255,0,255,0.5)",
  ];

  let p0 = { "x": x0, "y": y0 };
  let p1 = { "x": x1, "y": y1 };

  let cx = x1;
  let cy = y1;

  let r = d/2;

  let circ_seg = [];

  let end_ang = a0;

  // half circle only
  //
  let n = 32;
  for (let i=0; i<n; i++) {
    let _ca = (Math.PI*i/n)  + end_ang + (Math.PI/2);

    let _dx = Math.cos(_ca)*r;
    let _dy = Math.sin(_ca)*r;

    circ_seg.push( {"x": p1.x + _dx, "y": p1.y + _dy } );
  }

  ctx.strokeStyle = "rgba(30, 30, 30, 0.5)";
  ctx.beginPath();
  ctx.moveTo(circ_seg[0].x, circ_seg[0].y);
  for (let i=1; i<circ_seg.length; i++) {
    ctx.lineTo(circ_seg[i].x, circ_seg[i].y);
  }
  ctx.stroke();


  /*
  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 50, 50, 0.2)";
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.fill();
*/

  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 50, 50, 0.2)";
  ctx.fillRect(x0, y0, 5, 5);
  ctx.fill();

  let _a = Math.atan2( y1-y0, x1-x0 );
  let _aa = _a - a0;

  let _l = vec_len(p0, p1);
  let c_fac = _l/3;

  let c01 = vec_add( p0, vec_rot( vec_mul( vec_norm( vec_diff( p1, p0 ) ), c_fac ), -a0) );

  ctx.beginPath();
  ctx.fillStyle = "rgba(250, 50, 50, 0.2)";
  ctx.fillRect(c01.x, c01.y, 5, 5);
  ctx.fill();

  let c03 = vec_add(p1, vec_rot( vec_mul( vec_norm(vec_diff(p0, p1)), r ), (Math.PI/2)+a0 ) );

  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 250, 50, 0.7)";
  ctx.fillRect(c03.x, c03.y, 5, 5);
  ctx.fill();

  let c02 = vec_add(c03, vec_rot( vec_mul(vec_norm(vec_diff(c03, p1)), c_fac), -Math.PI/2));

  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 50, 250, 0.7)";
  ctx.fillRect(c02.x, c02.y, 5, 5);
  ctx.fill();

  //--

  let c11 = vec_add( p0, vec_rot( vec_mul( vec_norm( vec_diff( p1, p0 ) ), c_fac ), -a1) );

  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 250, 250, 0.9)";
  ctx.fillRect(c11.x, c11.y, 5, 5);
  ctx.fill();

  let c13 = vec_add(p1, vec_rot( vec_mul( vec_norm(vec_diff(p0, p1)), r ), -(Math.PI/2)+a0 ) );

  ctx.beginPath();
  ctx.fillStyle = "rgba(250, 250, 50, 0.7)";
  ctx.fillRect(c13.x, c13.y, 5, 5);
  ctx.fill();

  let c12 = vec_add(c13, vec_rot( vec_mul(vec_norm(vec_diff(c13, p1)), c_fac), Math.PI/2));

  ctx.beginPath();
  ctx.fillStyle = "rgba(50, 50, 250, 0.7)";
  ctx.fillRect(c12.x, c12.y, 5, 5);
  ctx.fill();

  let bz0 = [ p0, c01, c02, c03 ];
  let bz1 = [ p0, c11, c12, c13 ];

  let bez0 = new Bezier(bz0);
  let bez0_lut = bez0.getLUT(32);

  let bez1 = new Bezier(bz1);
  let bez1_lut = bez1.getLUT(32);

  for (let i=1; i<bez0_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez0_lut[i-1].x, bez0_lut[i-1].y );
    ctx.lineTo( bez0_lut[i].x, bez0_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez1_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez1_lut[i-1].x, bez1_lut[i-1].y );
    ctx.lineTo( bez1_lut[i].x, bez1_lut[i].y );
    ctx.stroke();
  }


}

function _dollop(ctx, x0, y0, w, h, a, opt) {
  let show_path = true;
  let show_cp = true;

  let cseq = [
    "rgba(255,0,0,0.5)",
    "rgba(0,255,0,0.5)",
    "rgba(0,0,255,0.5)",
    "rgba(255,255,0,0.5)",
    "rgba(0,255,255,0.5)",
    "rgba(255,0,255,0.5)",
    "rgba(255,0,255,0.5)",
  ];

  let _c = Math.cos(a);
  let _s = Math.sin(a);

  let dx0 = -_c*w/2 + _s*h;
  let dy0 =  _s*w/2 + _c*h;

  let dx1 =  _c*w/2 + _s*h;
  let dy1 = -_s*w/2 + _c*h;

  // looks decent...
  //
  let path = [
    { "x": x0, "y": y0 },
    { "x": x0+dx0, "y": y0+dy0 },
    { "x": x0+dx1, "y": y0+dy1 }
  ];

  let l01 = vec_len( path[1], path[0] );
  let l02 = vec_len( path[2], path[0] );

  let l12 = vec_len( path[1], path[2] );

  console.log(l01, l02, l12);

  let dollop_beg = l01/2;
  let dollop_end = l02/2;

  let base_ang0_f = 2.5;
  let base_ang1_f = 1.85;

  let dollop_mid_end = l12/2;

  let bz0 = [
    path[0],
    vec_add( path[0], vec_rot( vec_mul( vec_norm( vec_diff(path[1],path[0]) ), dollop_beg), vec_ang(path[0], path[1], path[2])*base_ang0_f ) ),
    vec_add( path[1], vect_n(path[1], path[2], path[0], dollop_end)),
    path[1]
  ];

  let bz1 = [
    path[1],
    vec_add( path[1], vect_n(path[1], path[2], path[0], -dollop_mid_end)),
    vec_add( path[2], vect_n(path[2], path[0], path[1],  dollop_mid_end)),
    path[2]
  ]

  let bz2 = [
    path[0],
    vec_add( path[0], vec_rot( vec_mul( vec_norm( vec_diff(path[2],path[0]) ), dollop_beg), vec_ang(path[0], path[1], path[2])*base_ang1_f ) ),
    vec_add( path[2], vect_n(path[2], path[0], path[1], -dollop_end)),
    path[2]
  ]

  let bez0 = new Bezier(bz0);
  let bez0_lut = bez0.getLUT(32);

  let bez1 = new Bezier(bz1);
  let bez1_lut = bez1.getLUT(32);

  let bez2 = new Bezier(bz2);
  let bez2_lut = bez2.getLUT(32);

  //---

  if (show_path) {
    for (let i=0; i<path.length; i++) {
      let nxt = (i+1)%(path.length);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.moveTo( path[i].x, path[i].y );
      ctx.lineTo( path[nxt].x, path[nxt].y );
      ctx.stroke();
    }

  }


  if (show_cp) {
    for (let i=0; i<bz0.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz0[i].x - 2, bz0[i].y - 2, 4, 4);
    }

    for (let i=0; i<bz1.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz1[i].x - 2, bz1[i].y - 2, 4, 4);
    }

    for (let i=0; i<bz2.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz2[i].x - 2, bz2[i].y - 2, 4, 4);
    }
  }

  for (let i=1; i<bez0_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez0_lut[i-1].x, bez0_lut[i-1].y );
    ctx.lineTo( bez0_lut[i].x, bez0_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez1_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez1_lut[i-1].x, bez1_lut[i-1].y );
    ctx.lineTo( bez1_lut[i].x, bez1_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez2_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez2_lut[i-1].x, bez2_lut[i-1].y );
    ctx.lineTo( bez2_lut[i].x, bez2_lut[i].y );
    ctx.stroke();
  }

}

function dollop_leaf(ctx, x0, y0, w, h, a, opt) {
  let show_path = false;
  let show_cp = false;

  let cseq = [
    "rgba(255,0,0,0.5)",
    "rgba(0,255,0,0.5)",
    "rgba(0,0,255,0.5)",
    "rgba(255,255,0,0.5)",
    "rgba(0,255,255,0.5)",
    "rgba(255,0,255,0.5)",
    "rgba(255,0,255,0.5)",
  ];

  let _c = Math.cos(a);
  let _s = Math.sin(a);

  let dx0 = -_c*w/2 + _s*h;
  let dy0 =  _s*w/2 + _c*h;

  let dx1 = -_c*(w/10) + _s*h*0.985;
  let dy1 =  _s*(w/10) + _c*h*0.985;

  let dx2 =  _c*w/2 + _s*h;
  let dy2 = -_s*w/2 + _c*h;

  // looks decent...
  //
  let path = [
    { "x": x0, "y": y0 },
    { "x": x0+dx0, "y": y0+dy0 },
    { "x": x0+dx1, "y": y0+dy1 },
    { "x": x0+dx2, "y": y0+dy2 }
  ];

  let l01 = vec_len( path[1], path[0] );
  let l02 = vec_len( path[2], path[0] );

  let l12 = vec_len( path[1], path[2] );

  let dollop_beg = l01/2;
  let dollop_end = l02/2;

  let base_ang0_f = 2.5;
  let base_ang1_f = 1.85;

  let dollop_mid_end = l12/2;

  let bz0 = [
    path[0],
    vec_add( path[0], vec_rot( vec_mul( vec_norm( vec_diff(path[1],path[0]) ), dollop_beg), vec_ang(path[0], path[1], path[2])*base_ang0_f ) ),
    vec_add( path[1], vect_n(path[1], path[2], path[0], dollop_end)),
    path[1]
  ];

  let bz1 = [
    path[1],
    vec_add( path[1], vect_n(path[1], path[2], path[0], -dollop_mid_end)),
    vec_add( path[2], vect_n(path[2], path[0], path[1],  dollop_mid_end)),
    path[2]
  ]

  let bz2 = [
    path[2],
    vec_add( path[2], vect_n(path[2], path[3], path[0], -dollop_mid_end)),
    vec_add( path[3], vect_n(path[3], path[0], path[2],  dollop_mid_end)),
    path[3]
  ]

  let bz3 = [
    path[0],
    vec_add( path[0], vec_rot( vec_mul( vec_norm( vec_diff(path[3],path[0]) ), dollop_beg), vec_ang(path[0], path[2], path[3])*base_ang1_f ) ),
    vec_add( path[3], vect_n(path[3], path[0], path[2], -dollop_end)),
    path[3]
  ]

  let bez0 = new Bezier(bz0);
  let bez0_lut = bez0.getLUT(32);

  let bez1 = new Bezier(bz1);
  let bez1_lut = bez1.getLUT(32);

  let bez2 = new Bezier(bz2);
  let bez2_lut = bez2.getLUT(32);

  let bez3 = new Bezier(bz3);
  let bez3_lut = bez3.getLUT(32);

  //---

  if (show_path) {
    for (let i=0; i<path.length; i++) {
      let nxt = (i+1)%(path.length);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.moveTo( path[i].x, path[i].y );
      ctx.lineTo( path[nxt].x, path[nxt].y );
      ctx.stroke();
    }

  }


  if (show_cp) {
    for (let i=0; i<bz0.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz0[i].x - 2, bz0[i].y - 2, 4, 4);
    }

    for (let i=0; i<bz1.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz1[i].x - 2, bz1[i].y - 2, 4, 4);
    }

    for (let i=0; i<bz2.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz2[i].x - 2, bz2[i].y - 2, 4, 4);
    }

    for (let i=0; i<bz3.length; i++) {
      ctx.fillStyle = cseq[i % cseq.length];
      ctx.fillRect( bz3[i].x - 2, bz3[i].y - 2, 4, 4);
    }
  }

  for (let i=1; i<bez0_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez0_lut[i-1].x, bez0_lut[i-1].y );
    ctx.lineTo( bez0_lut[i].x, bez0_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez1_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez1_lut[i-1].x, bez1_lut[i-1].y );
    ctx.lineTo( bez1_lut[i].x, bez1_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez2_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez2_lut[i-1].x, bez2_lut[i-1].y );
    ctx.lineTo( bez2_lut[i].x, bez2_lut[i].y );
    ctx.stroke();
  }

  for (let i=1; i<bez3_lut.length; i++) {
    ctx.strokeStyle = "rgba(50, 50, 50, 0.3)";
    ctx.beginPath();
    ctx.moveTo( bez3_lut[i-1].x, bez3_lut[i-1].y );
    ctx.lineTo( bez3_lut[i].x, bez3_lut[i].y );
    ctx.stroke();
  }

}

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  ctx = g_info.ctx;

  //ctx.fillStyle = "rgba(2,2,2,0.5)";
  //ctx.fillRect(30, 30, 50, 50);

  //dollop(ctx, 300, 300, 200, 200, 50, Math.PI/8, Math.PI/16);
  //dollop_leaf(ctx, 200, 200, 50, 100, Math.PI);
  let opt = {
    "p0" : { "x": 300, "y": 300 },
    "p3" : { "x": 200, "y": 150 },
    "a0" : Math.PI/8,
    "a1" : Math.PI/8,
    "sprout_n": 4,
    "sprout_t_fac": 0.7,
    //"sprout_a": Math.PI/4,
    "sprout_a": Math.PI/2,
    "t_start": 0.0,
    "len_fac": 0.4,
    "fat_fac": 0.2
  };
  //fat_leaf(ctx, opt, 2);
  skinny_leaf(ctx, opt, 2);

  return;

  let cx = 200, cy = 200;

  let p0  = { "x": cx,     "y": cy };
  let p0c = { "x": cx-10,  "y":cy-100 };
  let p1c = { "x": cx-50, "y":cy-100 };
  let p1  = { "x": cx-100, "y":cy-100 };
  let b = new Bezier(p0, p0c, p1c, p1);

  let lutp = b.getLUT(16);
  ctx.strokeStyle = "rgba(2,2,2,0.5)";
  ctx.beginPath();
  ctx.moveTo( lutp[0].x, lutp[0].y );
  for (let i=1; i<lutp.length; i++) {
    ctx.lineTo( lutp[i].x, lutp[i].y );
  }
  ctx.stroke();

  return;



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
    loading_anim();
    return;
  }

  // PER FRAME CODE
  //

  ctx.lineWidth = 0;

  let w2 = _cw / 2;
  let h2 = _ch / 2;

  ctx.fillStyle = '#777';
  ctx.lineWidth = 0;
  ctx.beginPath();
  ctx.fillRect(w2-30,h2-30,60,60);

  //
  // PER FRAME CODE


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
  g_info.size = Math.floor(dS - dS/3);
}

function init_fin() {
  g_info.ready = true;
}

function init() {

  // EXAMPLE INIT
  //

  setTimeout(function() { init_fin(); }, 2000);

  //
  // EXAMPLE INIT

}

function init_global_param() {
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

  console.log("...");

  clear();


  //---
  //---

  //---
  //---


  window.requestAnimationFrame(anim);

})();
