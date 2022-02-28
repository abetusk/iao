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
  "VERSION" : "0.1.0",
  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,
  "anim": true,

  "bg_color" : "#111",
  "f_list": [
    "stripe_45_square",
    "stripe_m45_square",
    "square_grid",
    "hatching_grid",
    "square_square",
    "square_circle",
    "circle_circle",
    "circle_square",
    "circle_band",
    "circle_band:1",
    "square_band",
    "square_band:1",
    "square_band:2"
  ],

  "hist" : [],

  "blink_ok" : 5,
  "blink_counter": 0,
  "f_hist":[]

};



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


function palette_gorillasu(offset) {
  let theta = 2*Math.PI*offset;
  let r = 127.5 + 127.5*Math.cos(theta);
  let g = 127.5 + 127.5*Math.sin(theta);
  let b = 127.5;

  return {"r": r, "g": g, "b": b, "rgb": _rgb2hex(r,g,b) };
}

function _rnd(l,u) {
  if (typeof l === "undefined") { l = 1; }
  if (typeof u === "undefined") {
    u = l;
    l = 0;
  }
  return l + ((u-l) * fxrand()) ;
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 0, v = 0;
  return Math.sqrt(-2 * Math.log(1 - _rnd())) * Math.cos(2 * Math.PI * _rnd()) 

  //while(u === 0) u = _rnd(); //Converting [0,1) to (0,1)
  //while(v === 0) v = _rnd();
  //return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// returns a gaussian random function with the given mean and stdev.
//
function gaussian(mean, stdev) {
  let y1, y2;
  let x1, x2, w;
  do {
    x1 = 2.0 * _rnd() - 1.0;
    x2 = 2.0 * _rnd() - 1.0;
    w = x1 * x1 + x2 * x2;
  } while (w >= 1.0);
  w = Math.sqrt((-2.0 * Math.log(w)) / w);
  y1 = x1 * w;
  y2 = x2 * w;

  let retval = mean + stdev * y1;
  if (retval > 0) { return retval; }
  return -retval;
}

function _irnd(l,u) {
  if (typeof l === "undefined") { l = 2; }
  if (typeof u === "undefined") {
    u = l;
    l = 0;
  }
  return Math.floor( l + ((u-l) * fxrand()) );
}

function _max(a,b) {
  if (a>b) { return a; }
  return b;
}

function _min(a,b) {
  if (a<b) { return a; }
  return b;
}

function _clamp(x,a,b) {
  if (typeof a === "undefined") { a = 0.0; }
  if (typeof b === "undefined") { b = a; a = 0.0; }
  if (x<a) { return a; }
  if (x>b) { return b; }
  return x;
}

//---

let g_mem_hurwitz = {};

function hurwitz_zeta(s,q,M) {
  M = ((typeof M === "undefined") ? 1024 : M);
  let sum = 0;

  for (let k=0; k<M; k++) {
    sum += Math.pow( 1.0/(q+k), s);
  }

  return sum;
}

function normalized_area_i(c,N,i,M) {
  M = ((typeof M === "undefined") ? 1024 : M);

  let key = c + ":" + N;
  if (!(key in g_mem_hurwitz)) {
    g_mem_hurwitz[key] = hurwitz_zeta(c,N,M);
  }
  let val = g_mem_hurwitz[key];

  return 1.0/(val * Math.pow(N+i, c));
}

//--

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

function _gdim(ds) {
  let _ee = 0.5;

  //let _irs = 8;

  let _irs = Math.floor(20.0 - fxrand()*10);

  let _lw = ds/2 - _ee - _irs/2;
  let _ors = ds - _lw - _ee;;

  return {"i":_irs, "l":_lw, "o":_ors, "e":_ee};
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

function square_grid_old(ctx, x, y, n, tot_width, small_square_width, color) {

  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  let _inset_width = tot_width - small_square_width;
  let _sw = small_square_width;

  let _ds = _inset_width / (n-1);

  for (let _dx=0; _dx<tot_width; _dx += _ds) {
    for (let _dy=0; _dy<tot_width; _dy += _ds) {
      let _x = x + _dx,
          _y = y + _dy;
      ctx.moveTo( _x, _y );
      ctx.lineTo( _x + _sw, _y );
      ctx.lineTo( _x + _sw, _y + _sw );
      ctx.lineTo( _x , _y + _sw );
      ctx.lineTo( _x , _y );
    }
  }

  ctx.fill();
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

    /*
    let _x = -band_x/2,
        _y = -r,
        _w = band_x,
        _h = 2*r;
    band_pgn.push( [
      {"X": _x      , "Y": _y},
      {"X": _x + _w , "Y": _y},
      {"X": _x + _w , "Y": _y + _h},
      {"X": _x      , "Y": _y + _h},
    ]);
    */
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


    /*
    let _x = -r,
        _y = -band_y/2,
        _w = 2*r,
        _h = band_y;
    band_pgn.push( [
      {"X": _x      , "Y": _y},
      {"X": _x + _w , "Y": _y},
      {"X": _x + _w , "Y": _y + _h},
      {"X": _x      , "Y": _y + _h},
    ]);
    */
  }

  let rop = [];
  _clip_difference(rop, circle_pgn, band_pgn);

  //polygon_with_holes(ctx, x, y, rop, color);
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


function test_clipper(ctx) {

  let color = "rgba(255,255,255,0.5)";
  let rop = {};

  rop = [];
  _clip_union( rop, [ example_paths0[0], example_paths0[1], example_paths1[0], example_paths1[1] ] );
  polygon_with_holes(ctx, 200, 200, rop, color);

  rop = [];
  _clip_intersect( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 350, 200, rop, color);

  rop = [];
  _clip_difference( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 200, 350, rop, color);

  rop = [];
  _clip_xor( rop, example_paths0, example_paths1 );
  polygon_with_holes(ctx, 350, 350, rop, color);

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
    //stripe_45_square(ctx, x+v, y+v, w-2*v, 0, w/10, w/5, c);
    stripe_45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c);
  }

  else if (fname == "stripe_m45_square") {
    //                    x  y  w  p   e   f    c
    stripe_m45_square(ctx, x+v, y+v, w-2*v, phase, w/10, w/5, c);
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

function disp_r(ctx, x, y, w, sub_n, recur_level, max_recur) {
  max_recur = ((typeof max_recur === "undefined") ? 6 : max_recur);

  if (recur_level >= max_recur) { return; }

  let mx = x + w/sub_n;
  let my = y + w/sub_n;
  let subw = w/sub_n;

  let p = fxrand();

  let do_recur = false;

  // both high and recur...
  //
  if (p < (1.0/32.0)) {
    do_recur = true;
  }

  else if (p < 0.55) {
    do_recur = true;
  }

  else if (p < 0.75) {
    let _f = g_info.f_list[ Math.floor(g_info.f_list.length * fxrand()) ],
        _c = "rgba(255,255,255," + (1.0 - fxrand()*0.125) + ")";

    let _freq = 1.0 - fxrand()*0.5;
    let _init_phase =  fxrand();

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

    g_info.f_hist.push(_func);

  }

  else {
    let _f = g_info.f_list[ Math.floor(g_info.f_list.length * fxrand()) ],
        _c = "rgba(255,255,255," + (0.6 - fxrand()*0.25) + ")";

    let _freq = 1.0 - fxrand()*0.5;
    let _init_phase =  fxrand();

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

    g_info.f_hist.push(_func);

    do_recur = true;
  }

  if (do_recur) {

    let sub_choice = [2,3];
    let nxt_sub_n = sub_choice[ Math.floor(fxrand()*sub_choice.length) ];

    for (let i=0; i<sub_n; i++) {
      for (let j=0; j<sub_n; j++) {
        let _x = x + i*subw;
        let _y = y + j*subw;
        disp_r(ctx, _x, _y, subw, nxt_sub_n, recur_level+1+(sub_n-2), max_recur);
      }
    }

  }

}

function custom0(s,p) {
  let a = eye_anim_2(s,p);
  let b = eye_anim_2(s,p);

  let pgn = [];
  for (let i=0; i<a.length; i++) {
    pgn.push(a[i]);
  }
  for (let i=0; i<b.length; i++) {
    pgn.push(b[i]);
  }

  return pgn;
}

// (x,y)    - translation
// s        - scale (scale before translation)
//
function polygon_eye_outline(x,y, s, theta) {
  x = ((typeof x === "undefined") ? 0.0 : x);
  y = ((typeof y === "undefined") ? 0.0 : y);
  s = ((typeof s === "undefined") ? 1.0 : s);
  theta = ((typeof theta === "undefined") ? 0.0 : theta);
  let pgn_o = eye_anim_0(s,true);
  let pgn_i = eye_anim_0(s*0.925, true);

  let fin_pgn = [];

  for (let i=0; i<pgn_o.length; i++) {
    for (let j=0; j<pgn_o[i].length; j++) {
      pgn_o[i][j].X += x;
      pgn_o[i][j].Y += y;
    }
    fin_pgn.push(pgn_o[i]);
  }

  for (let i=0; i<pgn_i.length; i++) {
    for (let j=0; j<pgn_i[i].length; j++) {
      pgn_i[i][j].X += x;
      pgn_i[i][j].Y += y;
    }
    pgn_i[i].reverse();
    fin_pgn.push(pgn_i[i]);
  }

  return fin_pgn;
}

function polygon_eye_outline_(x,y, s, theta) {
  x = ((typeof x === "undefined") ? 0.0 : x);
  y = ((typeof y === "undefined") ? 0.0 : y);
  s = ((typeof s === "undefined") ? 1.0 : s);
  theta = ((typeof theta === "undefined") ? 0.0 : theta);
  let pgn_o = eye_anim_0(s,true);
  let pgn_i = eye_anim_0(s*0.925, true);

  let fin_pgn = [];

  for (let i=0; i<pgn_o.length; i++) {
    for (let j=0; j<pgn_o[i].length; j++) {
      pgn_o[i][j].X += x;
      pgn_o[i][j].Y += y;
    }
    pgn_o[i].reverse();
    fin_pgn.push(pgn_o[i]);
  }

  for (let i=0; i<pgn_i.length; i++) {
    for (let j=0; j<pgn_i[i].length; j++) {
      pgn_i[i][j].X += x;
      pgn_i[i][j].Y += y;
    }
    //pgn_i[i].reverse();
    fin_pgn.push(pgn_i[i]);
  }

  return fin_pgn;
}

function __polygon_eye(_opt) {
  //scale = ((typeof scale === "undeifned") ? 100 : scale);
  //x = ((typeof x === "undeifned") ? 0 : x);
  //y = ((typeof y === "undeifned") ? 0 : y);
  let opt = { "s":100, "x":0, "y":0, "w":4.15, "w1":4.15*0.5, "h":3, "h1":3*.8, "F":0.9};
  for (let key in opt) {
    if (key in _opt) { opt[key] = _opt[key]; }
  }


  let perim = [];
  let hole = [];

  //let _w = 4.15;
  //let _h = 3;

  //let _w1 = _w*.5;
  //let _h1 = _h*.8;

  //let _scale = 100;
  //let F = 0.9;

  let x = opt.x;
  let y = opt.y;

  let _w = opt.w;
  let _w1 = opt.w1;

  let _h = opt.h;
  let _h1 = opt.h1;

  let F = opt.F;
  let scale = opt.s;


  perim.push( {"X":  _w/2, "Y":    0/2 } );
  perim.push( {"X": _w1/2, "Y":  _h1/2 } );
  perim.push( {"X":   0/2, "Y":   _h/2 } );
  perim.push( {"X":-_w1/2, "Y":  _h1/2 } );
  perim.push( {"X": -_w/2, "Y":    0/2 } );
  perim.push( {"X":-_w1/2, "Y": -_h1/2 } );
  perim.push( {"X":   0/2, "Y":  -_h/2 } );
  perim.push( {"X": _w1/2, "Y": -_h1/2 } );

  let n = perim.length;
  for (let i=0; i<n; i++) {
    hole.push( { "X": perim[n-i-1].X*F, "Y": perim[n-i-1].Y*F } );
  }

  for (let i=0; i<perim.length; i++) {
    perim[i].X = (scale*perim[i].X) + x;
    perim[i].Y = (scale*perim[i].Y) + y;

    hole[i].X = (scale*hole[i].X) + x;
    hole[i].Y = (scale*hole[i].Y) + y;
  }

  return [ perim, hole ];

}

//---

function eye_anim_0(s, _hide_pupil, theta) {
  s = ((typeof s === "undefined") ? 1.0 : s);
  _hide_pupil = ((typeof _hide_pupil === "undefined") ? false : _hide_pupil);
  theta = ((typeof theta === "undefined") ? 0.0 : theta);

  let pgn = [];

  let da = Math.PI*Math.sqrt(2)/4.0;
  let r = 0.5;
  let n = 16;

  let cx = 0;

  let sa = -(Math.PI/2.0 - da);
  let ea = -(Math.PI/2.0 + da);

  let scale = 200*s;

  cy = r*Math.cos(da);

  for (let i=0; i<(n-1); i++) {
    let p = (i/(n-1));
    let _a = (1.0 - p)*sa + p*ea;

    _a = (ea-sa)*p + sa;

    let _x = r*Math.cos(_a);
    let _y = cy + r*Math.sin(_a);

    pgn.push( {"X": _x, "Y":_y } );
  }

  for (let i=0; i<n; i++) { pgn.push( {"X": -pgn[i].X, "Y": -pgn[i].Y }); }

  for (let i=0; i<pgn.length; i++) {
    pgn[i].X *= scale;
    pgn[i].Y *= scale;
  }

  let fin_pgn = [ pgn ];

  if (!_hide_pupil) {
    let m = 32;
    let r1 = 0.475;
    let pgn1 = [];
    for (let i=0; i<m; i++) {
      let a = (i/m)*Math.PI*2;
      let _x = scale*r1*Math.cos(a);
      let _y = scale*r1*Math.sin(a);
      pgn1.push({"X":r1*_x, "Y":r1*_y});
    }

    let r2 = 0.32;
    let pgn2 = [];
    for (let i=0; i<m; i++) {
      let a = (i/m)*Math.PI*2;
      let _x = scale*r2*Math.cos(a);
      let _y = scale*r2*Math.sin(a);
      pgn2.push({"X":r2*_x, "Y":r2*_y});
    }

    fin_pgn.push(pgn1);
    fin_pgn.push(pgn2);
  }

  return fin_pgn;
  //return [pgn, pgn1, pgn2];
}

function eye_anim_2(s, _hide_pupil, theta) {
  s = ((typeof s === "undefined") ? 1.0 : s);
  _hide_pupil = ((typeof _hide_pupil === "undefined") ? false : _hide_pupil);
  theta = ((typeof theta === "undefined") ? 0.0 : theta);

  let pgn = [];

  let da = Math.PI*Math.sqrt(2)/4.0;
  let r = 0.5;
  let n = 16;

  let cx = 0;

  let sa = -(Math.PI/2.0 - da);
  let ea = -(Math.PI/2.0 + da);

  let scale = s*200;

  cy = r*Math.cos(da);

  for (let i=0; i<(n-1); i++) {
    let p = (i/(n-1));
    let _a = (1.0 - p)*sa + p*ea;

    _a = (ea-sa)*p + sa;

    let _x = r*Math.cos(_a);
    let _y = cy + r*Math.sin(_a);

    pgn.push( {"X": _x, "Y":_y } );
  }

  for (let i=0; i<n; i++) { pgn.push( {"X": -pgn[i].X, "Y": -pgn[i].Y }); }

  for (let i=0; i<pgn.length; i++) {
    pgn[i].X *= scale;
    pgn[i].Y *= scale;
  }

  return [pgn];
}

//---

function eye_anim_1(s, _hide_pupil, theta) {
  s = ((typeof s === "undefined") ? 1.0 : s);
  _hide_pupil = ((typeof _hide_pupil === "undefined") ? false : _hide_pupil);
  theta = ((typeof theta === "undefined") ? 0.0 : theta);

  let pgn = [];

  let da = Math.PI*Math.sqrt(2)/4.0;
  let r = 0.5;
  let n = 16;

  let cx = 0;

  let sa = -(Math.PI/2.0 - da);
  let ea = -(Math.PI/2.0 + da);

  let scale = s*200;

  cy = r*Math.cos(da);

  for (let i=0; i<(n-1); i++) {
    let p = (i/(n-1));
    let _a = (1.0 - p)*sa + p*ea;

    _a = (ea-sa)*p + sa;

    let _x = r*Math.cos(_a);
    let _y = cy + r*Math.sin(_a);

    pgn.push( {"X": _x, "Y":_y } );
  }
  for (let i=0; i<n; i++) {
    pgn.push( {"X": -pgn[i].X, "Y": -pgn[i].Y });
  }

  //---

  let eyelid_pgn = [];
  let el_da = .25*Math.PI*Math.sqrt(2)/4.0;
  let el_r = Math.sin(da)*r/Math.sin(el_da);

  let el_sa = -(Math.PI/2.0 + el_da);
  let el_ea = -(Math.PI/2.0 - el_da);

  let el_cy = el_r*Math.cos(el_da);

  for (let i=0; i<(n-1); i++) {
    let p = (i/(n-1));
    let _a = (1.0 - p)*sa + p*ea;

    _a = (ea-sa)*p + sa;

    let _x = r*Math.cos(_a);
    let _y = cy + r*Math.sin(_a);

    eyelid_pgn.push( {"X": scale*_x, "Y":scale*_y } );
  }

  for (let i=0; i<(n-1); i++) {
    let p = (i/(n-1));
    _el_a = (el_ea-el_sa)*p + el_sa;

    let _x = el_r*Math.cos(_el_a);
    let _y = el_cy + el_r*Math.sin(_el_a);

    eyelid_pgn.push( {"X": scale*_x, "Y":scale*_y } );
  }

  //---

  for (let i=0; i<pgn.length; i++) {
    pgn[i].X *= scale;
    pgn[i].Y *= scale;
  }

  let fin_pgn = [ pgn, eyelid_pgn ];


  if (!_hide_pupil) {
    let m = 32;
    let r1 = 0.475;
    let pgn1 = [];
    for (let i=0; i<m; i++) {
      let a = (i/m)*Math.PI*2;
      let _x = scale*r1*Math.cos(a);
      let _y = scale*r1*Math.sin(a);
      pgn1.push({"X":r1*_x, "Y":r1*_y});
    }

    let r2 = 0.32;
    let pgn2 = [];
    for (let i=0; i<m; i++) {
      let a = (i/m)*Math.PI*2;
      let _x = scale*r2*Math.cos(a);
      let _y = scale*r2*Math.sin(a);
      pgn2.push({"X":r2*_x, "Y":r2*_y});
    }

    fin_pgn.push(pgn1);
    fin_pgn.push(pgn2);
  }

  return fin_pgn;
  //return [pgn, eyelid_pgn, pgn1, pgn2];
}

//----
//----
//----

function eye_anim(ctx, x, y, s, _hide_pupil, phase_t) {
  x = ((typeof x === "undefined") ? 0.0 : x);
  y = ((typeof y === "undefined") ? 0.0 : y);
  s = ((typeof s === "undefined") ? 1.0 : s);
  phase_t = ((typeof phase_t === "undefined") ? 0 : phase_t);
  _hide_pupl = ((typeof _hide_pupil === "undefined") ? false : _hide_pupil);

  let _hp = _hide_pupil;

  let c0 = "rgba(255,255,255,0.5)";
  let c1 = "rgba(255,255,255,0.5)";
  let c2 = "rgba(255,255,255,0.5)";

  let _dur = [ 5, 9, 5 ];

  let _anim_sched = [
    {"s":0, "dur":30, "c":c0, "f": (function(_s,_p) { return function() { return eye_anim_0(_s,_p); }; })(s,_hp)  },

    {"s":-1, "dur": _dur[0], "c":c1, "f": (function(_s,_p) { return function() { return eye_anim_1(_s,_p); }; })(s,_hp)  },
    {"s":-1, "dur": _dur[1], "c":c2, "f": (function(_s,_p) { return function() { return custom0(_s,_p); }; })(s,_hp)  },
    {"s":-1, "dur": _dur[2], "c":c1, "f": (function(_s,_p) { return function() { return eye_anim_1(_s,_p); }; })(s,_hp)  },

    {"s":-1, "dur":600, "c": c0, "f": (function(_s,_p) { return function() { return eye_anim_0(_s,_p); }; })(s,_hp)  }
  ];
  let t0 = _anim_sched[0].s;
  let d = _anim_sched[0].dur;
  t0 += d;
  for (let i=1; i<_anim_sched.length; i++) {
    _anim_sched[i].s = t0;
    d = _anim_sched[i].dur;
    t0 += d;
  }
  let tot = t0;

  let color = "rgba(255,255,255,0.5)";

  let _t = ((g_info.tick + phase_t) % tot);
  //console.log(tot);

  for (let i=0; i<_anim_sched.length; i++) {
    if ( (_anim_sched[i].s <= _t) && ( _t < (_anim_sched[i].s+_anim_sched[i].dur)) ) {
      let _e = _anim_sched[i].f();
      for (let i=0; i<_e.length; i++) {
        polygons(ctx, x, y, [_e[i]], _anim_sched[i].c);
      }
    }
  }


}

function anim() {

  let _color = "rgba(255,255,255, 0.5)";

  let ctx = g_info.ctx;
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  ctx.clearRect(0, 0, _cw, _ch);
  ctx.fillStyle = g_info.bg_color;
  ctx.rect(0,0, _cw, _ch);
  ctx.fill();

  //DEBUG
  //floop(ctx, _cw, _ch);
  //g_info.tick++;
  //window.requestAnimationFrame(anim);
  //return;
  //debug


  for (let i=0; i<g_info.hist.length; i++) {
    let _x = g_info.hist[i].x;
    let _y = g_info.hist[i].y;
    let _s = g_info.hist[i].s;
    let _p = g_info.hist[i].p;
    let _hp = g_info.hist[i].hp;
    eye_anim(ctx, _x, _y, _s, _hp, _p);
  }

  /*

  eye_anim(ctx, 350, 100, 2.0, true);
  eye_anim(ctx, 300, 100, 0.5, true);
  eye_anim(ctx, 300, 100, 0.25);

  eye_anim(ctx, 350, 150, 0.5, true);
  eye_anim(ctx, 350, 150, 0.25);

  eye_anim(ctx, 400, 100, 0.5, true);
  eye_anim(ctx, 400, 100, 0.25);

  eye_anim(ctx, 350, 400, 0.5, true);
  eye_anim(ctx, 500, 300, 0.75);

  eye_anim(ctx, 300, 300, 1.0, false);
  eye_anim(ctx, 300, 300, 0.925, true);


  let pgn = polygon_eye_outline(800, 200, 1.5);
  if (first) {
    console.log(pgn);
    first = false;
    let z = polygon_eye_outline();
    console.log(z);
  }
  polygon_with_holes(ctx, 0, 0, pgn, _color);
  */


  g_info.tick++;
  window.requestAnimationFrame(anim);

}

var first = true;

//----
//----
//----

function get_bbox(pgns) {
  let bbox = [[0,0],[0,0]];
  for (i=0; i<pgns.length; i++) {
    for (j=0; j<pgns[i].length; j++) {
      if ((i==0) && (j==0)) {
        bbox[0][0] = pgns[0][0].X;
        bbox[1][0] = pgns[0][0].X;
        bbox[0][1] = pgns[0][0].Y;
        bbox[1][1] = pgns[0][0].Y;
      }

      if (pgns[i][j].X < bbox[0][0]) { bbox[0][0] = pgns[i][j].X; }
      if (pgns[i][j].Y < bbox[0][1]) { bbox[0][1] = pgns[i][j].Y; }
      if (pgns[i][j].X > bbox[1][0]) { bbox[1][0] = pgns[i][j].X; }
      if (pgns[i][j].Y > bbox[1][1]) { bbox[1][1] = pgns[i][j].Y; }
    }
  }

  return bbox;
}

function floop(ctx, w, h) {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0,0,w,h);


  let w2 = Math.floor(w/2);
  let h2 = Math.floor(h/2);

  let r = _max(h2,w2);
  r *= Math.sqrt(2);
  r = Math.floor(r);

  let _t = g_info.tick / 60;

  let color = "rgba(0,0,0,0.05125)";
  noise_donut(ctx, 300, 300, 100, 100, 40, 1000, _t);
  //disc_noise(ctx, 300, 300, 300, color, 0.5, 50000);
  //noise_donut(ctx, 300, 300, 100, 100, 1, 1000);

  return;
  //let color = "rgba(0,0,0,0.05125)";
  console.log("...");
  hatch_noise(ctx, w, h, 30, 30, 100000);
  return;

  cloud_vortex(ctx, w, h);
  disc_noise(ctx, w2, h2, r, color, 0.35, 1000000);
  return;


  // clip disc example
  //
  ctx.save();
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
  ctx.clip();
  disc_noise(ctx, 130,110, 120, color, 2.0, 150000);
  disc_noise(ctx, 100,120, 120, color, 2.0, 150000);
  ctx.restore();

  //ctx.save();
  //ctx.


  return;

  ctx.save();
  shaded_clip(ctx, w, h);
  radial_lines_even_spaced(ctx, w, h);
  ctx.restore();

  ctx.fillStyle = '#f00';
  ctx.fillRect(300,300,10,10);
  return;


  //disk_test(ctx, w, h);
  //disk_test(ctx, w, h);
  //disk_test(ctx, w, h);
  //disk_test(ctx, w, h);

  //radial_lines(ctx, w, h);

  return;

  shaded_clip(ctx, w, h);
  radial_lines_even_spaced(ctx, w, h);
  ctx.restore();

}

function noise_donut(ctx, cx, cy, rw, rh, M, N, _t) {

  //let _t = 0.3;
  let _f = 4;
  let _f_offset = 0.25;
  let _f_noise = 30.0;

  let _n_x = 0.0;
  let _n_y = _t/1.0;


  //ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.strokeStyle = "rgba(0,0,0,0.2)";

  let _min_r = 100;

  for (let idx=0; idx<M; idx++) {
    let r = 350*(idx/M) + _min_r;
    let _prv_x = 0, _prv_y = 0;

    for (let i=0; i<=N; i++) {

      let _a = Math.PI*2*i/N;

      //let _fac = _f*(idx/M) + _f_offset;
      //let _fac = _f*(1-(idx/M)) + _f_offset;
      let _fac = 4*_f*(idx/M)*(1-(idx/M)) + _f_offset;

      let _Mr = _f_noise*noise.perlin3( _n_x + Math.cos(_a)*_fac, _n_y + Math.sin(_a)*_fac, _t ) + r;
      _Mr /= 2;
      _Mr += 0.5;

      let _x = cx + Math.cos(_a)*_Mr;
      let _y = cy + Math.sin(_a)*_Mr;

      if (i==0) {
        _prv_x = _x;
        _prv_y = _y;
        ctx.beginPath();
        ctx.moveTo(_prv_x, _prv_y);
        continue;
      }

      //ctx.fillRect(_x, _y, 1,1);
      ctx.lineTo(_x,_y);

      _prv_x = _x;
      _prv_y = _y;

    }
    ctx.stroke();
  }

}

function hatch_noise(ctx, w, h, dx, dy, N) {
  let c = 'rgba(0,0,0,0.2)';
  //let c = 'rgba(255,255,255,0.2)';

  let ix = Math.floor((w + dx - 1) / dx);
  let iy = Math.floor((h + dy - 1) / dy);

  let s = 1.5;

  let n_w = dx/4;
  let n_h = dy/4;

  let px, py;

  ctx.fillStyle = c;
  for (let i=0; i<N; i++) {

    if ((i%2)==0) {
      //px = Math.floor(_rnd(-n_w/2,n_w/2) + _irnd(ix)*dx);
      px = Math.floor(_irnd(ix)*dx + gaussian(0,dx/8));
      py = _irnd(h);
    }
    else {
      px = _irnd(w);
      //py = Math.floor(_rnd(-n_h/2,n_h/2) + _irnd(iy)*dy);
      py = Math.floor(_irnd(iy)*dy + gaussian(0,dy/8));
    }

    ctx.fillRect(px,py,s,s);
  }
}

function cloud_vortex(ctx, w, h) {
  //let step = Math.floor(w/M);

  let sz = _min(w,h);

  let N_outer = 128;
  let r_outer = 2*Math.sqrt(2)*Math.PI*2*sz/(2*N_outer);

  let step_n = 10;

  let step_size = w/step_n;

  let cx = w/2;
  let cy = h/2;

  console.log("N_outer:", N_outer, "step_size:", step_size, "step_n:", step_n, "r_outer:", r_outer);

  for (let s_idx=0; s_idx<step_n; s_idx++) {

    let c = _clamp(_irnd(10) + Math.floor((s_idx/step_n) * 255), 0, 255);

    let _cur_r = (s_idx/step_n)*w/2;
    let _cur_circ = Math.PI*2*_cur_r;

    let N = N_outer;

    ctx.fillStyle = "rgba(" + c +"," + c + "," + c + ",0.9)";
    for (let i=0; i<N; i++) {
      let R = _cur_r + fxrand()*step_size/4;
      //let r = fxrand()*step*15;
      //let r = fxrand()*step_size;
      //let r = _rnd(0.9,1.1)*step_size;
      let r = _rnd(0.75,2.2)*r_outer;

      let a = (i/N)*Math.PI*2 + fxrand() + fxrand()*30;

      let x = cx + R*Math.cos(a);
      let y = cy + R*Math.sin(a);

      ctx.beginPath();
      ctx.arc(x,y, r, 0, 2*Math.PI);
      ctx.fill();

    }
  }
}

function disc_noise(ctx, x, y, R, c, gamma, N) {
  x = ((typeof x === "undefined") ? 0 : x);
  y = ((typeof y === "undefined") ? 0 : y);
  R = ((typeof R === "undefined") ? 100 : R);
  c = ((typeof c === "undefined") ? "rgba(0,0,0,0.125)" : c);
  gamma = ((typeof gamma === "undefined") ? 0.5 : gamma);
  N = ((typeof N === "undefined") ? 0.5 : N);

  ctx.fillStyle = c;
  let s = 1;
  for (let i=0; i<N; i++) {
    //let r = fxrand()*Math.pow(R, 1/gamma);
    let r = Math.pow(fxrand(), gamma)*R;
    let a = fxrand()*2.0*Math.PI;
    //let px = Math.floor(x + Math.pow(r, gamma)*Math.cos(a));
    //let py = Math.floor(y + Math.pow(r, gamma)*Math.sin(a));

    let px = Math.floor(x + r*Math.cos(a));
    let py = Math.floor(y + r*Math.sin(a));

    ctx.fillRect(px,py,s,s);
  }

}

function drawStar(ctx, r) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(r, 0);
  for (var i = 0; i < 9; i++) {
    ctx.rotate(Math.PI / 5);
    if (i % 2 === 0) {
      ctx.lineTo((r / 0.525731) * 0.200811, 0);
    } else {
      ctx.lineTo(r, 0);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function shaded_clip(ctx, w, h) {

  /*
  ctx.fillStyle = '#ddd';
  ctx.fillRect(0, 0, 150, 150);
  ctx.translate(75, 75);
  */

  // Create a circular clipping path
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
  ctx.clip();

  return;

  // draw background
  var lingrad = ctx.createLinearGradient(0, -75, 0, 75);
  lingrad.addColorStop(0, '#232256');
  lingrad.addColorStop(1, '#143778');

  ctx.fillStyle = lingrad;
  ctx.fillRect(-75, -75, 150, 150);


  // draw stars
  for (var j = 1; j < 50; j++) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.translate(75 - Math.floor(Math.random() * 150),
                  75 - Math.floor(Math.random() * 150));
    drawStar(ctx, Math.floor(Math.random() * 4) + 2);
    ctx.restore();
  }

}

function radial_lines_even_spaced(ctx, w, h) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.strokeStyle = "rgba(0,0,0,0.125)";

  let gamma = 0.5;

  let c0 = 300;
  let c1 = 300;
  let R = 300;
  let N = 10000;
  for (let i=0; i<N; i++) {
    let r = fxrand()*Math.pow(R, 1/gamma);
    let a = (3.0/N)*fxrand() + ((i/N)*2.0*Math.PI);
    let x = Math.pow(r, gamma)*Math.cos(a) + R;
    let y = Math.pow(r, gamma)*Math.sin(a) + R;

    let px = Math.floor(x);
    let py = Math.floor(y);

    let px1 = Math.floor(R*Math.cos(a) + R);
    let py1 = Math.floor(R*Math.sin(a) + R);

    ctx.beginPath();
    ctx.moveTo(px,py);
    ctx.lineTo(px1,py1);
    ctx.stroke();
  }

}

function radial_lines(ctx, w, h) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.strokeStyle = "rgba(0,0,0,0.125)";

  let gamma = 0.5;

  let c0 = 300;
  let c1 = 300;
  let R = 300;
  let N = 10000;
  for (let i=0; i<N; i++) {
    let r = fxrand()*Math.pow(R, 1/gamma);
    let a = fxrand()*2.0*Math.PI;
    let x = Math.pow(r, gamma)*Math.cos(a) + R;
    let y = Math.pow(r, gamma)*Math.sin(a) + R;

    let px = Math.floor(x);
    let py = Math.floor(y);

    let px1 = Math.floor(R*Math.cos(a) + R);
    let py1 = Math.floor(R*Math.sin(a) + R);

    ctx.beginPath();
    ctx.moveTo(px,py);
    ctx.lineTo(px1,py1);
    ctx.stroke();

  }
}

function disk_test(ctx, w, h) {

  ctx.fillStyle = "rgba(0,0,0,0.25)";

  let s =1.05;

  let gamma = 1.0;
  //let gamma = 0.5;

  let R = 300;
  let N = 100000;
  for (let i=0; i<N; i++) {
    let r = fxrand()*Math.pow(R, 1/gamma);
    let a = fxrand()*2.0*Math.PI;
    let x = Math.pow(r, gamma)*Math.cos(a) + R;
    let y = Math.pow(r, gamma)*Math.sin(a) + R;

    let px = Math.floor(x);
    let py = Math.floor(y);

    ctx.fillRect(x,y,s,s);

  }

}

// https://javascript.tutorialink.com/how-can-i-stop-the-alpha-premultiplication-with-canvas-imagedata/
//
function disk_test_canvas(ctx, w, h) {

  console.log("??");

  let ok = ctx.getImageData(0,0,w,h);

  // uniform
  //let gamma = 0.5;

  // uniform
  let gamma = 1.0;



  let R = 300;
  let N = 100000;
  for (let i=0; i<N; i++) {
    let r = fxrand()*Math.pow(R, 1/gamma);
    let a = fxrand()*2.0*Math.PI;
    let x = Math.pow(r, gamma)*Math.cos(a) + R;
    let y = Math.pow(r, gamma)*Math.sin(a) + R;

    let px = Math.floor(x);
    let py = Math.floor(y);

    let idx = (px + py*w)*4;

    ok.data[idx + 0] = 30;
    ok.data[idx + 1] = 30;
    ok.data[idx + 2] = 30;
    ok.data[idx + 3] = 32;

    /*

    for (let dx=-3; dx<=3; dx++) {
      for (let dy=-3; dy<=3; dy++) {
        let px = _clamp(Math.floor(x+dx), 0, w);
        let py = _clamp(Math.floor(y+dy), 0, h);

        let idx = (px + py*w)*4;

        ok.data[idx + 0] = 255;
        ok.data[idx + 1] = 0;
        ok.data[idx + 2] = 0;
        ok.data[idx + 3] = 10;
      }
    }
    */

  }

  ctx.putImageData(ok, 0, 0);

}

(()=>{

  console.log("fxhash:",fxhash);

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


  //DEBUG
  //DEBUG
  //DEBUG
  //window.requestAnimationFrame(anim);
  //return;

  //floop(ctx, g_info.width, g_info.height);
  //return;
  //DEBUG
  //DEBUG
  //DEBUG

  //DEBUG
  //DEBUG
  //test_clipper(ctx);
  //return;
  //DEBUG
  //DEBUG

  let _s = g_info.geom_initial_size_factor;

  //let _param_c = 1.2;
  let _param_c = 1.1;
  //let _param_N = 3;
  let _param_N = 7;

  let _retry = 1024;

  let _object_area = 0;
  let _base_pgn = polygon_eye_outline();
  let _bbox = [[0,0],[0,0]];
  for (let i=0; i<_base_pgn.length; i++) {
    for (let j=0; j<_base_pgn[i].length; j++) {
      if ((i==0) && (j==0)) {
        _bbox[0][0] = _base_pgn[i][j].X;
        _bbox[1][0] = _base_pgn[i][j].X;
        _bbox[0][1] = _base_pgn[i][j].Y;
        _bbox[1][1] = _base_pgn[i][j].Y;
      }

      if (_bbox[0][0] > _base_pgn[i][j].X) { _bbox[0][0] = _base_pgn[i][j].X; }
      if (_bbox[1][0] < _base_pgn[i][j].X) { _bbox[1][0] = _base_pgn[i][j].X; }

      if (_bbox[0][1] > _base_pgn[i][j].Y) { _bbox[0][1] = _base_pgn[i][j].Y; }
      if (_bbox[1][1] < _base_pgn[i][j].Y) { _bbox[1][1] = _base_pgn[i][j].Y; }

    }

    // we can get away with calculating area like this because
    // we have some knowledge of the geometry.
    // That is, this is a hacky way to calculate area.
    // Basic trapezoid integration.
    // Also, still not exact, but we're going to pretend
    //
    if (i==0) {
      for (let j=1; j<_base_pgn[i].length; j++) {
        _object_area += Math.abs( (_base_pgn[i][j].X - _base_pgn[i][j-1].X)*(_base_pgn[i][j].Y + _base_pgn[i][j-1].Y)/2.0 );
      }
    }

  }

  console.log("...", _object_area);

  let _dim_x = _bbox[1][0] - _bbox[0][0];
  let _dim_y = _bbox[1][1] - _bbox[0][1];

  let _cur_dim_x = _dim_x;
  let _cur_dim_y = _dim_y;

  let _area = g_info.width * g_info.height;

  let _object_norm_area = _object_area / _area;

  console.log( _area, _object_norm_area, _param_c, _param_N);

  let disp_pgns = [];
  let clip_pgns = [];
  let _COLLISION_MAX = 10;


  console.log(">>> dim_x:", _dim_x, "dim_y:", _dim_y);
  console.log(">>> total area:", _area, "object_area:", _object_area, "(normed object area:", _object_norm_area, ")");

  let _N_OBJ = 128;
  for (let i=0; i<_N_OBJ; i++) {
    let _Ai = _area*normalized_area_i(_param_c, _param_N, i);

    //let _scale = _Ai / _object_norm_area;
    let _scale = _Ai / _object_area;

    _cur_dim_x = _scale * _dim_x;
    _cur_dim_y = _scale * _dim_y;

    //let _pilot_pgn = polygon_eye_outline(0,0,_scale);
    //let _bbox = get_bbox(_pilot_pgn);

    //let _okx = _bbox[1][0] - _bbox[0][0];
    //let _oky = _bbox[1][1] - _bbox[0][1];

    //console.log(">>", _cur_dim_x, _cur_dim_y, _okx, _oky);

    //console.log(i, ">>> scale:", _scale, "Ai:", _Ai, "object_norm_area:", _object_norm_area, "cu_dim_x:", _cur_dim_x, "cur_dim_y:", _cur_dim_y);

    let _rndx = 0; //fxrand()*(g_info.width  - 2*_cur_dim_x) + _cur_dim_x;
    let _rndy = 0; //fxrand()*(g_info.height - 2*_cur_dim_y) + _cur_dim_y;

    let _pgn = [];
    let _clip_pgn = [];

    let _has_collision = false;
    let _collision_test = 0;

    if (i==0) {
      _rndx = fxrand()*(g_info.width  - _cur_dim_x) + _cur_dim_x/2;
      _rndy = fxrand()*(g_info.height - _cur_dim_y) + _cur_dim_y/2;

      _pgn = polygon_eye_outline(_rndx, _rndy, _scale);
      _clip_pgn = polygon_eye_outline_(_rndx, _rndy, _scale);

      disp_pgns.push(_pgn);
      clip_pgns.push(_clip_pgn);

      //g_info.hist.push( { "x":_rndx, "y": _rndy, "s": _scale, "p": _irnd(32) });
      g_info.hist.push( { "x":_rndx, "y": _rndy, "s": _scale, "p": _min(32, i), "hp": true  });

      continue;
    }

    //console.log(_rndx, _rndy, g_info.width, g_info.height, (g_info.width  - _cur_dim_x) , _cur_dim_x/2, (g_info.height - _cur_dim_y) , _cur_dim_y/2 );

    for (_collision_test=0; _collision_test<_COLLISION_MAX; _collision_test++) {


      _rndx = fxrand()*(g_info.width  - _cur_dim_x) + _cur_dim_x/2;
      _rndy = fxrand()*(g_info.height - _cur_dim_y) + _cur_dim_y/2;

      _pgn = polygon_eye_outline(_rndx, _rndy, _scale);
      _clip_pgn = polygon_eye_outline_(_rndx, _rndy, _scale);

      //DEBUG
      //eye_anim(ctx, _rndx, _rndy, _scale, "rgba(255,255,255,0.001)" );
      //polygon_with_holes(ctx, 0, 0, _clip_pgn, "rgba(255,255,255,0.05");
      //polygons(ctx, 0, 0, _pgn, "rgba(255,255,255,0.5)");

      _has_collision = false;
      let j=0;
      for (j=0; j<disp_pgns.length; j++) {

        let _rop = [];
        _clip_intersect(_rop, _clip_pgn, clip_pgns[j]);

        if (_rop.length > 0) {
          //DEBUG
          //polygons(ctx, 0, 0, _rop, "rgba(0, 0, 255, 1.0)");

          _has_collision=true;
          break;
        }
      }

      if (_has_collision == false) { break; }
    }

    if (_collision_test == _COLLISION_MAX) {
      console.log("giving up, couldn't find free space:", i, _Ai, _cur_dim_x, _cur_dim_y);
      continue;
    }

    //console.log("FOUND:", _collision_test, _rndx, _rndy, _scale);

    //g_info.hist.push( { "x":_rndx, "y": _rndy, "s": _scale, "p": _irnd(32) });
    g_info.hist.push( { "x":_rndx, "y": _rndy, "s": _scale, "p": Math.floor(_min(32, _irnd(4) +  i/16)), "hp": ((i>64) ? true : false)  });

    disp_pgns.push(_pgn);
    clip_pgns.push(_clip_pgn);

  }


  window.requestAnimationFrame(anim);

})();
