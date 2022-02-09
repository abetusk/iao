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

  "fps_debug": false,
  "fps": 0,
  "last_t":0,

  "palette": [
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

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "grid": [],
  "grid_mem": {},

  "rnd":[],

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

function disp_r(cx,cy,w,h,g,c) {
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  ds = _min(w/(g[0].length+1),h/(g.length+1));

  for (let i=0; i<g.length; i++) {
    for (let j=0; j<g[i].length; j++) {
      let _x = cx + j*ds + ds/2;
      let _y = cy + i*ds + ds/2;

      if (g[i][j] > 0) {
        //ctx.fillStyle = "rgba(32,32,32,0.2)";
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.fillRect(_x,_y, ds + 0.75, ds + 0.75);

      }
    }
  }

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

  // PER FRAME CODE
  //

  let ds = _min(_cw/10,_ch/10);

  let grid = g_info.grid;

  for (let i=0; i<grid.length; i++) {
    for (let j=0; j<grid[i].length; j++) {
      let x = 10 + j*ds;
      let y = 10 + i*ds;

      if (grid[i][j] > 0) {
        //ctx.fillStyle = "rgba(32,32,32,0.2)";
        ctx.fillStyle = g_info.palette_choice.colors[0];
        ctx.beginPath();
        ctx.fillRect(x,y, ds + 0.75, ds + 0.75);

        let _g = g_info.grid_mem[grid[i][j]].grid;
        let _c = g_info.grid_mem[grid[i][j]].c;


        disp_r(x,y,ds,ds, _g, _c);
      }
    }
  }

  //
  // PER FRAME CODE


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
  g_info.size = Math.floor(dS - dS/3);
}

function _get_max_idx(g) {
  let max_idx = -1;
  for (let i=0; i<g.length; i++) {
    for (let j=0; j<g[i].length; j++) {
      max_idx = _max( g[i][j], max_idx );
    }
  }

  return max_idx;
}

function init_fin() {
  g_info.ready = true;
  g_info.grid = gen_vadcrzr();

  let g = g_info.grid;
  let max_idx = _get_max_idx(g);

  for (let i=0; i<g.length; i++) {
    for (let j=0; j<g[i].length; j++) {
      let idx = g[i][j];
      if (idx == 0) { continue; }
      if (idx in g_info.grid_mem) { continue; }
      let _rg = gen_vadcrzr(max_idx);
      //g_info.grid_mem[idx] = {"grid":_rg, "c": _arnd(g_info.palette_choice.colors) };
      g_info.grid_mem[idx] = {"grid":_rg, "c": _arnd(g_info.palette_choice.colors.slice(1)) };
      max_idx = _get_max_idx(_rg);
    }
  }

}

function init() {

  // EXAMPLE INIT
  //


  setTimeout(function() { init_fin(); }, 50);

  //
  // EXAMPLE INIT

}

(()=>{

  console.log("fxhash:",fxhash);

  g_info.last_t = Date.now();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

  g_info.palette_choice = _arnd( g_info.palette );

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

function gen_vadcrzr(base_idx) {
  base_idx = ((typeof base_idx === "undefined") ? 1 : base_idx);
  let grid = [
  ];

  let H = [ { "v":6, "p":0.1 }, { "v":7, "p":0.1 }, {"v":8, "p":0.8} ];
  let W = [ { "v":7, "p":0.1 }, { "v":8, "p":0.4 }, {"v":9, "p":0.2}, {"v":10, "p":0.2}];



  let h = H[_irnd(3)].v;
  let w = W[_irnd(4)].v;

  for (let iy=0; iy<h; iy++) {
    grid.push([]);
    for (let ix=0; ix<w; ix++)  {
      grid[iy].push(0);
    }
  }

  let le, re;
  if ((w%2)==0) {
    le = Math.floor((w-1)/2)-1;
    re = Math.floor((w+1)/2)+1;
  }
  else {
    le = Math.floor((w)/2)-1;
    re = Math.floor((w)/2)+1;
  }

  let dh_eye = _irnd(2) + 2;
  let dw_eye = 1;

  let eye_h, eye_w;
  let eye_choice = _irnd(3);

  grid[dh_eye][le] = -base_idx;
  grid[dh_eye][re] = -base_idx;

  let idx = base_idx;

  if (eye_choice == 0) {
    eye_w = 2;
    eye_h = 1;
    grid[dh_eye][le-1] = -base_idx-1;
    grid[dh_eye][re+1] = -base_idx-1;

    grid[dh_eye][le-2] = idx;
    grid[dh_eye][re+2] = idx;
    idx++;

    grid[dh_eye][re-1] = idx;
    grid[dh_eye][le+1] = idx;
    idx++;

    for (let i=0; i<4; i++) {

      grid[dh_eye+1][le-2+i] = idx;
      grid[dh_eye+1][re+2-i] = idx;
      idx++;

      grid[dh_eye-1][le-2+i] = idx;
      grid[dh_eye-1][re+2-i] = idx;
    }

  }
  else if (eye_choice ==1 ) {
    eye_w = 1;
    eye_h = 2;
    grid[dh_eye+1][le] = -base_idx-1;
    grid[dh_eye+1][re] = -base_idx-1;

    grid[dh_eye-1][le] = idx;
    grid[dh_eye-1][re] = idx;
    idx++;

    grid[dh_eye+2][le] = idx;
    grid[dh_eye+2][re] = idx;
    idx++;

    for (let i=0; i<4; i++) {
      grid[dh_eye-1+i][le-1] = idx;
      grid[dh_eye-1+i][re+1] = idx;
      idx++;

      grid[dh_eye-1+i][le+1] = idx;
      grid[dh_eye-1+i][re-1] = idx;
      idx++;
    }

  }
  else if (eye_choice == 2) {
    eye_w = 1;
    eye_h = 1;

    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        if ((i==1) && (j==1)) { continue; }
        grid[dh_eye-1+i][le-1+j] = idx;
        grid[dh_eye-1+i][re+1-j] = idx;
        idx++;
      }
    }

  }

  let mid_offset = 1-(w%2);

  for (let i=0; i<(h); i++) {
    for (let j=0; j<(w/2); j++) {
      if (grid[i][j] != 0) { continue; }
      if (_irnd(2) == 0) {
        grid[i][j] = idx;
        grid[i][w-1-j] = idx;
        idx++;
      }
    }
  }


  //console.log("w:", w, "h:", h,"dh_eye:", dh_eye, "dw_eye:", dw_eye, "le:", le, "re:", re, "eye_choice:", eye_choice);


  for (let i=0; i<h; i++) {
    let s = '';
    for (let j=0; j<w; j++) {
      s += grid[i][j];
    }
    console.log(s);
  }
  return grid;
}

