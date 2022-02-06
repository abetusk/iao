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
  "canvas": {},
  "ctx" : {},
  "tick" : 0,
  "tick_val" : 0,

  "anim": false,
  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "monochrome": false,
  "palette" : [
    {
      name: 'floratopia',
      colors: ['#bf4a2b', '#cd902a', '#4e4973', '#f5d4bc'],
      stroke: '#1e1a43',
      background: '#1e1a43',
    },

    {
      name: 'butterfly',
      colors: ['#f40104', '#f6c0b3', '#99673a', '#f0f1f4'],
      stroke: '#191e36',
      background: '#191e36',
    }
  ],

  "rnd":[],
  "hue": fxrand()*360,

  //"bg_color" : "#111",
  "bg_color" : "#222",

  "hot_idx":0,

  "data" : [],
  "state" : []

};

//-----
//-----

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


function _rnd_color() {
  if (g_info.monochrome) {
    let _b = _clamp( Math.floor(fxrand()*255), 32, 255-32);
    let _color = "rgb(" + _b + "," + _b  + "," + _b + ")";
    return _color;
  }

  return g_info.palette[0].colors[ _irnd(g_info.palette[0].colors.length) ];

  //let _h = Math.floor(fxrand()*360);
  let _h = g_info.hue;
  let _c = Math.floor(_rnd(20, 40));
  let _l = Math.floor(_rnd(0, 80));

  let _rgb = chroma.hcl( _h, _c, _l ).rgb();
  let _color = "rgba(" + _rgb.join(",") + ",0.95)";

  return _color;
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

function update_sq(sq,x,y,w,h,theta) {

  let pnts = sq.p;
  pnts[0].x =  w/2;
  pnts[0].y =  h/2;

  pnts[1].x = -w/2;
  pnts[1].y =  h/2;

  pnts[2].x = -w/2;
  pnts[2].y = -h/2;

  pnts[3].x =  w/2;
  pnts[3].y = -h/2;

  let _c = Math.cos(theta);
  let _s = Math.sin(theta);
  for (let i=0; i<pnts.length; i++) {
    let _x = _c*pnts[i].x - _s*pnts[i].y;
    let _y = _s*pnts[i].x + _c*pnts[i].y;
    pnts[i].x = x + _x;
    pnts[i].y = y + _y;
  }

}

function create_sq(x,y,w,h,theta) {
  let pnts = [
    { "x" :  w/2, "y":  h/2 },
    { "x" : -w/2, "y":  h/2 },
    { "x" : -w/2, "y": -h/2 },
    { "x" :  w/2, "y": -h/2 }
  ];

  let _c = Math.cos(theta);
  let _s = Math.sin(theta);
  for (let i=0; i<pnts.length; i++) {
    let _x = _c*pnts[i].x - _s*pnts[i].y;
    let _y = _s*pnts[i].x + _c*pnts[i].y;
    pnts[i].x = x + _x;
    pnts[i].y = y + _y;
  }

  return pnts;
}

function update_package(_sq, sx, sy, distx, disty, gen_w, gen_h, gamma) {
  gamma = ((typeof gamma === "undefined") ? 10.0 : gamma);

  let len = Math.sqrt( distx*distx + disty*disty );
  let theta = Math.atan2(disty, distx);

  let _cos = Math.cos(theta);
  let _sin = Math.sin(theta);

  //let _vv = fxrand()*5 + 0.25;
  let _vv = _clamp( 3*Math.pow(fxrand(), 2), 0.25, 5);
  let _v_vec = { "x" : _vv*Math.cos(theta), "y": _vv*Math.sin(theta) };



  //let _w = gen_h*fxrand()/2 + 4;
  //let _h = gen_h*fxrand()/4 + 4;

  //let _w = _clamp(gen_h*Math.pow(fxrand(), gamma), 4, gen_h/2);
  let _w = _clamp(200*Math.pow(fxrand(), gamma), 4, gen_h/2);
  //let _h = _clamp(gen_h*Math.pow(fxrand(), gamma), 4, gen_h/4);
  let _h = (0.75 + 0.5*(fxrand()-0.5))*_w;

  _h = _clamp( Math.pow(fxrand(), 10)*_w, 1, _w );

  let _v = fxrand()*10 + 1;

  let _dd = (fxrand() - 0.5)*(gen_h - _h);
  if (Math.abs(_dd) < 1) {
    _dd = ( (fxrand()<0.5) ? 1 : -1 );
  }
  let _dx = _sin * _dd;
  let _dy = _cos * _dd;

  let _ttl = len / _vv;




  //let _b = _clamp( Math.floor(fxrand()*255), 32, 255-32);
  //let _color = "rgb(" + _b + "," + _b  + "," + _b + ")";

  //let _rgb = chroma.hcl( fxrand()*360, 50, 50 ).rgb();
  //let _color = "rgba(" + _rgb.join(",") + ",0.95)";

  let _color = _rnd_color();


  //let _color = "rgba(32,32,32,0.9)";
  //if (fxrand() < 0.5) {
  //  _color = "rgba(200,200,200,0.9)";
  //}


  _sq.c = _color;
  update_sq( _sq, sx + _dx, sy + _dy, _w, _h, theta);
  _sq.v.x = _vv*Math.cos(theta); 
  _sq.v.y = _vv*Math.sin(theta); 
  _sq.ttl = _ttl + 1;
  _sq.theta = theta;
  _sq.w = _w;
  _sq.h = _h;
  _sq.x = sx + _dx;
  _sq.y = sy + _dy;
}

function create_package(sx, sy, distx, disty, gen_w, gen_h, gamma) {
  gamma = ((typeof gamma === "undefined") ? 10.0 : gamma);

  let len = Math.sqrt( distx*distx + disty*disty );
  let theta = Math.atan2(disty, distx);

  let _cos = Math.cos(theta);
  let _sin = Math.sin(theta);

  //let _vv = fxrand()*5 + 3;
  let _vv = _clamp( 3*Math.pow(fxrand(), 2), 0.25, 5);
  let _v_vec = { "x" : _vv*Math.cos(theta), "y": _vv*Math.sin(theta) };



  //let _w = gen_h*fxrand()/2 + 4;
  //let _h = gen_h*fxrand()/4 + 4;

  //let _w = _clamp(gen_h*Math.pow(fxrand(), gamma), 4, gen_h/2);
  let _w = _clamp(200*Math.pow(fxrand(), gamma), 4, gen_h/2);
  //let _h = _clamp(gen_h*Math.pow(fxrand(), gamma), 4, gen_h/4);
  let _h = (0.75 + 0.5*(fxrand()-0.5))*_w;

  _h = _clamp( Math.pow(fxrand(), 10)*_w, 1, _w );

  let _v = fxrand()*10 + 1;

  let _dd = (fxrand() - 0.5)*(gen_h - _h);
  if (Math.abs(_dd) < 1) {
    _dd = ( (fxrand()<0.5) ? 1 : -1 );
  }
  let _dx = _sin * _dd;
  let _dy = _cos * _dd;

  let _ttl = len / _vv;

  //let _b = _clamp( Math.floor(fxrand()*255), 32, 255-32);
  //let _color = "rgb(" + _b + "," + _b  + "," + _b + ")";

  let _color = _rnd_color();

  let _xpos = fxrand()*1.25*distx - (distx/4);
  _ttl = (distx - _xpos) / _vv;

  let _sq = {
    "c": _color,
    "p": create_sq(sx + _dx, sy + _dy, _w, _h, theta),
    "v": _v_vec,
    "ttl": _ttl + 1,
    "theta":theta,
    "w":_w,
    "h":_h,
    //"x": sx + _dx,
    "x": _xpos,
    "y": sy + _dy
  };

  return _sq;
}

function create_pair(p0x,p0y,distx,disty,w,h,N) {
  //let N=30000;
  N = ((typeof N === "undefined") ? 30000 : N);

  let len = Math.sqrt( (distx*distx) + (disty*disty) );

  let theta = Math.atan2(disty, distx);

  let _cos = Math.cos(theta);
  let _sin = Math.sin(theta);

  let _g0 = { "p": create_sq(p0x, p0y, w, h, theta), "x": p0x, "y": p0y };
  let _g1 = { "p": create_sq(p0x + distx, p0y + disty, w, h, theta), "x":p0x + distx, "y":p0y + disty };

  let _pair = {
    "w": w,
    "h": h,
    "theta": theta,
    "dist" : { "x": distx , "y": disty },
    "dist_norm" : { "x": distx / len, "y": disty / len },
    "gen": [ _g0, _g1 ],
    "sq": [ ]
  };

  let _axis = { "x": Math.sin(theta), "y": Math.cos(theta) };

  for (let i=0; i<N; i++) {
    _pair.sq.push( create_package(p0x,p0y, distx,disty, w,h) );
  }

  //_pair.sq.sort( function(a,b) { return a.w*a.h - b.w*b.h; } );
  _pair.sq.sort( function(a,b) { return b.w*b.h - a.w*a.h; } );

  return _pair;
}

function draw_sq(ctx, _sq, c) {

  if (typeof c !== "undefined") { ctx.fillStyle = c; }

  ctx.fillRect( _sq.x, _sq.y, _sq.w, _sq.h );
}


function __draw_sq(ctx, _pnt, c) {
  if (typeof c !== "undefined") { ctx.fillStyle = c; }
  ctx.beginPath();

  ctx.moveTo(_pnt[0].x, _pnt[0].y);
  for (let i=1; i<=_pnt.length; i++) {
    let idx = i%_pnt.length;
    ctx.lineTo(_pnt[idx].x, _pnt[idx].y);
  }
  ctx.fill();

 }

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  clear(ctx, _cw, _ch, g_info.bg_color);

  if (g_info.data.length == 0) {

    for (let i=0; i<1; i++) {

      let x = Math.floor(fxrand()*_cw);
      let y = Math.floor(fxrand()*_ch);

      //x = -_cw;
      x = -_ch/2;
      y = _ch/2;

      let x1 = Math.floor(fxrand()*_cw);
      let y1 = Math.floor(fxrand()*_ch);

      //x1 = _cw + 100;
      //y1 = _ch + 100;

      x1 = _cw;
      //y1 = 2*_ch;
      y1 = _ch/2;



      //if (fxrand() < 0.5) { x1 = x; }
      //else { y1 = y; }

      let distx = x1 - x;
      let disty = y1 - y;

      //let w = fxrand()*50 + 10;
      //let h = fxrand()*100 + 40;

      w = 1;
      h = 1.25*_ch;

      //let _sq_density = 50;
      let _sq_density = fxrand()*(50-10) + 10;



      let _N = _sq_density * _max(_cw, _ch);

      console.log("_N:", _N);

      g_info.data.push(create_pair(x,y, distx,disty, w,h, _N));
    }
    //g_info.data.push( create_pair(300, 300, 500, 0, 10, 100) );
    //g_info.data.push( create_pair(400, 200, 0, 500, 10, 100) );
    //g_info.data.push( create_pair(700, 200, -500, 300, 30, 300) );

  }

  if ((g_info.tick%120)==-1) {
    let _idx = g_info.hot_idx;
    g_info.hot_idx = (g_info.hot_idx + 1)%(g_info.data.length);

    let x = Math.floor(fxrand()*_cw);
    let y = Math.floor(fxrand()*_ch);

    let x1 = Math.floor(fxrand()*_cw);
    let y1 = Math.floor(fxrand()*_ch);

    if (fxrand() < 0.5) { x1 = x; }
    else { y1 = y; }

    let distx = x1 - x;
    let disty = y1 - y;

    let w = fxrand()*50 + 10;
    let h = fxrand()*100 + 40;

    g_info.data[_idx] = create_pair(x,y, distx,disty, w,h);
  }

  ctx.beginPath();
  for (let _zidx=0; _zidx<g_info.data.length; _zidx++) {
    let z = g_info.data[_zidx];

    for (let i=0; i<z.sq.length ;i++) {
      ctx.fillStyle = z.sq[i].c;
      ctx.fillRect( Math.floor(z.sq[i].x), Math.floor(z.sq[i].y), Math.floor(z.sq[i].w), Math.floor(z.sq[i].h) );
    }

    for (let i=0; i<z.sq.length; i++) {
      if (z.sq[i].ttl<=0) {
        update_package( z.sq[i],z.gen[0].x, z.gen[0].y, z.dist.x, z.dist.y, z.w, z.h );
      }
      for (let j=0; j<z.sq[i].p.length; j++) {
        z.sq[i].p[j].x += z.sq[i].v.x;
        z.sq[i].p[j].y += z.sq[i].v.y;

        z.sq[i].x += z.sq[i].v.x;
        z.sq[i].y += z.sq[i].v.y;

      }
      z.sq[i].ttl--;
    }

    z.sq.sort( function(a,b) { return b.w*b.h - a.w*a.h; } );


  }

  g_info.tick++;
  window.requestAnimationFrame(anim);

  return;

  let n = g_info.state.length;

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  for (let i=0; i<n; i++) {
    let _v = g_info.state[i];

    ctx.fillRect( _v.x, _v.y, _v.w, _v.h );

    _v.x += _v.v.x;
    _v.y += _v.v.y;

    _v.ttl --;
  }

  let new_state = [];
  for (let i=0; i<n; i++) {
    let _v = g_info.state[i];

    if (_v.ttl <= 0) {
      let _u = {
        "x": 300 + fxrand()*50,
        "y": 300 + fxrand()*100,
        "w": 10 + fxrand()*30,
        "h": 10 + fxrand()*30,
        "v": { "x": 3 + fxrand()*5, "y": 0 },
        "ttl": 50 + fxrand()*30
      };
      new_state.push(_u);
      continue;
    }
    new_state.push(_v);
  }
  g_info.state = new_state;


  window.requestAnimationFrame(anim);

  if (g_info.anim) {

    if (!g_info.pause) {
      g_info.tick += 1;
      g_info.tick_val = 16*(1.0 + Math.sin(Math.PI*2.0*g_info.tick/g_info.speed_factor));
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
  link.download = "100shirtrsburning_screenshot.png";
  link.href = imguri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function _simple_ok(ctx) {

  ctx.beginPath();
  ctx.lineWidth = 0;
  ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
  ctx.moveTo(50, 50);
  ctx.arc(50, 50, 20, 0, 2*Math.PI);
  ctx.fill();
}

function init() {
  g_info.state = [];

  let p0 = [ 300, 300 ];
  let p1 = [ 1000, 300 ];


  for (i=0; i<20; i++) {

    let _v = {
      "x" : p0[0] + fxrand()*30,
      "y" : p0[0] + fxrand()*30,
      "v" : { "x": 10, "y": 0 },
      "ttl" : 50,
      "w": 20*fxrand() + 3,
      "h": 20*fxrand() + 3
    };
    g_info.state.push(_v);

  }
}

(()=>{

  console.log("fxhash:",fxhash);

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }

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

  init();

  g_info.speed_factor = fxrand()*511 + 1;

  clear(ctx, W, H, g_info.bg_color);

  //--

  // setup callback in f_hist.
  //
  let ox = Math.floor(dS/6),
      oy = Math.floor(dS/6);

  window.requestAnimationFrame(anim);

})();
