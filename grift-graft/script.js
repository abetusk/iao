//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var g_info = {
  "VERSION" : "0.5.0",

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

  "pattern": {},
  "pattern_realization": {},

  "scene_item" : [],
  "scene_item_bg" : [],

  "blood_moon": false,
  "blood_background":false,
  "bg_idx" : -1,
  "template_idx": -1,

  // a - arch
  // p - plant
  // _ - critter small
  // r - critter medeium
  // R - critter large
  // c - creature
  // M - moon
  // l - left graphic
  // z - right graphic
  // u - under graphic
  // . - nothing
  //
  "pattern_template":[

    /*
    { "prob": 0.5,
      "template":
        "appa" +
        "p_rp" +
        "p_.p" +
        "appa" },

    { "prob": 0.5,
      "template":
        "appa" +
        "pr_p" +
        "p._p" +
        "appa" },

    { "prob": 0.5,
      "template":
        "appa" +
        "pr_p" +
        "p._p" +
        "appa" },

    { "prob": 0.5,
      "template":
        "appa" +
        "prrp" +
        "p..p" +
        "appa" },
*/

    { "prob": 0.5,
      "template":
        "apMpa" +
        "pR..p" +
        "l...z" +
        "p...p" +
        "apupa" },

    { "prob": 0.5,
      "template":
        "apMpa" +
        "pc..p" +
        "l...z" +
        "p...p" +
        "apupa" }

  ],

  "feature":[],

  "_feature": {
    "Monster Type": "",
    "Plant 0" : "",
    "Plant 1" : "",
    "Plant 2" : "",
    "Plant 3" : "",
    "Plant 4" : "",
    "Plant 5" : "",
    "Plant 6" : "",
    "Plant 7" : "",
    "Plant 8" : "",
    "Moon" : "",
    "Arch 0" : "",
    "Arch 1" : "",
    "Arch 2" : "",
    "Arch 3" : "",
    "Left Medallion" : "",
    "Right Medallion" : "",
    "Bottom Item" : "",
    "Background" : "",
    "Blood Moon":"",
    "Blood Boy":""
  },

  "sched": [],

  // offsets are in images local pixel width and height values
  //

  "img" : {
    "head" : { "w": 826, "h" : 1425 }, 
    "chest": { "w": 826, "h" : 1425 },
    "leg"  : { "w": 826, "h" : 1425 },
    "feet" : { "w": 826, "h" : 1425 },
    "arm"  : { "w": 826, "h" : 1425 },

    "arches" :  { "w": 1250, "h" : 1650 },
    "board" : { "w": 1500, "h" : 1500 },

    "item": { "w":546, "h":1076},
    "creature": { "w":945, "h":1377, "offset_x": 50, "offset_y":0 },
    "critter": { "w":458, "h":590, "offset_x": 20, "offset_y":0},

    "arch" : { "w":350, "h": 458, "offset_x":0, "offset_y": 5},
    "plant" : { "w":285, "h": 420},
    "moon" : { "w":852, "h": 892, "offset_x":-10, "offset_y": 0},
    "under" : { "w":691, "h": 746, "offset_x":-15, "offset_y": 0},
    "midl" : { "w":375, "h": 363, "offset_x":-20, "offset_y": 0},
    "midr" : { "w":261, "h": 283, "offset_x":-20, "offset_y": 0},

    "bg_bottle": { "w":219, "h":284},
    "bg_tv": { "w":272, "h":304},
    "bg_flatleaf": { "w":519, "h":264},
    "bg_star": { "w":273, "h":369}

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

    "arches" : [ "img/arches_0.png", "img/arches_1.png", "img/arches_2.png", "img/arches_3.png" ],

    "board" : [ "img/board_0.png" ],
    "item" : [
      "img/item_0.png", "img/item_1.png", "img/item_2.png",
      "img/item_3.png", "img/item_4.png", "img/item_5.png",
      "img/item_6.png", "img/item_7.png"
    ],

    "creature" : [
      "img/creature_0.png", "img/creature_1.png", "img/creature_2.png",
      "img/creature_3.png", "img/creature_4.png", "img/creature_5.png",
      "img/creature_6.png", "img/creature_7.png", "img/creature_8.png",
      "img/creature_9.png", "img/creature_10.png", "img/creature_11.png"
    ],

    "critter" : [
      "img/critter_0.png", "img/critter_1.png", "img/critter_2.png",
      "img/critter_3.png", "img/critter_4.png", "img/critter_5.png",
      "img/critter_6.png", "img/critter_7.png", "img/critter_8.png",
      "img/critter_9.png", "img/critter_10.png", "img/critter_11.png",
      "img/critter_12.png"
    ],

    "plant": [
      "img/plant_0.png", "img/plant_1.png", "img/plant_2.png", "img/plant_3.png",
      "img/plant_4.png", "img/plant_5.png", "img/plant_6.png", "img/plant_7.png",
      "img/plant_8.png", "img/plant_9.png", "img/plant_10.png", "img/plant_11.png",
      "img/plant_12.png", "img/plant_13.png", "img/plant_14.png", "img/plant_15.png"
    ],

    "arch" : [
      "img/arch_0.png", "img/arch_1.png", "img/arch_2.png", "img/arch_3.png",
      "img/arch_4.png", "img/arch_5.png", "img/arch_6.png", "img/arch_7.png",
      "img/arch_8.png", "img/arch_9.png", "img/arch_10.png", "img/arch_11.png",
      "img/arch_12.png", "img/arch_13.png", "img/arch_14.png", "img/arch_15.png",
      "img/arch_16.png", "img/arch_17.png", "img/arch_18.png", "img/arch_19.png",
      "img/arch_20.png", "img/arch_21.png", "img/arch_22.png", "img/arch_23.png",
      "img/arch_24.png", "img/arch_25.png", "img/arch_26.png", "img/arch_27.png",
      "img/arch_28.png", "img/arch_29.png", "img/arch_30.png", "img/arch_31.png"
    ],


    "moon" : [
      "img/moon_0.png", "img/moon_1.png", "img/moon_2.png", "img/moon_3.png"
    ],


    "under" : [
      "img/under_0.png", "img/under_1.png", "img/under_2.png", "img/under_3.png",
      "img/under_4.png", "img/under_5.png", "img/under_6.png", "img/under_7.png",
      "img/under_8.png", "img/under_9.png"
    ],

    "midl" : [
      "img/midl_0.png", "img/midl_1.png", "img/midl_2.png", "img/midl_3.png"
    ],

    "midr" : [
      "img/midr_0.png", "img/midr_1.png", "img/midr_2.png", "img/midr_3.png"
    ],

    "bg_bottle": [
      "img/bg_bottle_0.png",
      "img/bg_bottle_1.png",
      "img/bg_bottle_2.png",
      "img/bg_bottle_3.png",
      "img/bg_bottle_4.png",
      "img/bg_bottle_5.png",
      "img/bg_bottle_6.png",
      "img/bg_bottle_7.png"
    ],

    "bg_tv": [
      "img/bg_tv_0.png",
      "img/bg_tv_1.png",
      "img/bg_tv_2.png"
    ],

    "bg_flatleaf": [
      "img/bg_flatleaf_0.png",
      "img/bg_flatleaf_1.png",
      "img/bg_flatleaf_2.png",
      "img/bg_flatleaf_3.png",
      "img/bg_flatleaf_4.png",
      "img/bg_flatleaf_5.png",
      "img/bg_flatleaf_6.png",
      "img/bg_flatleaf_7.png",
      "img/bg_flatleaf_8.png"
    ],

    "bg_star": [
      "img/bg_star_0.png",
      "img/bg_star_1.png",
      "img/bg_star_2.png",
      "img/bg_star_3.png",
      "img/bg_star_4.png",
      "img/bg_star_5.png",
      "img/bg_star_6.png"
    ]

  },


  "bg_choice" : ["bg_bottle", "bg_tv", "bg_flatleaf", "bg_star"],
  "bg_description": ["Bottles", "Games", "Leaves", "Stars"]


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

function screenshot() {

  g_info.app.renderer.render(g_info.app.stage);

  let _oc = g_info.app.renderer.extract.canvas( g_info.app.stage );

  let _c = document.createElement('canvas');
  _c.width = _oc.width;
  _c.height = _oc.height;

  let _ctx = _c.getContext('2d');
  _ctx.fillStyle = "#e0e0e0";
  _ctx.fillRect(0, 0, _oc.width, _oc.height);
  _ctx.drawImage(_oc, 0, 0);

  _c.toBlob(function(x) {
    let link = document.createElement("a");
    let imguri = URL.createObjectURL(x);
    link.download = "grift_graft.png";

    link.href = imguri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

  }, "image/png");

}

// doesn't pick up background color
//
function screenshot_pixi() {

  g_info.app.renderer.extract.canvas( g_info.app.stage ).toBlob(function(x) {
    let link = document.createElement("a");
    let imguri = URL.createObjectURL(x);
    link.download = "grift_graft.png";

    link.href = imguri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

  }, "image/png");

}

//---


// after all texture loading is done, this function is called
// and should be the final endpoint of the initialization process
//
function init_finalize() {
}


function animate_pixi(dt) {
  if (!g_info.ready) { return; }

  if (g_info.pause) { return; }

  let _cx = 30;
  let _cy = 0;

  for (let i=0; i<g_info.scene_item.length; i++) {
    let item  = g_info.scene_item[i];

    item.anim_idx++;
    item.dy =
      item.ly * Math.sin( (2.0*Math.PI*item.anim_idx / item.di) + item.dpx );
    item.dx =
      item.lx * Math.sin( (2.0*Math.PI*item.anim_idx / item.di) + item.dpy );
    item.y = item.cy + item.dy;
    item.x = _cx + item.cx + item.dx;

    item.sprite.x = item.x;
    item.sprite.y = item.y;
  }

  for (let i=0; i<g_info.scene_item_bg.length; i++) {
    let bg_item = g_info.scene_item_bg[i];

    bg_item.anim_idx++;
    bg_item.dy = 
      bg_item.ly * Math.sin( (2.0*Math.PI*bg_item.anim_idx / bg_item.di) + bg_item.dpy );
    bg_item.dx = 
      bg_item.lx * Math.sin( (2.0*Math.PI*bg_item.anim_idx / bg_item.di) + bg_item.dpx );
    bg_item.sprite.x = bg_item.cx + bg_item.dx;
    bg_item.sprite.y = bg_item.cy + bg_item.dy;

  }

  g_info.count++;
}

function _mod1(v) {
  if ((v>=0) && (v<=1)) { return v; }

  let q = Math.floor(v);
  return v-q;
}

function scene_setup(x) {

  let _Ry = 5.5;
  let _Rx = 5.5;

  let _margin_x = (0.25/_Rx)*g_info.size;
  let _cellsize_x = (1/_Rx)*g_info.size;

  let _margin_y = (0.25/_Ry)*g_info.size;
  let _cellsize_y = (1/_Ry)*g_info.size;

  let _ds = g_info.width - (g_info.size);
  let _offset_x = ((_ds > 0) ? (_ds/2) : 0);

  let _xmajor = true;
  if (g_info.width > g_info.height) { _xmajor = false; }
  _xmajor=false;

  // a - arch
  // p - plant
  // _ - critter small
  // r - critter medeium
  // R - critter large
  // c - creature
  // . - nothing
  //
  let _pr = g_info.pattern_realization;
  for (let i=0; i<_pr.length; i++) {
    for (let j=0; j<_pr[i].length; j++) {

      let _lx = 0;
      let _ly = 1;

      let _code = _pr[i][j].code;
      let _idx = _pr[i][j].idx;
      let loc = "";

      let s_w = _cellsize_x;
      let s_h = _cellsize_y;

      let _x = _margin_x + j*_cellsize_x;
      let _y = _margin_y + i*_cellsize_y;

      let _tint = 0xffffff;

      if (_code == '_') {
        loc = g_info.location.critter[ _idx ];

        if (_xmajor) {
          s_w = _cellsize_x;
          s_h = s_w * g_info.img.critter.h / g_info.img.critter.w;
        }
        else {
          s_h = _cellsize_y;
          s_w = s_h * g_info.img.critter.w / g_info.img.critter.h;
        }

      }
      else if (_code == 'r') {
        loc = g_info.location.critter[ _idx ];

        if (_xmajor) {
          s_w = 2*_cellsize_x;
          s_h = s_w * g_info.img.critter.h / g_info.img.critter.w;
        }
        else {
          s_h = 2*_cellsize_y;
          s_w = s_h * g_info.img.critter.w / g_info.img.critter.h;
        }

      }
      else if (_code == 'R') {
        loc = g_info.location.critter[ _idx ];

        if (_xmajor) {
          let _r = g_info.img.critter.h / g_info.img.critter.w;
          s_w = 3*_cellsize_x;
          s_h = s_w * _r;
          _x += g_info.img.critter.offset_x / _r;
          _y += g_info.img.critter.offset_y * _r;
        }
        else {
          let _r = g_info.img.critter.w / g_info.img.critter.h;
          s_h = 3*_cellsize_y;
          s_w = s_h * _r;
          _x += g_info.img.critter.offset_x * _r;
          _y += g_info.img.critter.offset_y / _r;
        }

      }
      else if (_code == 'c') {
        loc = g_info.location.creature[ _idx ];

        if (_xmajor) {
          let _r = g_info.img.creature.h / g_info.img.creature.w;
          s_w = 3*_cellsize_x;
          s_h = s_w * g_info.img.creature.h / g_info.img.creature.w;
          _x += g_info.img.creature.offset_x / _r;
          _y += g_info.img.creature.offset_y * _r;
        }
        else {
          let _r = g_info.img.creature.w / g_info.img.creature.h;
          s_h = 3*_cellsize_y;
          s_w = s_h * g_info.img.creature.w / g_info.img.creature.h;
          _x += g_info.img.creature.offset_x * _r;
          _y += g_info.img.creature.offset_y / _r;
        }

      }
      else if (_code == 'a') {
        loc = g_info.location.arch[ _idx ];

        if (_xmajor) {
          let _r = g_info.img.arch.h / g_info.img.arch.w;
          s_w = _cellsize_x;
          s_h = s_w * _r;
          _y += g_info.img.arch.offset_y * _r;
        }
        else {
          let _r = g_info.img.arch.w / g_info.img.arch.h;
          s_h = _cellsize_y;
          s_w = s_h * _r;
          _y += g_info.img.arch.offset_y * _r;
        }

      }
      else if (_code == 'p') {
        loc = g_info.location.plant[ _idx ];

        if (_xmajor) {
          s_w = _cellsize_x;
          s_h = s_w * g_info.img.plant.h / g_info.img.plant.w;
        }
        else {
          s_h = _cellsize_y;
          s_w = s_h * g_info.img.plant.w / g_info.img.plant.h;
        }

      }

      else if (_code == 'M') {
        loc = g_info.location.moon[ _idx ];

        if (_xmajor) {
          let _r = g_info.img.moon.h / g_info.img.moon.w;
          s_w = _cellsize_x;
          s_h = s_w * _r;
          _x += g_info.img.moon.offset_x / _r;
          _y += g_info.img.moon.offset_y * _r;
        }
        else {
          let _r = g_info.img.moon.w / g_info.img.moon.h;
          s_h = _cellsize_y;
          s_w = s_h * _r;
          _x += g_info.img.moon.offset_x * _r;
          _y += g_info.img.moon.offset_y / _r;
        }


        // blood moon
        //
        if (g_info.blood_moon) {
          _tint = 0xfb0c0c;
        }
      }

      else if (_code == 'u') {
        let _type = "under";
        let _scale = 1.0;

        _csx = _cellsize_x * _scale;
        _csy = _cellsize_y * _scale;

        loc = g_info.location[_type][ _idx ];

        if (_xmajor) {
          let _r = g_info.img[_type].h / g_info.img[_type].w;
          s_w = _csx;
          s_h = s_w * _r;
          _x += g_info.img[_type].offset_x / _r;
          _y += g_info.img[_type].offset_y * _r;
        }
        else {
          let _r = g_info.img[_type].w / g_info.img[_type].h;
          s_h = _csy;
          s_w = s_h * _r;
          _x += g_info.img[_type].offset_x * _r;
          _y += g_info.img[_type].offset_y / _r;
        }

        _ly = 1;
      }

      else if (_code == 'l') {
        let _type = "midl";
        let _scale = 1.0;

        loc = g_info.location[_type][ _idx ];

        if (_xmajor) {
          let _r = g_info.img[_type].h / g_info.img[_type].w;
          s_w = _scale * _cellsize_x;
          s_h = s_w * _r;
          _x += _scale * g_info.img[_type].offset_x / _r;
          _y += _scale *g_info.img[_type].offset_y * _r;
        }
        else {
          let _r = g_info.img[_type].w / g_info.img[_type].h;
          s_h = _scale * _cellsize_y;
          s_w = s_h * _r;
          _x += _scale * g_info.img[_type].offset_x * _r;
          _y += _scale * g_info.img[_type].offset_y / _r;
        }

        _lx = 1;
        _ly = 0;
      }

      else if (_code == 'z') {
        let _type = "midr";
        let _scale = 1.0;

        loc = g_info.location[_type][ _idx ];

        if (_xmajor) {
          let _r = g_info.img[_type].h / g_info.img[_type].w;
          s_w = _scale * _cellsize_x;
          s_h = s_w * _r;
          _x += _scale * g_info.img[_type].offset_x / _r;
          _y += _scale *g_info.img[_type].offset_y * _r;
        }
        else {
          let _r = g_info.img[_type].w / g_info.img[_type].h;
          s_h = _scale * _cellsize_y;
          s_w = s_h * _r;
          _x += _scale * g_info.img[_type].offset_x * _r;
          _y += _scale * g_info.img[_type].offset_y / _r;
        }

        _lx = 1;
        _ly = 0;
      }


      else if (_code == '.') { continue; }
      else {
        console.log("uncrecognized code:", i, j, _code, _idx);
        continue;
      }

      let _sprite  = new PIXI.Sprite(PIXI.Loader.shared.resources[loc].texture);

      _sprite.x = _x;
      _sprite.y = _y;

      _sprite.width   = s_w;
      _sprite.height  = s_h;
      _sprite.tint = _tint;

      _sprite.zIndex = 2;

      let item = {
        "sprite": _sprite,
        "v": true,
        "idx": 0,
        "anim_idx":0,
        "di":180,
        "cx": _offset_x + _x,
        "cy": _y,
        "x" : 0,
        "y" : 0,
        "dx":0,
        "dy":0,
        "da":0,
        "dpy": fxrand()*60.0,
        "dpx": fxrand()*60.0,
        "lx": _lx,
        "ly": _ly,
        "scale": 1.0,
        "disp_w": s_w,
        "disp_h": s_h
      };

      g_info.scene_item.push(item);

    }
  }

  for (let i=0; i<g_info.scene_item.length; i++) {
    g_info.container.addChild( g_info.scene_item[i].sprite );
  }

  //---

  let bg_name = g_info.bg_choice[ g_info.bg_idx ];


  let bg_tint = 0xffffff;
  if (g_info.blood_background) {
    bg_tint = 0xff0000;
  }

  let _rough_cell_size = Math.ceil(g_info.size / 9);

  let _j_n = g_info.width / _rough_cell_size;
  let _i_n = g_info.height / _rough_cell_size;

  for (let i=-1; i<(_i_n+1); i++) {
    for (let j=-1; j<(_j_n+1); j++) {

      let n = g_info.location[bg_name].length;
      let loc = g_info.location[bg_name][ _irnd(n) ];

      let _sprite  = new PIXI.Sprite(PIXI.Loader.shared.resources[loc].texture);

      let _w = g_info.img[bg_name].w;
      let _h = g_info.img[bg_name].h;
      let _cs = _rough_cell_size;

      let x_offset = ( ((i%2)==0) ? _cs/2 : 0 );


      _sprite.x = j*_cs + x_offset;
      _sprite.y = i*_cs;
      _sprite.width = _cs;
      _sprite.height = _cs * _h / _w;
      _sprite.zIndex = 1;

      _sprite.alpha = 0.1;
      _sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      _sprite.visible = true;
      _sprite.tint = bg_tint;

      let bg_item = {
        "sprite": _sprite,
        "v": true,
        "idx": 0,
        "anim_idx":0,
        "di":360,
        "x": 0,
        "y": 0,
        "cx": _cs*j + x_offset,
        "cy": _cs*i,
        "dx":0,
        "dy":0,
        "da":0,
        "dp": 0,
        "dpx" : fxrand()*360,
        "dpy" : fxrand()*360,
        "lx": 5,
        "ly": 5,
        "scale": 1.0,
        "disp_w": _cs,
        "disp_h": _cs
      };

      g_info.scene_item_bg.push(bg_item);
    }
  }

  for (let i=0; i<g_info.scene_item_bg.length; i++) {
    g_info.container.addChild( g_info.scene_item_bg[i].sprite );
  }

  g_info.ready = true;

  init_finalize();
}


function texture_load() {
  let img_list = [];

  for (let i=0; i<g_info.location.plant.length; i++) {
    img_list.push(g_info.location.plant[i]);
  }

  for (let i=0; i<g_info.location.arch.length; i++) {
    img_list.push(g_info.location.arch[i]);
  }

  for (let i=0; i<g_info.location.creature.length; i++) {
    img_list.push(g_info.location.creature[i]);
  }

  for (let i=0; i<g_info.location.critter.length; i++) {
    img_list.push(g_info.location.critter[i]);
  }

  for (let i=0; i<g_info.location.moon.length; i++) {
    img_list.push(g_info.location.moon[i]);
  }

  for (let i=0; i<g_info.location.under.length; i++) {
    img_list.push(g_info.location.under[i]);
  }

  for (let i=0; i<g_info.location.midl.length; i++) {
    img_list.push(g_info.location.midl[i]);
  }

  for (let i=0; i<g_info.location.midr.length; i++) {
    img_list.push(g_info.location.midr[i]);
  }

  for (let i=0; i<g_info.location.bg_bottle.length; i++) {
    img_list.push(g_info.location.bg_bottle[i]);
  }

  for (let i=0; i<g_info.location.bg_tv.length; i++) {
    img_list.push(g_info.location.bg_tv[i]);
  }

  for (let i=0; i<g_info.location.bg_flatleaf.length; i++) {
    img_list.push(g_info.location.bg_flatleaf[i]);
  }

  for (let i=0; i<g_info.location.bg_star.length; i++) {
    img_list.push(g_info.location.bg_star[i]);
  }


  PIXI.Loader.shared.add(img_list).load(scene_setup);

}


function random_template() {

  let _plant_n = 0;
  let _arch_n = 0;
  let _crit_n = 0;

  let n_x = 5, n_y = 5;
  g_info.pattern = g_info.pattern_template[ _irnd(g_info.pattern_template.length) ];

  g_info.pattern_realization = [];
  for (let i=0; i<n_y; i++) {
    g_info.pattern_realization.push([]);
    for (let j=0; j<n_x; j++) {

      let _code = g_info.pattern.template[i*n_x + j];

      if (g_info.pattern.template[ i*n_x + j ]=='.') {
        g_info.pattern_realization[i].push({"idx":-1, "v":false, "sprite":{}, "code": _code});
      }
      else {

        let _idx = -1;

        if (_code == '_') {
          _idx = _irnd( g_info.location.critter.length );

          g_info.feature.push( { "name": "Critter " + _crit_n, "value": _idx })
          _crit_n++;
        }
        else if (_code == 'r') {
          _idx = _irnd( g_info.location.critter.length );

          g_info.feature.push( { "name": "Critter " + _crit_n, "value": _idx })
          _crit_n++;
        }
        else if (_code == 'R') {
          _idx = _irnd( g_info.location.critter.length );

          g_info.feature.push( { "name": "Critter", "value": _idx })
        }

        else if (_code == 'c') {
          _idx = _irnd( g_info.location.creature.length );

          g_info.feature.push( { "name": "Creature", "value": _idx })
        }

        else if (_code == 'a') {
          _idx = _irnd( g_info.location.arch.length );

          g_info.feature.push( { "name": "Arch " + _arch_n, "value": _idx })
          _arch_n++;
        }
        else if (_code == 'p') {
          _idx = _irnd( g_info.location.plant.length );

          g_info.feature.push( { "name": "Plant " + _plant_n, "value": _idx })
          _plant_n++;
        }

        else if (_code == 'M') {
          _idx = _irnd( g_info.location.moon.length );
        }

        else if (_code == 'u') {
          _idx = _irnd( g_info.location.under.length );

          g_info.feature.push( { "name": "Moon", "value" : _idx });

          if (fxrand() < (1.0/128.0)) {
            g_info.feature.push( { "name":"Blood Moon", "value": true });
            g_info.blood_moon = true;
          }
        }

        else if (_code == 'l') {
          _idx = _irnd( g_info.location.midl.length );

          g_info.feature.push( { "name": "Left Medallion", "value" : _idx });
        }

        else if (_code == 'z') {
          _idx = _irnd( g_info.location.midl.length );

          g_info.feature.push( { "name": "Right Medallion", "value" : _idx });
        }

        g_info.pattern_realization[i].push({"idx":_idx, "v":false, "sprite":{}, "code": _code });
      }

    }
  }

  g_info.bg_idx = _irnd( g_info.bg_choice.length );

  g_info.feature.push( { "name":"Background", "value": g_info.bg_description[ g_info.bg_idx] });
  if (fxrand() < (1.0/32.0)) {
    g_info.blood_background = true;

    g_info.feature.push( { "name":"Blood Background", "value": true });
  }

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

  //---

  random_template();

  //---


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

  //----
  //----
  texture_load();
  //----
  //----

  let ele = document.getElementById("canvas_container");
  ele.appendChild(g_info.app.view);

  g_info.app.ticker.add(animate_pixi);

  // sort spirtes by zorder
  //
  g_info.app.stage.children.sort( function(a,b) {
    if (a.zIndex > b.zIndex) { return -1; }
    if (a.zIndex < b.zIndex) { return 1; }
    return 0;
  });

  

  // keyboard input and functions
  //
  // p - pause animation
  // s - screenshot
  //
  document.addEventListener('keydown', function(ev) {
    if (ev.key == 's')      { screenshot(); }
    else if (ev.key == 'p') { g_info.pause = ((g_info.pause) ? false : true); }

    return false;
  });

  let _feat = {};
  for (let i=0; i<g_info.feature.length; i++)  {
    _feat[ g_info.feature[i].name ] = g_info.feature[i].value ;
  }
  window.$fxhashFeatures = _feat;

})();
