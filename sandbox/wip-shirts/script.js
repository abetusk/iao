// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
//
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

var RND = $fx.rand;

var CANVAS_ID = 'iao_canvas';
var g_data = {
  "two": undefined,

  "ANIMATE": true,
  "BG" : ['#fff', '#fff'],
  "FG" : ['#000', '#000'],

  //DEBUG
  //"BG" : ['#f00', '#0f0'],
  //"FG" : ['#f0f', '#00f'],

  "pattern_period": [ [7,7,1], [7,7,1] ],

  "default_pattern_period": {
    "checkerboard.red" : [20,20, 2],
    "checkerboard.blue" : [20,20, 2],
    "%" : [20,20, 2],
    "/" : [10,10, 2.0],
    "\\" : [10,10, 2.0],
    "o" : [10,10, 2],
    ":" : [10,10, 2],
    "z" : [10,10,2.0],
    "Z" : [10,10,2.0],
    "|" : [20,20,1.25],
    "x" : [20,20,2.0],

    "~" : [52,26, 1],
    "v" : [80,80, 0.25],
    "*" : [180,180, 0.25],
    "^" : [60,60,1.125],
    "$" : [100,20,2],
    "c" : [56,28,2.0],
    "p" : [40,40, 1.5],
    "?" : [24,40,1.5],
    "#" : [44,12,2.0],
    "X" : [32,64,0.75],
    "T" : [152,152,0.5],
    "F" : [260,260,0.125],
    "@" : [80,105,1.5],
    "A" : [88,24,1.0],
    "m" : [80,88,0.5],
    "R" : [84,84,0.25],
    "h" : [40,40,1.0],
    "S" : [10, 10, 2.5],
    "s" : [10, 10, 2.5]
  },

  "f_pat_info": [
    //[ pat_checkerboard_red,     "checkerboard.red" ],
    //[ pat_checkerboard_blue,  "checkerboard.blue" ],
    [ pat_checkerboard,       "%" ],
    [ pat_diag0,              "\\" ],
    [ pat_diag1,              "/" ],
    [ pat_circ0,              "o" ],
    [ pat_circ1,              ":" ],
    [ pat_wiggle,             "~" ],
    //[ pat_anchor,             "v" ],
    //[ pat_glam,               "*" ],
    //[ pat_diamond,            "^" ],
    [ pat_bank,               "$" ],
    [ pat_cloud,              "c" ],
    [ pat_parkay,             "p" ],
    [ pat_groovy,             "?" ],
    [ pat_curtain,            "#" ],
    [ pat_aztec,              "X" ],
    //[ pat_temple,             "T" ],
    //[ pat_food,               "F" ],
    [ pat_nomoon,             "@" ],
    [ pat_autumn,             "A" ],
    [ pat_moroccan,           "m" ],
    //[ pat_rounded,            "R" ],
    [ pat_zigzag0,            "z" ],
    [ pat_zigzag1,            "Z" ],
    [ pat_grid0,              "|" ],
    [ pat_grid1,              "x" ],
    [ pat_houndstooth,        "h" ],
    [ pat_stripe0,            "S" ],
    [ pat_stripe1,            "s" ]
  ],

  "f_pat": [
    //pat_checkerboard_red,
    //pat_checkerboard_blue,
    pat_checkerboard,
    pat_diag0,
    pat_diag1,
    pat_circ0,
    pat_circ1,
    pat_wiggle,
    //pat_anchor,
    //pat_glam,
    //pat_diamond,
    pat_bank,
    pat_cloud,
    pat_parkay,
    pat_groovy,
    pat_curtain,
    pat_aztec,
    //pat_temple,
    //pat_food,
    pat_nomoon,
    pat_autumn,
    pat_moroccan,
    //pat_rounded,
    pat_zigzag0,
    pat_zigzag1,
    pat_grid0,
    pat_grid1,
    pat_houndstooth,
    pat_stripe0,
    pat_stripe1
  ],

  "svg_pattern" : []
};

function _downloadSVG() {
  var ele = document.getElementById(CANVAS_ID);
  var b = new Blob([ ele.innerHTML ]);
  saveAs(b, "mstp.svg");
}


function downloadSVG() {
  var ele = document.getElementById(CANVAS_ID);
  let defs = document.getElementById("pattern_defs");

  // very hacky, find the defs definition, take the defs
  // from the html and insert them here.
  // Probably should define the patterns in this file and
  // use two.js to append them...
  //
  let _defs = "<defs>";
  let svg_txt = ele.innerHTML;
  let pos = svg_txt.search("<defs>");

  let fin_txt = svg_txt.slice(0,pos);
  fin_txt +=  "<defs>";
  fin_txt += defs.innerHTML;
  fin_txt += svg_txt.slice(pos + _defs.length);

  var b = new Blob([ fin_txt ]);
  saveAs(b, "fig.svg");

}

function drand(a,b) {
  if (typeof a === "undefined") { a = 0; b = 1; }
  else if (typeof b === "undefined") { b = a; a = 0; }
  if (a > b) { let t = b; b = a; a = t; }
  return (RND()*(b-a)) + a;
}

function irnd(a,b) {
  a = ((typeof a === "undefined") ? 2 : a);
  return Math.floor( drand(a,b) );
}

function pat_checkerboard_red(dx,dy, w,h, s, lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["checkerboard.red"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["checkerboard.red"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["checkerboard.red"][2] : s );
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill('#f06');
    add.rect(w/2,h/2);
    add.rect(w/2,h/2).move(w/2,h/2);
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();
}

function pat_checkerboard_blue(dx,dy, w,h, s, lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][2] : s );
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill('#06f');
    add.rect(w/2,h/2);
    add.rect(w/2,h/2).move(w/2,h/2);
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

function pat_checkerboard(dx,dy, w,h, s, lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["checkerboard.blue"][2] : s );
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    //add.rect(w/2,h/2);
    //add.rect(w/2,h/2).move(w/2,h/2);

    add.rect(w,h).fill( g_data.BG[mt_idx] );
    add.rect(w/2,h/2).fill( g_data.FG[mt_idx] );
    add.rect(w/2,h/2).move(w/2,h/2).fill(g_data.FG[mt_idx]);

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// lower left to upper right diagonal
//
function pat_diag0(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["\\"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["\\"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["\\"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    //add.rect(w,h).fill("#fff");
    add.rect(w,h).fill( g_data.BG[mt_idx] );

    //add.line(0,0,w,h).stroke({"color":"#000", "linecap":"square", "width":lw});
    //add.line(0,-h,2*w,h).stroke({"color":"#000", "linecap":"square", "width":lw});
    //add.line(-w,0,w,2*h).stroke({"color":"#000", "linecap":"square", "width":lw});
    add.line(0,0,w,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(0,-h,2*w,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(-w,0,w,2*h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();
}

// lower right to upper left diagonal
//
function pat_diag1(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["/"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["/"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["/"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    //add.rect(w,h).fill("#fff");
    //add.line(w,0,0,h).stroke({"color":"#000", "linecap":"butt", "width":lw});
    //add.line(2*w,0,0,2*h).stroke({"color":"#000", "linecap":"butt", "width":lw});
    //add.line(w,-h,-w,h).stroke({"color":"#000", "linecap":"butt", "width":lw});

    add.rect(w,h).fill( g_data.BG[mt_idx] );
    add.line(w,0,0,h).stroke({"color":g_data.FG[mt_idx], "linecap":"butt", "width":lw});
    add.line(2*w,0,0,2*h).stroke({"color":g_data.FG[mt_idx], "linecap":"butt", "width":lw});
    add.line(w,-h,-w,h).stroke({"color":g_data.FG[mt_idx], "linecap":"butt", "width":lw});
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// circle grid stack
//
function pat_circ0(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["o"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["o"][1] : h );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {

    //add.rect(w,h).fill("#fff");
    //add.circle(w/3).center(0,0);
    //add.circle(w/3).center(0,h);
    //add.circle(w/3).center(w,h);
    //add.circle(w/3).center(w,0);

    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.circle(w/3).center(0,0).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(0,h).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(w,h).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(w,0).fill(g_data.FG[mt_idx]);

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}


// offset circle
//
function pat_circ1(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period[":"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period[":"][1] : h );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    //add.rect(w,h).fill("#fff");
    //add.circle(w/3).center(w/2,h/2);
    //add.circle(w/3).center(0,0);
    //add.circle(w/3).center(0,h);
    //add.circle(w/3).center(w,h);
    //add.circle(w/3).center(w,0);

    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.circle(w/3).center(w/2,h/2).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(0,0).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(0,h).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(w,h).fill(g_data.FG[mt_idx]);
    add.circle(w/3).center(w,0).fill(g_data.FG[mt_idx]);
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_wiggle(dx,dy, w,h, s, lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["~"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["~"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["~"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 52,26
  //
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );
    add.path("M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z");

  });
  //p.scale(0.25);
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_anchor(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["v"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["v"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["v"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 80,80

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);

    add.fill( g_data.FG[mt_idx] );
    //add.stroke({"color": g_data.FG[mt_idx] });

    add.path("M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_glam(dx,dy, w,h, s, lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["*"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["*"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["*"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 180,180

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);

    add.fill( g_data.FG[mt_idx] );
    add.stroke({"color": g_data.FG[mt_idx] });

    add.path("M81.2792408,88 L68.4142136,88 L87.7117544,107.297541 L81.2792408,88 L81.2792408,88 Z M83.3874259,88 L96.6125741,88 L90,107.837722 L83.3874259,88 L83.3874259,88 Z M98.7207592,88 L111.585786,88 L92.2882456,107.297541 L98.7207592,88 L98.7207592,88 Z M65.7928932,85.7928932 L73.5857864,78 L75.2071068,78 L105.792893,78 L106.414214,78 L106.914214,78.5 L114.207107,85.7928932 L115.414214,87 L90.7071068,111.707107 L90,112.414214 L64.5857864,87 L64.5857864,87 L65.7928932,85.7928932 L65.7928932,85.7928932 Z M68.4142136,86 L74,80.4142136 L79.5857864,86 L68.4142136,86 L68.4142136,86 Z M84.4142136,86 L90,80.4142136 L95.5857864,86 L84.4142136,86 L84.4142136,86 Z M100.414214,86 L106,80.4142136 L111.585786,86 L100.414214,86 L100.414214,86 Z M92.4142136,80 L103.585786,80 L98,85.5857864 L92.4142136,80 L92.4142136,80 Z M82,85.5857864 L87.5857864,80 L76.4142136,80 L82,85.5857864 L82,85.5857864 Z M17.4142136,0 L0.707106781,16.7071068 L0,17.4142136 L0,0 L17.4142136,0 L17.4142136,0 Z M4.27924078,0 L0,12.8377223 L0,0 L4.27924078,0 L4.27924078,0 Z M14.5857864,0 L2.28824561,12.2975408 L6.38742589,0 L14.5857864,0 L14.5857864,0 Z M180,17.4142136 L162.585786,0 L180,0 L180,17.4142136 L180,17.4142136 Z M165.414214,0 L177.711754,12.2975408 L173.612574,0 L165.414214,0 Z M180,12.8377223 L175.720759,0 L180,0 L180,12.8377223 L180,12.8377223 Z M1.42108547e-14,163 L15.7928932,163 L16.4142136,163 L16.9142136,163.5 L24.2071068,170.792893 L25.4142136,172 L17.4142136,180 L0,180 L0,163 L1.42108547e-14,163 Z M0,173 L6.61257411,173 L4.27924078,180 L0,180 L0,173 Z M14.5857864,180 L21.5857864,173 L8.72075922,173 L6.38742589,180 L14.5857864,180 Z M2.4158453e-13,165.414214 L5.58578644,171 L0,171 L0,165.414214 L2.4158453e-13,165.414214 Z M10.4142136,171 L16,165.414214 L21.5857864,171 L10.4142136,171 Z M2.41421356,165 L13.5857864,165 L8,170.585786 L2.41421356,165 Z M180,163 L165.207107,163 L163.585786,163 L155.792893,170.792893 L155.792893,170.792893 L154.585786,172 L162.585786,180 L180,180 L180,163 Z M165.414214,180 L158.414214,173 L171.279241,173 L173.612574,180 L165.414214,180 Z M180,173 L173.387426,173 L175.720759,180 L180,180 L180,173 Z M158.414214,171 L164,165.414214 L169.585786,171 L158.414214,171 Z M180,165.414214 L174.414214,171 L180,171 L180,165.414214 Z M172,170.585786 L177.585786,165 L166.414214,165 L172,170.585786 Z M152.932504,25.6532829 L154.346717,27.0674965 L120.405592,61.008622 L118.991378,59.5944084 L152.932504,25.6532829 Z M154.346717,152.932504 L152.932504,154.346717 L118.991378,120.405592 L120.405592,118.991378 L154.346717,152.932504 Z M27.0674965,154.346717 L25.6532829,152.932504 L59.5944084,118.991378 L61.008622,120.405592 L27.0674965,154.346717 Z M25.6532829,27.0674965 L27.0674965,25.6532829 L61.008622,59.5944084 L59.5944084,61.008622 L25.6532829,27.0674965 Z M0,85 C2.209139,85 4,86.790861 4,89 C4,91.209139 2.209139,93 0,93 L0,85 Z M180,85 C177.790861,85 176,86.790861 176,89 C176,91.209139 177.790861,93 180,93 L180,85 Z M94,0 C94,2.209139 92.209139,4 90,4 C87.790861,4 86,2.209139 86,0 L94,0 Z M94,180 C94,177.790861 92.209139,176 90,176 C87.790861,176 86,177.790861 86,180 L94,180 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_diamond(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["^"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["^"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["^"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 60,60

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);

    add.fill( g_data.FG[mt_idx] );
    //add.stroke({"color": g_data.FG[mt_idx] });

    add.path("M54.627417,1.33226763e-15 L55.4558441,0.828427125 L54.0416306,2.24264069 L51.7989899,-1.44328993e-15 L54.627417,7.10542736e-15 L54.627417,1.33226763e-15 Z M5.372583,-5.55111512e-16 L4.54415588,0.828427125 L5.95836944,2.24264069 L8.20101013,-1.44328993e-15 L5.372583,-7.77156117e-16 L5.372583,-5.55111512e-16 Z M48.9705627,6.32827124e-15 L52.627417,3.65685425 L51.2132034,5.07106781 L46.1421356,-1.44328993e-15 L48.9705627,5.21804822e-15 L48.9705627,6.32827124e-15 Z M11.0294373,-1.44328993e-15 L7.372583,3.65685425 L8.78679656,5.07106781 L13.8578644,1.22124533e-15 L11.0294373,-3.33066907e-16 L11.0294373,-1.44328993e-15 Z M43.3137085,2.10942375e-15 L49.7989899,6.48528137 L48.3847763,7.89949494 L40.4852814,2.10942375e-15 L43.3137085,-1.44328993e-15 L43.3137085,2.10942375e-15 Z M16.6862915,3.33066907e-16 L10.2010101,6.48528137 L11.6152237,7.89949494 L19.5147186,-3.33066907e-16 L16.6862915,-1.44328993e-15 L16.6862915,3.33066907e-16 Z M37.6568542,2.55351296e-15 L46.9705627,9.3137085 L45.5563492,10.7279221 L34.8284271,-5.55111512e-16 L37.6568542,-1.44328993e-15 L37.6568542,2.55351296e-15 Z M22.3431458,5.55111512e-16 L13.0294373,9.3137085 L14.4436508,10.7279221 L25.1715729,-1.11022302e-16 L22.3431458,-1.44328993e-15 L22.3431458,5.55111512e-16 Z M32,-3.33066907e-16 L44.1421356,12.1421356 L42.7279221,13.5563492 L30,0.828427125 L17.2720779,13.5563492 L15.8578644,12.1421356 L28,-3.33066907e-16 L32,-1.44328993e-15 L32,-3.33066907e-16 Z M0.284271247,-1.44328993e-15 L28.2842712,28 L26.8700577,29.4142136 L-2.15508222e-16,2.54415588 L-2.15508222e-16,4.71844785e-16 L0.284271247,4.71844785e-16 L0.284271247,-1.44328993e-15 Z M1.80408836e-15,5.372583 L25.4558441,30.8284271 L24.0416306,32.2426407 L3.33720546e-15,8.20101013 L-2.15508222e-16,5.372583 L1.80408836e-15,5.372583 Z M-2.15508222e-16,11.0294373 L22.627417,33.6568542 L21.2132034,35.0710678 L4.80878765e-15,13.8578644 L1.25607397e-15,11.0294373 L-2.15508222e-16,11.0294373 Z M-2.15508222e-16,16.6862915 L19.7989899,36.4852814 L18.3847763,37.8994949 L7.73346434e-15,19.5147186 L6.28036983e-16,16.6862915 L-2.15508222e-16,16.6862915 Z M1.66860273e-15,22.3431458 L16.9705627,39.3137085 L15.5563492,40.7279221 L-2.15508222e-16,25.1715729 L-2.15508222e-16,22.3431458 L1.66860273e-15,22.3431458 Z M-2.15508222e-16,28 L14.1421356,42.1421356 L12.7279221,43.5563492 L-2.15508222e-16,30.8284271 L-2.15508222e-16,28 L-2.15508222e-16,28 Z M-2.15508222e-16,33.6568542 L11.3137085,44.9705627 L9.89949494,46.3847763 L5.20282872e-16,36.4852814 L5.20282872e-16,33.6568542 L-2.15508222e-16,33.6568542 Z M-2.15508222e-16,39.3137085 L8.48528137,47.7989899 L7.07106781,49.2132034 L3.55271368e-15,42.1421356 L3.55271368e-15,39.3137085 L-2.15508222e-16,39.3137085 Z M-2.15508222e-16,44.9705627 L5.65685425,50.627417 L4.24264069,52.0416306 L3.55271368e-15,47.7989899 L2.66453526e-15,44.9705627 L-2.15508222e-16,44.9705627 Z M-2.15508222e-16,50.627417 L2.82842712,53.4558441 L1.41421356,54.8700577 L2.48058749e-15,53.4558441 L2.48058749e-15,50.627417 L-2.15508222e-16,50.627417 Z M54.627417,60 L30,35.372583 L5.372583,60 L8.20101013,60 L30,38.2010101 L51.7989899,60 L54.627417,60 L54.627417,60 Z M48.9705627,60 L30,41.0294373 L11.0294373,60 L13.8578644,60 L30,43.8578644 L46.1421356,60 L48.9705627,60 L48.9705627,60 Z M43.3137085,60 L30,46.6862915 L16.6862915,60 L19.5147186,60 L30,49.5147186 L40.4852814,60 L43.3137085,60 L43.3137085,60 Z M37.6568542,60 L30,52.3431458 L22.3431458,60 L25.1715729,60 L30,55.1715729 L34.8284271,60 L37.6568542,60 L37.6568542,60 Z M32,60 L30,58 L28,60 L32,60 L32,60 Z M59.7157288,3.33066907e-16 L31.7157288,28 L33.1299423,29.4142136 L60,2.54415588 L60,-1.44328993e-15 L59.7157288,-1.44328993e-15 L59.7157288,3.33066907e-16 Z M60,5.372583 L34.5441559,30.8284271 L35.9583694,32.2426407 L60,8.20101013 L60,5.372583 L60,5.372583 Z M60,11.0294373 L37.372583,33.6568542 L38.7867966,35.0710678 L60,13.8578644 L60,11.0294373 L60,11.0294373 Z M60,16.6862915 L40.2010101,36.4852814 L41.6152237,37.8994949 L60,19.5147186 L60,16.6862915 L60,16.6862915 Z M60,22.3431458 L43.0294373,39.3137085 L44.4436508,40.7279221 L60,25.1715729 L60,22.3431458 L60,22.3431458 Z M60,28 L45.8578644,42.1421356 L47.2720779,43.5563492 L60,30.8284271 L60,28 L60,28 Z M60,33.6568542 L48.6862915,44.9705627 L50.1005051,46.3847763 L60,36.4852814 L60,33.6568542 L60,33.6568542 Z M60,39.3137085 L51.5147186,47.7989899 L52.9289322,49.2132034 L60,42.1421356 L60,39.3137085 L60,39.3137085 Z M60,44.9705627 L54.3431458,50.627417 L55.7573593,52.0416306 L60,47.7989899 L60,44.9705627 L60,44.9705627 Z M60,50.627417 L57.1715729,53.4558441 L58.5857864,54.8700577 L60,53.4558441 L60,50.627417 L60,50.627417 Z M39.8994949,16.3847763 L41.3137085,14.9705627 L30,3.65685425 L18.6862915,14.9705627 L20.1005051,16.3847763 L30,6.48528137 L39.8994949,16.3847763 L39.8994949,16.3847763 Z M37.0710678,19.2132034 L38.4852814,17.7989899 L30,9.3137085 L21.5147186,17.7989899 L22.9289322,19.2132034 L30,12.1421356 L37.0710678,19.2132034 L37.0710678,19.2132034 Z M34.2426407,22.0416306 L35.6568542,20.627417 L30,14.9705627 L24.3431458,20.627417 L25.7573593,22.0416306 L30,17.7989899 L34.2426407,22.0416306 L34.2426407,22.0416306 Z M31.4142136,24.8700577 L32.8284271,23.4558441 L30,20.627417 L27.1715729,23.4558441 L28.5857864,24.8700577 L30,23.4558441 L31.4142136,24.8700577 L31.4142136,24.8700577 Z M56.8700577,59.4142136 L58.2842712,58 L30,29.7157288 L1.71572875,58 L3.12994231,59.4142136 L30,32.5441559 L56.8700577,59.4142136 L56.8700577,59.4142136 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_bank(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["$"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["$"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["$"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 100,20

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);

    add.fill( g_data.FG[mt_idx] );
    //add.stroke({"color": g_data.FG[mt_idx] });

    add.path("M21.1841339,20 C21.5411448,19.869748 21.9037256,19.7358773 22.272392,19.5983261 C22.6346445,19.4631679 23.8705367,18.9999982 24.0399055,18.9366758 C33.6397477,15.3475548 39.6469349,14 50,14 C60.2711361,14 65.3618399,15.2217689 74.6286093,18.9284767 C75.584355,19.310775 76.4978747,19.6675274 77.3787841,20 L83.604005,20 C81.0931362,19.2694473 78.4649665,18.3089537 75.3713907,17.0715233 C65.8881601,13.2782311 60.5621972,12 50,12 C39.3741437,12 33.144814,13.3973866 23.3395101,17.0633242 C23.1688625,17.1271247 21.9338538,17.5899633 21.5732596,17.7245028 C19.0984715,18.6478581 16.912678,19.3994574 14.8494171,20 L21.1841339,20 L21.1841339,20 Z M21.1841339,0 C13.2575214,2.89194861 8.07672845,4 7.87150385e-14,4 L7.81597009e-14,4 L0,2 C5.74391753,2 9.9514017,1.4256397 14.8494171,1.40165657e-15 L21.1841339,6.9388939e-17 L21.1841339,0 Z M77.3787841,2.21705987e-12 C85.238555,2.9664329 90.5022896,4 100,4 L100,2 C93.1577329,2 88.6144135,1.4578092 83.604005,1.04805054e-13 L77.3787841,0 L77.3787841,2.21705987e-12 Z M7.87150385e-14,14 C8.44050043,14 13.7183277,12.7898887 22.272392,9.59832609 C22.6346445,9.46316794 23.8705367,8.99999822 24.0399055,8.9366758 C33.6397477,5.34755477 39.6469349,4 50,4 C60.2711361,4 65.3618399,5.2217689 74.6286093,8.92847669 C84.1118399,12.7217689 89.4378028,14 100,14 L100,12 C89.7288639,12 84.6381601,10.7782311 75.3713907,7.07152331 C65.8881601,3.2782311 60.5621972,2 50,2 C39.3741437,2 33.144814,3.39738661 23.3395101,7.0633242 C23.1688625,7.12712472 21.9338538,7.58996334 21.5732596,7.72450279 C13.2235239,10.8398294 8.16350991,12 0,12 L7.81597009e-14,14 L7.87150385e-14,14 L7.87150385e-14,14 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_cloud(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["c"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["c"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["c"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 56,28

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    //add.rect(w,h).fill("#fff");
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_parkay(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["p"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["p"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["p"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 40,40

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M20,20.5 L20,18 L0,18 L0,16 L20,16 L20,14 L0,14 L0,12 L20,12 L20,10 L0,10 L0,8 L20,8 L20,6 L0,6 L0,4 L20,4 L20,2 L0,2 L0,0 L20.5,0 L22,0 L22,20 L24,20 L24,0 L26,0 L26,20 L28,20 L28,0 L30,0 L30,20 L32,20 L32,0 L34,0 L34,20 L36,20 L36,0 L38,0 L38,20 L40,20 L40,22 L20,22 L20,20.5 L20,20.5 Z M0,20 L2,20 L2,40 L0,40 L0,20 L0,20 Z M4,20 L6,20 L6,40 L4,40 L4,20 L4,20 Z M8,20 L10,20 L10,40 L8,40 L8,20 L8,20 Z M12,20 L14,20 L14,40 L12,40 L12,20 L12,20 Z M16,20 L18,20 L18,40 L16,40 L16,20 L16,20 Z M20,24 L40,24 L40,26 L20,26 L20,24 L20,24 Z M20,28 L40,28 L40,30 L20,30 L20,28 L20,28 Z M20,32 L40,32 L40,34 L20,34 L20,32 L20,32 Z M20,36 L40,36 L40,38 L20,38 L20,36 L20,36 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_groovy(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["?"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["?"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["?"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 24,40

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M0,40 C5.5228475,40 10,35.5228475 10,30 L10,20 L10,0 C4.4771525,0 0,4.4771525 0,10 L0,20 L0,40 Z M22,40 C16.4771525,40 12,35.5228475 12,30 L12,20 L12,0 C17.5228475,0 22,4.4771525 22,10 L22,20 L22,40 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_curtain(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["#"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["#"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["#"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 44,12

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M20,12 L20,10 L0,0 L0,10 L4,12 L20,12 L20,12 Z M38,12 L42,10 L42,0 L22,10 L22,12 L38,12 Z M20,0 L20,8 L4,1.77635684e-15 L20,0 L20,0 Z M38,8.8817842e-16 L22,8 L22,0 L38,5.55111512e-16 L38,8.8817842e-16 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_aztec(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["X"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["X"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["X"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 32,64

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M0,28 L20,28 L20,16 L16,16 L16,24 L4,24 L4,4 L32,4 L32,32 L28,32 L28,8 L8,8 L8,20 L12,20 L12,12 L24,12 L24,32 L0,32 L0,28 Z M12,36 L32,36 L32,40 L16,40 L16,64 L0,64 L0,60 L12,60 L12,36 Z M28,48 L24,48 L24,60 L32,60 L32,64 L20,64 L20,44 L32,44 L32,56 L28,56 L28,48 Z M0,36 L8,36 L8,56 L0,56 L0,52 L4,52 L4,40 L0,40 L0,36 Z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_temple(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["T"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["T"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["T"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // fill rule is evenodd, don't know how to coerce svg.js to do it

  // w/h 152,152

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    let _p = add.path("M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z");
    _p.attr('fill-rule', 'evenodd');

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}




// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_food(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["F"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["F"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["F"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 260,260

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    let p_list = [];

    p_list.push( add.path("M24.37 16c.2.65.39 1.32.54 2H21.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06A5 5 0 0 1-17.45 28v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H-20a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1L.9 19.22a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0L2.26 23h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM-13.82 27l16.37 4.91L18.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H-13.1z") );
    p_list.push( add.path("M284.37 16c.2.65.39 1.32.54 2H281.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06a5 5 0 0 1-2.24-8.94v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H240a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM246.18 27l16.37 4.91L278.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H246.9z") );
    p_list.push( add.path("M159.5 21.02A9 9 0 0 0 151 15h-42a9 9 0 0 0-8.5 6.02 6 6 0 0 0 .02 11.96A8.99 8.99 0 0 0 109 45h42a9 9 0 0 0 8.48-12.02 6 6 0 0 0 .02-11.96zM151 17h-42a7 7 0 0 0-6.33 4h54.66a7 7 0 0 0-6.33-4zm-9.34 26a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-7a7 7 0 1 1 0-14h42a7 7 0 1 1 0 14h-9.34zM109 27a9 9 0 0 0-7.48 4H101a4 4 0 1 1 0-8h58a4 4 0 0 1 0 8h-.52a9 9 0 0 0-7.48-4h-42z") );
    p_list.push( add.path("M39 115a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6-8a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-3-29v-2h8v-6H40a4 4 0 0 0-4 4v10H22l-1.33 4-.67 2h2.19L26 130h26l3.81-40H58l-.67-2L56 84H42v-6zm-4-4v10h2V74h8v-2h-8a2 2 0 0 0-2 2zm2 12h14.56l.67 2H22.77l.67-2H40zm13.8 4H24.2l3.62 38h22.36l3.62-38z") );
    p_list.push( add.path("M129 92h-6v4h-6v4h-6v14h-3l.24 2 3.76 32h36l3.76-32 .24-2h-3v-14h-6v-4h-6v-4h-8zm18 22v-12h-4v4h3v8h1zm-3 0v-6h-4v6h4zm-6 6v-16h-4v19.17c1.6-.7 2.97-1.8 4-3.17zm-6 3.8V100h-4v23.8a10.04 10.04 0 0 0 4 0zm-6-.63V104h-4v16a10.04 10.04 0 0 0 4 3.17zm-6-9.17v-6h-4v6h4zm-6 0v-8h3v-4h-4v12h1zm27-12v-4h-4v4h3v4h1v-4zm-6 0v-8h-4v4h3v4h1zm-6-4v-4h-4v8h1v-4h3zm-6 4v-4h-4v8h1v-4h3zm7 24a12 12 0 0 0 11.83-10h7.92l-3.53 30h-32.44l-3.53-30h7.92A12 12 0 0 0 130 126z") );
    p_list.push( add.path("M212 86v2h-4v-2h4zm4 0h-2v2h2v-2zm-20 0v.1a5 5 0 0 0-.56 9.65l.06.25 1.12 4.48a2 2 0 0 0 1.94 1.52h.01l7.02 24.55a2 2 0 0 0 1.92 1.45h4.98a2 2 0 0 0 1.92-1.45l7.02-24.55a2 2 0 0 0 1.95-1.52L224.5 96l.06-.25a5 5 0 0 0-.56-9.65V86a14 14 0 0 0-28 0zm4 0h6v2h-9a3 3 0 1 0 0 6H223a3 3 0 1 0 0-6H220v-2h2a12 12 0 1 0-24 0h2zm-1.44 14l-1-4h24.88l-1 4h-22.88zm8.95 26l-6.86-24h18.7l-6.86 24h-4.98zM150 242a22 22 0 1 0 0-44 22 22 0 0 0 0 44zm24-22a24 24 0 1 1-48 0 24 24 0 0 1 48 0zm-28.38 17.73l2.04-.87a6 6 0 0 1 4.68 0l2.04.87a2 2 0 0 0 2.5-.82l1.14-1.9a6 6 0 0 1 3.79-2.75l2.15-.5a2 2 0 0 0 1.54-2.12l-.19-2.2a6 6 0 0 1 1.45-4.46l1.45-1.67a2 2 0 0 0 0-2.62l-1.45-1.67a6 6 0 0 1-1.45-4.46l.2-2.2a2 2 0 0 0-1.55-2.13l-2.15-.5a6 6 0 0 1-3.8-2.75l-1.13-1.9a2 2 0 0 0-2.5-.8l-2.04.86a6 6 0 0 1-4.68 0l-2.04-.87a2 2 0 0 0-2.5.82l-1.14 1.9a6 6 0 0 1-3.79 2.75l-2.15.5a2 2 0 0 0-1.54 2.12l.19 2.2a6 6 0 0 1-1.45 4.46l-1.45 1.67a2 2 0 0 0 0 2.62l1.45 1.67a6 6 0 0 1 1.45 4.46l-.2 2.2a2 2 0 0 0 1.55 2.13l2.15.5a6 6 0 0 1 3.8 2.75l1.13 1.9a2 2 0 0 0 2.5.8zm2.82.97a4 4 0 0 1 3.12 0l2.04.87a4 4 0 0 0 4.99-1.62l1.14-1.9a4 4 0 0 1 2.53-1.84l2.15-.5a4 4 0 0 0 3.09-4.24l-.2-2.2a4 4 0 0 1 .97-2.98l1.45-1.67a4 4 0 0 0 0-5.24l-1.45-1.67a4 4 0 0 1-.97-2.97l.2-2.2a4 4 0 0 0-3.09-4.25l-2.15-.5a4 4 0 0 1-2.53-1.84l-1.14-1.9a4 4 0 0 0-5-1.62l-2.03.87a4 4 0 0 1-3.12 0l-2.04-.87a4 4 0 0 0-4.99 1.62l-1.14 1.9a4 4 0 0 1-2.53 1.84l-2.15.5a4 4 0 0 0-3.09 4.24l.2 2.2a4 4 0 0 1-.97 2.98l-1.45 1.67a4 4 0 0 0 0 5.24l1.45 1.67a4 4 0 0 1 .97 2.97l-.2 2.2a4 4 0 0 0 3.09 4.25l2.15.5a4 4 0 0 1 2.53 1.84l1.14 1.9a4 4 0 0 0 5 1.62l2.03-.87zM152 207a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6 2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-11 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-8 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-5-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-24 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm16 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm7-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zm86-29a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1 246 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM275 214a29 29 0 0 0-57.97 0h57.96zM72.33 198.12c-.21-.32-.34-.7-.34-1.12v-12h-2v12a4.01 4.01 0 0 0 7.09 2.54c.57-.69.91-1.57.91-2.54v-12h-2v12a1.99 1.99 0 0 1-2 2 2 2 0 0 1-1.66-.88zM75 176c.38 0 .74-.04 1.1-.12a4 4 0 0 0 6.19 2.4A13.94 13.94 0 0 1 84 185v24a6 6 0 0 1-6 6h-3v9a5 5 0 1 1-10 0v-9h-3a6 6 0 0 1-6-6v-24a14 14 0 0 1 14-14 5 5 0 0 0 5 5zm-17 15v12a1.99 1.99 0 0 0 1.22 1.84 2 2 0 0 0 2.44-.72c.21-.32.34-.7.34-1.12v-12h2v12a3.98 3.98 0 0 1-5.35 3.77 3.98 3.98 0 0 1-.65-.3V209a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-24c.01-1.53-.23-2.88-.72-4.17-.43.1-.87.16-1.28.17a6 6 0 0 1-5.2-3 7 7 0 0 1-6.47-4.88A12 12 0 0 0 58 185v6zm9 24v9a3 3 0 1 0 6 0v-9h-6z") );
    p_list.push( add.path("M-17 191a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2H4zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1-14 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM15 214a29 29 0 0 0-57.97 0h57.96z") );

    for (let i=0; i<p_list.length; i++) {
      p_list[i].attr('fill-rule', 'evenodd');
    }

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}


// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_nomoon(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["@"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["@"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["@"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 80,105

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_autumn(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["A"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["A"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["A"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 88,24

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    add.path("M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z");

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_moroccan(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["m"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["m"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["m"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 80,88

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    let _p = add.path("M22,21.910316 L22,26 L19.9989006,26 C10.0613799,26 2,34.0588745 2,44 C2,53.9433113 10.0583823,62 19.9989006,62 L22,62 L22,66.0897789 C30.0119364,66.8120156 36.7852126,71.8280516 39.9995613,78.820232 C43.2123852,71.8285229 49.9832383,66.8116352 58,66.089684 L58,62 L60.0010994,62 C69.9386201,62 78,53.9411255 78,44 C78,34.0566887 69.9416177,26 60.0010994,26 L58,26 L58,21.9102211 C49.9880636,21.1879844 43.2147874,16.1719484 40.0004387,9.17976804 C36.7876148,16.1714771 30.0167617,21.1883648 22,21.910316 L22,21.910316 Z M54,58 L54,62.6957274 C48.4256128,64.0124934 43.5445087,67.1235896 40,71.385704 C36.4554913,67.1235896 31.5743872,64.0124934 26,62.6957274 L26,58 L20.0071931,58 C12.2712339,58 6,51.7336865 6,44 C6,36.2680135 12.2753906,30 20.0071931,30 L26,30 L26,25.3042726 C31.5743872,23.9875066 36.4554913,20.8764104 40,16.614296 C43.5445087,20.8764104 48.4256128,23.9875066 54,25.3042726 L54,30 L59.9928069,30 C67.7287661,30 74,36.2663135 74,44 C74,51.7319865 67.7246094,58 59.9928069,58 L54,58 L54,58 Z M42,88 C42,78.0588745 50.0613799,70 59.9989006,70 L62,70 L62,65.910316 L62,65.910316 C70.0163968,65.1883977 76.7869984,60.1719338 80,53.1807228 L80,60.614296 C76.4554913,64.8764104 71.5743872,67.9875066 66,69.3042726 L66,74 L60.0071931,74 C52.2753906,74 46,80.2680135 46,88 L42,88 Z M38,88 C38,78.0566887 29.9416177,70 20.0010994,70 L18,70 L18,65.9102211 C9.98806359,65.1879844 3.21478738,60.1719484 0.000438743025,53.179768 L0,60.614296 C3.54450873,64.8764104 8.42561275,67.9875066 14,69.3042726 L14,74 L19.9928069,74 C27.7287661,74 34,80.2663135 34,88 L38,88 Z M42,7.10542736e-15 C42,9.94331128 50.0583823,18 59.9989006,18 L62,18 L62,22.0897789 C70.0119364,22.8120156 76.7852126,27.8280516 79.9995613,34.820232 L80,27.385704 C76.4554913,23.1235896 71.5743872,20.0124934 66,18.6957274 L66,14 L60.0071931,14 C52.2712339,14 46,7.73368655 46,1.42108547e-14 L42,1.42108547e-14 L42,7.10542736e-15 Z M-2.27373675e-13,34.8192772 C3.21300164,27.8280662 9.98360316,22.8116023 18,22.089684 L18,18 L20.0010994,18 C29.9386201,18 38,9.9411255 38,7.10542736e-15 L34,7.10542736e-15 C34,7.7319865 27.7246094,14 19.9928069,14 L14,14 L14,14 L14,18.6957274 C8.42561275,20.0124934 3.54450873,23.1235896 8.31903435e-11,27.385704 L2.84217094e-14,34.8192772 L-2.27373675e-13,34.8192772 Z");
    _p.attr('fill-rule', 'evenodd');

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// cc-by Steve Schoger (https://heropatterns.com/)
//
function pat_rounded(dx,dy, w,h, s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["R"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["R"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["R"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);

  // w/h 84,84

  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.fill( g_data.FG[mt_idx] );

    let _p = add.path("M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z");
    _p.attr('fill-rule', 'evenodd');

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}



// offset circle
//
function pat_zigzag0(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["z"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["z"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["z"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    //add.fill( g_data.FG[mt_idx] );

    add.line(  0,   0, w/2,  h/2).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(w/2, h/2,   w,    0).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});

    add.line(  0,     h,  w/2, 3*h/2).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(w/2, 3*h/2,    w,     h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// offset circle
//
function pat_zigzag1(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["Z"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["Z"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["Z"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);

    add.line(0,0,w/2,h/2).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(w/2,h/2,0,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});

    add.line(w,0,3*h/2,h/2).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(3*w/2,h/2,w,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});

  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// grid, axis aligned
//
function pat_grid0(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["|"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["|"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["|"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.line(w/2,0,w/2,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(0,h/2,w,h/2).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// gird, cross pattern
//
function pat_grid1(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["x"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["x"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["x"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.line(0,0, w,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
    add.line(w,0,0,h).stroke({"color":g_data.FG[mt_idx], "linecap":"square", "width":lw});
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// houndstooth
//
//----
//
// Copyright (C) 2014-07-19 Kevin L. Durette
// This work is licensed under a Creative Commons Attribution 4.0 International License.
//
function pat_houndstooth(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["x"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["x"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["x"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.polygon("0,0, 20,0, 40,20, 30,20, 20,10, 20,20, 10,20, 20,30, 20,40, 0,20, 0,0").fill(g_data.FG[mt_idx]).stroke({"width": 0});
    add.polygon("40,0, 40,10, 30,0, 40, 0").fill(g_data.FG[mt_idx]).stroke({"width":0});
    add.polygon("0,40, 10,40, 0,30, 0, 40").fill(g_data.FG[mt_idx]).stroke({"width":0});
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}
//
//----

// strip
//
function pat_stripe0(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["S"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["S"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["S"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.rect(w,h/2).fill(g_data.FG[mt_idx]);
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}

// strip
//
function pat_stripe1(dx,dy,w,h,s,lw, mt_idx) {
  w = ((typeof w === "undefined") ? g_data.default_pattern_period["s"][0] : w );
  h = ((typeof h === "undefined") ? g_data.default_pattern_period["s"][1] : h );
  s = ((typeof s === "undefined") ? g_data.default_pattern_period["s"][2] : s );
  lw = ((typeof lw === "undefined") ? 1 : lw);
  let draw = g_data.svg_draw;
  var p = draw.pattern(w, h, function(add) {
    add.rect(w,h).fill(g_data.BG[mt_idx]);
    add.rect(w/2,h).fill(g_data.FG[mt_idx]);
  });
  p.scale(s);
  p.translate(dx,dy);

  document.getElementById("pattern_defs").appendChild( p.node );
  g_data.svg_pattern.push( [p.node, mt_idx] );

  return p.url();;
}



function grid_r(ctx, x,y, r, lvl, opt) {
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
  if      (p < prob_prof[0]) { }

  // subdivide
  //
  else if (p < prob_prof[1]) {
    for (let i=0; i<4; i++) {
      grid_r(ctx, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
    }
  }

  // display tile
  //
  else {
    ctx.g.push( [x,y,r,irnd(pat_a.length),lvl] );
    if (p < prob_prof[2]) {
      for (let i=0; i<4; i++) {
        grid_r(ctx, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
      }
    }
  }

  return ctx;
}

function _clone_a(a) {
  let b = [];
  for (let i=0; i<a.length; i++) {
    b.push(a[i]);
  }
  return b;
}

// transform p quadrent array by transform
//
// 2 3
// 1 0
//
function p_transform(sym_code, p) {
  let u = [];

  let T = {
    'i'  : [0,1,2,3],
    '='  : [0,1,2,3],
    'H'  : [0,1,2,3],
    '#'  : [0,1,2,3],

    '|'  : [1,0,3,2],
    '-'  : [3,2,1,0],
    '\\' : [0,3,2,1],
    '/'  : [2,1,0,3],

    'r0' : [0,1,2,3],
    'r1' : [1,2,3,0],
    'r2' : [2,3,0,1],
    'r3' : [3,0,1,2]
  };

  let Ta = T[sym_code];

  for (let i=0; i<p.length; i++) {
    u.push( Ta[p[i]] );
  }
  return u;
}

function p2xy(cx,cy,p, R) {
  let dxy = [
    [ 1, -1],
    [-1, -1],
    [-1,  1],
    [ 1,  1]
  ];

  let r = R;
  let r2 = r/2;

  let xy = [cx,cy];

  for (let i=0; i<p.length; i++) {

    xy[0] += r*dxy[ p[i] ][0];
    xy[1] += r*dxy[ p[i] ][1];

    r = r2;
    r2 /= 2;

  }

  return xy;
}

function grid_sym_r(ctx, x,y, r, lvl, opt) {
  let max_lvl = opt.max_level;
  let prob_prof = opt.prob_profile;

  //DEBUG
  //if (lvl >= 3) { return; }

  if (lvl >= max_lvl) { return; }
  let two = g_data.two;

  let lvl_parity = lvl%2;

  let r2 = r/2;

  // 2 3
  // 1 0
  //
  let dxy = [
    [ r2, -r2 ],
    [-r2, -r2 ],
    [-r2,  r2 ],
    [ r2,  r2 ]
  ];

  let n = prob_prof.length;
  let pat_a = opt.pattern_choice;

  if (lvl==0) { 
    console.log(">>>", opt.symmetry);
  }

  if ((lvl == 0) && (opt.symmetry != 'i')) {

    let symmetry_map = {};

    let sym_lib = opt.symmetry_lib[ opt.symmetry ];

    for (let i=0; i<sym_lib.length; i++) {
      symmetry_map[ sym_lib[i][0] ] = sym_lib[i][1];
    }

    let sym_map_all = {};
    for (let sym_code in opt.symmetry_lib) {
      sym_map_all[ sym_code ] = {};
      let _lib = opt.symmetry_lib[ sym_code ];
      for (let i=0; i<_lib.length; i++) {
        sym_map_all[ sym_code ][ _lib[i][0] ] = _lib[i][1];
      }
    }

    if (opt.symmetry == '=') {

      ctx.p.push(1);
      grid_sym_r(ctx, x + dxy[1][0], y + dxy[1][1], r/2, lvl+1, opt);
      ctx.p.pop();

      ctx.p.push(2);
      grid_sym_r(ctx, x + dxy[2][0], y + dxy[2][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let n = ctx.g.length;
      for (let i=0; i<n; i++) {
        let u_g = _clone_a( ctx.g[i] );
        let u_g_p = _clone_a( ctx.g_p[i] );
        if      (u_g_p[0] == 1) { u_g[0] += r; u_g_p[0] = 0; }
        else if (u_g_p[0] == 2) { u_g[0] += r; u_g_p[0] = 3; }
        ctx.g.push(u_g);
        ctx.p.push(u_g_p);
      }
    }

    else if (opt.symmetry == 'H') {

      ctx.p.push(0);
      grid_sym_r(ctx, x + dxy[0][0], y + dxy[0][1], r/2, lvl+1, opt);
      ctx.p.pop();

      ctx.p.push(1);
      grid_sym_r(ctx, x + dxy[1][0], y + dxy[1][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let n = ctx.g.length;
      for (let i=0; i<n; i++) {
        let u_g = _clone_a( ctx.g[i] );
        let u_g_p = _clone_a( ctx.g_p[i] );
        if      (u_g_p[0] == 0) { u_g[1] += r; u_g_p[0] = 3; }
        else if (u_g_p[0] == 1) { u_g[1] += r; u_g_p[0] = 2; }
        ctx.g.push(u_g);
        ctx.p.push(u_g_p);
      }

    }

    else if (opt.symmetry == '#') {

      ctx.p.push(0);
      grid_sym_r(ctx, x + dxy[0][0], y + dxy[0][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let tdxy = [ [0,0], [-r,0], [-r,r], [0,r] ];
      let n = ctx.g.length;
      for (let i=0; i<n; i++) {

        for (let ridx=1; ridx<4; ridx++) {
          let u_g = _clone_a( ctx.g[i] );
          let u_g_p = _clone_a( ctx.g_p[i] );
          u_g_p[0] = ridx;
          u_g[0] += tdxy[ridx][0];
          u_g[1] += tdxy[ridx][1];
          ctx.g.push(u_g);
          ctx.p.push(u_g_p);
        }

      }

    }

    else if (opt.symmetry == '|') {

      ctx.p.push(1);
      grid_sym_r(ctx, x + dxy[1][0], y + dxy[1][1], r/2, lvl+1, opt);
      ctx.p.pop();

      ctx.p.push(2);
      grid_sym_r(ctx, x + dxy[2][0], y + dxy[2][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let n = ctx.g.length;
      for (let i=0; i<n; i++) {

        let u_g_p = p_transform( opt.symmetry, ctx.g_p[i] );
        let u_g   = _clone_a( ctx.g[i] );
        let xy = p2xy( x,y, u_g_p, r/2 );
        u_g[0] = xy[0];
        u_g[1] = xy[1];

        u_g[3] = symmetry_map[ ctx.g[i][3]  ];

        ctx.g.push(u_g);
        ctx.p.push(u_g_p);
      }

    }

    else if (opt.symmetry == '-') {

      ctx.p.push(0);
      grid_sym_r(ctx, x + dxy[0][0], y + dxy[0][1], r/2, lvl+1, opt);
      ctx.p.pop();

      ctx.p.push(1);
      grid_sym_r(ctx, x + dxy[1][0], y + dxy[1][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let n = ctx.g.length;
      for (let i=0; i<n; i++) {

        let u_g_p = p_transform( opt.symmetry, ctx.g_p[i] );
        let u_g   = _clone_a( ctx.g[i] );
        let xy = p2xy( x,y, u_g_p, r/2 );
        u_g[0] = xy[0];
        u_g[1] = xy[1];

        u_g[3] = symmetry_map[ ctx.g[i][3]  ];

        ctx.g.push(u_g);
        ctx.p.push(u_g_p);
      }

    }

    else if (opt.symmetry == 'r0') {

      ctx.p.push(0);
      grid_sym_r(ctx, x + dxy[0][0], y + dxy[0][1], r/2, lvl+1, opt);
      ctx.p.pop();

      let n = ctx.g.length;
      for (let i=0; i<n; i++) {

        for (let ridx=1; ridx<4; ridx++) {
          let sym_code = 'r0';

          if      (ridx == 1) { sym_code = '|'; }
          else if (ridx == 2) { sym_code = 'r2'; }
          else if (ridx == 3) { sym_code = '-'; }

          let u_g_p = p_transform( sym_code, ctx.g_p[i] );
          let u_g   = _clone_a( ctx.g[i] );

          let xy = p2xy( x,y, u_g_p, r/2 );
          u_g[0] = xy[0];
          u_g[1] = xy[1];

          u_g[3] = sym_map_all[ sym_code ][ ctx.g[i][3] ];

          ctx.g.push(u_g);
          ctx.p.push(u_g_p);
        }

      }

    }

    return ctx;
  }

  let p = drand();
  if (lvl == 0) { p = drand(prob_prof[0], prob_prof[n-2]);  }

  // terminate
  //
  if      (p < prob_prof[0]) { }

  // subdivide
  //
  else if (p < prob_prof[1]) {
    for (let i=0; i<4; i++) {
      ctx.p.push(i);
      grid_sym_r(ctx, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
      ctx.p.pop();
    }
  }

  // display tile
  //
  else {
    ctx.g_p.push( _clone_a(ctx.p) );
    ctx.g.push( [x,y,r,irnd(pat_a.length),lvl] );
    if (p < prob_prof[2]) {
      for (let i=0; i<4; i++) {
        ctx.p.push(i);
        grid_sym_r(ctx, x + dxy[i][0], y + dxy[i][1], r/2, lvl+1, opt);
        ctx.p.pop();
      }
    }
  }

  return ctx;
}


function multiscale_truchet_pattern(xy,r,pat_idx, lvl, _f_pat0, _f_pat1) {
  let two = g_data.two;

  let lvl2 = lvl%2;

  let pattern_period = g_data.pattern_period;
  let pp0x = pattern_period[lvl2][0],
      pp0y = pattern_period[lvl2][1],
      pp0s = pattern_period[lvl2][2],
      pp1x = pattern_period[1-lvl2][0],
      pp1y = pattern_period[1-lvl2][1],
      pp1s = pattern_period[1-lvl2][2];

  pp0x *= pp0s;
  pp0y *= pp0s;

  pp1x *= pp1s;
  pp1y *= pp1s;

  let f_pat0 = (lvl2 ? _f_pat1 : _f_pat0);
  let f_pat1 = (lvl2 ? _f_pat0 : _f_pat1);

  let r_1_3 = r/3;
  let r_2_3 = 2*r/3;

  let d = 2*r;
  let d_1_3 = 1*d / 3;
  let d_2_3 = 2*d / 3;

  let _tol = [];

  let fudge = -0.5;

  // background square
  //
  /*
  let sbg = two.makeRectangle( xy[0], xy[1], d+fudge, d+fudge );
  sbg.fill = "rgb(255,255,255)";
  sbg.stroke = "rgb(255,255,255)";
  sbg.linewidth = 1;
  */

  //_tol.push(sbg);

  let s = two.makeRectangle( xy[0], xy[1], d, d );
  s.fill = f_pat0( -qrem(xy[0], pp0x), -qrem(xy[1], pp0y) );
  s.stroke = f_pat0( -qrem(xy[0], pp0x), -qrem(xy[1], pp0y) );
  s.linewidth = 1;

  _tol.push(s);

  // inner tube \
  //
  if (pat_idx == 0) {
    /*
    let a0bg = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, Math.PI );
    a0bg.stroke = "rgb(255,255,255)";
    a0bg.fill = "rgb(255,255,255)";
    a0bg.linewidth = 1;
    let a2bg = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3+fudge, 0, -Math.PI/2 );
    a2bg.stroke = "rgb(255,255,255)";
    a2bg.fill = "rgb(255,255,255)";
    a2bg.linewidth = 1;
    */

    let a0 = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3, Math.PI/2, Math.PI );
    a0.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.linewidth = 1;

    let a2 = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3, 0, -Math.PI/2 );
    a2.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.linewidth = 1;

    //_tol.push(a0bg,a2bg,a0,a2);
    _tol.push(a0,a2);
  }

  // inner tube /
  //
  else if (pat_idx == 1) {
    /*
    let a0bg = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, 0 );
    a0bg.stroke = "rgb(255,255,255)";
    a0bg.fill = "rgb(255,255,255)";
    a0bg.linewidth = 1;
    let a2bg = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3+fudge, -Math.PI, -Math.PI/2 );
    a2bg.stroke = "rgb(255,255,255)";
    a2bg.fill = "rgb(255,255,255)";
    a2bg.linewidth = 1;
    */

    let a0 = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3, Math.PI/2, 0 );
    a0.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.linewidth = 1;

    let a2 = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3, -Math.PI, -Math.PI/2 );
    a2.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.linewidth = 1;

    //_tol.push(a0bg,a2bg,a0,a2);
    _tol.push(a0,a2);
  }

  // inner tube /
  //
  else if (pat_idx == 2) {
    /*
    let a0bg = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, 0 );
    a0bg.stroke = "rgb(255,255,255)";
    a0bg.fill = "rgb(255,255,255)";
    a0bg.linewidth = 1;
    */

    let a0 = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3, Math.PI/2, 0 );
    a0.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.linewidth = 1;

    //_tol.push(a0bg,a0);
    _tol.push(a0);
  }

  else if (pat_idx == 3) {
    /*
    let a2bg = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3+fudge, -Math.PI, -Math.PI/2 );
    a2bg.stroke = "rgb(255,255,255)";
    a2bg.fill = "rgb(255,255,255)";
    a2bg.linewidth = 1;
    */

    let a2 = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3, -Math.PI, -Math.PI/2 );
    a2.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.linewidth = 1;

    //_tol.push(a2bg,a2);
    _tol.push(a2);
  }

  if (pat_idx == 4) {
    /*
    let a0bg = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, Math.PI );
    a0bg.stroke = "rgb(255,255,255)";
    a0bg.fill = "rgb(255,255,255)";
    a0bg.linewidth = 1;
    */

    let a0 = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3, Math.PI/2, Math.PI );
    a0.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.linewidth = 1;

    //_tol.push(a0bg,a0);
    _tol.push(a0);
  }

  else if (pat_idx == 5) {
    /*
    let a2bg = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3+fudge, 0, -Math.PI/2 );
    a2bg.stroke = "rgb(255,255,255)";
    a2bg.fill = "rgb(255,255,255)";
    a2bg.linewidth = 1;
    */

    let a2 = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3, 0, -Math.PI/2 );
    a2.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.linewidth = 1;

    //_tol.push(a2bg,a2);
    _tol.push(a2);
  }


  // fat cross
  //
  else if (pat_idx == 6) {
    /*
    let _fcbg = two.makeRectangle( xy[0], xy[1], d+fudge, d+fudge );
    _fcbg.fill = "rgb(255,255,255)";
    _fcbg.stroke = "rgb(255,255,255)";
    _fcbg.linewidth = 1;
    */

    let _fc = two.makeRectangle( xy[0], xy[1], d, d );
    _fc.fill = f_pat0( -qrem(xy[0], pp0x), -qrem(xy[1], pp0y) );
    _fc.stroke = f_pat0( -qrem(xy[0], pp0x), -qrem(xy[1], pp0y) );
    _fc.linewidth = 1;

    /*
    let a0bg = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, Math.PI );
    a0bg.stroke = "rgb(255,255,255)";
    a0bg.fill = "rgb(255,255,255)";
    a0bg.linewidth = 1;
    */

    let a0 = two.makeArcSegment( xy[0] + r, xy[1] - r, 0, d_2_3, Math.PI/2, Math.PI );
    a0.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]-r, pp1y) );
    a0.linewidth = 1;

    /*
    let a2bg = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3+fudge, 0, -Math.PI/2 );
    a2bg.stroke = "rgb(255,255,255)";
    a2bg.fill = "rgb(255,255,255)";
    a2bg.linewidth = 1;
    */

    let a2 = two.makeArcSegment( xy[0] - r, xy[1] + r, 0, d_2_3, 0, -Math.PI/2 );
    a2.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]+r, pp1y) );
    a2.linewidth = 1;


    /*
    let a1bg = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3+fudge, Math.PI/2, 0 );
    a1bg.stroke = "rgb(255,255,255)";
    a1bg.fill = "rgb(255,255,255)";
    a1bg.linewidth = 1;
    let a3bg = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3+fudge, -Math.PI, -Math.PI/2 );
    a3bg.stroke = "rgb(255,255,255)";
    a3bg.fill = "rgb(255,255,255)";
    a3bg.linewidth = 1;
    */

    let a1 = two.makeArcSegment( xy[0] - r, xy[1] - r, 0, d_2_3, Math.PI/2, 0 );
    a1.stroke = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a1.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1]-r, pp1y) );
    a1.linewidth = 1;

    let a3 = two.makeArcSegment( xy[0] + r, xy[1] + r, 0, d_2_3, -Math.PI, -Math.PI/2 );
    a3.stroke = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a3.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1]+r, pp1y) );
    a3.linewidth = 1;

    /*
    let srbg = two.makeRectangle( xy[0], xy[1], r_1_3, r_1_3 );
    srbg.stroke = "rgb(255,255,255)";
    srbg.fill = "rgb(255,255,255)";
    srbg.linewidth = 1;
    */

    let sr = two.makeRectangle( xy[0], xy[1], r_1_3, r_1_3 );
    sr.stroke = f_pat1( -qrem(xy[0], pp1x), -qrem(xy[1], pp1y) );
    sr.fill = f_pat1( -qrem(xy[0], pp1x), -qrem(xy[1], pp1y) );
    sr.linewidth = 1;


    //_tol.push(_fcbg,_fc, a0bg, a0, a1bg, a1, a2bg, a2, a3bg, a3, srbg, sr);
    _tol.push(_fc, a0, a1, a2, a3, sr);
  }

  else { }


  // tube ends
  //

  /*
  let e0bg = two.makeCircle(xy[0] + r, xy[1], r_1_3+fudge );
  e0bg.noStroke();
  e0bg.fill = "rgb(255,255,255)";
  e0bg.linewidth = 1;
  let e1bg = two.makeCircle(xy[0], xy[1] - r, r_1_3+fudge );
  e1bg.noStroke();
  e1bg.fill = "rgb(255,255,255)";
  e1bg.linewidth = 1;
  let e2bg = two.makeCircle(xy[0] - r, xy[1], r_1_3+fudge );
  e2bg.noStroke();
  e2bg.fill = "rgb(255,255,255)";
  e2bg.linewidth = 1;
  let e3bg = two.makeCircle(xy[0], xy[1] + r, r_1_3+fudge );
  e3bg.noStroke();
  e3bg.fill = "rgb(255,255,255)";
  e3bg.linewidth = 1;
  */


  let e0 = two.makeCircle(xy[0] + r, xy[1], r_1_3 );
  e0.noStroke();
  e0.fill = f_pat1( -qrem(xy[0]+r, pp1x), -qrem(xy[1], pp1y) );
  e0.linewidth = 1;

  let e1 = two.makeCircle(xy[0], xy[1] - r, r_1_3 );
  e1.noStroke();
  e1.fill = f_pat1( -qrem(xy[0], pp1x), -qrem(xy[1]-r, pp1y) );
  e1.linewidth = 1;

  let e2 = two.makeCircle(xy[0] - r, xy[1], r_1_3 );
  e2.noStroke();
  e2.fill = f_pat1( -qrem(xy[0]-r, pp1x), -qrem(xy[1], pp1y) );
  e2.linewidth = 1;

  let e3 = two.makeCircle(xy[0], xy[1] + r, r_1_3 );
  e3.noStroke();
  e3.fill = f_pat1( -qrem(xy[0], pp1x), -qrem(xy[1]+r, pp1y) );
  e3.linewidth = 1;

  //_tol.push(e0bg,e1bg,e2bg,e3bg,e0,e1,e2,e3);
  _tol.push(e0,e1,e2,e3);

  //wings
  //

  /*
  let w0bg = two.makeCircle( xy[0] + r, xy[1] - r, d_1_3+fudge );
  w0bg.noStroke();
  w0bg.fill = "rgb(255,255,255)";
  w0bg.linewidth=1;
  let w1bg = two.makeCircle( xy[0] - r, xy[1] - r, d_1_3+fudge );
  w1bg.noStroke();
  w1bg.fill = "rgb(255,255,255)";
  w1bg.linewidth=1;
  let w2bg = two.makeCircle( xy[0] - r, xy[1] + r, d_1_3+fudge );
  w2bg.noStroke();
  w2bg.fill = "rgb(255,255,255)";
  w2bg.linewidth=1;
  let w3bg = two.makeCircle( xy[0] + r, xy[1] + r, d_1_3+fudge );
  w3bg.noStroke();
  w3bg.fill = "rgb(255,255,255)";
  w3bg.linewidth=1;
  */

  let w0 = two.makeCircle( xy[0] + r, xy[1] - r, d_1_3 );
  w0.noStroke();
  w0.fill = f_pat0( -qrem(xy[0]+r, pp0x), -qrem(xy[1]-r, pp0y) );
  w0.linewidth = 1;

  let w1 = two.makeCircle( xy[0] - r, xy[1] - r, d_1_3 );
  w1.noStroke();
  w1.fill = f_pat0( -qrem(xy[0]-r, pp0x), -qrem(xy[1]-r, pp0y) );
  w1.linewidth = 1;

  let w2 = two.makeCircle( xy[0] - r, xy[1] + r, d_1_3 );
  w2.noStroke();
  w2.fill = f_pat0( -qrem(xy[0]-r, pp0x), -qrem(xy[1]+r, pp0y) );
  w2.linewidth = 1;

  let w3 = two.makeCircle( xy[0] + r, xy[1] + r, d_1_3 );
  w3.noStroke();
  w3.fill = f_pat0( -qrem(xy[0]+r, pp0x), -qrem(xy[1]+r, pp0y) );
  w3.linewidth = 1;

  //_tol.push(w0bg,w1bg,w2bg,w3bg,w0,w1,w2,w3);
  _tol.push(w0,w1,w2,w3);

  return _tol;
}

function _debug() {
  let two = g_data.two;
  two.clear();

  //var draw = SVG().addTo('body').size(300, 300);
  var draw = SVG().addTo('body');
  g_data["svg_draw"] = draw;

  var pat0 = draw.pattern(20, 20, function(add) {
    add.rect(20,20).fill('#f06')
    add.rect(10,10)
    add.rect(10,10).move(10,10)
  });

  var pat1 = draw.pattern(20, 20, function(add) {
    add.rect(20,20).fill('#06f')
    add.rect(10,10)
    add.rect(10,10).move(10,10)
  });

  let cxy0 = [400,400];
  let cxy1 = [302,307];


  let c0 = two.makeCircle(cxy0[0],cxy0[1], 200);
  c0.fill = "url(#pattern-3)";
  c0.fill = pat0.url();

  let c1 = two.makeCircle(cxy1[0],cxy1[1], 120);
  c1.fill = "url(#pattern-4)";
  c1.fill = pat1.url();

  console.log( qrem(cxy0[0], 20), qrem(cxy0[1], 20));
  console.log( qrem(cxy1[0], 20), qrem(cxy1[1], 20));

  pat0.translate( -qrem(cxy0[0],20), -qrem(cxy0[1],20));
  pat1.translate( -qrem(cxy1[0],20), -qrem(cxy1[1],20));



  g_data["debug"] = {
    "c0": c0,
    "c1": c1,
    "pat0": pat0,
    "pat1": pat1
  };

  two.update();
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

function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(Math.random()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}

function qrem(n, m) {
  let q = Math.floor(n / m);
  return n - (m*q);
}

//--------------------
//               _
//   __ _  ___ _(_)__
//  /  ' \/ _ `/ / _ \
// /_/_/_/\_,_/_/_//_/
//
//--------------------


function web_init() {
  let two = init_twojs();
  g_data["two"] = two;

  var draw = SVG().addTo('body');
  g_data["svg_draw"] = draw;

  let c0 = "rgb(200,200,200)";
  let c1 = "rgb(50,50,50)";

  let pal = [ c0,c1 ];

  pal[0] = "url(#pattern-" + (irnd(41)+1).toString() + ")";
  pal[1] = "url(#pattern-" + (irnd(41)+1).toString() + ")";

  g_data["pal_idx"] = [ pal[2], pal[3] ];
  g_data["pal"]     = [ pal[0], pal[1] ];

  let p_prof = [ 1/32, 0.55, 0.75, 1 ];
  p_prof = [ 1/32, 0.55, 0.68, 1 ];

  let cxy = [400,400];
  let R = 200;
  let max_lvl = 5;

  let all_pat = [0,1,2,3,4,5,6, 7];
  fisher_yates_shuffle(all_pat);
  let _m = irnd(all_pat.length-2);
  for (let i=0; i<_m; i++) { all_pat.pop(); }

  let sym_choice = ['i', '=', 'H', '#', 'r0', '|', '-' ];
  let _sc = sym_choice[ irnd(sym_choice.length) ];

  let opt = {
    "max_level": max_lvl,
    //"pattern_choice": [0,1,2,3,4,5,6],
    //"pattern_choice": [0,1],
    "pattern_choice": all_pat,

    //"symmetry" : "=",
    //"symmetry" : "H",
    //"symmetry" : "|",
    //"symmetry" : "r0",
    "symmetry" : _sc,

    "symmetry_lib": {

      // equal corner, left/right, up/down
      //
      "i"  : [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7] ],
      "#"  : [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7] ],
      "="  : [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7] ],
      "H"  : [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7] ],

      "r0"  : [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7] ],
      "r1"  : [[0,1], [1,0], [2,5], [3,4], [4,2], [5,3], [6,6], [7,7] ],
      "r2"  : [[0,0], [1,1], [2,3], [3,2], [4,5], [5,4], [6,6], [7,7] ],
      "r3"  : [[0,1], [1,0], [2,4], [3,5], [4,3], [5,2], [6,6], [7,7] ],

      // mirror symmetry, left/right, top/down,
      // lower left/upper right, upper left/lower right
      //
      "|"  : [[0,1], [1,0], [2,4], [4,2], [3,5], [5,3], [6,6], [7,7] ],
      "-"  : [[0,1], [1,0], [2,5], [5,2], [3,4], [4,3], [6,6], [7,7] ],
      "\\" : [[0,0], [1,1], [2,2], [3,3], [4,5], [5,4], [6,6], [7,7] ],
      "/"  : [[0,0], [1,1], [2,3], [3,2], [4,4], [5,5], [6,6], [7,7] ]
    },
    "prob_profile": p_prof
  };

  let f_pat_info = g_data.f_pat_info;
  let _i0 = irnd(f_pat_info.length);
  let _i1 = irnd(f_pat_info.length);

  //DEBUG
  //_i0 = 6;
  //_i1 = 6;

  let pat0_func = f_pat_info[ _i0 ][0];
  let pat1_func = f_pat_info[ _i1 ][0];

  let pat0_code = f_pat_info[ _i0 ][1];
  let pat1_code = f_pat_info[ _i1 ][1];

  let DPP = g_data.default_pattern_period;

  g_data.pattern_period[0][0] = DPP[ f_pat_info[_i0][1] ][0];
  g_data.pattern_period[0][1] = DPP[ f_pat_info[_i0][1] ][1];

  g_data.pattern_period[1][0] = DPP[ f_pat_info[_i1][1] ][0];
  g_data.pattern_period[1][1] = DPP[ f_pat_info[_i1][1] ][1];

  g_data["f_info"] = {
    "pat" : [ f_pat_info[_i0][1], f_pat_info[_i1][1] ]
  };

  let ppx0 = g_data.pattern_period[0][0];
  let ppy0 = g_data.pattern_period[0][1];
  let pps0 = g_data.pattern_period[0][2];

  let ppx1 = g_data.pattern_period[1][0];
  let ppy1 = g_data.pattern_period[1][1];
  let pps1 = g_data.pattern_period[1][2];

  pps0 = DPP[ pat0_code ][2] * drand(0.25,1.0);
  pps1 = DPP[ pat1_code ][2] * drand(0.25,1.0);

  //pps0 = DPP[ pat0_code ][2] * 0.25;
  //pps1 = DPP[ pat1_code ][2] * 0.25;


  g_data.pattern_period[0][0] = ppx0;
  g_data.pattern_period[0][1] = ppy0;
  g_data.pattern_period[0][2] = pps0;

  g_data.pattern_period[1][0] = ppx1;
  g_data.pattern_period[1][1] = ppy1;
  g_data.pattern_period[1][2] = pps1;

  let f_wrap0 = (function(_f,_w,_h,_s) {
    return function(_dx,_dy) {
      return _f( _dx, _dy, _w, _h, _s, undefined, 0 );
    };
  })( pat0_func, ppx0, ppy0, pps0 );

  let f_wrap1 = (function(_f,_w,_h,_s) {
    return function(_dx,_dy) {
      return _f( _dx, _dy, _w, _h, _s, undefined, 1 );
    };
  })( pat1_func, ppx1, ppy1, pps1 );


  g_data["opt"] = opt;
  let grid_ctx = {
    "g": [],
    "p": [],
    "g_p": []
  };

  while (grid_ctx.g.length == 0) {
    grid_sym_r(grid_ctx, cxy[0], cxy[1], R, 0, opt );

    let _lvl_threshold = 2,
        _lvl_m = -1;
    for (let i=0; i<grid_ctx.g.length; i++) {
      if (grid_ctx.g[i][4] > _lvl_m) {
        _lvl_m = grid_ctx.g[i][4];
      }
    }

    // if we get back nothing try again
    //
    if (_lvl_m < 0) {
      //console.log("REJECT ZERO");
      continue;
    }

    // if the resulting pattern is too simple
    // (max level is 1), accept with some small
    // prbability, otherwise, retry
    //

    if (_lvl_m < 2) {
      if (drand() > (1/32)) {
        //console.log("REJECT SIMPLE");

        grid_ctx = { "g": [], "p": [], "g_p": [] };
        continue;
      }

      //console.log("ACCEPT SIMPLE");
    }

  }

  // sort by size (level)
  //
  grid_ctx.g.sort( mstp_sort );

  g_data["grid_ctx"] = grid_ctx;
  g_data["draw_list"] = [];
  let svg_draw = g_data.svg_draw;

  //DEBUG
  //g = [ [300,300, 100, 0, 0 ] ];
  //grid_ctx.g = [
  //  [300,500, 100, 6, 1 ],
  //  [500,500, 100, 6, 1 ]
  //];

  // pick our colors, I guess (foreground/background)
  //
  let co_pal = color500[ irnd(color500.length) ];

    g_data.BG[0] = co_pal[0];
    g_data.FG[0] = co_pal[1];
    g_data.FG[1] = co_pal[2];
    g_data.BG[1] = co_pal[3];

    //let bg_rect = two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
    //bg_rect.fill = co_pal[4];

  /*
  if ( drand() < 0.5 ) {

    g_data.BG[0] = co_pal[0];
    g_data.FG[0] = co_pal[1];
    g_data.FG[1] = co_pal[2];
    g_data.BG[1] = co_pal[3];

    let bg_rect = two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
    bg_rect.fill = co_pal[4];

  }
  else {

    console.log("desc");

    g_data.BG[0] = co_pal[4];
    g_data.FG[0] = co_pal[3];
    g_data.FG[1] = co_pal[2];
    g_data.BG[1] = co_pal[1];

    let bg_rect = two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
    bg_rect.fill = co_pal[0];
  }
  */

  for (let i=0; i<grid_ctx.g.length; i++) {
    let v = grid_ctx.g[i];

    //                                     x      y     r    pat    lvl    f_fg     f_bg
    //
    let _l = multiscale_truchet_pattern( [v[0], v[1]], v[2], v[3], v[4], f_wrap0, f_wrap1 );
    g_data.draw_list.push(_l);
  }

  randomize_animation();

  two.update();

  window.requestAnimationFrame(anim);
}


//------------------------------
//      ___          __
//  ___/ (_)__ ___  / /__ ___ __
// / _  / (_-</ _ \/ / _ `/ // /
// \_,_/_/___/ .__/_/\_,_/\_, /
//          /_/          /___/
//------------------------------

function randomize_animation() {

  let anim_type = [ 'i', 'e', 'w' ];

  for (let i=0; i<2; i++) {
    animation_ctx[i].type = anim_type[ irnd(anim_type.length) ];

    //animation_ctx[i].type ='e';

    if (animation_ctx[i].type == 'e') {

      animation_ctx[i] = {
        "x":0, "y": 0, "type":"e",

        "f": [[0,0]],
        "c": [[0,0]],
        "p": [[0,0]]
      };

      let f0 = drand(1/32,10/32);
      let f1 = drand(1/32,10/32);

      animation_ctx[i].f[0][0] = f0;
      animation_ctx[i].f[0][1] = f1;

      animation_ctx[i].c[0][0] = drand(3,8);
      animation_ctx[i].c[0][1] = drand(3,8)
    }

    else if (animation_ctx[i].type == 'w') {

      animation_ctx[i] = {
        "x":0, "y": 0, "type":"w",
        "v": [0,0],
        "u": [[0,0]],
        "f": [[0,0]],
        "c": [[0,0]],
        "p": [[0,0]]
      };

      let theta = 2*Math.PI*drand();
      let ds = drand(-2,7);

      animation_ctx[i].v[0] = (5 + ds)*Math.cos(theta);
      animation_ctx[i].v[1] = (5 + ds)*Math.sin(theta);

      //kiss
      //
      if (0) {
      for (let j=0; j<1; j++) {
        animation_ctx[i].u[j][0] = -animation_ctx[i].v[1]/8;
        animation_ctx[i].u[j][1] =  animation_ctx[i].v[0]/8;

        let f = [ drand((3/4) - (1/32), (3/4) + (1/32)), drand((3/4) + (1/32), (3/4)+(1/32)) ];
        let c = [ drand(0.9, 1.1), drand(0.9,1.1) ];
        let p = [ drand(0.5) , drand(0.5) ];

        animation_ctx[i].f[j][0] = f[0];
        animation_ctx[i].f[j][1] = f[1];

        animation_ctx[i].c[j][0] = c[0];
        animation_ctx[i].c[j][1] = c[1];

        animation_ctx[i].p[j][0] = p[0];
        animation_ctx[i].p[j][1] = p[1];
      }
      }
    }

  }

}

// e - ellipse
// w - linear + wiggle
//
var animation_ctx = [
  {
    "x" : 0, "y" : 0,
    "type": "e",

    "f" : [[3/16,5/16], [1/8, 1/14]],

    //fase debug
    //"f" : [[5/2,7/2], [1/8, 1/14]],

    "c" : [[4.1,4.2], [1/5, 1/6]],
    "p" : [[0.1,0.5], [0.2, 0.3]]
  },

  {
    "x" : 0, "y" : 0,
    "type": "w",
    "v" : [15,16],
    "u" : [ [5,-6] ],
    "f" : [[3/4,2/4] ],
    "c" : [[1,1] ],
    "p" : [[0,0.5] ]
  }
];

function motion_animate(ctx, t) {
  if      (ctx.type == 'e') { return motion_ellipse(ctx, t); }
  else if (ctx.type == 'w') { return motion_wiggle(ctx, t); }
  return [0,0];
}

function motion_ellipse(ctx, t) {
  let n = ctx.f.length;
  let xy = [0,0];
  for (let i=0; i<n; i++) {
    let fx = ctx.f[i][0],
        cx = ctx.c[i][0],
        px = ctx.p[i][0];

    let fy = ctx.f[i][1],
        cy = ctx.c[i][1],
        py = ctx.p[i][1];

    xy[0] += cx*Math.cos(2*Math.PI*((fx*t) + px));
    xy[1] += cy*Math.cos(2*Math.PI*((fy*t) + py));
  }
  return xy;
}

function motion_wiggle(ctx, t) {
  let n = ctx.f.length;
  let xy = [ t*ctx.v[0], t*ctx.v[1] ];
  for (let i=0; i<n; i++) {
    xy[0] += ctx.u[i][0] + (ctx.c[i][0] * Math.cos( (2*Math.PI)*((ctx.f[i][0]*t) + ctx.p[i][0]) ) );
    xy[1] += ctx.u[i][1] + (ctx.c[i][1] * Math.cos( (2*Math.PI)*((ctx.f[i][1]*t) + ctx.p[i][1]) ) );
  }
  return xy;
}


function anim() {

  if (g_data.ANIMATE) {

    let Ts = Date.now() / 1000;

    let xymod = [
      [ g_data.pattern_period[0][0], g_data.pattern_period[0][1] ],
      [ g_data.pattern_period[1][0], g_data.pattern_period[1][1] ]
    ]

    let xyxy = [
      motion_animate(animation_ctx[0], Ts),
      motion_animate(animation_ctx[1], Ts),
    ];

    xyxy[0][0] = qrem( xyxy[0][0], xymod[0][0] );
    xyxy[0][1] = qrem( xyxy[0][1], xymod[0][1] );

    xyxy[1][0] = qrem( xyxy[1][0], xymod[1][0] );
    xyxy[1][1] = qrem( xyxy[1][1], xymod[1][1] );

    for (let i=0; i<g_data.svg_pattern.length; i++) {
      let p = g_data.svg_pattern[i][0];
      let mt_idx = g_data.svg_pattern[i][1];

      p.setAttribute('x', xyxy[mt_idx][0]);
      p.setAttribute('y', xyxy[mt_idx][1]);
    }

  }

  window.requestAnimationFrame(anim);
}

