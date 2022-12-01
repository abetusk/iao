var numeric = require("./numeric.js");
//var _CSG = require("./csg.js");
//var CSG = _CSG.CSG;

var Delaunay = require("./delaunay.js");
var ClipperLib = require("./clipper.js");

var jeom_info = {
  "w": 1/4,
  "h": 1/7
};

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

// info.v   - vector
// info.a   - how much to rotate
// info.c   - center [0,0,0]
// info.n   - number of stacks (default 1)
// info.h   - height
// info.
//
function jeom_extrude(pgn, info) {
  info = ((typeof info === "undefined") ? {} : info);
  let n = ((typeof info.n === "undefined") ? 1 : info.n);
  let v = ((typeof info.v === "undefined") ? [0,0,1/n] : info.v);
  let a = ((typeof info.a === "undefined") ? 0 : info.a);
  let c = ((typeof info.c === "undefined") ? [0,0,0] : info.c);
  let h = ((typeof info.h === "undefined") ? 1.0 : info.h);
  let f_h = ((typeof info.f_h === "undefined") ? (function() { return 1.0; }) : info.f_h);
  let use_delaunay = ((typeof info.delaunay === "undefined") ? false : info.delaunay);

  let base_tri = [];
  let top_tri = [];

  let _z = -h/2;

  let trail_idx = 0;

  //let use_delaunay = false;

  if (use_delaunay) {

    let delaunay_tri = [];
    for (let ii=0; ii<pgn.length; ii++) {
      delaunay_tri.push([pgn[ii].X, pgn[ii].Y]);
    }
    let base_tri_idx = Delaunay.triangulate(delaunay_tri);


    for (let ii=0; ii<base_tri_idx.length; ii+=3) {
      let idx0 = base_tri_idx[ii+0];
      let idx1 = base_tri_idx[ii+1];
      let idx2 = base_tri_idx[ii+2];

      base_tri.push( delaunay_tri[idx0][0], delaunay_tri[idx0][1], _z);
      base_tri.push( delaunay_tri[idx1][0], delaunay_tri[idx1][1], _z);
      base_tri.push( delaunay_tri[idx2][0], delaunay_tri[idx2][1], _z);

      top_tri.push( delaunay_tri[idx0][0], delaunay_tri[idx0][1], -_z);
      top_tri.push( delaunay_tri[idx1][0], delaunay_tri[idx1][1], -_z);
      top_tri.push( delaunay_tri[idx2][0], delaunay_tri[idx2][1], -_z);
    }

  }
  else {

    for (let ii=0; ii<(pgn.length-trail_idx); ii++) {
      let idx0 = ii;
      let idx1 = (ii+1)%(pgn.length-trail_idx);
      base_tri.push( 0, 0, _z );
      base_tri.push( pgn[idx0].X, pgn[idx0].Y, _z);
      base_tri.push( pgn[idx1].X, pgn[idx1].Y, _z);

      top_tri.push( 0, 0, -_z );
      top_tri.push( pgn[idx0].X, pgn[idx0].Y, -_z);
      top_tri.push( pgn[idx1].X, pgn[idx1].Y, -_z);
    }
  }


  let tri = [];
  let p = [0,0, -0.5];
  for (let ii=0; ii<n; ii++) {
    let _z_nxt = ((ii+1)/n) - 0.5;
    let _z_prv = (ii/n) - 0.5;

    for (let idx=0; idx<(pgn.length-trail_idx); idx++) {
      let idx_prv = idx;
      let idx_nxt = (idx+1)%(pgn.length-trail_idx);
      tri.push(pgn[idx_prv].X,  pgn[idx_prv].Y, _z_nxt);
      tri.push(pgn[idx_nxt].X,  pgn[idx_nxt].Y, _z_prv);
      tri.push(pgn[idx_prv].X,  pgn[idx_prv].Y, _z_prv);

      tri.push(pgn[idx_prv].X,  pgn[idx_prv].Y, _z_nxt);
      tri.push(pgn[idx_nxt].X,  pgn[idx_nxt].Y, _z_nxt);
      tri.push(pgn[idx_nxt].X,  pgn[idx_nxt].Y, _z_prv);
    }

  }

  for (let idx=0; idx<base_tri.length; idx+=9) {
    tri.push(base_tri[idx+0], base_tri[idx+1], base_tri[idx+2]);
    tri.push(base_tri[idx+3], base_tri[idx+4], base_tri[idx+5]);
    tri.push(base_tri[idx+6], base_tri[idx+7], base_tri[idx+8]);
  }

  for (let idx=0; idx<base_tri.length; idx+=9) {
    tri.push(top_tri[idx+6], top_tri[idx+7], top_tri[idx+8]);
    tri.push(top_tri[idx+3], top_tri[idx+4], top_tri[idx+5]);
    tri.push(top_tri[idx+0], top_tri[idx+1], top_tri[idx+2]);
  }

  return tri;
}


function jeom_flatten() {
}

function _cross(a,b) {
  let ax = [
    [ 0, -a[2], a[1] ],
    [ a[2], 0, -a[0] ],
    [ -a[1], a[0], 0 ]
  ];

  return numeric.dot(ax,b);
}

// flat part on z,
// lies in x-y plane
//
function jeom_road(info) {
  info = ((typeof info === "undefined") ? jeom_info : info);
  let _w = info.w;
  let _h = info.h;

  let vert = [

    // front panel
    //
    -_w/2,  1/2, -_h/2,  _w/2,  1/2, -_h/2,   -_w/2, -1/2, -_h/2,
     _w/2,  1/2, -_h/2,  _w/2, -1/2, -_h/2,   -_w/2, -1/2, -_h/2,

    // back panel
    //
    -_w/2,  1/2, +_h/2, -_w/2, -1/2, +_h/2,   _w/2,  1/2, +_h/2,
     _w/2,  1/2, +_h/2, -_w/2, -1/2, +_h/2,   _w/2, -1/2, +_h/2,

    // left side stripe
    //
    -_w/2,  1/2, -_h/2,   -_w/2, -1/2, -_h/2,  -_w/2, -1/2, +_h/2,
    -_w/2,  1/2, -_h/2,   -_w/2, -1/2, +_h/2,  -_w/2,  1/2, +_h/2,


    // right side stripe
    //
     _w/2,  1/2, -_h/2,   _w/2, -1/2, +_h/2,  _w/2, -1/2, -_h/2,
     _w/2,  1/2, -_h/2,   _w/2,  1/2, +_h/2,  _w/2, -1/2, +_h/2,

    // back cap (optional)
    //
    -_w/2,  1/2, -_h/2,   -_w/2,  1/2, +_h/2,   _w/2,  1/2, -_h/2,
     _w/2,  1/2, -_h/2,   -_w/2,  1/2, +_h/2,   _w/2,  1/2, +_h/2,

    // front cap (optional)
    //
    -_w/2, -1/2, -_h/2,   _w/2, -1/2, +_h/2,    -_w/2, -1/2, +_h/2,
     _w/2, -1/2, -_h/2,   _w/2, -1/2, +_h/2,    -_w/2, -1/2, -_h/2

  ];

  return vert;
}

// flat part on z,
// lies in x-y plane
//
function jeom_bend() {
  info = ((typeof info === "undefined") ? jeom_info : info);
  let _w = info.w;
  let _h = info.h;

  let tri = [];

  tri.push( [ -_w/2, -1/2,    -_h/2 ] );
  tri.push( [  _w/2, -_w/2, -_h/2 ] );
  tri.push( [  _w/2, -1/2,    -_h/2 ] );
  fr.push(tri);


  tri = [];
  tri.push( [ -_w/2, -1/2,    -_h/2 ] );
  tri.push( [ -_w/2, -_w/2, -_h/2 ] );
  tri.push( [  _w/2, -_w/2, -_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_w/2, -_w/2, -_h/2 ] );
  tri.push( [  _w/2,  _w/2, -_h/2 ] );
  tri.push( [  _w/2, -_w/2, -_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_w/2, -_h/2 ] )
  tri.push( [  _w/2,  _w/2, -_h/2 ] )
  tri.push( [  1/2,     _w/2, -_h/2 ] )
  fr.push(tri);
  tri = [];
  tri.push( [  1/2,    -_w/2, -_h/2 ] )
  tri.push( [  _w/2, -_w/2, -_h/2 ] )
  tri.push( [  _w/2,  _w/2, -_h/2 ] )
  fr.push(tri);

  //--

  // bottom
  //

  // bottom square
  //
  tri = [];
  tri.push( [ -_w/2, -1/2,    +_h/2 ] );
  tri.push( [  _w/2, -1/2,    +_h/2 ] );
  tri.push( [  _w/2, -_w/2, +_h/2 ] );
  fr.push(tri);

  tri = [];
  tri.push( [ -_w/2, -1/2,    +_h/2 ] );
  tri.push( [  _w/2, -_w/2, +_h/2 ] );
  tri.push( [ -_w/2, -_w/2, +_h/2 ] );
  fr.push(tri);

  // connecting triangle
  //
  tri = [];
  tri.push( [ -_w/2, -_w/2, +_h/2 ] );
  tri.push( [  _w/2, -_w/2, +_h/2 ] );
  tri.push( [  _w/2,  _w/2, +_h/2 ] );
  fr.push(tri);

  // right square
  //
  tri = [];
  tri.push( [  1/2,    -_w/2, +_h/2 ] )
  tri.push( [  1/2,     _w/2, +_h/2 ] )
  tri.push( [  _w/2,  _w/2, +_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  1/2,    -_w/2, +_h/2 ] )
  tri.push( [  _w/2,  _w/2, +_h/2 ] )
  tri.push( [  _w/2, -_w/2, +_h/2 ] )
  fr.push(tri);

  //--

  // front edge
  //
  tri = [];
  tri.push( [ -_w/2, -1/2, -_h/2 ] )
  tri.push( [  _w/2, -1/2, -_h/2 ] )
  tri.push( [  _w/2, -1/2, +_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_w/2, -1/2, +_h/2 ] )
  tri.push( [ -_w/2, -1/2, -_h/2 ] )
  tri.push( [  _w/2, -1/2, +_h/2 ] )
  fr.push(tri);
  // front right edge
  //
  tri = [];
  tri.push( [  _w/2, -1/2,    -_h/2 ] )
  tri.push( [  _w/2, -_w/2, -_h/2 ] )
  tri.push( [  _w/2, -1/2,    +_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _w/2, -1/2,    +_h/2 ] )
  tri.push( [  _w/2, -_w/2, -_h/2 ] )
  tri.push( [  _w/2, -_w/2, +_h/2 ] )
  fr.push(tri);

  // front left edge
  //
  tri = [];
  tri.push( [ -_w/2, -1/2,    -_h/2 ] )
  tri.push( [ -_w/2, -1/2,    +_h/2 ] )
  tri.push( [ -_w/2, -_w/2, -_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ -_w/2, -1/2,    +_h/2 ] )
  tri.push( [ -_w/2, -_w/2, +_h/2 ] )
  tri.push( [ -_w/2, -_w/2, -_h/2 ] )
  fr.push(tri);

  //---

  // right edge
  //
  tri = [];
  tri.push( [ 1/2, -_w/2, -_h/2 ] )
  tri.push( [ 1/2,  _w/2, -_h/2 ] )
  tri.push( [ 1/2,  _w/2, +_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ 1/2, -_w/2, +_h/2 ] )
  tri.push( [ 1/2, -_w/2, -_h/2 ] )
  tri.push( [ 1/2,  _w/2, +_h/2 ] )
  fr.push(tri);

  // right up edge
  //
  tri = [];
  tri.push( [ 1/2,     _w/2, -_h/2 ] )
  tri.push( [ _w/2,  _w/2, -_h/2 ] )
  tri.push( [ 1/2,     _w/2, +_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [ _w/2,  _w/2, -_h/2 ] )
  tri.push( [ _w/2,  _w/2, +_h/2 ] )
  tri.push( [ 1/2,     _w/2, +_h/2 ] )
  fr.push(tri);

  // right down edge
  //
  tri = [];
  tri.push( [ 1/2,    -_w/2, -_h/2 ] )
  tri.push( [ 1/2,    -_w/2, +_h/2 ] )
  tri.push( [ _w/2, -_w/2, -_h/2 ] )
  fr.push(tri);


  tri = [];
  tri.push( [ _w/2, -_w/2, -_h/2 ] )
  tri.push( [ 1/2,    -_w/2, +_h/2 ] )
  tri.push( [ _w/2, -_w/2, +_h/2 ] )
  fr.push(tri);

  // diagnoal connecting edge
  //
  tri = [];
  tri.push( [ -_w/2,  -_w/2, -_h/2 ] )
  tri.push( [  _w/2,   _w/2, +_h/2 ] )
  tri.push( [  _w/2,   _w/2, -_h/2 ] )
  fr.push(tri);

  tri = [];
  tri.push( [  _w/2,   _w/2, +_h/2 ] )
  tri.push( [ -_w/2,  -_w/2, -_h/2 ] )
  tri.push( [ -_w/2,  -_w/2, +_h/2 ] )
  fr.push(tri);

  let flat_fr = [];
  for (let i=0; i<fr.length; i++) {
    for (let j=0; j<fr[i].length; j++) {
      for (let k=0; k<fr[i][j].length; k++) {
        flat_fr.push( fr[i][j][k] );
      }
    }
  }

  return flat_fr;
}

function jeom_stair() {
  info = ((typeof info === "undefined") ? jeom_info : info);
  let _w = info.w;
  let _h = info.h;


  let parity = 1;

  let st = [];
  let _st_n = Math.floor( (2/_h) + _h );
  let _st_m = Math.floor( (1/_h) + _h );

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
    _r = _3rect_xz( _w, _st_ds,
      dx, dy, dz, 1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // up facing top step
    //
    dx = 0;
    dy = -0.5 + ((1/2)*_st_ds) + (i*_st_ds);
    dz = (2*_st_ds) + (i*_st_ds);
    _r = _3rect_xy( _w, _st_ds,
      dx, dy, dz, 1-parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // right side stair
    //
    dx = _w/2;
    dy = -0.5 + _st_ds/2 + i*_st_ds;
    dz = +_st_ds/2 + i*_st_ds;
    _r = _3rect_zy(
      3*_st_ds, _st_ds,
      dx, dy, dz,
      parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // left side stair 
    //
    dx = -_w/2;
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
    _r = _3rect_xz( _w, _st_ds,
      dx, dy, dz, parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // bottom facing bottom step
    //
    dx = 0;
    dy = -0.5 + ((1/2)*_st_ds) + (i*_st_ds);
    dz =  - (_st_ds) + (i*_st_ds);
    _r = _3rect_xy( _w, _st_ds,
      dx, dy, dz, parity);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  }

  // right side stair
  //
  dx = _w/2;
  dy =  - (_st_ds/2);
  dz = 0.5 - _st_ds;
  _r = _3rect_zy(
    2*_st_ds, _st_ds,
    dx, dy, dz,
    parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  dx = _w/2;
  dy =  + (_st_ds/2);
  dz = 0.5 - (_st_ds/2);
  _r = _3rect_zy(
    1*_st_ds, _st_ds,
    dx, dy, dz,
    parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

  // left side stair
  //
  dx = -_w/2;
  dy = - (_st_ds/2);
  dz = 0.5 - _st_ds;
  _r = _3rect_zy(
    2*_st_ds, _st_ds,
    dx, dy, dz,
    1-parity);
  for (let j=0; j<_r.length; j++) { st.push(_r[j]); }



  dx = -_w/2;
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
    _r = _3rect_xz( _w, _h,
      0, -0.5, 0, 0);
    for (let j=0; j<_r.length; j++) { st.push(_r[j]); }

    // top endcap
    //
    _r = _3rect_xy( _w, _h,
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

  return flat_st;
}

// flat part on z,
// lies in x-y plane
//
function jeom_tee(info) {
  info = ((typeof info === "undefined") ? jeom_info : info);
  let _w = info.w;
  let _h = info.h;

  let T = [];

  _r = _3rect_xy( 1, _w, 0, 0, -_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy(_w, (1-_w)/2, 0, -1/2 + (1-_w)/4, -_h/2, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xy( 1, _w, 0, 0, +_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_xy(_w, (1-_w)/2, 0, -1/2 + (1-_w)/4, +_h/2, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // bottom and top
  //
  _r = _3rect_xz( _w, _h, 0, -1/2, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_xz( 1, _h, 0, _w/2, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // optional...
  // left and right
  //
  _r = _3rect_zy( _h, _w, 1/2, 0, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_zy( _h, _w,-1/2, 0, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  // inner caps
  //
  _r = _3rect_zy( _h, (1-_w)/2, -_w/2, -1/2+(1-_w)/4, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }
  _r = _3rect_zy( _h, (1-_w)/2,  _w/2, -1/2+(1-_w)/4, 0, 1);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xz( (1-_w)/2, _h, -1/2+(1-_w)/4, -_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  _r = _3rect_xz( (1-_w)/2, _h,  1/2-(1-_w)/4, -_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { T.push(_r[j]); }

  let flat_T = [];
  for (let i=0; i<T.length; i++) {
    for (let j=0; j<T[i].length; j++) {
      for (let k=0; k<T[i][j].length; k++) {
        flat_T.push( T[i][j][k] );
      }
    }
  }

  return flat_T;
}

// flat part on z,
// lies in x-y plane
//
function jeom_cross(info) {
  info = ((typeof info === "undefined") ? jeom_info : info);
  let _w = info.w;
  let _h = info.h;
  let pl = [];

  _r = _3rect_xy( 1, _w, 0, 0, -_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_w, (1-_w)/2, 0, -1/2 + (1-_w)/4, -_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_w, (1-_w)/2, 0,  1/2 - (1-_w)/4, -_h/2, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy( 1, _w, 0, 0, +_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xy(_w, (1-_w)/2, 0, -1/2 + (1-_w)/4, +_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xy(_w, (1-_w)/2, 0,  1/2 - (1-_w)/4, +_h/2, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // bottom and top
  //
  _r = _3rect_xz( _w, _h, 0, -1/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( _w, _h, 0,  1/2, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // optional...
  // left and right
  //
  _r = _3rect_zy( _h, _w,  1/2, 0, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _h, _w, -1/2, 0, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  // middle caps
  //
  let _mc = (1/2) - ((1-_w)/4);
  _r = _3rect_zy( _h, (1-_w)/2, -_w/2, -_mc, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _h, (1-_w)/2,  _w/2, -_mc, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_zy( _h, (1-_w)/2, -_w/2,  _mc, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_zy( _h, (1-_w)/2,  _w/2,  _mc, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  //--

  _r = _3rect_xz( (1-_w)/2, _h, -_mc, -_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_w)/2, _h,  _mc, -_w/2, 0, 0);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  _r = _3rect_xz( (1-_w)/2, _h, -_mc,  _w/2, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }
  _r = _3rect_xz( (1-_w)/2, _h,  _mc,  _w/2, 0, 1);
  for (let j=0; j<_r.length; j++) { pl.push(_r[j]); }

  let flat_pl = [];
  for (let i=0; i<pl.length; i++) {
    for (let j=0; j<pl[i].length; j++) {
      for (let k=0; k<pl[i][j].length; k++) {
        flat_pl.push( pl[i][j][k] );
      }
    }
  }


  return flat_pl;
}

// flat part on z,
// lies in x-y plane
//
function jeom_pillar(info) {
  let default_info = { "slice": 16, "r": 0.25, "rf": (function() { return 1.0; }) };
  info = ((typeof info === "undefined") ? default_info : info);
  let _n = ((typeof info.slice === "undefined") ? 16 : info.slice);
  let _r = ((typeof info.r === "undefined") ? 0.25 : info.r);
  let _rf = ((typeof info.rf === "undefined") ? (function() { return 1.0; }) : info.rf);

  let _base = [];
  for (let ii=0; ii<_n; ii++) {
    let theta = 2.0*Math.PI*ii/_n;
    //let f = Math.random()/4 + 0.8;
    f = _rf(ii);
    _base.push({ "X": f*Math.cos(theta)*_r, "Y": -f*Math.sin(theta)*_r });
  }

  let _tri = jeom_extrude(_base);
  return _tri;
}


//----
//----
//----


function jeom_mov(tri, v) {
  for (let i=0; i<tri.length; i+=3) {
    tri[i+0] += v[0];
    tri[i+1] += v[1];
    tri[i+2] += v[2];
  }
}

function jeom_scale(tri, v) {
  for (let i=0; i<tri.length; i+=3) {
    tri[i+0] *= v[0];
    tri[i+1] *= v[1];
    tri[i+2] *= v[2];
  }
}

// https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
//
function jeom_rot(tri, v, theta) {
  let c = Math.cos(theta), s = Math.sin(theta);
  let ic = 1-c, is = 1-s;
  let uxx = v[0]*v[0],
      uyy = v[1]*v[1],
      uzz = v[2]*v[2],
      uxy = v[0]*v[1],
      uxz = v[0]*v[2],
      uyz = v[1]*v[2],
      ux = v[0],
      uy = v[1],
      uz = v[2];

  let uyx = uxy,
      uzx = uxz,
      uzy = uyz;

  let m_r = [
    [ c + uxx*ic,       uxy*ic - uz*s,  uxz*ic + uy*s ],
    [ uyx*ic + uz*s,    c + uyy*ic,     uyz*ic - ux*s ],
    [ uzx*ic - uy*s,    uzy*ic + ux*s,  c + uzz*ic ]
  ];

  let tx=0, ty=0, tz=0;
  for (let i=0; i<tri.length; i+=3) {
    tx = m_r[0][0]*tri[i+0] + m_r[0][1]*tri[i+1] + m_r[0][2]*tri[i+2];
    ty = m_r[1][0]*tri[i+0] + m_r[1][1]*tri[i+1] + m_r[1][2]*tri[i+2];
    tz = m_r[2][0]*tri[i+0] + m_r[2][1]*tri[i+1] + m_r[2][2]*tri[i+2];

    tri[i+0] = tx;
    tri[i+1] = ty;
    tri[i+2] = tz;
  }

}

function jeom_rotx(tri, theta) { jeom_rot(tri, [1,0,0], theta); }
function jeom_roty(tri, theta) { jeom_rot(tri, [0,1,0], theta); }
function jeom_rotz(tri, theta) { jeom_rot(tri, [0,0,1], theta); }

function jeom_dup(tri) {
  let v = Array(tri.length);
  for (let i=0; i<tri.length; i++) {
    v[i] = tri[i];
  }
  return v;
}

function jeom_csg2tri(_csg) {
  let _debug = false;
  let tri = [];

  let pgn = _csg.polygons;

  for (let ii=0; ii<pgn.length; ii++) {

    let vertices = pgn[ii].vertices;
    let pos0 = vertices[0].pos;
    tri.push(pos0.x, pos0.y, pos0.z);

    let pos1 = vertices[1].pos;
    tri.push(pos1.x, pos1.y, pos1.z);

    let pos2 = vertices[2].pos;
    tri.push(pos2.x, pos2.y, pos2.z);

    if (_debug) {
    console.log(ii, "pos0:", pos0, vertices[0].normal);
    console.log(ii, "pos1:", pos1, vertices[1].normal);
    console.log(ii, "pos2:", pos2, vertices[2].normal);
    }

    if (vertices.length > 3) {
      let pos3 = vertices[3].pos;

      if (_debug) {
    console.log(ii, "pos3:", pos3, vertices[3].normal);
      }

      tri.push(pos2.x, pos2.y, pos2.z);
      tri.push(pos3.x, pos3.y, pos3.z);
      tri.push(pos0.x, pos0.y, pos0.z);
    }

    if (_debug) {
    console.log("");
    }

  }
  return tri;
}

function jeom_stl_print(tri) {

  let x = 0, y = 0, z = 0;
  let d = 1;
  let _eps = (1.0/(1024.0*1024.0));

  console.log("solid");
  for (let i=0; i<tri.length; i+=9) {
    let ax = x + tri[i + 0]*d ;
    let ay = y + tri[i + 1]*d ;
    let az = z + tri[i + 2]*d ;

    let bx = x + tri[i + 3]*d ;
    let by = y + tri[i + 4]*d ;
    let bz = z + tri[i + 5]*d ;

    let cx = x + tri[i + 6]*d ;
    let cy = y + tri[i + 7]*d ;
    let cz = z + tri[i + 8]*d ;

    let pA = [ ax, ay, az ];
    let pB = [ bx, by, bz ];
    let pC = [ cx, cy, cz ];

    let cb = numeric.sub( pC, pB );
    let ab = numeric.sub( pA, pB );
    let _n = _cross(cb, ab);

    let _nn = numeric.norm2(_n);
    if (Math.abs(_nn) > _eps) {
      _n = numeric.mul(_n, 1.0/_nn);
    }


    console.log("facet normal", _n[0], _n[1], _n[2]);
    console.log("  outer loop");
    console.log("    vertex", ax, ay, az);
    console.log("    vertex", bx, by, bz);
    console.log("    vertex", cx, cy, cz);
    console.log("  endloop");
    console.log("endfacet");


  }
  console.log("endsolid");

}

function jeom_off_print(tri) {

  console.log("OFF");
  console.log(tri.length/3, tri.length/9, 0);
  for (let i=0; i<tri.length; i+=3) {
    console.log(tri[i], tri[i+1], tri[i+2]);
  }
  for (let i=0; i<tri.length; i+=9) {
    console.log(3, i+0, i+1, i+2);
    console.log(3, i+3, i+4, i+5);
    console.log(3, i+6, i+7, i+8);
  }
}


//jeom_stl_print(jeom_stair());
//jeom_stl_print(jeom_tee());
//jeom_stl_print(jeom_cross());

function _main() {
  let pm = jeom_pillar();

  //jeom_rotx(pm, Math.PI/2.0);
  jeom_stl_print(pm);
  //jeom_off_print(pm);

}



function _debug() {
  let _n = 16, _r = 0.25;
  let _test_pgn = [];
  for (let ii=0; ii<_n; ii++) {
    let theta = 2.0*Math.PI*ii/_n;
    let f = Math.random()/4 + 0.8;
    _test_pgn.push({ "X": f*Math.cos(theta)*_r, "Y": -f*Math.sin(theta)*_r });
  }
  //_test_pgn.push({"X": 0, "Y":0.0});

  //for (let ii=0; ii<_test_pgn.length; ii++) {
  //  console.log(_test_pgn[ii].X, _test_pgn[ii].Y);
  //}

  let _debug_tri = jeom_extrude(_test_pgn);
  jeom_stl_print(_debug_tri);

}

_main();
//_debug();
