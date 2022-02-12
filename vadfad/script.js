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
  "download_filename": "vadfad.png",
  "canvas": {},
  "ctx" : {},

  //"canvas_disp":{},
  //"ctx_disp": {},

  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "fps_debug": false,
  "fps": 0,
  "cur_t": 0,
  "last_t":0,
  "delta_t":0,

  "alphabet": {
    "0":  ".x." + "x.x" + "x.x" + "x.x" + ".x." ,
    "1":  ".x." + "xx." + ".x." + ".x." + "xxx" ,
    "a":  "xxx" + "x.x" + "xxx" + "x.x" + "x.x" ,
    "b":  "xxx" + "x.x" + "xxx" + "x.x" + "xxx" ,
    "c":  "xxx" + "x.." + "x.." + "x.." + "xxx" ,
    "d":  "xx." + "x.x" + "x.x" + "x.x" + "xx." ,
    "e":  "xxx" + "x.." + "xx." + "x.." + "xxx" ,
    "f":  "xxx" + "x.." + "xx." + "x.." + "x.." ,
    "g":  "xxx" + "x.." + "x.." + "x.x" + "xxx" ,
    "h":  "x.x" + "x.x" + "xxx" + "x.x" + "x.x" ,
    "i":  "xxx" + ".x." + ".x." + ".x." + "xxx" ,
    "j":  "xxx" + "..x" + "..x" + "x.x" + "xxx" ,
    "k":  "x.x" + "xx." + "xx." + "x.x" + "x.x" ,
    "l":  "x.." + "x.." + "x.." + "x.." + "xxx" ,
    "m":  "x.x" + "xxx" + "x.x" + "x.x" + "x.x" ,
    "n":  "xx." + "x.x" + "x.x" + "x.x" + "x.x" ,

    "o":  "xxx" + "x.x" + "x.x" + "x.x" + "xxx" ,

    "p":  "xxx" + "x.x" + "xxx" + "x.." + "x.." ,
    "q":  "xxx" + "x.x" + "x.x" + "x.x" + "xx." ,

    "r":  "xxx" + "x.x" + "xx." + "x.x" + "x.x" ,

    "s":  "xxx" + "x.." + "xxx" + "..x" + "xxx" ,
    "t":  "xxx" + ".x." + ".x." + ".x." + ".x." ,
    "u":  "x.x" + "x.x" + "x.x" + "x.x" + "xxx" ,
    "v":  "x.x" + "x.x" + "x.x" + "x.x" + ".x." ,
    "w":  "x.x" + "x.x" + "x.x" + "xxx" + "x.x" ,
    "x":  "x.x" + "x.x" + ".x." + "x.x" + "x.x" ,
    "y":  "x.x" + "x.x" + "xxx" + ".x." + ".x." ,
    "z":  "xxx" + "..x" + ".x." + "x.." + "xxx" 
  },

  "palette": [
  {  
    "name": "mably",
    "colors": [
      "#13477b",
      "#2f1b10",
      "#d18529",
      "#d72a25",
      "#e42184",
      "#138898",
      "#9d2787",
      "#7f311b"
    ],
    "stroke": "#2a1f1d",
    "background": "#dfc792"
  },
  {  
    "name": "miradors",
    "colors": ["#ff6936", "#fddc3f", "#0075ca", "#00bb70"],
    "stroke": "#ffffff",
    "background": "#020202"
  },
  {  
    "name": "bloomberg",
    "colors": ["#ff5500", "#f4c145", "#144714", "#2f04fc", "#e276af"],
    "stroke": "#000",
    "background": "#fff3dd"
  },
  {  
    "name": "kaffeprat",
    "colors": ["#BCAA8C", "#D8CDBE", "#484A42", "#746B58", "#9A8C73"],
    "stroke": "#000",
    "background": "#fff"
  },
  {  
    "name": "hilda03",
    "colors": ["#e95145", "#f8b917", "#b8bdc1", "#ffb2a2"],
    "stroke": "#010101",
    "background": "#6b7752"
  },
  {
    "name": "rohlfs_3",
    "colors": ["#abdfdf", "#fde500", "#58bdbc", "#eff0dd"],
    "stroke": "#211029",
    "background": "#f76975"
  },
  {
    "name": "dale_night",
    "colors": ["#ae5d9d", "#f1e8bc", "#ef8fa3", "#f7c047", "#58c9ed", "#f77150"],
    "stroke": "#000000",
    "background": "#00ae83"
  },
  {
    "name": "cc234",
    "colors": ["#ffce49", "#ede8dc", "#ff5736", "#ff99b4"],
    "background": "#f7f4ed"
  },
  {
    "name": "sneaker",
    "colors": ["#e8165b", "#401e38", "#66c3b4", "#ee7724", "#584098"],
    "stroke": "#401e38",
    "background": "#ffffff"
  },

  {
    "name": "nowak",
    "colors": ["#e85b30", "#ef9e28", "#c6ac71", "#e0c191", "#3f6279", "#ee854e", "#180305"],
    "stroke": "#180305",
    "background": "#ede4cb"
  },
  {
    "name": "dt09",
    "colors": ["#052e57", "#de8d80"],
    "stroke": "#efebda",
    "background": "#efebda"
  },
  {
    "name": "present-correct",
    "colors": [ "#fd3741", "#fe4f11", "#ff6800", "#ffa61a", "#ffc219", "#ffd114", "#fcd82e", "#f4d730",
                "#ced562", "#8ac38f", "#79b7a0", "#72b5b1", "#5b9bae", "#6ba1b7", "#49619d", "#604791",
                "#721e7f", "#9b2b77", "#ab2562", "#ca2847" ]
  },
  {
    "name": "tundra2",
    "colors": ["#5f9e93", "#3d3638", "#733632", "#b66239", "#b0a1a4", "#e3dad2"]
  },
  {
    "name": "roygbiv-warm",
    "colors": [ "#705f84", "#687d99", "#6c843e", "#fc9a1a", "#dc383a", "#aa3a33", "#9c4257" ]
  },
  {
    "name": "jungle",
    "colors": [ "#adb100", "#e5f4e9", "#f4650f", "#4d6838", "#cb9e00", "#689c7d", "#e2a1a8", "#151c2e" ],
    "stroke": "#0e0f27",
    "background": "#cecaa9"
  },
  {
    "name": "ducci_g",
    "colors": ["#c75669", "#000000", "#11706a"],
    "stroke": "#11706a",
    "background": "#ecddc5"
  },
  {
    "name": "rag-taj",
    "colors": ["#ce565e", "#8e1752", "#f8a100", "#3ac1a6"],
    "background": "#efdea2"
  },
  {
    "name": "system.#05",
    "colors": ["#db4549", "#d1e1e1", "#3e6a90", "#2e3853", "#a3c9d3"],
    "stroke": "#000",
    "background": "#fff"
  },
  {
    "name": "san ramon",
    "colors": ["#4f423a", "#f6a74b", "#589286", "#f8e9e2", "#2c2825"],
    "stroke": "#2c2825",
    "background": "#fff"
  },
  {
    "name": "dt10",
    "colors": ["#e5dfcf", "#151513"],
    "stroke": "#151513",
    "background": "#e9b500"
  },
  {
    "name": "revolucion",
    "colors": ["#ed555d", "#fffcc9", "#41b797", "#eda126", "#7b5770"],
    "stroke": "#fffcc9",
    "background": "#2d1922"
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

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "state": {
    "blink_open": false,
    "blink_cur_t":0,
    "blink_end_t":0,

    "effect": [],

    "eye_color": "rgba(240,240,240,0.6)",

    "msg_color" : "red",
    "msg_grad_freq": 1/80,
    "msg_cur_t":0,
    "msg_end_t":0
  },

  "screnshake": false,

  "fg_amp_x": 0,
  "fg_amp_y": 5,
  "fg_freq_x": 0,
  "fg_freq_y": 1/20.0,
  "fg_phase_x": 0,
  "fg_phase_y": 0,

  "grid": [],
  "grid_mem": {},

  "bg_grid": [],
  "bg_key":[],
  "bg_amp": 32.0,
  "bg_freq": 1/64.0,
  "bg_phase_x": 0.3,
  "bg_phase_y": 0.1,

  "bg_counter":0,

  "rnd":[],

  "message_choice" : [ "", "game\nover", "1up", "ready",
    "insert\ncoin", "high\nscore",
    "credits\n0", "score\n0000"
  ],

  "effect_choice": ["ball", "squiggle", "bullet", "cluster", "" ],

  "text_square_size" : 10,
  "bg_color" : "#333",

  "background_type": 1,

  "param": {},
  "features":{}

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

function disp_txt(txt,cx,cy,w,h,c) {
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  for (let i =0; i<txt.length; i++) {
    if (!(txt[i] in g_info.alphabet)) { continue; }




  }


}

function disp_r(cx,cy,w,h,g,c,no_eyes,no_shadow,no_overlap) {
  no_eyes = ((typeof no_eyes === "undefined") ? false : no_eyes);
  no_shadow = ((typeof no_shadow === "undefined") ? false : no_shadow);
  no_overlap = ((typeof no_overlap === "undefined") ? false : no_overlap);
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  ds = _min(w/(g[0].length+1),h/(g.length+1));

  let shadow_offset = 4;

  let _o = 0.75;
  if (no_overlap) { _o = 0; }

  if (!no_shadow) {
    let _so = shadow_offset;
    for (let i=0; i<g.length; i++) {
      for (let j=0; j<g[i].length; j++) {
        let _x = cx + j*ds + ds/2;
        let _y = cy + i*ds + ds/2;

        if (g[i][j] > 0) {
          //ctx.fillStyle = "rgba(32,32,32,0.2)";

          ctx.fillStyle = '#777';
          ctx.beginPath();
          ctx.fillRect(_x + _so,_y + _so, ds + _o, ds + _o);

        }
       
      }
    }
  }


  for (let i=0; i<g.length; i++) {
    for (let j=0; j<g[i].length; j++) {
      let _x = cx + j*ds + ds/2;
      let _y = cy + i*ds + ds/2;

      if ((g[i][j] < 0) && (no_eyes)) { continue; }

      if (g[i][j] != 0) {
        //ctx.fillStyle = "rgba(32,32,32,0.2)";

        if (g[i][j] > 0) {
          ctx.fillStyle = c;
        }
        else {

          //ctx.fillStyle = "rgba(240,240,240,0.3)";
          //ctx.fillStyle = "rgba(240,240,240,0.9)";

          /*
          if (Math.floor(g_info.tick/2)%2) {
            ctx.fillStyle = "rgba(255,255,255,0.9)";
          }
          else {
            ctx.fillStyle = "rgba(30,30,30,0.9)";
          }
          */
          ctx.fillStyle = "rgba(230,230,230,0.9)";

        }

        ctx.beginPath();
        ctx.fillRect(_x,_y, ds + _o, ds + _o);

      }
    }
  }

}

function draw_squiggle(ctx, x, y, ds, start_frame, n_frame, c, sz) {
  ds = ((typeof ds === "undefined") ? 15: ds);
  start_frame = ((typeof start_frame === "undefined") ? 0 : start_frame);
  n_frame = ((typeof n_frame === "undefined") ? 8 : n_frame);
  c = ((typeof c === "undefined") ? "rgba(255,0,0,0.5)" : c);
  sz = ((typeof sz === "undefined") ? ds : sz);

  let xstep = [0,1,2,1];
  let _o = 0;

  for (let i=0; i<n_frame; i++) {
    let _y = i*ds;
    let _x = ds*xstep[(i+start_frame)%xstep.length];

    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.fillRect(x + _x, y + _y, sz + _o, sz + _o);
  }
}

function draw_text(ctx, base_x, base_y, txt, c, ds) {
  let _ds = ((typeof ds === "undefined") ? g_info.text_square_size : ds);
  c = ((typeof c === "undefined") ?  "rgba(200,200,200,0.4)" : c);
  let ab = g_info.alphabet;

  ctx.fillStyle = c;

  //let _ds = 30;
  //let _ds = g_info.size * 0.035;

  let cy = 0;
  let cur_line_idx = 0;
  let ch_width = 4;
  let ch_height = 6;

  for (let ch_idx=0; ch_idx<txt.length; ch_idx++) {
    let ch = txt[ch_idx];

    if (ch == '\n') {
      cy += ch_height*_ds;
      cur_line_idx=0;
      continue;
    }

    let cx = cur_line_idx*ch_width*_ds;
    cur_line_idx++;

    if (!(ch in ab)) { continue; }

    let gr = ab[ch];


    for (let i=0; i<5; i++) {
      for (let j=0; j<3; j++) {

        let _x = j*_ds + cx + base_x;
        let _y = i*_ds + cy + base_y;

        if (ch == 'o') {
          //console.log( ch, i*3 + j, gr[i*3 + j] );
        }

        if (gr[i*3 + j] == 'x') {
          ctx.beginPath();
          ctx.fillRect(_x, _y, _ds + 0.5, _ds + 0.5);
        }
      }
    }


  }

}

function draw_effect() {
  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;


  for (let i=0; i<g_info.state.effect.length; i++) {

    let _s_x = _cw/2;
    let _s_y = _ch/2;

    let _s_ds_bg = g_info.size*0.045;
    let _s_ds = g_info.size*0.035;

    let ele = g_info.state.effect[i];

    if (ele.type == "squiggle") {
      if (ele.init) {
        ele.next_frame_t = g_info.cur_t + ele.frame_delta_t;
        ele.init=false;
      }

      if (!g_info.pause) {
        if (g_info.cur_t >= ele.next_frame_t) {
          ele.frame_idx = (ele.frame_idx+1)%ele.n_frame;
          ele.next_frame_t += ele.frame_delta_t;
        }
      }

      ctx.save();

      ctx.translate(_cw/2, _ch/2);
      ctx.rotate(ele.a);
      ctx.translate(-_cw/2,-_ch/2);

      if (ele.frame_idx < 8) {

        let _xb = _s_x - _s_ds_bg/2 + ele.x;
        let _yb = _s_y - _s_ds_bg/2 + _s_ds + ele.y;

        let _x = _s_x - _s_ds/2 + ele.x;
        let _y = _s_y - _s_ds/2 + _s_ds + ele.y;

        draw_squiggle(ctx, _xb , _yb, _s_ds, 1, ele.frame_idx, "rgba(255, 128, 0, 0.95)", _s_ds_bg);
        draw_squiggle(ctx,  _x,   _y, _s_ds, 1, ele.frame_idx, "rgba(255, 0, 0, 0.95)");

      }
      else {
        let _xb = _s_x - _s_ds_bg/2 + ele.x;
        let _yb = _s_y + (ele.frame_idx-8)*_s_ds - _s_ds_bg/2 + _s_ds + ele.y;

        let _x = _s_x - _s_ds/2 + ele.x;
        let _y = _s_y + (ele.frame_idx-8)*_s_ds - _s_ds/2 + _s_ds + ele.y;

        draw_squiggle(ctx, _xb, _yb, _s_ds, ele.frame_idx+1, 8, "rgba(255, 128, 0, 0.95)", _s_ds_bg);
        draw_squiggle(ctx,  _x,  _y, _s_ds, ele.frame_idx+1, 8, "rgba(255, 0, 0, 0.95)");
      }

      ctx.restore();
    }

    else if (ele.type == "ball") {
      if (ele.init) {
        ele.next_frame_t = g_info.cur_t + ele.frame_delta_t;
        ele.init=false;
      }

      if (g_info.cur_t >= ele.next_frame_t) {
        ele.frame_idx = (ele.frame_idx+1)%ele.n_frame;
        ele.next_frame_t += ele.frame_delta_t;
      }

      let _x = _s_x - _s_ds/2 + ele.x;
      let _y = _s_y + ele.frame_idx*ele.vy - _s_ds/2 + _s_ds + ele.y;

      ctx.save();

      ctx.translate(_cw/2, _ch/2);
      ctx.rotate(ele.a);
      ctx.translate(-_cw/2,-_ch/2);

      ctx.beginPath();
      if (ele.frame_idx%2) {
        ctx.fillStyle = "rgba(255,30,0,0.9)";
      }
      else {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
      }

      ctx.fillRect(_x - ele.or/2, _y - ele.or/2, ele.or, ele.or);

      ctx.beginPath();
      if (ele.frame_idx%2) {
        ctx.fillStyle = "rgba(255,200,0,0.9)";
      }
      else {
        ctx.fillStyle = "rgba(200,200,0,0.9)";
      }

      ctx.fillRect(_x - ele.ir/2, _y - ele.ir/2, ele.ir, ele.ir);

      ctx.restore();
    }

    else if (ele.type == "explode") {
    }

    else if (ele.type == "bullet") {
      if (ele.init) {
        ele.next_frame_t = g_info.cur_t + ele.frame_delta_t;
        ele.init=false;
      }

      if (g_info.cur_t >= ele.next_frame_t) {
        ele.frame_idx = (ele.frame_idx+1)%ele.n_frame;
        ele.next_frame_t += ele.frame_delta_t;
      }

      let _x = _s_x - _s_ds/2 + ele.x;
      let _y = _s_y + ele.frame_idx*ele.vy - _s_ds/2 + _s_ds + ele.y;

      ctx.save();

      ctx.translate(_cw/2, _ch/2);
      ctx.rotate(ele.a);
      ctx.translate(-_cw/2,-_ch/2);

      ctx.beginPath();
      let c_cur = "";
      let c0 = "255,30,0";
      let c1 = "255,255,255";
      if (ele.frame_idx%2) {
        c_cur = c0;
        ctx.fillStyle = "rgba(" + c0 + ",0.9)";
      }
      else {
        c_cur = c1;
        ctx.fillStyle = "rgba(" + c1 + ",0.9)";
      }
      ctx.fillRect(_x,_y, ele.or, ele.or);


      let m = 3;
      m = _clamp( Math.floor(ele.frame_idx/3), 0, 3);
      for (let ii=0; ii<m; ii++) {
        let _alpha = 0.9;
        _alpha = _clamp( (1.0 - ii/3)*0.8, 0, 0.9);
        ctx.fillStyle = "rgba(" + c_cur + "," + _alpha.toString() + ")";
        ctx.beginPath();
        ctx.fillRect(_x,_y - (4*ele.or/4) + (1*ele.or/6) - (5*ii*ele.or/6), ele.or, ele.or/2);
      }

      ctx.restore();

    }

    else if (ele.type == "cluster") {

      if ( ((g_info.tick%120) >=  (120-55)) && ((g_info.tick%120) < (120-5))) {

        if ((g_info.tick%120)==0) { ele.init = true; }

        if (ele.init) {
          ele.next_frame_t = g_info.cur_t + ele.frame_delta_t;

          ele.cur_start_t = g_info.cur_t + ele.start_t;
          ele.cur_end_t = ele.cur_start_t + ele.ttl;
          ele.init=false;

          ele.c_p = _irnd(4);
        }

        if (g_info.cur_t >= ele.cur_end_t) {
          ele.cur_start_t = g_info.cur_t + _rnd(10000);
          ele.cur_end_t = ele.cur_start_t + _rnd(300);
          ele.next_frame_t = g_info.cur_t + ele.frame_delta_t;
          ele.cur_t = g_info.cur_t;
          ele.next_frame_t = ele.cur_start_t + ele.frame_delta_t;
          ele.frame_idx = 0;

          ele.s = _rnd(10,50);

          if ((i%8) == 0) {
            ele.x = _rnd(2*g_info.width/8, 6*g_info.width/8);
            ele.y = _rnd(2*g_info.height/8, 6*g_info.height/8);
          }
          else {
            let _p = Math.floor(i/8)*8;
            ele.x = g_info.state.effect[_p].x + _rnd(-10, 10);
            ele.y = g_info.state.effect[_p].y + _rnd(-10, 10);
          }

          ele.s = _rnd(10,50);

          ele.orig_x = ele.x;
          ele.orig_y = ele.y;
          ele.vx = _rnd(2.0);
          ele.vy = _rnd(2.0);
          ele.vc = _rnd(1.0);
          ele.start_t = _rnd(32);
          ele.orig_ttl = _rnd(16);
          ele.ttl = ele.orig_ttl;

          ele.c = 0.7;
          ele.dc = _irnd(-1,1)/8;

          let _S = g_info.size/4;
          ele.s = _clamp( _S*_rndpow(2.0), 10, _S);
          ele.ds = 2*_rnd(-1,1);

          ele.vx = _rnd(-5,5);
          ele.vy = _rnd(-5,5);
        }

        if (g_info.cur_t >= ele.cur_start_t) {

          if (g_info.cur_t >= ele.next_frame_t) {
            ele.frame_idx = (ele.frame_idx+1)%ele.n_frame;
            ele.next_frame_t += ele.frame_delta_t;
          }

          if (!g_info.pause) {
            ele.x += ele.vx;
            ele.y += ele.vy;

            ele.c = _clamp( ele.c + ele.dc, 0, 1); 
            ele.s = _clamp( ele.s + ele.ds, 1, 1000);
          }

          let _r = Math.floor(ele.c*255);
          let _ff = (g_info.tick + ele.c_p)%4;
          if ((_ff==0) || (_ff==1)) {
            ctx.fillStyle = "rgba(" + _r + ",0,0,0.9)";
          }
          else if ((_ff==2) || (_ff==3)) {
            ctx.fillStyle = "rgba(" + _r + "," + _r + ",0,0.9)";
          }
          else if ((_ff==4) || (_ff==5)) {
            ctx.fillStyle = "#333";
          }
          else if ((_ff==5) || (_ff==7))  {
            ctx.fillStyle = "#eee";
          }
          ctx.beginPath();
          ctx.fillRect(ele.x - ele.s/2, ele.y - ele.s/2, ele.s, ele.s);
        }

      }

    }

  }

}



function draw_message() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  let msgs = g_info.param.message.split("\n");
  //let msg_x = _cw/2;
  //let msg_y = 50;
  let msg_y = g_info.text_square_size*5;
  let _mso = 10;
  let msg_c_shadow = "rgba(90,90,90, 1.0)";
  let msg_c = "rgba(100, 100, 100, 1.0)";

  if (Math.floor(g_info.tick/4)%2) {
    msg_c = "rgba(240,240,240,0.9)";
  }
  else {
    msg_c = "rgba(240,40,0,0.9)";
  }

  let _gpx0 = (Math.sin(g_info.state.msg_grad_freq*g_info.tick*Math.PI*2)+1.0)/2.0;
  let _gpx1 = (Math.sin(g_info.state.msg_grad_freq*g_info.tick*Math.PI*2 + Math.PI/4)+1.0)/2.0;
  let _gpx2 = (Math.sin(g_info.state.msg_grad_freq*g_info.tick*Math.PI*2 + Math.PI/2)+1.0)/2.0;

  _gpx0 = _clamp(Math.floor(_gpx0*255), 40, 255);
  _gpx1 = _clamp(Math.floor(_gpx1*255), 40, 255);
  _gpx2 = _clamp(Math.floor(_gpx2*255), 40, 255);

  let _c0, _c1, _c2;

  if (g_info.state.msg_color == "red") {
    _c0 = "rgb(" + _gpx0 + ",0,0)";
    _c1 = "rgb(" + _gpx1 + ",0,0)";
    _c2 = "rgb(" + _gpx2 + ",0,0)";
  }
  else if (g_info.state.msg_color == "white") {
    _c0 = "rgb(" + _gpx0 + "," + _gpx0 + "," + _gpx0 + ")";
    _c1 = "rgb(" + _gpx1 + "," + _gpx1 + "," + _gpx1 + ")";
    _c2 = "rgb(" + _gpx2 + "," + _gpx2 + "," + _gpx2 + ")";
  }

  msg_c = ctx.createLinearGradient(0,0,1000,1000);
  msg_c.addColorStop(0, _c0);
  msg_c.addColorStop(0.5, _c1);
  msg_c.addColorStop(1.0, _c2);

  msg_c_shadow = "#333";

  let msg_char_dx = g_info.text_square_size*4;
  let msg_ox = 30/2;

  let msg_x = _cw/2 - (msgs[0].length*msg_char_dx/2)

  if (msgs.length == 3) {

    msg_x = _cw/2 - (msgs[0].length*msg_char_dx/2)
    msg_y = _ch/6;

    draw_text(ctx, msg_x+_mso , msg_y+_mso , msgs[0] , msg_c_shadow);
    draw_text(ctx, msg_x      , msg_y      , msgs[0] , msg_c);

    msg_x = _cw/2 - (msgs[1].length*msg_char_dx/2)
    msg_y = 3*_ch/6;

    draw_text(ctx, msg_x+_mso , msg_y+_mso , msgs[1], msg_c_shadow);
    draw_text(ctx, msg_x      ,msg_y       , msgs[1], msg_c );

    msg_x = _cw/2 - (msgs[2].length*msg_char_dx/2)
    msg_y = 5*_ch/6;

    draw_text(ctx, msg_x+_mso , msg_y+_mso , msgs[2], msg_c_shadow );
    draw_text(ctx, msg_x      , msg_y      , msgs[2], msg_c);
  }
  else {
    if (msgs.length >= 1) {

      msg_x = _cw/2 - (msgs[0].length*msg_char_dx/2) + msg_ox;
      msg_y = 1*_ch/12;

      draw_text(ctx, msg_x+_mso , msg_y+_mso , msgs[0], msg_c_shadow );
      draw_text(ctx, msg_x      , msg_y      , msgs[0], msg_c);
    }
    if (msgs.length >= 2) {
      msg_x = 150;
      msg_y = 500;

      msg_x = _cw/2 - (msgs[1].length*msg_char_dx/2) + msg_ox;
      msg_y = 5*_ch/6;

      draw_text(ctx, msg_x+_mso , msg_y+_mso , msgs[1], msg_c_shadow );
      draw_text(ctx, msg_x      , msg_y      , msgs[1], msg_c);
    }
  }

}


function anim() {

  // fps
  //
  let now_t, delta_t;

  if (!g_info.pause) {
    now_t = Date.now();
    delta_t = (now_t - g_info.last_t);
    g_info.cur_t = now_t;
    g_info.last_t = now_t;
    g_info.delta_t = delta_t;
    if (delta_t > 0) { g_info.fps = 1000/(delta_t); }
    if (g_info.fps_debug) {
      if ((g_info.tick%30)==0) {
        console.log(g_info.fps);
      }
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

  if (!g_info.ready) {
    loading_anim();
    window.requestAnimationFrame(anim);
    return;
  }


  if (g_info.param.effect_type == "cluster") {
    if ((g_info.tick%120) > (120-55)) {
      g_info.screenshake = true;
    }
    else {
      g_info.screenshake = false;
    }

  }

  if (g_info.screenshake) {
    ctx.save();

    if (!g_info.pause) {
      ctx.translate( _irnd(-10,10), _irnd(-10,10) );
    }
  }

  let _base_block_w = g_info.grid[0].length;
  let _base_block_h = g_info.grid.length;

  //---

  let ds = _min(_cw/(_base_block_w+5),_ch/(_base_block_h+5));

  let grid = g_info.grid;

  let cx = _cw/2 - g_info.grid[0].length*ds/2;
  let cy = _ch/2 - g_info.grid.length*ds/2;

  let shadow_offset = 10;


  // background
  //
  let pal_n = g_info.palette_choice.colors.length;
  let walk_idx = 0;
  let walk_d = Math.floor(g_info.rnd[0]*65537);
  walk_d = 1;
  let bg_seg = 16;
  let bg_ds = _max(_cw, _ch)/bg_seg;
  let bgo = 0;

  /*
  let seq_del = 0;
  let _ft = Math.floor(g_info.tick/16)%8;
  if (_ft == 0) { seq_del = 0; }
  else if (_ft==1) { seq_del = 1; }
  else if (_ft==2) { seq_del = 2; }
  else if (_ft==3) { seq_del = 1; }
  */
  //if ((Math.floor(g_info.tick/16)%12)==0) { g_info.bg_counter++; }

  for (let i=-3; i<(bg_seg+3); i++) {
    for (let j=-3; j<(bg_seg+3); j++) {
      let x = j*bg_ds + bgo/2;
      let y = i*bg_ds + bgo/2;
      if ((i%2)==1) {
        x += bg_ds/2;
      }

      //let _bg_key = g_info.bg_key[ (walk_idx  + seq_del) % g_info.bg_key.length ];

      if (g_info.background_type == 0) {
        let _bg_key = g_info.bg_key[ walk_idx  ];

        let pal_c = g_info.palette_choice.colors[ walk_idx % g_info.palette_choice.colors.length ];
        walk_idx = (walk_idx+walk_d)%g_info.bg_key.length;

        let _bg_grid = g_info.grid_mem[_bg_key];

        let dx = g_info.bg_amp*Math.cos( g_info.bg_freq*g_info.tick + g_info.bg_phase_x );
        let dy = g_info.bg_amp*Math.sin( g_info.bg_freq*g_info.tick + g_info.bg_phase_y );

        let rgb = _hex2rgb(pal_c);
        let c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.075)";

        disp_r(x+dx, y+dy, bg_ds-bgo, bg_ds-bgo, _bg_grid.grid, c, true, true, true);
      }

      else if (g_info.background_type == 1) {

        let __n = 12;
        let seq_del = 0;
        let _ft = Math.floor(g_info.tick/16)%__n;
        if (i%2) {
          if (_ft < (__n/2)) { seq_del = _ft; }
          else { seq_del = __n-_ft; }
        }
        else {
          if (_ft >= (__n/2)) { seq_del = _ft; }
          else { seq_del = __n-_ft; }
        }

        let col_idx = (j + i + 10 + seq_del )%g_info.palette_choice.colors.length;


        let m_key_idx = (j + 5 + seq_del ) % (g_info.bg_key.length);
        let m_idx = g_info.bg_key[m_key_idx];

        let _bg_grid = g_info.grid_mem[m_idx];

        let pal_c = g_info.palette_choice.colors[ col_idx ];
        let rgb = _hex2rgb(pal_c);
        let c = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.075)";
        let dx = g_info.bg_amp*Math.cos( g_info.bg_freq*g_info.tick + g_info.bg_phase_x );
        let dy = g_info.bg_amp*Math.sin( g_info.bg_freq*g_info.tick + g_info.bg_phase_y );
        disp_r(x+dx, y+dy, bg_ds-bgo, bg_ds-bgo, _bg_grid.grid, c, true, true, true);

      }

    }
  }

  // draw text under monster but over backgroudn texture
  //
  draw_message();

  // Monster
  //
  let dx = g_info.fg_amp_x*Math.cos( g_info.fg_freq_x*g_info.tick + g_info.fg_phase_x );
  let dy = g_info.fg_amp_y*Math.cos( g_info.fg_freq_y*g_info.tick + g_info.fg_phase_y );

  // shadow
  //
  let _so = shadow_offset;
  for (let i=0; i<grid.length; i++) {
    for (let j=0; j<grid[i].length; j++) {
      let x = cx + j*ds + dx;
      let y = cy + i*ds + dy;

      if (grid[i][j] > 0) {
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.fillRect(x + _so,y + _so, ds + 0.75, ds + 0.75);

      }

    }
  }

  // main monster
  //
  for (let i=0; i<grid.length; i++) {
    for (let j=0; j<grid[i].length; j++) {
      let x = cx + j*ds + dx;
      let y = cy + i*ds + dy;

      if (grid[i][j] != 0) {
        if (grid[i][j] > 0) {
          ctx.fillStyle = g_info.palette_choice.colors[0];
          ctx.beginPath();
          ctx.fillRect(x,y, ds + 0.75, ds + 0.75);

          let _g = g_info.grid_mem[grid[i][j]].grid;
          let _c = g_info.grid_mem[grid[i][j]].c;

          disp_r(x,y,ds,ds, _g, _c);
        }
        else {

          ctx.beginPath();
          ctx.fillStyle =  g_info.state.eye_color;
          ctx.fillRect(x,y, ds + 0.125, ds + 0.125);

        }

      }
    }
  }

  // effects above background but behind monster
  //
  draw_effect();

  if (g_info.screenshake) {
    ctx.restore();
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


function update_cluster() {

  for (let i=0; i<g_info.state.effect.length; i++) {
    let ele = g_info.state.effect[i];

    ele.c_p = _irnd(4);

    ele.s = _rnd(10,50);

    if ((i%8) == 0) {
      ele.x = _rnd(2*g_info.width/8, 6*g_info.width/8);
      ele.y = _rnd(2*g_info.height/8, 6*g_info.height/8);
    }
    else {
      let _p = Math.floor(i/8)*8;
      ele.x = g_info.state.effect[_p].x + _rnd(-10, 10);
      ele.y = g_info.state.effect[_p].y + _rnd(-10, 10);
    }

    ele.orig_x = ele.x;
    ele.orig_y = ele.y;
    ele.vx = _rnd(2.0);
    ele.vy = _rnd(2.0);
    ele.vc = _rnd(1.0);
    ele.start_t = _rnd(32);
    ele.orig_ttl = _rnd(16);
    ele.ttl = ele.orig_ttl;


    //ele.x = ele.orig_x;
    //ele.y = ele.orig_y;

    ele.c = 0.7;
    ele.dc = _irnd(-1,1)/8;

    let _S = g_info.size/4;
    ele.s = _clamp( _S*_rndpow(2.0), 10, _S);
    ele.ds = 2*_rnd(-1,1);


    ele.vx = _rnd(-5,5);
    ele.vy = _rnd(-5,5);

  }


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

  g_info.size = Math.floor(dS);

  g_info.text_square_size = g_info.size*0.025;

  if (g_info.param.effect_type == "cluster") {
    update_cluster();
  }

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
}

function init() {

  g_info.ready = true;
  g_info.grid = gen_vadfad();

  let g = g_info.grid;
  let base_idx = _get_max_idx(g) + 1;

  for (let i=0; i<g.length; i++) {
    for (let j=0; j<g[i].length; j++) {
      let idx = g[i][j];
      if (idx == 0) { continue; }
      if (idx in g_info.grid_mem) { continue; }
      let _rg = gen_vadfad(base_idx);
      g_info.grid_mem[idx] = {"grid":_rg, "c": _arnd(g_info.palette_choice.colors.slice(1)) };
      base_idx= _get_max_idx(_rg)+1;
    }
  }

  g_info.bg_grid = gen_vadfad(base_idx)+1;
  update_effect();

  for (let key in g_info.grid_mem) {
    let ikey = parseInt(key);
    if (ikey>0) {
      g_info.bg_key.push(ikey);
    }
  }


  //setTimeout(function() { init_fin(); }, 50);
}

function init_param() {
  g_info.param["effect_type"] = _arnd(g_info.effect_choice);
  g_info.param["message"] = _arnd(g_info.message_choice);

  g_info.param["background_type"] = _irnd(2);

  g_info.background_type = g_info.param.background_type;
}


function update_effect() {
  let _cw = g_info.width;
  let _ch = g_info.width;

  let effect_type = g_info.param.effect_type;

  let M = 8;
  if (effect_type == "cluster") {
    M = 1024;
  }

  g_info.param["effect_type"] = effect_type;

  for (let i=0; i<M; i++) {
    let r = 50;
    let cx = _cw/2;
    let cy = _ch/2;
    let a = (i/M)*Math.PI*2;
    let x = r*Math.cos(a) + cx;
    let y = r*Math.sin(a) + cy;
    let ele = {
      "type": effect_type, //"squiggle",
      "init":true,
      "orig_x": 100,
      "orig_y":0,
      "a": a,
      "da": 0,
      "x": 0,
      "y": 250,
      "dx": 0,
      "dy": 0,

      "ds": -0.1,
      "s": 30,
      "c": 1.0,
      "dc": -0.1,

      "vx": 0,
      "vy": 0,
      "state":"start",
      "frame_idx": 0,
      "next_frame_t": 0,
      "frame_delta_t" : 40,
      "n_frame" : 64,
      "frame": []
    };

    ele.y = g_info.size/3;

    // ball testing
    //
    if (effect_type == "ball") {

      //ele.x = 30*Math.cos(a) + cx;
      //ele.y = 30*Math.sin(a) + cy;

      //ele.x = 0;
      //ele.y = 250;
      //ele.y = g_info.size/3;
      ele.vy = 10;
      //ele.or = 35;
      //ele.ir = 25;
      ele.or = 45;
      ele.ir = 35;
      ele.n_frame = 100;
    }
    else if (effect_type == "bullet") {
      //ele.y = 250;
      //ele.y = g_info.size/3;
      ele.vy = 10;
      ele.or = 35;
      ele.ir = 25;
      ele.n_frame = 100;
    }
    else if (effect_type == "cluster") {

      if ((i%8) == 0) {
        ele.x = _rnd(2*g_info.width/8, 6*g_info.width/8);
        ele.y = _rnd(2*g_info.height/8, 6*g_info.height/8);
      }
      else {
        let _p = Math.floor(i/8)*8;
        ele.x = g_info.state.effect[_p].x + _rnd(-10, 10);
        ele.y = g_info.state.effect[_p].y + _rnd(-10, 10);
      }

      ele.s = _rnd(10,50);

      ele.orig_x = ele.x;
      ele.orig_y = ele.y;
      ele.vx = _rnd(2.0);
      ele.vy = _rnd(2.0);
      ele.vc = _rnd(1.0);
      ele.start_t = _rnd(32);
      ele.orig_ttl = _rnd(16);
      ele.ttl = ele.orig_ttl;
    }

    g_info.state.effect.push(ele);
  }

}

// MAIN
//
(()=>{

  console.log("fxhash:",fxhash);

  g_info.last_t = Date.now();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

  init_param();

  g_info.palette_choice = _arnd( g_info.palette );

  console.log(g_info.palette_choice.name);

  g_info.cur_t = Date.now();
  g_info.last_t = g_info.cur_t;
  g_info.delta_t = 0;

  if (_irnd(2) == 0) {
    g_info.state.eye_color = "rgba(240,240,240,0.6)";
    g_info.param["eye_color"] = "white";
  }
  else {
    g_info.state.eye_color = "rgba(40,40,40,0.6)";
    g_info.param["eye_color"] = "black";
  }
  g_info.state.msg_color = ["red", "white"][_irnd(2)];

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


  window.$fxhashFeatures = {
    "Color Scheme": g_info.palette_choice.name,
    "Eye Type" : g_info.param.eye_choice,
    "Eye Color" : g_info.param.eye_color,
    "Pixel Height": g_info.param.orig_height,
    "Pixel Width": g_info.param.orig_width,
    "Background Type": g_info.param.background_type
  };

  if (g_info.param.message.length > 0) {
    window.$fxhashFeatures["Message"] = g_info.param.message.split("\n").join(" ");
  }
  if (g_info.param.effect_type.length > 0) {
    window.$fxhashFeatures["Effect"] = g_info.param.effect_type;
  }

  console.log(">>", window.$fxhashFeatures );

  window.requestAnimationFrame(anim);

})();

function gen_vadfad(base_idx) {
  base_idx = ((typeof base_idx === "undefined") ? 1 : base_idx);
  let grid = [
  ];

  let H = [ { "v":6, "p":0.1 }, { "v":7, "p":0.1 }, {"v":8, "p":0.8} ];
  let W = [ { "v":7, "p":0.05 }, { "v":8, "p":0.3 }, {"v":9, "p":0.3}, {"v":10, "p":0.3}, {"v":11, "p":.05}, {"v":15, "p":1/64.0}];

  // eye_choice:
  //
  // 0 - horizontal (2 pixel wide, 1 high) 
  // 1 - vertical (1 pixel wide , 2 hight)
  // 2 - single (1x1 pixel each)
  //
  let eye_choice = _irnd(3);

  let fill_corner = ((_rnd() < 0.5) ? true : false);

  //let h = H[_irnd(3)].v;
  //let w = W[_irnd(4)].v;

  let h = _arnd(H).v;
  let w = _arnd(W).v;

  if (base_idx == 1) {
    g_info.param["orig_height"] = h;
    g_info.param["orig_width"] = w;
    g_info.param["eye_choice"] = eye_choice;
  }

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
      idx++;
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

  for (let i=0; i<h; i++) {
    let s = '';
    for (let j=0; j<w; j++) {
      s += grid[i][j];
    }
  }
  return grid;
}

