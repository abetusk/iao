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
  "download_filename": "3sum_economy.png",
  "canvas": {},
  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,
  "tick_N" : 2048,


  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "palette" :[],

  "rnd":[],

  "state": [],
  "path": [],
  "path_init":false,

  "particle": [],

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

function path_point(u, s) {
  let p = g_info.path;
  s = s - Math.floor(s);
  for (let i=0; i<p.length; i++) {
    let j = ((i+1)%p.length);
    if ((s >= p[i].s) && (s < p[i].e)) {
      let t = (s - p[i].s) / (p[i].e - p[i].s);

      u.x = (1-t)*p[i].x + t*p[j].x;
      u.y = (1-t)*p[i].y + t*p[j].y;
      return;

    }
  }

  console.log("!!!!!", s);
  u.x = -100;
  u.y = -100;
  return;
}

function square_square(ctx, _x, _y, owidth, iwidth, color) {
  /*
  let w2 = owidth/2;

  let x = _x - w2;
  let y = _y - w2;


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

  return;
  */
  let x = _x;
  let y = _y;
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


function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);
  g_info.tick++;
  window.requestAnimationFrame(anim);

  if (!g_info.ready) {
    loading_anim();
    return;
  }

  let T = (g_info.tick % g_info.tick_N) / g_info.tick_N;

  let N = g_info.state.length;
  for (let i=0; i<N; i++) {
    let u = g_info.state[i];
    ctx.fillStyle = '#f33';

    path_point(u, T + (i/N));

    if (isNaN(u.x) || isNaN(u.y)) {
      console.log("!!!!", u, u.x, u.y, i);
    }

    u.dx = 30*Math.cos( 2.0*Math.PI*(u.freqx*g_info.tick/128 + u.phase) );
    u.dy = 30*Math.sin( 2.0*Math.PI*(u.freqy*g_info.tick/128 + u.phase) );

    if (isNaN(u.dx) || isNaN(u.dy)) {
      console.log("!!!!", u.dx, u.dy, i);
    }

    let _x = u.x + u.dx;
    let _y = u.y + u.dy;


    if (u.shape == "square") {
      let _sqw = u.ow;
      let _mx = u.x ;
      let _my = u.y ;

      ctx.fillStyle = u.c;
      ctx.beginPath();
      ctx.save();
      ctx.translate(  _x, _y );
      ctx.rotate( u.a );
      ctx.translate( -_x, -_y );
      ctx.fillRect( _x - _sqw/2, _y - _sqw/2, _sqw, _sqw);
      ctx.restore();
    }
    else if (u.shape == "circle") {
      ctx.fillStyle = u.c;
      ctx.beginPath();
      ctx.arc( _x, _y, u.ow, 0, Math.PI*2);
      ctx.fill();
    }

    else if (u.shape == "donut") {
      circle_circle(ctx, _x, _y, u.ow, u.iw, u.c);
    }

    else if (u.shape == "frame") {
      let _sqw = u.ow;
      let _sqwi = u.iw;
      let _mx = u.x - _sqw/2;
      let _my = u.y - _sqw/2;
      ctx.beginPath();
      ctx.save();
      ctx.translate( _x, _y );
      ctx.rotate(u.a);
      ctx.translate(-_x, -_y);
      square_square(ctx, _x - _sqw/2, _y - _sqw/2, _sqw, _sqwi, u.c);
      ctx.restore();
    }

  }

  ctx.strokeStyle = "#333";
  ctx.beginPath();
  for (let i=0; i<=g_info.path.length; i++) {
    let idx = (i%g_info.path.length);
    if (i==0) {
      ctx.moveTo( g_info.path[idx].x, g_info.path[idx].y );
      continue;
    }
    ctx.lineTo( g_info.path[idx].x, g_info.path[idx].y );
  }
  ctx.stroke();



  ///---

  for (let i=0; i<N; i++) {
    g_info.state[i].a += g_info.state[i].da;
    if (g_info.state[i].a >= (Math.PI*2)) {
      g_info.state[i].a -= Math.PI*2;
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
  //g_info.size = Math.floor(dS - dS/3);
  g_info.size = dS;

  init_path();
}

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


function init_done() {
  g_info.ready = true;
}

function init_loadpalette(txt) {
  let dat = JSON.parse(txt);
  g_info.palette = dat.pal;
  init_done();
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

function init_path() {

  let _w = g_info.width;
  let _h = g_info.height;

  let _p = [];
  _p.push( { "x": _w/8, "y": _h/2, "z": -1} );
  _p.push( { "x": _w/4, "y": _h/4, "z": 0 } );
  _p.push( { "x": _w/2 + _w/8, "y": _h/2, "z": 1 } );
  _p.push( { "x": 3*_w/4, "y": 3*_h/4, "z": 0.5 } );
  _p.push( { "x": 7*_w/8, "y": _h/2 , "z":0 } );
  _p.push( { "x": 3*_w/4, "y": _h/4 , "z": -0.5 } );
  _p.push( { "x": _w/2 - _w/8, "y": _h/2 , "z": -1} );
  _p.push( { "x": _w/8, "y": 3*_h/4, "z": -1.5 } );

  for (let i=0; i<_p.length; i++) {

  }

  let _s = 0.0;
  for (let i=0; i<_p.length; i++) {
    let j = ((i+1)%_p.length);

    let len = Math.sqrt( Math.pow(_p[j].x - _p[i].x, 2) + Math.pow(_p[j].y - _p[i].y, 2) );
    _p[i]["s"] = _s;
    _p[i]["e"] = _s + len;
    _s += len;
  }

  for (let i=0; i<_p.length; i++) {
    _p[i].s /= _s;
    _p[i].e /= _s;
  }

  g_info.path = _p;

  g_info.path_init = true;
}

function __init_path() {

  let _w = g_info.width;
  let _h = g_info.height;

  let _p = [];
  _p.push( { "x": _w/8, "y": _h/2 } );
  _p.push( { "x": _w/4, "y": _h/4 } );
  _p.push( { "x": _w/2 + _w/8, "y": _h/2 } );
  _p.push( { "x": 3*_w/4, "y": 3*_h/4 } );
  _p.push( { "x": 7*_w/8, "y": _h/2 } );
  _p.push( { "x": 3*_w/4, "y": _h/4 } );
  _p.push( { "x": _w/2 - _w/8, "y": _h/2 } );
  _p.push( { "x": _w/8, "y": 3*_h/4 } );

  let _s = 0.0;
  for (let i=0; i<_p.length; i++) {
    let j = ((i+1)%_p.length);

    let len = Math.sqrt( Math.pow(_p[j].x - _p[i].x, 2) + Math.pow(_p[j].y - _p[i].y, 2) );
    _p[i]["s"] = _s;
    _p[i]["e"] = _s + len;
    _s += len;
  }

  for (let i=0; i<_p.length; i++) {
    _p[i].s /= _s;
    _p[i].e /= _s;
  }

  g_info.path = _p;

  g_info.path_init = true;
}


function init() {
  let _shape = [ "square", "circle", "donut", "frame" ];
  loadjson("./chromotome.json", init_loadpalette);

  let _w = g_info.width;
  let _h = g_info.height;

  // setup objects
  //
  N = 500000 / g_info.size;
  let W_o = 10, W_om = 8, W_i = 5, W_im = 2;

  for (let i=0; i<N; i++) {
    let _dx = (fxrand() - 0.5)*80;
    let _dy = (fxrand() - 0.5)*80;
    let b = Math.floor(fxrand()*255);
    let c = "rgba(" + b + "," + b + "," + b + ",0.8";
    let ele = {
      "x": 0,
      "y": 0,
      "dx": _dx,
      "dy": _dy,
      "ow": fxrand()*W_o + W_om,
      "iw": fxrand()*W_i + W_im,
      "t": fxrand(),
      "a": fxrand()*Math.PI*2,
      "da": fxrand()*Math.PI*2/(360*2),
      "freq": fxrand(),
      "freqx": fxrand(),
      "freqy": fxrand(),
      "phase": fxrand(),
      "shape": _shape[_irnd(_shape.length)],
      "c": c
    };
    g_info.state.push(ele);
  }

  // find path
  //

  init_path();
}

(()=>{

  console.log("fxhash:",fxhash);

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
