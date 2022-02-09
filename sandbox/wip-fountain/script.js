//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
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
  "download_filename": "BOILERPLATE.png",
  "canvas": {},
  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "fps_debug":true,
  "fps":0,
  "last_t":0,

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "rnd":[],

  "palette" : [],

  "monochome": true,
  "palette_choice": {},
  "palette_idx": -1,


  "features":[],

  "state": [],
  "bg_color" : "#222"

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

function _rndpow(s) {
  return Math.pow(fxrand(), s);
}

function _arnd(a) {
  let n = a.length;
  let idx = _irnd(n);
  return a[idx];
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

// https://stackoverflow.com/a/596243 CC-BY-SA
// https://stackoverflow.com/users/61574/anonymous
//
function _brightness(r, g, b) {
  return ((r/255.0)*0.299) + (0.587*(g/255.0)) + (0.114*(b/255.0));
}

//--


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


//--

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

//----

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



// pretty hacky...might need to revisit
// //
// //  "working" parameters:
// //
// //  w = 200
// //  hatching_grid(ctx, 410, 410, 4, w, w/6.25, "rgba(255,255,255,0.95)");
// //
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
  
  }

  let rop = [];
  _clip_difference(rop, circle_pgn, band_pgn);

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


function size_f(w,t,t_end) {
  /*
  if ((t/t_end) < 0.5) {
    let _sin = Math.sin( Math.PI*(t_end - t)/t_end );
    return w*_sin*_sin;
  }
*/

  let p = 2*((t/t_end) - 0.5);
  //return w*(1-(p*p));
  if (p<0) {
    return w*(1-Math.pow(p, 6));
  }
  return w*(1-Math.pow(p, 1.25));


  //return w*Math.sin( Math.PI*(t_end - t)/t_end );
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

  if (!g_info.pause) {
    g_info.tick++;
  }

  window.requestAnimationFrame(anim);

  if (!g_info.ready) {
    loading_anim();
    return;
  }

  // PER FRAME CODE
  //

  //g_info.state.sort( function(a,b) { return b.cur_t - a.cur_t; } );
  g_info.state.sort( function(a,b) { return a.w- b.w; } );

  let _z = g_info.state;
  for (let i=0; i<_z.length; i++) {
    let _ele = _z[i];

    if (_ele.visible) {
      let _x = _ele.x ; //- _ele.w/2;
      let _y = _ele.y ;// - _ele.h/2;

      let _xx = _x - _ele.cur_w/2;
      let _yy = _y - _ele.cur_h/2;

      ctx.fillStyle = _ele.c;
      ctx.save();
      ctx.beginPath();
      //ctx.fillRect(_ele.x, _ele.y, _ele.w, _ele.h);

      ctx.translate(_x, _y);
      ctx.rotate(_ele.cur_a);
      ctx.translate(-_x, -_y);

      if (_ele.shape == "square_square") {
        square_square(ctx, _xx, _yy, _ele.cur_w, _ele.cur_w*.7, _ele.c);
      }
      else if (_ele.shape == "square") {
        ctx.fillRect(_xx, _yy, _ele.cur_w, _ele.cur_w);
      }
      else if (_ele.shape == "rect") {
        ctx.fillRect(_xx, _yy, _ele.cur_w, _ele.cur_h);
      }
      else if (_ele.shape == "square_band") {
        square_band(ctx, _xx, _yy, _ele.cur_w, _ele.cur_h, _ele.cur_w/3, 0, _ele.c);
      }
      else if (_ele.shape == "square_plus") {
        square_band(ctx, _xx, _yy, _ele.cur_w, _ele.cur_h, _ele.cur_w/3, _ele.cur_w/3, _ele.c);
      }
      else if (_ele.shape == "stripe") {
        stripe_45_square(ctx, _xx, _yy, _ele.cur_w, 0, _ele.cur_w/5, _ele.cur_w/5, _ele.c);
      }

      else if (_ele.shape == "mstripe") {
        stripe_m45_square(ctx, _xx, _yy, _ele.cur_w, 0, _ele.cur_w/5, _ele.cur_w/5, _ele.c);
      }

      //ctx.fillRect(_ele.x - _ele.w/2, _ele.y - _ele.h/2, _ele.cur_w, _ele.cur_h);

      //circle_band(ctx, _xx, _yy, _ele.cur_w, _ele.cur_w/3, 0, _ele.c);

      //hatching_grid(ctx, _xx, _yy, 4, _ele.cur_w, _ele.cur_w/6.25, _ele.c);

      ctx.restore();

    }

  }

  if (!g_info.pause) {
    for (let i=0; i<_z.length; i++) {
      let _ele = _z[i];

      _ele.x += _ele.vx;
      _ele.y += _ele.vy;

      if (_ele.cur_t > 0) {
        _ele.cur_w = size_f(_ele.w, _ele.cur_t, _ele.end_t);
        _ele.cur_h = size_f(_ele.h, _ele.cur_t, _ele.end_t);

        _ele.cur_a += _ele.da;
        if (_ele.cur_a > (Math.PI*2)) {
          _ele.cur_a -= Math.PI*2;
        }
        _ele.visible = true;
      }
      else {
        _ele.cur_w = 0;
        _ele.cur_h = 0;
        _ele.visible = false;

        //_ele.x = _rnd(-10,10) + _cw/2;
        //_ele.y = _rnd(-10,10) + _ch/2;

        _ele.x = _cw/2;
        _ele.y = _ch/2;

        _ele.end_t = _rnd(120,300);

        //_ele.da = _rnd(-2*Math.PI, 2*Math.PI)/1024;
      }

      _ele.cur_t++;

      if (_ele.cur_t >= _ele.end_t) {
        _ele.x = _cw/2;
        _ele.y = _ch/2;

        _ele.cur_t = -5;

      }


    }
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
  g_info.size = dS;

  if (g_info.ready) { init_fin(); }
}

function init_fin() {

  let _shapes = [ "square_square", "square", "ret", "square_band", "stripe", "square_plus" ];

  g_info.ready = true;

  let _w2 = g_info.width/2;
  let _h2 = g_info.height/2;

  console.log("init_fin");

  g_info.state = [];

  let N = 500;
  for (let i=0; i<N; i++) {

    let va = fxrand()*Math.PI*2;
    va = Math.PI*2*i/N;
    let vx = Math.cos(va);
    let vy = Math.sin(va);

    let b = Math.floor(fxrand()*255);
    let c = "rgba(" + b + "," + b + "," + b + ",0.85)";

    c = _arnd(g_info.palette_choice.colors);

    let _w = _max( fxrand()*30, 5);
    let _h = _max( fxrand()*30, 5);

    _w = _max( 100*_rndpow(1.5), 5);
    _h = _w;

    let sx = _rnd(-100,100) + _w2;
    let sy = _rnd(-100,100) + _h2;
    sx = _w2 + _w/2;
    sy = _h2 + _h/2;

    let _shape = _arnd(_shapes);

    let ele = {
      //"x": _rnd(-1,1)*100 + _w2 - _w/2,
      //"y": _rnd(-1,1)*100 + _h2 - _h/2,
      "shape": _shape,
      "x": sx,
      "y": sy,
      "c": c,
      "cur_w": 0,
      "cur_h": 0,
      "w": _w,
      "h": _h,
      "a": fxrand()*Math.PI*2,
      "cur_a": fxrand()*Math.PI*2,
      "da": fxrand()*Math.PI*2/100,
      "vx": vx,
      "vy": vy,
      "cur_t" : 0,
      "end_t" : Math.floor(_rnd(120,400)),
      "visible": true
    };

    ele.da = 3/100;

    //ele.cur_t = _irnd(ele.end_t);
    ele.cur_t = _irnd(0,300);
    ele.end_t = 300;
    ele.x = (ele.cur_t / ele.end_t)*ele.vx + sx - _w/2;
    ele.y = (ele.cur_t / ele.end_t)*ele.vy + sy - _h/2;
    ele.cur_w = size_f(ele.w, ele.cur_t, ele.end_t);
    ele.cur_h = size_f(ele.h, ele.cur_t, ele.end_t);

    g_info.state.push(ele);
  }
}

function load_palette(txt) {
  g_info.palette = JSON.parse(txt);

  let idx = _irnd(g_info.palette.pal.length);
  g_info.palette_choice = g_info.palette.pal[idx];
  g_info.palette_idx = idx;

  init_fin();
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



function init() {

  // EXAMPLE INIT
  //

  loadjson("./chromotome.json", load_palette)
  //setTimeout(function() { init_fin(); }, 500);

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
      g_info.anim = ((g_info.anim == true) ? false : true);
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
