// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

var CANVAS_ID = 'iao_canvas';
var g_data = {
  "two": undefined

};

var RND = Math.random;

function drand(a,b) {
  if (typeof a === "undefined") { a = 0; b = 1; }
  else if (typeof b === "undefined") { b = a; a = 0; }
  if (a > b) { let t = b; b = a; a = t; }
  return (RND()*(b-a)) + a;
}

function irnd(a,b) {
  a = ((typeof a === "undefined") ? 2 : a);
  return Math.floor( drand(a,b) );
  //return Math.floor( drand() * a );
}

function downloadSVG() {
  var ele = document.getElementById(CANVAS_ID);
  var b = new Blob([ ele.innerHTML ]);
  saveAs(b, "mstp.svg");
}

function _grid_r(g, x,y, r, lvl, max_lvl, prob_prof) {
  max_lvl = ((typeof max_lvl === "undefined") ? 10 : max_lvl);
  if (lvl >= max_lvl) { return; }

  let pal = [
    "rgb(200,200,200)",
    "rgb(50,50,50)"
  ];

  let two = g_data.two;

  let lvl_parity = lvl%2;

  let r2 = r/2;

  let dxy = [
    [ r2, -r2 ],
    [-r2, -r2 ],
    [-r2,  r2 ],
    [ r2,  r2 ]
  ];

  let n = prob_prof.length;

  let p = drand();
  if (lvl == 0) { p = drand(prob_prof[0], prob_prof[n-2]);  }


  // terminate
  //
  if      (p < prob_prof[0]) {
  }

  // subdivide
  //
  else if (p < prob_prof[1]) {

    for (let i=0; i<4; i++) {
      _grid_r(g, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, max_lvl, prob_prof);
    }
  }

  // display tile
  //
  else {

    //g.push( [x,y,r,irnd(),lvl] );
    g.push( [x,y,r,irnd(7),lvl] );
    if (p < prob_prof[2]) {
      for (let i=0; i<4; i++) {
        _grid_r(g, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, max_lvl, prob_prof);
      }
    }

  }

  return g;
}

function grid_r(g, x,y, r, lvl, opt) {
  let max_lvl = opt.max_level;
  let prob_prof = opt.prob_profile;

  if (lvl >= max_lvl) { return; }
  let two = g_data.two;

  let lvl_parity = lvl%2;

  let r2 = r/2;

  let dxy = [
    [ r2, -r2 ],
    [-r2, -r2 ],
    [-r2,  r2 ],
    [ r2,  r2 ]
  ];

  let n = prob_prof.length;
  let pat_a = opt.pattern_choice;

  let p = drand();
  if (lvl == 0) { p = drand(prob_prof[0], prob_prof[n-2]);  }


  // terminate
  //
  if      (p < prob_prof[0]) {
  }

  // subdivide
  //
  else if (p < prob_prof[1]) {

    for (let i=0; i<4; i++) {
      grid_r(g, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
    }
  }

  // display tile
  //
  else {

    //g.push( [x,y,r,irnd(),lvl] );
    g.push( [x,y,r,irnd(pat_a.length),lvl] );
    if (p < prob_prof[2]) {
      for (let i=0; i<4; i++) {
        grid_r(g, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
      }
    }

  }

  return g;
}


function pat0(xy,r,pat_idx, c0, c1) {
  pat_idx = ((typeof pat_idx === "undefined") ? irnd() : pat_idx);
  c0 = ((typeof c0 === "undefined") ?  "rgb(200,200,200)" : c0);
  c1 = ((typeof c1 === "undefined") ?  "rgb(50,50,50)" : c1);

  let two = g_data.two;

  let r_1_3 = r/3;
  let r_2_3 = 2*r/3;

  let d = 2*r;

  let d_1_3 = 1*d / 3;
  let d_2_3 = 2*d / 3;

  // background square
  //
  let s = two.makeRectangle( xy[0], xy[1], d, d );
  s.fill = c0;
  s.noStroke();

  // inner tube \
  //
  if (pat_idx == 0) {
    let a0 = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3, Math.PI/2, Math.PI );
    a0.noStroke();
    a0.fill = c1;

    let a2 = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3, 0, -Math.PI/2 );
    a2.noStroke();
    a2.fill = c1;
  }

  // inner tube /
  //
  else if (pat_idx == 1) {
    let a0 = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3, Math.PI/2, 0 );
    a0.noStroke();
    a0.fill = c1;

    let a2 = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3, -Math.PI, -Math.PI/2 );
    a2.noStroke();
    a2.fill = c1;
  }

  // inner tube /
  //
  else if (pat_idx == 2) {
    let a0 = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3, Math.PI/2, 0 );
    a0.noStroke();
    a0.fill = c1;
  }

  else if (pat_idx == 3) {
    let a2 = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3, -Math.PI, -Math.PI/2 );
    a2.noStroke();
    a2.fill = c1;
  }

  if (pat_idx == 4) {
    let a0 = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3, Math.PI/2, Math.PI );
    a0.noStroke();
    a0.fill = c1;
  }

  else if (pat_idx == 5) {
    let a2 = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3, 0, -Math.PI/2 );
    a2.noStroke();
    a2.fill = c1;
  }


  // fat cross
  //
  else if (pat_idx == 6) {
    let _fc = two.makeRectangle( xy[0], xy[1], d, d );
    _fc.fill = c0;
    _fc.noStroke();
  }

  else {



  }


  // tube ends
  //

  let e0 = two.makeCircle(xy[0] + r, xy[1], r_1_3 );
  e0.noStroke();
  e0.fill = c1;

  let e1 = two.makeCircle(xy[0], xy[1] - r, r_1_3 );
  e1.noStroke();
  e1.fill = c1;

  let e2 = two.makeCircle(xy[0] - r, xy[1], r_1_3 );
  e2.noStroke();
  e2.fill = c1;

  let e3 = two.makeCircle(xy[0], xy[1] + r, r_1_3 );
  e3.noStroke();
  e3.fill = c1;

  //wings
  //

  let w0 = two.makeCircle( xy[0] + r, xy[1] - r, d_1_3 );
  w0.noStroke();
  w0.fill = c0;

  let w1 = two.makeCircle( xy[0] - r, xy[1] - r, d_1_3 );
  w1.noStroke();
  w1.fill = c0;

  let w2 = two.makeCircle( xy[0] - r, xy[1] + r, d_1_3 );
  w2.noStroke();
  w2.fill = c0;

  let w3 = two.makeCircle( xy[0] + r, xy[1] + r, d_1_3 );
  w3.noStroke();
  w3.fill = c0;


}


function init_twojs(canvas_id) {
  canvas_id = ((typeof canvas_id === "undefined") ? CANVAS_ID : canvas_id);
  let two = new Two({"fitted":true});
  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);
  two.update();
  return two;
}

function mstp_sort(a,b) {
  if (a[2] < b[2]) { return  1; }
  if (a[2] > b[2]) { return -1; }
  return 0;
}

function _amin(a) {
  let _m = a[0];
  for (let i=1; i<a.length; i++) {
    if (_m > a[i]) { _m = a[i]; }
  }
  return _m;
}

function rand_pal_colorsjs() {
  let col_idx0 = irnd( COLORS.length );
  let col_nei = COLORS[col_idx0].combinations;

  let max_iter = 200;

  for (let i=0; i<max_iter; i++) {
    if ( (_amin(col_nei)-1) < COLORS.length ) { break; }
    col_idx0 = irnd( COLORS.length );
    col_nei = COLORS[col_idx0].combinations ;
  }

  let col_idx1 = -1;
  for (let i=0; i<max_iter; i++) {
    let idx = col_nei[ irnd(col_nei.length) ] - 1;
    if (idx < COLORS.length) { col_idx1 = idx; break; }
  }

  if (col_idx1 < 0) {
    console.log("DEFAULT PALETTE, couldn't resolve:", col_idx0, col_idx1);
    return [ "rgb(200,200,200)", "rgb(50,50,50)" ];
  }
  return [ COLORS[col_idx0].hex, COLORS[col_idx1].hex, col_idx0, col_idx1 ];
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

function web_init() {
  let two = init_twojs();
  g_data["two"] = two;

  let c0 = "rgb(200,200,200)";
  let c1 = "rgb(50,50,50)";

  let pal = [ c0,c1 ];

  pal = rand_pal_colorsjs();

  g_data["pal_idx"] = [pal[2], pal[3] ];
  g_data["pal"] = [pal[0], pal[1]];

  let p_prof = [ 1/32, 0.55, 0.75, 1 ];
  p_prof = [ 2/32, 0.55, 0.68, 1 ];

  let cxy = [400,400];
  let R = 200;
  let max_lvl = 6;

  let all_pat = [0,1,2,3,4,5,6];
  fisher_yates_shuffle(all_pat);
  let _m = irnd(all_pat.length-2);
  for (let i=0; i<_m; i++) { all_pat.pop(); }

  let opt = {
    "max_level": max_lvl,
    //"pattern_choice": [0,1,2,3,4,5,6],
    //"pattern_choice": [0,1],
    "pattern_choice": all_pat,
    "prob_profile": p_prof
  };

  g_data["opt"] = opt;

  let g = [];
  grid_r(g, cxy[0], cxy[1], R, 0, opt );

  g.sort( mstp_sort );

  g_data["g"] = g;

  for (let i=0; i<g.length; i++) {
    let v = g[i];
    let lp = v[4]%2;
    pat0( [v[0], v[1]], v[2], v[3], pal[lp], pal[1-lp] );
  }

  two.update();
}
