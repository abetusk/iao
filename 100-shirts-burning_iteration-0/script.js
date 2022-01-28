//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

// requires jsclipper


var g_info = {
  "VERSION" : "0.6.0",
  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,
  "anim": true,
  "speed_factor":256,

  "color": [ ],

  "bg_color" : "#111",
  "f_list": [
    "disp_tile_0",
    "disp_tile_1"
  ],
  "f_hist":[]

};

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

function test_f_truchet(ctx) {
  clear();

  let c0 = "rgba(255, 0, 0, 1.0)";
  let c1 = "rgba(0, 255, 255, 1.0)";

  //ctx.globalAlpha = 0.8;

  disp_tile_0(ctx, 100, 100, 100, c0, c1);
  disp_tile_1(ctx, 400, 100, 100, c1, c0);
}

// By convention, phase takes on a value from 0 to 1
//
// phase is the parameter that controls any animation
//
function disp(ctx, fname, x, y, w, fg, bg, phase) {

  let v=1;

  if (g_info.anim == false) { phase = 1; }

  if (fname == "disp_tile_0") {
    disp_tile_0(ctx, x, y, w, fg, bg, phase);
  }
  else if (fname == "disp_tile_1") {
    disp_tile_1(ctx, x, y, w, fg, bg, phase);
  }

}

function disp_r(ctx, x, y, w, sub_n, recur_level, max_recur, fg_color, bg_color) {
  max_recur = ((typeof max_recur === "undefined") ? 6 : max_recur);

  if (recur_level >= max_recur) { return; }

  let mx = x + w/sub_n;
  let my = y + w/sub_n;
  let subw = w/sub_n;

  let p = fxrand();

  let do_recur = false;

  if (p < (1.0/32.0)) { do_recur = false; }
  else if (p < 0.55)  { do_recur = true;  }

  else if (p < 0.75) {

    // choose random tile
    //
    let _f = g_info.f_list[ Math.floor(g_info.f_list.length * fxrand()) ];
    let _freq = 1.0 - fxrand()*0.5;
    let _init_phase =  fxrand();

    // allow call back to save the history and to independently
    // adjust the frequencey of each
    //
    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_fg_c, _p_bg_c, _p_F, _p_i_p) {
      return function() {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/g_info.speed_factor + _p_i_p)))/2.0;

        //console.log(g_info.speed_factor);

        let _fc = _rgb2hex( _p_fg_c.rgb );
        let _bc = _rgb2hex( _p_bg_c.rgb );
        //disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_fg_c, _p_bg_c, _phase);
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _fc, _bc, _phase);
      };
    })(ctx, _f, x, y, w, fg_color, bg_color, _freq, _init_phase);

    g_info.f_hist.push({ "lvl": recur_level, "idx": g_info.f_hist.length, "f": _func });
  }

  else if (p < 1.0) {

    do_recur = true;

    // choose random tile
    //
    let _f = g_info.f_list[ Math.floor(g_info.f_list.length * fxrand()) ];
    let _freq = 1.0 - fxrand()*0.5;
    let _init_phase =  fxrand();

    // allow call back to save the history and to independently
    // adjust the frequencey of each
    //
    let _func = (function(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_fg_c, _p_bg_c, _p_F, _p_i_p) {
      return function() {
        let _phase = (1.0 + Math.sin(Math.PI*2*_p_F*(g_info.tick/g_info.speed_factor + _p_i_p)))/2.0;

        let _fc = _rgb2hex( _p_fg_c.rgb );
        let _bc = _rgb2hex( _p_bg_c.rgb );
        //disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _p_fg_c, _p_bg_c, _phase);
        disp(_p_ctx, _p_f, _p_x, _p_y, _p_w, _fc, _bc, _phase);
      };
    })(ctx, _f, x, y, w, fg_color, bg_color, _freq, _init_phase);

    g_info.f_hist.push({ "lvl": recur_level, "idx": g_info.f_hist.length, "f": _func });
  }

  // force something interesting if we're at thef irst level
  //
  if (recur_level == 0) { do_recur = true; }



  if (do_recur) {

    let nxt_sub_n = 2;

    for (let i=0; i<sub_n; i++) {
      for (let j=0; j<sub_n; j++) {
        let _x = x + i*subw;
        let _y = y + j*subw;
        disp_r(ctx, _x, _y, subw, 2, recur_level+1, max_recur, bg_color, fg_color);
      }
    }

  }

}

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;
  clear(ctx, _cw, _ch, g_info.bg_color);
  //ctx.clearRect(0, 0, _cw, _ch);
  //ctx.fillStyle = g_info.bg_color;
  //ctx.rect(0,0, _cw, _ch);
  //ctx.fill();

  for (let i=0; i<g_info.f_hist.length; i++) {
    g_info.f_hist[i].f();
  }

  window.requestAnimationFrame(anim);

  if (g_info.anim) {
    g_info.tick += 1;
    g_info.tick_val = 16*(1.0 + Math.sin(Math.PI*2.0*g_info.tick/g_info.speed_factor));
  }

}

// Note, wings extend pas width
//
// This is pretty sloppy. The angles are other calculations are mostly
// slapped together after I obvserved what worked and what didn't.
//
function disp_tile_0(ctx, pos_x, pos_y, width, color_fg, color_bg, phase) {

  let pi  = Math.PI;
  let pi2 = Math.PI/2.0;
  let w2 = width/2;
  let w_1_3  = width/3;
  let w_2_3 = 2*width/3;
  let w_1_6 = width/6;

  let _dx = 0, _dy = 0;
  let _cos2 = Math.cos(pi*phase/2);
  let _sin2 = Math.sin(pi*phase/2);

  let dn = 32;
  let _r0 = 0,
      _r1 = 0,
      _dr = 0,
      _cr = 0;

  ctx.lineWidth = 0;

  // center rectangle
  //

  ctx.beginPath();

  ctx.fillStyle = color_bg;
  ctx.moveTo(pos_x + w2, pos_y + w2);
  ctx.arc(pos_x + w2, pos_y + w2, phase*w2, 0, 2*pi);
  ctx.fill();

  ctx.beginPath();

  // lower left inner arc
  //
  ctx.fillStyle = color_fg;

  _dx = pos_x ;
  _dy = pos_y + width;

  _cr = (w_2_3 - w_1_3)/2;
  _dr = phase*_cr;
  _r0 = w_1_3 + _cr + _dr;
  _r1 = w_1_3 + _cr - _dr;
  for (let i=0; i<dn; i++) {
    let _a = (i/(dn-1))*phase*pi2 + (1.0-i/(dn-1))*0;
    let _px = _dx + _r0*Math.cos(_a);
    let _py = _dy - _r0*Math.sin(_a);
    if (i==0) { ctx.moveTo(_px, _py); }
    else      { ctx.lineTo(_px, _py); }
  }

  for (let i=dn-1; i>=00; i--) {
    let _a = (i/(dn-1))*phase*pi2 + (1.0-i/(dn-1))*0;
    let _px = _dx + _r1*Math.cos(_a);
    let _py = _dy - _r1*Math.sin(_a);
    ctx.lineTo(_px, _py);
  }
  ctx.fill();



  // upper right arc
  //

  _dx = pos_x + width;
  _dy = pos_y ;

  _cr = (w_2_3 - w_1_3)/2;
  _dr = phase*_cr;
  _r0 = w_1_3 + _cr + _dr;
  _r1 = w_1_3 + _cr - _dr;
  for (let i=0; i<dn; i++) {
    let _a = (i/(dn-1))*0 + (1.0-i/(dn-1))*phase*pi2;
    let _px = _dx - _r0*Math.cos(_a);
    let _py = _dy + _r0*Math.sin(_a);
    if (i==0) { ctx.moveTo(_px, _py); }
    else      { ctx.lineTo(_px, _py); }
  }

  for (let i=dn-1; i>=00; i--) {
    let _a = (i/(dn-1))*0 + (1.0-i/(dn-1))*phase*pi2;
    let _px = _dx - _r1*Math.cos(_a);
    let _py = _dy + _r1*Math.sin(_a);
    ctx.lineTo(_px, _py);
  }
  ctx.fill();

  // top fg wing
  //
  ctx.moveTo(pos_x + w2, pos_y );
  ctx.arc(pos_x + w2, pos_y, phase*w_1_6, 0, 2*pi, true);

  // bottom fg wing
  //
  ctx.moveTo(pos_x + w2, pos_y + width);
  ctx.arc(pos_x + w2, pos_y + width, phase*w_1_6, 0, 2*pi, true);

  // left fg wing
  //
  _dx = Math.floor(pos_x + _cos2*w2);
  _dy = Math.floor(pos_y + width - _sin2*w2);

  ctx.moveTo(_dx, _dy);
  ctx.arc(_dx, _dy, phase*w_1_6, 0, 2*pi, true);

  // right fg wing
  //
  _dx = Math.floor(pos_x + width - _cos2*w2);
  _dy = Math.floor(pos_y + _sin2*w2);

  // order matters, we'll get removals if we're not careful
  // I'm being sloppy here...the better place is to do this
  // in the linear segmentation.
  //
  ctx.moveTo(_dx, _dy);
  ctx.arc(_dx, _dy, phase*w_1_6, 0, 2*pi, false);
  ctx.fill();


  ctx.beginPath();

  // upper left bg wing
  //
  ctx.fillStyle = color_bg;
  ctx.moveTo(pos_x, pos_y);
  ctx.arc(pos_x, pos_y, phase*w_1_3, 0, 2*pi);

  // upper right bg wing
  //
  ctx.moveTo(pos_x + width, pos_y);
  ctx.arc(pos_x + width, pos_y, phase*w_1_3, 0, 2*pi);

  // lower right bg wing
  //
  ctx.moveTo(pos_x + width, pos_y + width );
  ctx.arc(pos_x + width, pos_y + width, phase*w_1_3, 0, 2*pi);

  // lower left bg wing
  //
  ctx.moveTo(pos_x, pos_y + width );
  ctx.arc(pos_x, pos_y + width, phase*w_1_3, 0, 2*pi);

  ctx.fill();

}

// Note, wings extend pas width
//
function disp_tile_1(ctx, pos_x, pos_y, width, color_fg, color_bg, phase) {

  let pi  = Math.PI;
  let pi2 = Math.PI/2.0;
  let w2 = width/2;
  let w_1_3  = width/3;
  let w_2_3 = 2*width/3;
  let w_1_6 = width/6;

  let _dx = 0, _dy = 0;
  let _cos2 = Math.cos(pi*phase/2);
  let _sin2 = Math.sin(pi*phase/2);

  let dn = 32;
  let _r0 = 0,
      _r1 = 0,
      _dr = 0,
      _cr = 0;

  ctx.lineWidth = 0;

  // center rectangle
  //
  //ctx.fillStyle = color_bg;
  //ctx.fillRect(pos_x, pos_y, width, width);

  ctx.beginPath();

  ctx.fillStyle = color_bg;
  ctx.moveTo(pos_x + w2, pos_y + w2);
  ctx.arc(pos_x + w2, pos_y + w2, phase*w2, 0, 2*pi);
  ctx.fill();

  //--

  ctx.beginPath();

  // upper left inner arc
  //

  ctx.fillStyle = color_fg;
  /*
  ctx.moveTo(pos_x, pos_y);
  ctx.arc(pos_x, pos_y, w_2_3, 0, pi2);
  */


  _dx = pos_x ;
  _dy = pos_y ;

  _cr = (w_2_3 - w_1_3)/2;
  _dr = phase*_cr;
  _r0 = w_1_3 + _cr + _dr;
  _r1 = w_1_3 + _cr - _dr;

  let _sa = 0;
  let _ea = phase*pi2;
  let _a = 0;
  for (let i=0; i<dn; i++) {
    _a = (i/(dn-1))*_sa  + (1.0-i/(dn-1))*_ea;
    let _px = _dx + _r0*Math.cos(_a);
    let _py = _dy + _r0*Math.sin(_a);
    if (i==0) { ctx.moveTo(_px, _py); }
    else      { ctx.lineTo(_px, _py); }
  }

  for (let i=dn-1; i>=0; i--) {
    let _a = (i/(dn-1))*_sa + (1.0-i/(dn-1))*_ea;
    let _px = _dx + _r1*Math.cos(_a);
    let _py = _dy + _r1*Math.sin(_a);
    ctx.lineTo(_px, _py);
  }
  ctx.fill();


  // lower right arc
  //
  ctx.beginPath();

  //ctx.moveTo(pos_x + width, pos_y + width);
  //ctx.arc(pos_x + width, pos_y + width, w_2_3, pi, -pi2);


  _dx = pos_x + width;
  _dy = pos_y + width;

  _cr = (w_2_3 - w_1_3)/2;
  _dr = phase*_cr;
  _r0 = w_1_3 + _cr + _dr;
  _r1 = w_1_3 + _cr - _dr;

  _sa = pi;
  _ea = (1.0-phase)*pi + phase*pi2;
  for (let i=0; i<dn; i++) {
    _a = (i/(dn-1))*_sa  + (1.0-i/(dn-1))*_ea;
    let _px = _dx + _r0*Math.cos(_a);
    let _py = _dy - _r0*Math.sin(_a);
    if (i==0) { ctx.moveTo(_px, _py); }
    else      { ctx.lineTo(_px, _py); }
  }

  for (let i=dn-1; i>=0; i--) {
    _a = (i/(dn-1))*_sa + (1.0-i/(dn-1))*_ea;
    let _px = _dx + _r1*Math.cos(_a);
    let _py = _dy - _r1*Math.sin(_a);
    ctx.lineTo(_px, _py);
  }
  ctx.fill();


  //--

  // top fg wing
  //
  ctx.moveTo(pos_x + w2, pos_y );
  ctx.arc(pos_x + w2, pos_y, phase*w_1_6, pi, 0);

  // bottom fg wing
  //
  ctx.moveTo(pos_x + w2, pos_y + width);
  ctx.arc(pos_x + w2, pos_y + width, phase*w_1_6, 0, pi);

  // left fg wing
  //
  ctx.moveTo(pos_x, pos_y + w2);
  //ctx.arc(pos_x, pos_y + w2, phase*w_1_6, -3*pi2, -pi2);

  _sa = 0;
  _ea = phase*pi2;
  _dx = pos_x + w2*Math.cos(_ea);
  _dy = pos_y + w2*Math.sin(_ea);
  ctx.arc(_dx, _dy, phase*w_1_6, 0, 2*pi);


  //ctx.arc(pos_x, pos_y + w2, phase*w_1_6, -3*pi2, -pi2);

  // right fg wing
  //
  ctx.moveTo(pos_x + width, pos_y + w2);

  // sloppy as fuck!
  //
  _sa = pi;
  _ea = pi2;
  _a = (1.0-phase)*_sa + phase*_ea;
  _dx = pos_x + width + w2*Math.cos(_a);
  _dy = pos_y + width - w2*Math.sin(_a);
  ctx.arc(_dx, _dy, phase*w_1_6, 0, 2*pi, true);


  ctx.fill();

  ctx.beginPath();

  // upper left bg wing
  //
  ctx.fillStyle = color_bg;
  ctx.moveTo(pos_x, pos_y);
  ctx.arc(pos_x, pos_y, phase*w_1_3, 0, 2*pi);

  // upper right bg wing
  //
  ctx.moveTo(pos_x + width, pos_y);
  ctx.arc(pos_x + width, pos_y, phase*w_1_3, 0, 2*pi);

  // lower right bg wing
  //
  ctx.moveTo(pos_x + width, pos_y + width );
  ctx.arc(pos_x + width, pos_y + width, phase*w_1_3, 0, 2*pi);

  // lower left bg wing
  //
  ctx.moveTo(pos_x, pos_y + width );
  ctx.arc(pos_x, pos_y + width, phase*w_1_3, 0, 2*pi);

  ctx.fill();

}

function disp_tile(ctx, tile_type, pos_x, pos_y, width, color_fg, color_bg) {

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
  link.download = "100shirtrsburning_screenshot.png";
  link.href = imguri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

(()=>{

  console.log("fxhash:",fxhash);

  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let W = canvas.width;
  let H = canvas.height;

  let dS = ((W<H) ? W : H);

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  g_info.size = Math.floor(dS - dS/3);
  g_info.tick = 0;

  g_info.speed_factor = fxrand()*511 + 1;

  // Pick random foreground and background colors in
  // HSV space to make them a bit more pleasant.
  // Parameters are hand picked.
  //

  let fg_h_range = 1.0/8.0;
  let fg_h = (fxrand() - 0.5)*fg_h_range;
  if (fg_h < 0) { fg_h += 1.0; }
  let fg_s = 0.8 - fxrand()*0.125;
  let fg_v = 0.8 - fxrand()*0.125;

  let fg_rgb = HSVtoRGB(fg_h, fg_s, fg_v);
  let fg_color = { "hsv": {"h":fg_h, "s":fg_s, "v":fg_v}, "rgb":fg_rgb};
  
  // Background colors too close in hue will clash
  // pretty badly, so we force it at maximum distance
  // away.
  //
  let bg_h = fg_h + 0.5;
  if (bg_h < 0) { bg_h += 1.0; }
  if (bg_h > 1.0) { bg_h -= 1.0; }
  let bg_s = 1.0 - fxrand()*0.25 ;
  let bg_v = 1.0 - fxrand()*0.25 ;

  let bg_rgb = HSVtoRGB(bg_h, bg_s, bg_v);
  let bg_color = { "hsv": {"h":bg_h, "s":bg_s, "v":bg_v}, "rgb": bg_rgb };

  g_info.color.push(fg_color);
  g_info.color.push(bg_color);

  //--

  let ox = Math.floor(dS/6),
      oy = Math.floor(dS/6);

  let c_size = 500;
  let isubdiv = 2;
  for (let i=0; i<isubdiv; i++) {
    for (let j=0; j<isubdiv; j++) {
      let _x = i*c_size/isubdiv;
      let _y = j*c_size/isubdiv;
      disp_r(ctx, ox + _x , oy + _y , c_size/isubdiv, 2, 1, 5, fg_color, bg_color);
      //disp_r(ctx, ox + _x , oy + _y , c_size/isubdiv, 2, 1, 2, fg_color, bg_color);
    }
  }

  // Though it might be a nice effect, Carlson talks about rendering
  // in "largest first" order (rendering tiles nearer the root first).
  // The sorting by index is just to maintain som default (stable) ordering
  // and is probably not necessary (?).
  //
  g_info.f_hist.sort(
    function(_a,_b) {
      let _d = _a.lvl - _b.lvl;
      if (_d!=0) { return (_d < 0) ? -1 : 1; }
      return (_a.idx < _b.idx) ? -1 : 1;
    }
  );


  for (let i=0; i<g_info.f_hist.length; i++) { g_info.f_hist[i].f(); }

  document.addEventListener('keydown', function(ev) {
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
    else if (ev.key == 's') {
      screenshot();
    }
    return false;
  });

  window.requestAnimationFrame(anim);

})();
