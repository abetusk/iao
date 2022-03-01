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

  "current_profile" : {},
  "profile": [
    {
      "base_level": 7,
      "refine_level": 5,
      "display_start_level": 3,
      "display_layer_count": 35,
      "cx": 300,
      "cy": 400,
      "reflect_x": 900,
      "c_choice": [
        "rgba(0,0,0,0.02)",
        "rgba(170,0,0,0.05)"
      ],
      "c": "rgba(0,0,0,0.02)"
    },

    {
      "base_level": 8,
      "refine_level": 5,
      "display_start_level": 4,
      "display_layer_count": 20,
      "cx": 300,
      "cy": 400,
      "reflect_x": 900,
      "c_choice": [
        "rgba(0,0,0,0.02)",
        "rgba(170,0,0,0.09)"
      ],
      "c": "rgba(0,0,0,0.05)"
    },

    // digital rorschach
    //
    {
      "base_level": 7,
      "refine_level": 3,
      "display_start_level": 0,
      "display_layer_count": 15,
      "cx": 300,
      "cy": 400,
      "reflect_x": 800,
      "c_choice": [
        "rgba(0,0,0,0.02)",
        "rgba(170,0,0,0.09)"
      ],
      "c": "rgba(0,0,0,0.07)"
      //"c": "rgba(0,0,0,0.035)"
    },
    {
      "base_level": 7,
      "refine_level": 3,
      "display_start_level": 0,
      "display_layer_count": 5,
      "cx": 300,
      "cy": 400,
      "reflect_x": 900,
      "c_choice": [
        "rgba(201,59,106,0.05)",
        "rgba(0,0,0,0.12)",
        "rgba(170,0,0,0.1)"
        //"rgba(243,152,195,0.15)"
      ],
      "_c_choice": [
        "rgba(0,0,0,0.12)",
        "rgba(170,0,0,0.15)",
        "rgba(201,59,106,0.1)"
        //"rgba(243,152,195,0.15)"
      ],
      "c": "rgba(0,0,0,0.99)"
    }
  ],

  "noise" : [],

  "disp_pgns":[],
  "pgn_set": [],

  "rnd":[],

  "features" : {},

  //"bg_color" : "#eee"
  "bg_color" : "rgba(240,240,240,1.0)"

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

function water_poly_r(ctx, pgns, lvl, c) {
  let display = false;

  if (lvl==0) { return; }

  let n = pgns.length;
  let pgn = pgns[n-1];

  if (display) {

    //ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillStyle = c;
    ctx.beginPath();

    ctx.moveTo(pgn[0].x, pgn[0].y);
    for (let i=1; i<pgn.length; i++) {
      ctx.lineTo(pgn[i].x, pgn[i].y);
    }
    ctx.fill();
  }

  // good
  //let _f = 0.25;
  let _f = 0.3;

  let subdiv_pgn = [];
  for (let i=0; i<pgn.length; i++) {
    let ni = ((i+1)%pgn.length);

    let mx = {
      "x": (pgn[i].x + pgn[ni].x)/2.0, 
      "y": (pgn[i].y + pgn[ni].y)/2.0
    };

    let _l = _f*vec_len( vec_diff(pgn[ni], pgn[i]) );

    let a = fxrand()*Math.PI*2;

    let dv = {
      "x": _l*Math.cos(a),
      "y": _l*Math.sin(a)
    };

    let v = vec_add( mx, dv );

    subdiv_pgn.push( pgn[i] );
    subdiv_pgn.push( v );
  }

  pgns.push(subdiv_pgn);

  //water_poly_r(ctx, subdiv_pgn, lvl-1);
  water_poly_r(ctx, pgns, lvl-1);

}

function experiment0_water_poly_base_r(ctx, pgns, lvl, c, display) {
  //let display = false;
  c = ((typeof c === "undefined") ? "rgba(0,0,0,0.04)" : c);
  display = ((typeof display === "undefined") ? false : display);

  if (lvl==0) { return; }

  let n = pgns.length;
  let pgn = pgns[n-1];

  if (display) {

    //ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillStyle = c;
    ctx.beginPath();

    ctx.moveTo(pgn[0].x, pgn[0].y);
    for (let i=1; i<pgn.length; i++) {
      ctx.lineTo(pgn[i].x, pgn[i].y);
    }
    ctx.fill();
  }

  // good
  //let _f = 0.25;
  //let _f = 0.7;
  let _f = 0.6;

  //_f = _rndpow(2.5)*0.6;


  let subdiv_pgn = [];
  for (let i=0; i<pgn.length; i++) {
    let ni = ((i+1)%pgn.length);

    let mx = {
      "x": (pgn[i].x + pgn[ni].x)/2.0, 
      "y": (pgn[i].y + pgn[ni].y)/2.0
    };

    let _l = _f*vec_len( vec_diff(pgn[ni], pgn[i]) );

    let a = fxrand()*Math.PI*2;

    let dv = {
      "x": _l*Math.cos(a),
      "y": _l*Math.sin(a)
    };

    let v = vec_add( mx, dv );

    subdiv_pgn.push( pgn[i] );
    subdiv_pgn.push( v );
  }

  pgns.push(subdiv_pgn);

  water_poly_base_r(ctx, pgns, lvl-1, c, display);
}

function water_poly_base_r(pgns, lvl) {
  c = ((typeof c === "undefined") ? "rgba(0,0,0,0.04)" : c);
  display = ((typeof display === "undefined") ? false : display);

  if (lvl==0) { return; }

  let n = pgns.length;
  let pgn = pgns[n-1];

  //let _f = 0.6;
  let _f = 0.5;

  let subdiv_pgn = [];
  for (let i=0; i<pgn.length; i++) {
    let ni = ((i+1)%pgn.length);

    let mx = {
      "x": (pgn[i].x + pgn[ni].x)/2.0, 
      "y": (pgn[i].y + pgn[ni].y)/2.0
    };

    let _l = _f*vec_len( vec_diff(pgn[ni], pgn[i]) );

    let a = 2*fxrand()*Math.PI;

    let dv = {
      "x": _l*Math.cos(a),
      "y": _l*Math.sin(a)
    };

    let v = vec_add( mx, dv );

    subdiv_pgn.push( pgn[i] );
    subdiv_pgn.push( v );
  }

  pgns.push(subdiv_pgn);

  water_poly_base_r(pgns, lvl-1);
}

function layer_polygon(ctx, pgns, c, start_idx) {
  c = ((typeof c === "undefined") ? "rgba(0,0,0,0.2)" : c);
  start_idx = ((typeof start_idx === "undefined") ? 0 : start_idx);

  ctx.fillStyle = c;
  for (let idx=start_idx; idx<pgns.length; idx++) {
    let p = pgns[idx];

    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i=1; i<p.length; i++) {
      ctx.lineTo(p[i].x, p[i].y);
    }
    ctx.closePath();
    ctx.fill();

  }


}


function anim() {
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  g_info.tick++;
  window.requestAnimationFrame(anim);

  clear();
  if (!g_info.ready) {
    loading_anim();
    return;
  }

  for (i=0; i<g_info.noise.length; i++) {
    let v = g_info.noise[i];
    ctx.fillStyle = v.c;
    ctx.beginPath();
    ctx.arc( v.x, v.y, v.r, 0, Math.PI*2);
    ctx.fill();
  }

  let _prof = g_info.current_profile;
  let n = (g_info.tick % _prof.display_layer_count) + 1;

  n = (g_info.tick % (2*_prof.display_layer_count));
  if (n > _prof.display_layer_count) {
    //n = 2*_prof.display_layer_count - n;
    n = _prof.display_layer_count - (n%_prof.display_layer_count);
  }

  n = _prof.display_layer_count;


  //for (let idx=0; idx<_prof.display_layer_count; idx++) {
  //for (let idx=0; idx<n; idx++) {

  //let c_choice = [ "rgba(0,0,0,0.02)", "rgba(170,0,0,0.02)", ];

  let c_choice = _prof.c_choice;

  for (let i=0; i<g_info.pgn_set.length; i++) {
    let disp_pgn = g_info.pgn_set[i];
    //for (let idx=0; idx<g_info.disp_pgns.length; idx++) {
    for (let idx=0; idx<disp_pgn.length; idx++) {

      let c = c_choice[i % c_choice.length];

      //let rpgns = g_info.disp_pgns[idx];
      let rpgns = disp_pgn[idx];
      //layer_polygon(ctx, rpgns, _prof.c, _prof.display_start_level);
      layer_polygon(ctx, rpgns, c, _prof.display_start_level);


      ctx.save();
      ctx.translate(_prof.reflect_x,0);
      ctx.scale(-1, 1);
      //layer_polygon(ctx, rpgns, _prof.c, _prof.display_start_level);
      layer_polygon(ctx, rpgns, c, _prof.display_start_level);
      ctx.restore();
    }
  }


}

function setup_pgns() {
  let ok = true;

  let _prof = g_info.current_profile;


  let disp_pgn = [];
  let pgn = [];

  for (let i=0; i<8; i++) {
  //for (let i=0; i<3; i++) {
    let a = (i/8)*Math.PI*2;

    pgn.push({ 
      "x": _prof.cx + 150*Math.cos(a),
      "y": _prof.cy + 150*Math.sin(a)
    });

  }

  let pgns = [ pgn ];

  let lvl = _prof.base_level;
  water_poly_base_r(pgns, lvl);
  for (let idx=0; idx<_prof.display_layer_count; idx++) {
    let rpgns = [ pgns[pgns.length-1] ];
    water_poly_base_r(rpgns, _prof.refine_level);
    disp_pgn.push( rpgns );
  }

  g_info.pgn_set.push(disp_pgn);

  // wip

  pgn = [];
  for (let i=0; i<3; i++) {
    let a = (i/8)*Math.PI*2;

    pgn.push({ 
      "x": _prof.cx + 150*Math.cos(a) + 300,
      "y": 150 + 50*Math.sin(a)
    });

  }

  pgns = [ pgn ];

  disp_pgn = [];

  lvl = _prof.base_level;
  water_poly_base_r(pgns, lvl);
  for (let idx=0; idx<_prof.display_layer_count; idx++) {
    let rpgns = [ pgns[pgns.length-1] ];

    water_poly_base_r(rpgns, _prof.refine_level);

    disp_pgn.push( rpgns );
  }

  g_info.pgn_set.push(disp_pgn);

  // wip

  pgn = [];
  for (let i=0; i<3; i++) {
    let a = (i/8)*Math.PI*2;

    pgn.push({ 
      "x": _prof.cx + 150*Math.cos(a) + 300,
      "y": 550 + 50*Math.sin(a)
    });

  }

  pgns = [ pgn ];

  disp_pgn = [];

  lvl = _prof.base_level;
  water_poly_base_r(pgns, lvl);
  for (let idx=0; idx<_prof.display_layer_count; idx++) {
    let rpgns = [ pgns[pgns.length-1] ];

    water_poly_base_r(rpgns, _prof.refine_level);

    disp_pgn.push( rpgns );
  }

  g_info.pgn_set.push(disp_pgn);


}

function clear(ctx, clear_width, clear_height, bg_color) {
  ctx = ((typeof ctx === "undefined") ? g_info.ctx : ctx);
  clear_width  = ((typeof clear_width  === "undefined") ? g_info.canvas.width  : clear_width)
  clear_height = ((typeof clear_height === "undefined") ? g_info.canvas.height : clear_height)
  bg_color     = ((typeof bg_color === "undefined") ? g_info.bg_color : bg_color)


  //wtf
  //

  ctx.fillStyle = bg_color;
  ctx.clearRect(0, 0, clear_width, clear_height);
  //ctx.fillStyle = bg_color;
  //ctx.rect(0,0, clear_width, clear_height);
  //ctx.fill();
  ctx.fillRect(0,0, clear_width, clear_height);
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

function _rnd_weight() {
  let x = fxrand();
  if (x< 0.5) { return 4*x*x; }
  return 1- 4*(x-0.5)*(x-0.5);
}

function init() {
  init_fin();

  let idx = Math.floor(fxrand()*g_info.profile.length);
  g_info.current_profile = g_info.profile[idx];

  g_info.current_profile = g_info.profile[0];

  setup_pgns();

  console.log(">>>", g_info.width, g_info.height);

  let R = 2;
  let N = 20000;
  let w = g_info.width, h = g_info.height;
  for (let i=0; i<N; i++) {
    let v = {
      "x": _rnd_weight()*w ,
      "y": _rnd_weight()*h ,
      "r": fxrand()*R,
      "c": "rgba(0,0,0,0.05)" };
    g_info.noise.push(v);
  }

  console.log(">>", idx);
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

  clear();


  //---
  //---

  //---
  //---


  window.requestAnimationFrame(anim);

})();
