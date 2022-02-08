//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var g_info = {
  "VERSION" : "0.1.0",
  "download_filename": "3sum_economy.png",

  "path_debug": false,
  "fps_debug": false,

  "fps" : 0,
  "last_t" : 0,

  "angle": 0,

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

  "monochrome": false,

  // taken from the chromotome project.
  // see chromotome.json for more information
  //
  "palette" :[
  {
    "name": "roygbiv-warm",
    "colors": [
      "#705f84",
      "#687d99",
      "#6c843e",
      "#fc9a1a",
      "#dc383a",
      "#aa3a33",
      "#9c4257"
    ]
  },
  {
    "name": "jrmy",
    "colors": ["#df456c", "#ea6a82", "#270b32", "#471e43"],
    "stroke": "#270b32",
    "background": "#ef9198"
  },
  {
    "name": "jung_horse",
    "colors": ["#e72e81", "#f0bf36", "#3056a2"],
    "stroke": "#000000",
    "background": "#ffffff"
  },
  {
    "name": "jung_croc",
    "colors": ["#f13274", "#eed03e", "#405e7f", "#19a198"],
    "stroke": "#000000",
    "background": "#ffffff"
  },
  {
    "name": "ducci_b",
    "colors": ["#ecddc5", "#79b27b", "#000000", "#ac6548"],
    "stroke": "#ac6548",
    "background": "#d5c08e"
  },
  {
    "name": "honey",
    "colors": ["#f14d42", "#f4fdec", "#4fbe5d", "#265487", "#f6e916", "#f9a087", "#2e99d6"],
    "stroke": "#141414",
    "background": "#f4fdec"
  },
  {
    "name": "juxtapoz",
    "colors": ["#20357e", "#f44242", "#ffffff"],
    "stroke": "#000000",
    "background": "#cfc398"
  },
  {
    "name": "dale_cat",
    "colors": ["#f77656", "#f7f7f7", "#efc545", "#dfe0e2", "#3c70bd", "#66bee4"],
    "stroke": "#000000",
    "background": "#f6e0b8"
  }
  ],


  "rnd":[],

  "density": 0,
  "state": [],
  "path": [],
  "path_init":false,
  "path_configuration": 0,
  "path_configuration_n": 3,

  "bezier_normal_weight": 180,

  "show_particles": true,
  "particle_n": 0,
  "particle": [],
  "particle_density": 4,
  "particle_angle": 0,


  "features": {},
  "bg_color" : "#333"

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
  let p = g_info.lut_path;

  s = s - Math.floor(s);
  for (let i=0; i<p.length; i++) {
    let j = ((i+1)%p.length);
    if ((s >= p[i].s) && (s < p[i].e)) {
      let t = (s - p[i].s) / (p[i].e - p[i].s);

      u.x = (1-t)*p[i].x + t*p[j].x;
      u.y = (1-t)*p[i].y + t*p[j].y;
      u.z = (1-t)*p[i].z + t*p[j].z;
      return;

    }
  }

  console.log("!!!!!", s);
  u.x = -100;
  u.y = -100;
  return;
}

function square_square(ctx, _x, _y, owidth, iwidth, color) {
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

  let T = (g_info.tick % g_info.tick_N) / g_info.tick_N;

  let N = g_info.state.length;
  for (let i=0; i<N; i++) {
    let u = g_info.state[i];
    path_point(u, u.path_speed*g_info.tick + u.path_phase);
  }

  // unfortunately, z sorting gives too much popping
  //
  //g_info.state.sort( function(a,b) { return b.z - a.z; } );
  g_info.state.sort( function(a,b) { return b.area - a.area; } );

  ctx.save();
  ctx.translate( _cw/2, _ch/2);
  ctx.rotate(g_info.angle);
  ctx.translate( -_cw/2, -_ch/2);

  for (let i=0; i<N; i++) {
    let u = g_info.state[i];
    ctx.fillStyle = '#f33';

    u.dx = u.M*Math.cos( 2.0*Math.PI*(u.freqx*g_info.tick/128 + u.phase) );
    u.dy = u.M*Math.sin( 2.0*Math.PI*(u.freqy*g_info.tick/128 + u.phase) );

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

    else if (u.shape == "rect") {
      let _rx = u.owx;
      let _ry = u.owy;
      let _mx = u.x ;
      let _my = u.y ;

      ctx.fillStyle = u.c;
      ctx.beginPath();
      ctx.save();
      ctx.translate(  _x, _y );
      ctx.rotate( u.a );
      ctx.translate( -_x, -_y );
      ctx.fillRect( _x - _rx/2, _y - _ry/2, _rx, _ry);
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

  ctx.restore();

  // particles
  //
  // being sloppy...
  // paricles aren't part of the global rotation
  //

  if (g_info.show_particles) {
    ctx.beginPath();
    for (let i=0; i<g_info.particle.length; i++) {
      let p = g_info.particle[i];
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.sz,p.sz);

      if (!g_info.pause) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = g_info.height - 1;
        }
        else if (p.y > g_info.height) {
          p.y = 1;
        }

        if (p.x < 0) {
          p.x = g_info.width-1;
        }
        else if (p.x > g_info.width) {
          p.x = 1;
        }
      }


    }

  }

  // DEBUG
  // bezier control points
  //
  if (g_info.path_debug) {

    for (let i=0; i<g_info.path.length; i++) {
      let _p = g_info.path[i];

      ctx.fillStyle = '#0f0';
      ctx.fillRect( _p.c0.x, _p.c0.y, 5, 5);

      ctx.fillStyle = '#22f';
      ctx.fillRect( _p.c1.x, _p.c1.y, 3, 3);

      for (let j=0; j<g_info.path[i].lut.length; j++) {
        let pnt = g_info.path[i].lut[j];

        ctx.fillStyle = '#f00';
        ctx.fillRect( pnt.x, pnt.y, 5, 5 );

      }
    }


    // DEBUG
    // draw underlying path
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

  }


  ///---

  // update state
  //

  if (!g_info.pause) {
    for (let i=0; i<N; i++) {
      g_info.state[i].a += g_info.state[i].da;
      if (g_info.state[i].a >= (Math.PI*2)) {
        g_info.state[i].a -= Math.PI*2;
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

  init_path();
  init_shapes();
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


function init_loadpalette(txt) {
  let dat = JSON.parse(txt);
  g_info.palette = dat.pal;

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

function init_path() {

  let _w = g_info.width;
  let _h = g_info.height;

  let _p = [];

  let path_configuration_choice = g_info.path_configuration;

  // all these x/y rescalings needed tweaking...
  // fiddled with it until it looked reasonable
  //
  let _fx = 1.55, _fy = 2.5;

  if (path_configuration_choice == 0) {
    _fx = 1.5;
    _fy = 1.05;

    _p.push( { "x": _w/8,   "y":   _h/2, "z": 0} );
    _p.push( { "x": _w/2,   "y":   _h/8, "z": 0} );
    _p.push( { "x": 7*_w/8, "y":   _h/2, "z": 0} );
    _p.push( { "x": _w/2,   "y": 7*_h/8, "z": 0} );
  }
  else if (path_configuration_choice == 1) {
    _fx = 1.75;
    _fy = 1.15;
    _p.push( { "x": _w/8, "y": _h/2, "z": -1} );

    _p.push( { "x": _w/3, "y": _h/4, "z": 0 } );

    _p.push( { "x": 2*_w/3, "y": 3*_h/4, "z": 0.5 } );

    _p.push( { "x": 7*_w/8, "y": _h/2 , "z":0 } );

    _p.push( { "x": 3*_w/4, "y": _h/4 , "z": -0.5 } );

    _p.push( { "x": _w/4, "y": 3*_h/4, "z": -1.5 } );
  }
  else if (path_configuration_choice == 2) {
    _fx = 1.55;
    _fy = 2.5;

    _p.push( { "x":   _w/7, "y":  _h/2, "z":  0} );

    _p.push( { "x": 2*_w/7, "y":   _h/4, "z":  1} );
    _p.push( { "x": 3*_w/7, "y": 3*_h/4, "z":  1} );
    _p.push( { "x": 4*_w/7, "y":   _h/4, "z":  1} );
    _p.push( { "x": 5*_w/7, "y": 3*_h/4, "z":  1} );

    _p.push( { "x": 6*_w/7, "y": _h/2, "z": 0} );

    _p.push( { "x": 5*_w/7, "y":   _h/4, "z": -1} );
    _p.push( { "x": 4*_w/7, "y": 3*_h/4, "z": -1} );
    _p.push( { "x": 3*_w/7, "y":   _h/4, "z": -1} );
    _p.push( { "x": 2*_w/7, "y": 3*_h/4, "z": -1} );
  }

  // rescale base path.
  // I did the path by hand so it's easier, conceptually,
  // to think it laid out as above and then rescale
  // by the tewaking factors
  //
  //
  for (let i=0; i<_p.length; i++) {
    _p[i].x = (_p[i].x - _w/2)*_fx + _w/2;
    _p[i].y = (_p[i].y - _h/2)*_fy + _h/2;
  }


  for (let i=0; i<_p.length; i++) {
    let ni = (i+1)%_p.length;
    let pi = (i+_p.length-1)%_p.length;

    let u = {
      "x": _p[ni].x - _p[pi].x,
      "y": _p[ni].y - _p[pi].y,
      "z": _p[ni].z - _p[pi].z
    };

    let len = Math.sqrt( u.x*u.x  + u.y*u.y + u.z*u.z );
    u.x /= len;
    u.y /= len;
    u.z /= len;

    v = { "x": -u.x, "y": -u.y, "z": -u.z };

    _p[i]["c0_n"]  = u;
    _p[pi]["c1_n"] = v;

    let _C = g_info.bezier_normal_weight;
    _p[i]["c0"]  = { "x": _C*u.x + _p[i].x , "y": _C*u.y + _p[i].y , "z": _C*u.z + _p[i].z };
    _p[pi]["c1"] = { "x": _C*v.x + _p[i].x , "y": _C*v.y + _p[i].y , "z": _C*v.z + _p[i].z };
  }

  for (let i=0; i<_p.length; i++) {
    let ni = (i+1)%_p.length;
    _p[i]["bez"] = new Bezier( _p[i], _p[i].c0, _p[i].c1, _p[ni] );
    _p[i]["lut"] = _p[i].bez.getLUT(16);
  }

  let lutp = [];
  for (let i=0; i<_p.length; i++) {
    for (let j=0; j<_p[i].lut.length; j++) {
      let v = {
        "x": _p[i].lut[j].x,
        "y": _p[i].lut[j].y,
        "z": _p[i].lut[j].z,
        "s": 0,
        "e": 0
      };
      lutp.push( _p[i].lut[j] );
    }
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

  _s = 0.0;
  for (let i=0; i<lutp.length; i++) {
    let j = ((i+1)%lutp.length);

    let len = Math.sqrt( Math.pow(lutp[j].x - lutp[i].x, 2) + Math.pow(lutp[j].y - lutp[i].y, 2) );
    lutp[i]["s"] = _s;
    lutp[i]["e"] = _s + len;
    _s += len;
  }

  for (let i=0; i<lutp.length; i++) {
    lutp[i].s /= _s;
    lutp[i].e /= _s;
  }



  g_info.path = _p;
  g_info.lut_path = lutp;

  g_info.path_init = true;
}


// I've selected palettes manually,
// so just use it as pre-specified instead
// of loading the whole chromotome
//
//
function init() {
  //loadjson("./chromotome.json", init_loadpalette);
  init_fin();
}

function init_fin() {

  g_info.path_configuration = _irnd(g_info.path_configuration_n);
  g_info.palette_idx = _irnd(g_info.palette.length+1);
  if (g_info.palette_idx == g_info.palette.length) {
    g_info.monochrome = true;
  }
  else {
    if ("background" in g_info.palette[ g_info.palette_idx ]) {
      g_info.bg_color = g_info.palette[ g_info.palette_idx ].background;
    }
  }

  g_info.features["Path Configuration"] = g_info.path_configuration;
  if (g_info.monochrome) {
    g_info.features["Color Scheme"] = "monochrome";
  }
  else {
    g_info.features["Color Scheme"] = g_info.palette[ g_info.palette_idx ].name;
  }

  window.$fxhashFeatures = g_info.features;

  let density = _max(8*_rndpow(1.5), 4);
  g_info.density = density;
  g_info.features["Density"] = density;

  let _a = fxrand()*Math.PI*2;
  g_info.angle = _a;
  g_info.features["Angle"] = _a;


  let _pa = fxrand()*Math.PI*2;
  g_info.particle_angle = _pa;
  g_info.features["Particle Angle"] = _pa;


  g_info.particle_density = 4;

  console.log(g_info.features);

  init_path();
  init_shapes();
  g_info.ready = true;
}

function init_shapes() {
  let _w = g_info.width;
  let _h = g_info.height;

  let density = g_info.density;

  g_info.state = [];
  g_info.particle = [];

  //let _shape = [ "square", "circle", "donut", "frame" ];
  //let _shape = [ "square", "frame", "rect" ];

  // decided on rects only...
  //
  let _shape = [ "rect" ];

  let N = Math.ceil(g_info.size * density);
  let _W_o = 10, _W_om = 4, _W_i = 5, _W_im = 2;

  let _da = fxrand()*Math.PI*2/80;

  for (let i=0; i<N; i++) {
    let shape_name = _shape[_irnd(_shape.length)];
    let W_o = _W_o;
    let W_om = _W_om;
    let W_i = _W_i;
    let W_im = _W_im;
    if ((shape_name == "square") || (shape_name == "frame")) {
      W_o *= 2;
      W_om *= 2;
      W_i *= 2;
      W_im *= 2;
    }

    let _path_speed = _rndpow(1.5)/2048;
    if (g_info.path_configuration == 2) {
      _path_speed = _rndpow(1.5)/4192;
    }

    let _szf = 6,
        _sze = 3.5;

    let _phase = _rndpow(3.25)*Math.PI*2;

    let b = Math.floor(fxrand()*255);
    let c = "rgba(" + b + "," + b + "," + b + ",0.8";
    if (!g_info.monochrome) {
      let pal = g_info.palette[ g_info.palette_idx ];
      c = pal.colors[ _irnd(pal.colors.length) ];
    }
    let ele = {
      "M": _rndpow(0.5)*200 + 1,
      "x": 0,
      "y": 0,
      "dx": 0,
      "dy": 0,
      "ow": _max( _szf*_rndpow(_sze)*W_o , W_om),
      "owx": _max( _szf*_rndpow(_sze)*W_o , W_om),
      "owy": _max( _szf*_rndpow(_sze)*W_o , W_om),
      "iw": fxrand()*W_i + W_im,
      "t": fxrand(),
      "a": fxrand()*Math.PI*2,
      "da": ((_rnd() < 0.5)?-1:1)*(_rndpow(3.5)*Math.PI*2/(160) + (1/256)),
      "freq": fxrand(),

      //"freqx": fxrand()/4,
      //"freqy": fxrand()/4,
      //"freqx": _rndpow(1.5)/8,
      //"freqy": _rndpow(1.5)/8,
      "freqx": 0,
      "freqy": 0,

      "path_speed": _path_speed,
      "path_phase": fxrand(),

      "area": 0,

      "phase": _phase,
      "shape": shape_name,
      "c": c
    };

    if (shape_name == "square") {
      ele["area"] = ele.ow*ele.ow;
    }
    else if (shape_name == "rect")  {
      ele["area"] = ele.owx*ele.owy;
    }
    else {
      ele["area"] = 1;
    }

    g_info.state.push(ele);
  }

  g_info.particle_n = g_info.particle_density * g_info.size;

  let _pN = g_info.particle_n;
  //let part_ang = fxrand()*Math.PI*2;
  let part_ang = g_info.particle_angle;
  for (let i=0; i<_pN; i++) {

    let _vx = 0;
    let _vy = _max(3*_rndpow(1.5), 1/8) ;

    let vx = Math.sin(part_ang)*_vy;
    let vy = Math.cos(part_ang)*_vy;

    let b = Math.floor(fxrand()*255);
    let c = "rgba(" + b + "," + b + "," + b + ",0.8";
    let ele = {
      "x": fxrand()*_w,
      "y": fxrand()*_h,
      "sz": 1.5*fxrand() + 0.25,
      "vx": vx,
      "vy": vy,
      "c": c
    };
    g_info.particle.push(ele);
  }

}

(()=>{

  g_info.last_t = Date.now();

  console.log("fxhash:",fxhash);

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
