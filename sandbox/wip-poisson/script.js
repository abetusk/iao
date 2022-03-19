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

  "rnd":[],

  "features" : {},

  "pnt": [],
  "pnt_b": [],
  //"max_pnt": 1000,
  //"max_pnt": (1000*1000)/(Math.PI*2*100),
  //"pnt_r": 10,
  //"max_pnt": (1000*1000)/(Math.PI*2*5*5),
  //"pnt_r": 5,
  //"pnt_try_count": 10,

  "max_pnt": (1000*1000)/(Math.PI*2*2*2),
  "pnt_r": 2,
  "pnt_try_count": 5,

  "pnt_seed_idx": [],

  "qtree": {},

  "debug": [],

  "poisson_rady": false,
  "connect_ready": false,

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

function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(Math.random()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}

function pulse(strike) {
  strike = ((typeof strike === "undefined") ? true : strike);

  /*
  if (g_info.pnt_b.length != g_info.pnt.length) {
    g_info.pnt_b = [];
    for (let i=0; i<g_info.pnt.length; i++) {
      g_info.pnt_b.pusb( Object.assign({}, g_info.pnt[i]) );
    }
  }
  */

  for (let i=0; i<g_info.pnt.length; i++) {
    g_info.pnt[i].fire_ttl = g_info.pnt[i].fire_ttl-1;
    g_info.pnt[i].ban_ttl  = g_info.pnt[i].ban_ttl-1;

    if (g_info.pnt[i].fire_ttl < 0) {
      g_info.pnt[i].fire_ttl = 0;
    }
    if (g_info.pnt[i].ban_ttl < 0) {
      g_info.pnt[i].ban_ttl = 0;
    }

  }

  for (let i=0; i<g_info.pnt.length; i++) {
    let pnt = g_info.pnt[i];

    if (pnt.fire_ttl == 0) { continue; }

    for (let nei_key in pnt.nei) {
      let nei_idx = pnt.nei[nei_key];

      let nei_pnt = g_info.pnt[nei_idx];
      if (nei_pnt.ban_ttl > 0) { continue; }

      nei_pnt.ban_ttl  = nei_pnt.ban_ttl_max;
      nei_pnt.fire_ttl = nei_pnt.fire_ttl_max;

    }

  }

  if (strike) {
    let rnd_idx = Math.floor(fxrand()*g_info.pnt.length);
    if (g_info.pnt[rnd_idx].ban_ttl == 0) {
      g_info.pnt[rnd_idx].ban_ttl = g_info.pnt[rnd_idx].ban_ttl_max;
      g_info.pnt[rnd_idx].fire_ttl = g_info.pnt[rnd_idx].fire_ttl_max;
    }
  }


}

function connect() {
  if (g_info.connect_ready) { return; }

  console.log("bang");

  let sched = [];
  for (let i=0; i<g_info.pnt.length; i++) {
    sched.push(i);
  }
  fisher_yates_shuffle(sched);

  let qtree = g_info.qtree;
  qtree.clear();
  for (let i=0; i<g_info.pnt.length; i++) {
    qtree.insert(g_info.pnt[i]);
  }



  for (let i=0; i<sched.length; i++) {
    let idx = sched[i];
    let pnt = g_info.pnt[idx];

    let ele = qtree.retrieve(pnt);
    for (let j=0; j<ele.length; j++) {
      if ( ele[j].i == idx) { continue; }

      if (vec_len(vec_diff(pnt, ele[j])) < (4*g_info.pnt_r)) {
        if (fxrand() < 0.5) {
          pnt.nei[ ele[j].i ] = ele[j].i;
          g_info.pnt[ ele[j].i ].nei[ idx ] = idx;
        }
      }
    }
  }

  g_info.connect_ready = true;

}

function poisson_place(step_iter, reset) {
  let estimate_n = (g_info.width*g_info.height)/(Math.PI*2*g_info.pnt_r*g_info.pnt_r);

  step_iter = ((typeof step_iter === "undefined") ? (g_info.pnt_try_count*estimate_n) : step_iter);
  reset = ((typeof reset === "undefined") ? false : reset);

  if (reset) {
    g_info.pnt = [];
    g_info.pnt_seed_idx = [];
  }


  // init
  //
  if (g_info.pnt.length == 0) {
    let pnt = {
      "x": fxrand()*g_info.width,
      "y": fxrand()*g_info.height,
      "r": g_info.pnt_r,
      "i": 0,
      "width": g_info.pnt_r*2,
      "height": g_info.pnt_r*2,
      "nei":{},
      "fire_ttl": 0,
      "fire_ttl_max": 5,
      "ban_ttl": 0,
      "ban_ttl_max": 30,
      "k": g_info.pnt_try_count
    };

    g_info.pnt.push(pnt);
    g_info.pnt_seed_idx.push(0);
  }

  // nothing to do
  //
  if (g_info.pnt_seed_idx.length == 0) {
    if (!g_info.poisson_ready) {
      console.log("poisson_ready");
    }
    g_info.poisson_ready = true;
    return;
  }

  // reconstruct tree
  //
  let qtree = g_info.qtree;
  qtree.clear();
  for (let i=0; i<g_info.pnt.length; i++) {
    let pnt = g_info.pnt[i];
    qtree.insert(pnt);
  }


  for (let it=0; it<step_iter; it++) {

    if ((g_info.pnt.length < g_info.max_pnt) &&
        (g_info.pnt_seed_idx.length > 0)) {
      let _si = Math.floor(fxrand()*g_info.pnt_seed_idx.length);
      let seed_idx = g_info.pnt_seed_idx[_si];
      let seed_pnt = g_info.pnt[seed_idx];

      let ta = fxrand()*Math.PI*2;
      let td = 2*(1+fxrand())*g_info.pnt_r;

      let new_pnt = {
        "x": seed_pnt.x + td*Math.cos(ta),
        "y": seed_pnt.y + td*Math.sin(ta),
        "r": g_info.pnt_r,
        "i": g_info.pnt.length,
        "width": 2*g_info.pnt_r,
        "height": 2*g_info.pnt_r,
        "nei":{},
        "fire_ttl": 0,
        "fire_ttl_max": 5,
        "ban_ttl": 0,
        "ban_ttl_max": 30,
        "k": g_info.pnt_try_count
      };

      let ele = qtree.retrieve(new_pnt);
      let try_idx = 0;
      for (try_idx=0; try_idx<ele.length; try_idx++) {
        let _d = vec_len(vec_diff(new_pnt, ele[try_idx]))
        if (_d < g_info.pnt_r*2) { break; }

        // bounds of window
        //
        if (new_pnt.x < (g_info.pnt_r)) { break; }
        if (new_pnt.y < (g_info.pnt_r)) { break; }
        if (new_pnt.x > (g_info.width  - g_info.pnt_r)) { break; }
        if (new_pnt.y > (g_info.height - g_info.pnt_r)) { break; }
      }

      // collision...
      //
      if (try_idx == ele.length) {
        g_info.pnt.push(new_pnt);
        g_info.pnt_seed_idx.push( new_pnt.i );

        qtree.insert(new_pnt);
      }
      else { }

      seed_pnt.k--;
      if (seed_pnt.k == 0) {
        let _ei  = g_info.pnt_seed_idx.length-1;
        g_info.pnt_seed_idx[ _si ] = g_info.pnt_seed_idx[_ei];
        g_info.pnt_seed_idx.pop();
      }

    }

  }

}

function anim() {

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




  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);
  g_info.tick++;

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
    window.requestAnimationFrame(anim);
    loading_screen();
    return;
  }


  //poisson_place(1000);
  poisson_place();
  connect();

  let _sw = g_info.pnt_r*(1.75);

  ctx.beginPath();

  for (let i=0; i<g_info.pnt.length; i++) {
    let p = g_info.pnt[i];

    if (p.fire_ttl > 0) {
      ctx.fillStyle = "rgba(127,0,0,0.9)";
    }
    else {
      ctx.fillStyle = "rgba(127,127,127,0.9)";
    }

    ctx.fillRect( p.x - _sw/2, p.y - _sw/2, _sw,_sw);
  }

  if (g_info.connect_ready) {
    let strike = (((g_info.tick%120)==0) ? true : false);
    pulse();
  }


  /*
  if (g_info.connect_ready) {
    ctx.strokeStyle = "rgba(255,0,0,0.05)";
    for (let i=0; i<g_info.pnt.length; i++) {

      ctx.beginPath();
      for (let nei_idx in g_info.pnt[i].nei) {
        let _to = g_info.pnt[i].nei[nei_idx];
        ctx.moveTo( g_info.pnt[i].x, g_info.pnt[i].y );
        ctx.lineTo( g_info.pnt[_to].x, g_info.pnt[_to].y );
        ctx.stroke();
      }
    }
  }
  */



  ctx.fillStyle = "rgba(127,0,0,0.05)";
  for (let i=0; i<g_info.debug.length; i++) {
    ctx.fillRect(g_info.debug[i].x, g_info.debug[i].y, 5, 5);
  }


  window.requestAnimationFrame(anim);

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

  let dS = ((W<H) ? W : H);

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = Math.floor(dS - dS/3);

  if (g_info.ready) { init_fin(); }
}

function init_fin() {
  g_info.ready = true;

  let pointquad = false;
  let bounds = {
    "x":0,
    "y":0,
    "width": g_info.width,
    "height": g_info.height
  };

  //g_info.qtree = new QuadTree(bounds, pointquad);
  g_info.qtree = new Quadtree(bounds, pointquad);
}

function init() {

  //setTimeout(function() { init_fin(); }, 2000);
  init_fin();

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

  window.requestAnimationFrame(anim);

})();
