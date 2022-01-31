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

  //"native_width" : 826,
  //"native_height" : 1425,

  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "rnd":[],

  "type" : "WebGL",
  "app" : {},
  "container" :{},

  "ready": false,

  //"toks" : ["head", "chest", "leg", "feet", "arm", "arch", "board" ],
  "toks" : ["head", "chest", "leg", "feet", "arm", "board" ],

  "sprite": {
    "head": [],
    "chest": [],
    "leg": [],
    "feet":[],
    "arm":[],

    //"arch":[],
    "board":[]
  },

  "active" : {
    "head": "",
    "chest": "",
    "leg": "",
    "feet": "",
    "arm": "",

    //"arch":"",
    "board":""
  },


  "tarot_major_name" : [
    "The Fool", "The Magician", "The Papess/High Priestess", "The Empress",
    "The Emperor","The Pope/Hierophant","The Lovers","The Chariot","Strength",
    "The Hermit","The Wheel","Justice","The Hanged Man","Death","Temperance",
    "The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World"
  ],


  "state" : {
    "head" : { "v": false, "idx": 0, "anim_idx":0, "di":180, "x":60, "y":70, "dx":0, "dy":0, "da":0, "dp":0, "lx": 1, "ly": 2, "scale": 0.72, "disp_w":0, "disp_h":0 },
    "chest": { "v": false, "idx": 0, "anim_idx":0, "di":185, "x":60, "y":70, "dx":0, "dy":0, "da":0, "dp":0, "lx": 1, "ly": 2, "scale": 0.72, "disp_w":0, "disp_h":0  },
    "leg"  : { "v": false, "idx": 0, "anim_idx":0, "di":190, "x":60, "y":70, "dx":0, "dy":0, "da":0, "dp":0, "lx": 1, "ly": 2, "scale": 0.72, "disp_w":0, "disp_h":0  },
    "feet" : { "v": false, "idx": 0, "anim_idx":0, "di":175, "x":60, "y":70, "dx":0, "dy":0, "da":0, "dp":0, "lx": 1, "ly": 2, "scale": 0.72, "disp_w":0, "disp_h":0  },
    "arm"  : { "v": false, "idx": 0, "anim_idx":0, "di":170, "x":60, "y":70, "dx":0, "dy":0, "da":0, "dp":0, "lx": 1, "ly": 2, "scale": 0.72, "disp_w":0, "disp_h":0  },

    //"arch" :  { "v": false, "idx": 0, "anim_idx":0, "di":1, "x":0, "y":0, "dx":0, "dy":0, "da":0, "dp":0, "lx":1, "ly":2, "scale":0.95, "disp_w":0, "disp_h":0  },
    "board" : { "v": false, "idx": 0, "anim_idx":0, "di":1, "x":0, "y":0, "dx":0, "dy":0, "da":0, "dp":0, "lx":1, "ly":2, "scale":1.0, "disp_w":0, "disp_h":0  },

    "name" : { "v": false, "idx": 0 }
  },

  "img" : {
    "head" : { "w": 826, "h" : 1425 }, 
    "chest": { "w": 826, "h" : 1425 },
    "leg"  : { "w": 826, "h" : 1425 },
    "feet" : { "w": 826, "h" : 1425 },
    "arm"  : { "w": 826, "h" : 1425 },

    //"arch" :  { "w": 1250, "h" : 1650 },
    "board" : { "w": 1500, "h" : 1500 },
  },

  "count":0,

  "location": {
    "head": [
      "img/head_00.png", "img/head_01.png", "img/head_02.png",
      "img/head_03.png", "img/head_04.png", "img/head_05.png",
      "img/head_06.png", "img/head_07.png", "img/head_08.png",
      "img/head_09.png", "img/head_10.png", "img/head_11.png"
    ],
    "chest": [
      "img/chest_00.png", "img/chest_01.png", "img/chest_02.png",
      "img/chest_03.png", "img/chest_04.png", "img/chest_05.png",
      "img/chest_06.png", "img/chest_07.png", "img/chest_08.png",
      "img/chest_09.png", "img/chest_10.png", "img/chest_11.png",
      "img/chest_12.png", "img/chest_13.png"
    ],
    "leg": [
      "img/leg_00.png", "img/leg_01.png", "img/leg_02.png",
      "img/leg_03.png", "img/leg_04.png", "img/leg_05.png",
      "img/leg_06.png", "img/leg_07.png", "img/leg_08.png",
      "img/leg_09.png", "img/leg_10.png", "img/leg_11.png",
      "img/leg_12.png", "img/leg_13.png"
    ],
    "feet":[
      "img/feet_00.png", "img/feet_01.png", "img/feet_02.png",
      "img/feet_03.png", "img/feet_04.png", "img/feet_05.png",
      "img/feet_06.png", "img/feet_07.png", "img/feet_08.png",
      "img/feet_09.png", "img/feet_10.png", "img/feet_11.png",
      "img/feet_12.png", "img/feet_13.png", "img/feet_14.png",
      "img/feet_15.png"
    ],
    "arm": [
      "img/arm_00.png", "img/arm_01.png", "img/arm_02.png",
      "img/arm_03.png", "img/arm_04.png", "img/arm_05.png",
      "img/arm_06.png", "img/arm_07.png", "img/arm_08.png",
      "img/arm_09.png", "img/arm_10.png", "img/arm_11.png",
      "img/arm_12.png", "img/arm_13.png", "img/arm_14.png",
      "img/arm_15.png"
    ],

    //"arch" : [ "img/arches_0.png", "img/arches_1.png", "img/arches_2.png", "img/arches_3.png" ],

    "board" : [ "img/board_0.png" ]

  },


  //"bg_color" : "#111",
  //"bg_color" : "#eee",
  "bg_color" : "#722",
  "f_list": [ ],
  "f_hist":[]

};

function howdy() {
  let _howdy = [
    " _  _  _____      _______   __",
    "| || |/ _ \\ \\    / /   \\ \\ / /",
    "| __ | (_) \\ \\/\\/ /| |) \\ V / ",
    "|_||_|\\___/ \\_/\\_/ |___/ |_|  ",
    "                              "
  ];
  console.log(_howdy.join("\n"));
}

//-----
//-----


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

function rgb2num(r,g,b) {
  if (typeof g === "undefined") {
    g = r.g;
    b = r.b;
    r = r.r;
  }

  return Math.floor(b) + Math.floor(b)*256 + Math.floor(r)*(256*256);
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

function _clamp(v,l,u) {
  if (v<l) { v = l; }
  if (v>u) { v = u; }
  return v;
}

function _irnd(l,u) {
  if (typeof u === "undefined") {
    u = l;
    l = 0;
  }
  return Math.floor(fxrand()*(u-l) + l);
}

function _rnd(l,u) {
  if (typeof l === "undefined") { return fxrand(); }
  if (typeof u === "undefined") { u = l; l = 0.0; }

  return fxrand()*(u-l) + l;
}


//-----
//-----

// dispaly dispatch, called every animation frame,
// most likely originating from the callbacks setup
// in f_hist.
//
// By convention, phase takes on a value from 0 to 1
//
// phase is the parameter that controls any animation
//
function disp(ctx, fname, x, y, w, phase) {

  let v=1;

  if (g_info.anim == false) { phase = 1; }

  if (fname == "") {
  }
  else if (fname == "") {
  }

}

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);
  for (let i=0; i<g_info.f_hist.length; i++) {

    if (i == (g_info.f_hist.length-1)) {
      g_info.f_hist[i].f( { "last": true } );
    }
    else {
      g_info.f_hist[i].f();
    }
  }

  window.requestAnimationFrame(anim);

  if (g_info.anim) {

    if (!g_info.pause) {
      g_info.tick += 1;
      g_info.tick_val = 16*(1.0 + Math.sin(Math.PI*2.0*g_info.tick/g_info.speed_factor));
    }

  }

}

function screenshot() {

  g_info.app.renderer.extract.canvas( g_info.app.stage ).toBlob(function(x) {
    let link = document.createElement("a");
    let imguri = URL.createObjectURL(x);
    link.download = "grift_graft_corpse.png";

    link.href = imguri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

  }, "image/png");

}

//---


function draw_clear() {
  //let toks = ["head", "chest", "leg", "feet", "arm", "arch" ];
  let toks = g_info.toks;
  for (let i=0; i<toks.length; i++) {
    let tok = toks[i];
    g_info.container.removeChild( g_info.active[tok] );
    g_info.active[tok] = {};
  }
}

function draw_rand(h_idx, c_idx, a_idx, l_idx, f_idx) {
  //let toks = ["feet", "leg", "chest", "arm", "head"];
  let toks = g_info.toks;

  let zord = [ 1, 2, 3, 4, 5, -2, -1 ];
  //for (let i=0; i<toks.length; i++) { zord.push(toks.length - i+1); }

  let _idx = [];

  draw_clear();

  h_idx = _clamp(h_idx, 0, g_info.sprite["head"].length-1);
  c_idx = _clamp(c_idx, 0, g_info.sprite["chest"].length-1);
  a_idx = _clamp(a_idx, 0, g_info.sprite["arm"].length-1);
  l_idx = _clamp(l_idx, 0, g_info.sprite["leg"].length-1);
  f_idx = _clamp(f_idx, 0, g_info.sprite["feet"].length-1);

  g_info.container.addChild( g_info.sprite["head"][h_idx] );
  g_info.container.addChild( g_info.sprite["chest"][c_idx] );
  g_info.container.addChild( g_info.sprite["arm"][a_idx] );
  g_info.container.addChild( g_info.sprite["leg"][l_idx] );
  g_info.container.addChild( g_info.sprite["feet"][f_idx] );

  //g_info.container.addChild( g_info.sprite["arch"][0] );
  g_info.container.addChild( g_info.sprite["board"][0] );

  g_info.active["head"]  = g_info.sprite["head"][h_idx] ;
  g_info.active["chest"] = g_info.sprite["chest"][c_idx] ;
  g_info.active["arm"]   = g_info.sprite["arm"][a_idx] ;
  g_info.active["leg"]   = g_info.sprite["leg"][l_idx] ;
  g_info.active["feet"]  = g_info.sprite["feet"][f_idx] ;

  //g_info.active["arch"]  = g_info.sprite["arch"][0] ;
  g_info.active["board"]  = g_info.sprite["board"][0] ;

  _idx.push(f_idx);
  _idx.push(l_idx);
  _idx.push(c_idx);
  _idx.push(a_idx);
  _idx.push(h_idx);

  //_idx.push(0);
  _idx.push(0);

  for (let i=0; i<toks.length; i++) {
    let tok = toks[i];
    g_info.state[tok].dp  = 2.0*Math.PI*fxrand();
    g_info.state[tok].v = true;

    g_info.active[tok].zIndex = zord[i];

    // init
    //
    g_info.state[toks[i]].idx = 0;
  }

  g_info.state.head.idx    = h_idx;
  g_info.state.arm.idx     = a_idx;
  g_info.state.chest.idx   = c_idx;
  g_info.state.feet.idx    = f_idx;
  g_info.state.leg.idx     = l_idx;

  //g_info.state.arch.idx     = 0;
  g_info.state.board.idx     = 0;

}


//---

// after all texture loading is done, this function is called
// and should be the final endpoint of the initialization process
//
function init_finalize() {
  draw_rand(0, 0, 0, 0, 0);
}


function animate_pixi(dt) {
  if (!g_info.ready) { return; }

  for (let i=0; i<g_info.toks.length; i++) {
    let tok = g_info.toks[i];

    if (g_info.state[tok].v) {

        //board NaN 2 1 0 2.6627873094710455
      //console.log("before:", tok, g_info.active[tok].y);

      //console.log( tok, g_info.state[tok].dy , g_info.state[tok].ly, g_info.state[tok].anim_idx , g_info.state[tok].di, g_info.state[tok].dp );

      g_info.state[tok].anim_idx++;
      g_info.state[tok].dy =
        g_info.state[tok].ly*Math.sin( (2.0*Math.PI*g_info.state[tok].anim_idx / g_info.state[tok].di) + g_info.state[tok].dp );
      g_info.active[tok].y = g_info.state[tok].y + g_info.state[tok].dy;
      g_info.active[tok].x = g_info.state[tok].x + g_info.state[tok].dx;

      //console.log("after:", tok, g_info.active[tok].y);


      //console.log(tok, g_info.active[tok].y);
    }
  }

  g_info.count++;
}

function _mod1(v) {
  if ((v>=0) && (v<=1)) { return v; }

  let q = Math.floor(v);
  return v-q;
}

function texture_setup(x) {
  //let toks = ["head", "chest", "leg", "feet", "arm" , "arch"];
  let toks = g_info.toks;

  let parts_hsv = [];

  let _s = 0.2;
  let _v = 0.85;


  //parts_hsv.push( { "h": fxrand(), "s": 0.5, "v": 0.2 } )
  parts_hsv.push( { "h": fxrand(), "s": _s, "v": _v } )
  for (let i=1; i<toks.length; i++) {
    let _A = (2.0*fxrand() - 1.0)*0.1;
    _A = 0;
    parts_hsv.push( { "h": parts_hsv[0].h, "s": _A+_s, "v": _A+_v } );
  }
  parts_hsv[1].v = 0.7;
  parts_hsv[2].v = 0.7;

  parts_hsv[3].s = 0.5;
  parts_hsv[3].v = 0.9;

  parts_hsv[5].h = _mod1(parts_hsv[0].h + 0.5);
  parts_hsv[5].s = 0.35;
  parts_hsv[5].v = 0.45;

  /*
  parts_hsv[6].h = _mod1(parts_hsv[0].h + 0.5);
  parts_hsv[6].s = 0.55;
  parts_hsv[6].v = 0.7;
  */


  /*
  parts_hsv.push( { "h": parts_hsv[0].h, "s": 0.25, "v": 0.2 } )
  parts_hsv.push( { "h": parts_hsv[0].h, "s": 0.3, "v": 0.2 } )
  parts_hsv.push( { "h": parts_hsv[0].h, "s": 0.27, "v": 0.2 } )
  parts_hsv.push( { "h": parts_hsv[0].h, "s": 0.55, "v": 0.2 } )
  parts_hsv.push( { "h": parts_hsv[0].h, "s": 0.47, "v": 0.2 } )
  */


  for (let i=0; i<toks.length; i++) {
    let tok = toks[i];

    let _scale = g_info.state[tok].scale;

    let s_h = g_info.height ;
    //let s_w = Math.floor((g_info.native_width/g_info.native_height) * s_h);
    let s_w = Math.floor((g_info.img[tok].w/g_info.img[tok].h) * s_h);

    s_h *= _scale;
    s_w *= _scale;

    g_info.state[tok].x = Math.floor(g_info.width/2 - s_w/2);

    for (let j=0; j<g_info.location[tok].length; j++) {
      let loc = g_info.location[tok][j];

      let _sprite  = new PIXI.Sprite(PIXI.Loader.shared.resources[loc].texture);

      _sprite.width   = s_w;
      _sprite.height  = s_h;

      g_info.state[tok].disp_w = s_w;
      g_info.state[tok].disp_h = s_h;

      let rgb = HSVtoRGB(parts_hsv[i].h, parts_hsv[i].s, parts_hsv[i].v);
      _sprite.tint = rgb2num(rgb);

      g_info.sprite[tok].push( _sprite );
    }

  }

  g_info.ready = true;

  init_finalize();
}


function texture_load() {
  let toks = g_info.toks;

  let img_list = [];
  for (let i=0; i<toks.length; i++) {
    let tok = toks[i];
    for (let j=0; j<g_info.location[tok].length; j++) {
      let loc = g_info.location[tok][j];
      img_list.push(loc);
    }
  }

  PIXI.Loader.shared.add(img_list).load(texture_setup);
}



(()=>{

  console.log("fxhash:",fxhash);

  // initialize graphcis (pixi, nice messages)
  //
  g_info.type = "WebGL";
  if (!PIXI.utils.isWebGLSupported()) {
    g_info.type = "canvas";
  }
  PIXI.utils.sayHello(g_info.type);
  howdy();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

  g_info.width = window.innerWidth;
  g_info.height = window.innerHeight;
  g_info.size = ((g_info.width < g_info.height) ? g_info.width : g_info.height);

  let dS = g_info.size;

  g_info.eff_size = Math.floor(dS - dS/3);
  g_info.tick = 0;


  for (let i=0; i<g_info.toks.length; i++) {
    let tok = g_info.toks[i];
    //let _disp_width = g_info.native_width * ( g_info.height * g_info.state[tok].scale / g_info.native_height );
    //let _disp_width = g_info.img[tok].w * (g_info.state[tok].scale * g_info.img[tok].w / g_info.size);

    //let _disp_height = (g_info.state[tok].scale * g_info.size );
    //let _disp_width  = (g_info.state[tok].scale * g_info.size );

    //g_info.state[tok].x = Math.floor(g_info.width/2 - _disp_width/2 );

    //console.log("w:h[", g_info.width, g_info.height, "], img:", g_info.img[tok].w, g_info.img[tok].h, ", effwidth(", _disp_width , ")");
  }

  //---
  //
  // initialize pixi
  //

  g_info.app = new PIXI.Application({
    width:g_info.width,
    height:g_info.height,
    antialias: true,
    transparent: false,
    resolution: 1
  });
  g_info.app.view.id = "canvas";

  let app = g_info.app;

  g_info.app.renderer.backgroundColor = 0xe0e0e0;
  g_info.ctx = g_info.app.renderer.context;

  g_info.container = new PIXI.Container();
  g_info.container.sortableChildren = true;

  g_info.app.stage.addChild(g_info.container);
  texture_load();

  let ele = document.getElementById("canvas_container");
  ele.appendChild(g_info.app.view);

  g_info.app.ticker.add(animate_pixi);

  // wip...don't know how to tell pixi to do the spirte z index sorting
  //
  g_info.app.stage.children.sort( function(a,b) {
    if (a.zIndex > b.zIndex) { return -1; }
    if (a.zIndex < b.zIndex) { return 1; }
    return 0;
  });


  //---


  // keyboard input and functions
  //
  // p - pause animation
  // s - screenshot
  //
  document.addEventListener('keydown', function(ev) {
    /*
    if (ev.key == 'a') {
      g_info.anim = ((g_info.anim == true) ? false : true);
    }
    else if ((ev.key == '.') || (ev.key == '>')) {
      g_info.speed_factor -= 1;
      if (g_info.speed_factor <= 1) {
        g_info.speed_factor = 1;
      }
    }
    else if ((ev.key == ',') || (ev.key == '<')) {
      g_info.speed_factor += 1;
    }
    else 
    */
    if (ev.key == 's')      { screenshot(); }
    else if (ev.key == 'p') { g_info.pause = ((g_info.pause) ? false : true); }

    return false;
  });

  //window.requestAnimationFrame(anim);

})();
