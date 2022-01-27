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
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,
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
    "square_band"
  ],
  "f_hist":[]

};

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
    ctx.fill();
  }

}

/*
(ctx,info) {
  ctx.fillStyle = "rgb(200,0,0,0.5)";
  ctx.fill

}
*/

function _gdim(ds) {
  let _ee = 0.5;

  //let _irs = 8;

  let _irs = Math.floor(20.0 - fxrand()*10);

  let _lw = ds/2 - _ee - _irs/2;
  let _ors = ds - _lw - _ee;;

  return {"i":_irs, "l":_lw, "o":_ors, "e":_ee};
}

function stripe_45_square(ctx, x, y, width, phase, empty_width, stripe_width, color) {
  let p = [], q = [];

  let _s = empty_width + stripe_width;

  let z=phase;
  for ( ; z<width; z+=_s) {
    let _ze = z+stripe_width;
    if (_ze > width) { _ze = width; }
    p.push([z, _ze]);
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

function stripe_m45_square(ctx, x, y, width, phase, empty_width, stripe_width, color) {
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

function square_grid(ctx, x, y, n, tot_width, small_square_width, color) {

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
function hatching_grid(ctx, x, y, ndiag, tot_width, small_square_width, color) {
  let opgn = [ [ {"X":0,"Y":0}, {"X":tot_width,"Y":0}, {"X":tot_width,"Y":tot_width}, {"X":0,"Y":tot_width} ] ];
  let epgn = [];

  let _diag_len = tot_width / Math.sqrt(2.0);

  let _dr = small_square_width / Math.sqrt(2.0);

  let _cell_width_o = _diag_len / (ndiag-1.0);

  let _dx = _cell_width_o * Math.sqrt(2);
  let _dy = _cell_width_o * 3 / 2;

  // setup clipper polygons
  //
  let _by = -4;
  let m = ndiag+10;
  for (let i=0; i<m; i++) {
    let _bx = ( ((i%2)==0) ? 0 : -(_dx/2) );
    _bx -= 0;
    for (let j=0; j<m; j++) {
      let p = [];

      let _x = _bx + (j*_dx);
      let _y = _by + (i*_dy/2);

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

function circle_square(ctx, x, y, r, width, color) {
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  ctx.arc( x, y, r, 0, 2*Math.PI, false);

  let _x = x - r/2,
      _y = y - r/2;
  ctx.moveTo(_x,_y);
  ctx.lineTo(_x, _y + width);
  ctx.lineTo(_x + width, _y + width);
  ctx.lineTo(_x + width, _y);

  ctx.fill();
}

function circle_band(ctx, x, y, r, band_x, band_y, color) {
  let circle_pgn = [[]];
  let band_pgn = [];

  let _ds = 5;
  let _dn = Math.ceil(Math.PI*2*r/_ds);


  for (let i=0; i<_dn; i++) {
    let theta = Math.PI*2.0*i/_dn;
    circle_pgn[0].push({"X": Math.cos(theta)*r, "Y": Math.sin(theta)*r});
  }

  if (band_x > 0) {
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
  }

  if (band_y > 0) {
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

function disp(ctx, fname, x, y, w, c) {

  let v=1;

  if (fname == "stripe_45_square") {
    //                    x  y  w  p   e   f    c
    //stripe_45_square(ctx, x+v, y+v, w-2*v, 0, w/10, w/5, c);
    stripe_45_square(ctx, x+v, y+v, w-2*v, g_info.tick_val, w/10, w/5, c);
  }

  else if (fname == "stripe_m45_square") {
    //                    x  y  w  p   e   f    c
    stripe_m45_square(ctx, x+v, y+v, w-2*v, g_info.tick_val, w/10, w/5, c);
  }

  else if (fname == "square_grid") {
    //               x   y n  w   sw   c
    square_grid(ctx, x+v, y+v, 5, w-2*v, w/10, c);
  }

  else if (fname == "hatching_grid") {
    //                  x    y   n  w    ew   c
    hatching_grid(ctx, x+v, y+v, 4, w-2*v, w/6.25, c);
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
    circle_square(ctx, x+w/2, y+w/2, w/2 - v, w/2, c);
  }

  else if (fname == "circle_band") {
    circle_band(ctx, x+w/2, y+w/2, w/2 - v, w/3, 0, c);
  }

  else if (fname == "square_band") {
    square_band(ctx, x+v, y+v, w-2*v, w-2*v, w/3, 0, c);
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
    //disp(ctx, _f, x, y, w, _c);

    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c) {
      return function() {
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c);
      };
    })(ctx, _f, x, y, w, _c);

    g_info.f_hist.push(_func);

  }

  else {
    let _f = g_info.f_list[ Math.floor(g_info.f_list.length * fxrand()) ],
        _c = "rgba(255,255,255," + (0.6 - fxrand()*0.25) + ")";
    //disp(ctx, _f, x, y, w, _c);

    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c) {
      return function() {
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_c);
      };
    })(ctx, _f, x, y, w, _c);

    g_info.f_hist.push(_func);

    do_recur = true;
  }

  if (do_recur) {
    disp_r(ctx, x,   y, subw, sub_n, recur_level+1, max_recur);
    disp_r(ctx, mx,  y, subw, sub_n, recur_level+1, max_recur);
    disp_r(ctx, mx, my, subw, sub_n, recur_level+1, max_recur);
    disp_r(ctx, x,  my, subw, sub_n, recur_level+1, max_recur);
  }

}

function anim() {

  let color = "rgba(255,255,255,0.95)";

  let pos = [
    [100,100],
    [200,100],
    [300,100],

    [100,200],
    [200,200],
    [300,200],

    [100,300],
    [200,300],
    [300,300],

    [100,400],
    [200,400],
    [300,400] ];

  let ctx = g_info.ctx;
  ctx.clearRect(0, 0, 1000, 1000);

  for (let i=0; i<g_info.f_hist.length; i++) {
    g_info.f_hist[i]();
  }

  window.requestAnimationFrame(anim);

  g_info.tick += 1;
  g_info.tick_val = 32*Math.sin(Math.PI*2.0*g_info.tick/512);
  g_info.tick %= 512;

  // disable for now
  //
  g_info.tick_val = 0;
}

(()=>{

  console.log(">>>", fxhash);

  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  let dS = ((W<H) ? W : H);

  g_info.ctx = ctx;
  g_info.size = dS - 25;
  g_info.tick = 0;

  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      let _x = 10 + i*g_info.size/3;
      let _y = 10 + j*g_info.size/3;
      disp_r(ctx, _x, _y, g_info.size/3, 2, 1, 6);
    }
  }

  for (let i=0; i<g_info.f_hist.length; i++) {
    g_info.f_hist[i]();
  }

  //window.requestAnimationFrame(anim);

})();
