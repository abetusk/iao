//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var g_info = {
  "VERSION" : "0.1.0",
  "PROJECT" : "PROJECT",
  "download_filename": "BOILERPLATE.png",
  "canvas": {},
  "ctx" : {},
  "ready": false,
  "tick" : 0,
  "tick_val" : 0,

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  "capture_dt":5000,

  "fps_debug": false,
  "fps": 0,
  "last_t":0,


  "pause": false,

  "speed_factor":256,
  "color": [ ],

  "rnd":[],

  "features" : {},

  "iter": 0,
  "max_iter": 100,

  "crack_shape": 0,
  "shape_size_factor": 2/3,
  "size":0,

  "group": [],

  "shimmer_state" : [],

  "shape_choice": [

    // square 
    //
    [[
      { "X": -1/2, "Y": -1/2},
      { "X":  1/2, "Y": -1/2},
      { "X":  1/2, "Y":  1/2},
      { "X": -1/2, "Y":  1/2}
    ]],

    // circle
    //
    [[
      {"X":0.5,"Y":0},
      {"X":0.4903926402016152,"Y":0.09754516100806412},
      {"X":0.46193976625564337,"Y":0.1913417161825449},
      {"X":0.4157348061512726,"Y":0.2777851165098011},
      {"X":0.3535533905932738,"Y":0.35355339059327373},
      {"X":0.27778511650980114,"Y":0.4157348061512726},
      {"X":0.19134171618254492,"Y":0.46193976625564337},
      {"X":0.09754516100806417,"Y":0.4903926402016152},
      {"X":3.061616997868383e-17,"Y":0.5},
      {"X":-0.0975451610080641,"Y":0.4903926402016152},
      {"X":-0.19134171618254486,"Y":0.46193976625564337},
      {"X":-0.277785116509801,"Y":0.4157348061512727},
      {"X":-0.35355339059327373,"Y":0.3535533905932738},
      {"X":-0.4157348061512727,"Y":0.2777851165098011},
      {"X":-0.46193976625564337,"Y":0.19134171618254495},
      {"X":-0.4903926402016152,"Y":0.0975451610080643},
      {"X":-0.5,"Y":6.123233995736766e-17},
      {"X":-0.4903926402016152,"Y":-0.09754516100806418},
      {"X":-0.4619397662556434,"Y":-0.19134171618254484},
      {"X":-0.41573480615127273,"Y":-0.277785116509801},
      {"X":-0.35355339059327384,"Y":-0.35355339059327373},
      {"X":-0.2777851165098011,"Y":-0.4157348061512726},
      {"X":-0.19134171618254517,"Y":-0.46193976625564326},
      {"X":-0.09754516100806433,"Y":-0.49039264020161516},
      {"X":-9.184850993605148e-17,"Y":-0.5},
      {"X":0.09754516100806415,"Y":-0.4903926402016152},
      {"X":0.191341716182545,"Y":-0.4619397662556433},
      {"X":0.2777851165098009,"Y":-0.41573480615127273},
      {"X":0.3535533905932737,"Y":-0.35355339059327384},
      {"X":0.4157348061512726,"Y":-0.2777851165098011},
      {"X":0.46193976625564326,"Y":-0.1913417161825452},
      {"X":0.49039264020161516,"Y":-0.09754516100806436}
    ]],

    // heart
    //
    [[
      {"X":0,"Y":-0.15625},
      {"X":0.00047084296677742983,"Y":-0.1623660887733345},
      {"X":0.0037125916285978217,"Y":-0.1800239055279351},
      {"X":0.012230447300081262,"Y":-0.20723144694730022},
      {"X":0.028021345572997822,"Y":-0.2409229109994941},
      {"X":0.05237568547572451,"Y":-0.2773054507230179},
      {"X":0.08574067733194701,"Y":-0.3122804757289513},
      {"X":0.12765732351782266,"Y":-0.3418861653061944},
      {"X":0.17677669529663684,"Y":-0.36270630368119416},
      {"X":0.23095432790777656,"Y":-0.3721964489192509},
      {"X":0.28741481436143845,"Y":-0.36889086040854024},
      {"X":0.3429726166718281,"Y":-0.3524706759232958},
      {"X":0.39429025373736876,"Y":-0.3236930497406712},
      {"X":0.4381517864200341,"Y":-0.28419957313066},
      {"X":0.4717281816890296,"Y":-0.23623767292558626},
      {"X":0.49281181446859984,"Y":-0.18233872025931508},
      {"X":0.5,"Y":-0.12500000000000003},
      {"X":0.4928118144686,"Y":-0.0664142090847391},
      {"X":0.4717281816890296,"Y":-0.008280507160031758},
      {"X":0.4381517864200341,"Y":0.04828303380893264},
      {"X":0.39429025373736876,"Y":0.10272218061987505},
      {"X":0.34297261667182827,"Y":0.154937263581852},
      {"X":0.2874148143614385,"Y":0.20510811397029025},
      {"X":0.23095432790777676,"Y":0.2534882525072553},
      {"X":0.17677669529663692,"Y":0.3002063036811941},
      {"X":0.12765732351782266,"Y":0.34510942015427915},
      {"X":0.08574067733194701,"Y":0.3876748745188827},
      {"X":0.052375685475724576,"Y":0.42700343401882535},
      {"X":0.028021345572997847,"Y":0.46189378012029014},
      {"X":0.01223044730008127,"Y":0.4909834153146638},
      {"X":0.003712591628597842,"Y":0.5129304332618715},
      {"X":0.00047084296677743303,"Y":0.5266039596812994},
      {"X":9.18338008663387e-49,"Y":0.53125},
      {"X":-0.0004708429667774296,"Y":0.5266039596812995},
      {"X":-0.0037125916285978278,"Y":0.5129304332618714},
      {"X":-0.012230447300081234,"Y":0.4909834153146639},
      {"X":-0.028021345572997798,"Y":0.4618937801202902},
      {"X":-0.05237568547572451,"Y":0.4270034340188255},
      {"X":-0.0857406773319469,"Y":0.38767487451888283},
      {"X":-0.12765732351782255,"Y":0.3451094201542792},
      {"X":-0.17677669529663684,"Y":0.30020630368119416},
      {"X":-0.23095432790777637,"Y":0.25348825250725565},
      {"X":-0.28741481436143845,"Y":0.2051081139702904},
      {"X":-0.3429726166718281,"Y":0.1549372635818521},
      {"X":-0.3942902537373684,"Y":0.10272218061987543},
      {"X":-0.43815178642003394,"Y":0.04828303380893278},
      {"X":-0.4717281816890294,"Y":-0.008280507160031505},
      {"X":-0.4928118144686,"Y":-0.06641420908473925},
      {"X":-0.5,"Y":-0.12499999999999989},
      {"X":-0.4928118144686,"Y":-0.1823387202593146},
      {"X":-0.4717281816890296,"Y":-0.23623767292558617},
      {"X":-0.4381517864200341,"Y":-0.28419957313065985},
      {"X":-0.3942902537373686,"Y":-0.3236930497406713},
      {"X":-0.34297261667182827,"Y":-0.35247067592329573},
      {"X":-0.2874148143614387,"Y":-0.36889086040854013},
      {"X":-0.23095432790777656,"Y":-0.37219644891925086},
      {"X":-0.176776695296637,"Y":-0.3627063036811941},
      {"X":-0.12765732351782294,"Y":-0.3418861653061945},
      {"X":-0.08574067733194701,"Y":-0.3122804757289514},
      {"X":-0.0523756854757246,"Y":-0.2773054507230179},
      {"X":-0.028021345572997958,"Y":-0.24092291099949445},
      {"X":-0.012230447300081283,"Y":-0.2072314469473003},
      {"X":-0.003712591628597848,"Y":-0.18002390552793524},
      {"X":-0.0004708429667774284,"Y":-0.16236608877333447}
    ]],

    // oval (wide)
    //
    [[
      {"X":0.5,"Y":0},
      {"X":0.4903926402016152,"Y":0.06828161270564488},
      {"X":0.46193976625564337,"Y":0.13393920132778142},
      {"X":0.4157348061512726,"Y":0.19444958155686076},
      {"X":0.3535533905932738,"Y":0.2474873734152916},
      {"X":0.27778511650980114,"Y":0.29101436430589084},
      {"X":0.19134171618254492,"Y":0.3233578363789503},
      {"X":0.09754516100806417,"Y":0.34327484814113063},
      {"X":3.061616997868383e-17,"Y":0.35},
      {"X":-0.0975451610080641,"Y":0.34327484814113063},
      {"X":-0.19134171618254486,"Y":0.3233578363789503},
      {"X":-0.277785116509801,"Y":0.29101436430589084},
      {"X":-0.35355339059327373,"Y":0.24748737341529164},
      {"X":-0.4157348061512727,"Y":0.19444958155686076},
      {"X":-0.46193976625564337,"Y":0.13393920132778145},
      {"X":-0.4903926402016152,"Y":0.068281612705645},
      {"X":-0.5,"Y":4.286263797015736e-17},
      {"X":-0.4903926402016152,"Y":-0.06828161270564492},
      {"X":-0.4619397662556434,"Y":-0.13393920132778137},
      {"X":-0.41573480615127273,"Y":-0.19444958155686068},
      {"X":-0.35355339059327384,"Y":-0.2474873734152916},
      {"X":-0.2777851165098011,"Y":-0.29101436430589084},
      {"X":-0.19134171618254517,"Y":-0.32335783637895027},
      {"X":-0.09754516100806433,"Y":-0.3432748481411306},
      {"X":-9.184850993605148e-17,"Y":-0.35},
      {"X":0.09754516100806415,"Y":-0.34327484814113063},
      {"X":0.191341716182545,"Y":-0.3233578363789503},
      {"X":0.2777851165098009,"Y":-0.2910143643058909},
      {"X":0.3535533905932737,"Y":-0.24748737341529167},
      {"X":0.4157348061512726,"Y":-0.19444958155686076},
      {"X":0.46193976625564326,"Y":-0.13393920132778162},
      {"X":0.49039264020161516,"Y":-0.06828161270564505}
    ]],

    // oval (high)
    //
    [[
      {"X":0.25,"Y":0},
      {"X":0.2451963201008076,"Y":0.09754516100806412},
      {"X":0.23096988312782168,"Y":0.1913417161825449},
      {"X":0.2078674030756363,"Y":0.2777851165098011},
      {"X":0.1767766952966369,"Y":0.35355339059327373},
      {"X":0.13889255825490057,"Y":0.4157348061512726},
      {"X":0.09567085809127246,"Y":0.46193976625564337},
      {"X":0.04877258050403208,"Y":0.4903926402016152},
      {"X":1.5308084989341915e-17,"Y":0.5},
      {"X":-0.04877258050403205,"Y":0.4903926402016152},
      {"X":-0.09567085809127243,"Y":0.46193976625564337},
      {"X":-0.1388925582549005,"Y":0.4157348061512727},
      {"X":-0.17677669529663687,"Y":0.3535533905932738},
      {"X":-0.20786740307563634,"Y":0.2777851165098011},
      {"X":-0.23096988312782168,"Y":0.19134171618254495},
      {"X":-0.2451963201008076,"Y":0.0975451610080643},
      {"X":-0.25,"Y":6.123233995736766e-17},
      {"X":-0.2451963201008076,"Y":-0.09754516100806418},
      {"X":-0.2309698831278217,"Y":-0.19134171618254484},
      {"X":-0.20786740307563636,"Y":-0.277785116509801},
      {"X":-0.17677669529663692,"Y":-0.35355339059327373},
      {"X":-0.13889255825490054,"Y":-0.4157348061512726},
      {"X":-0.09567085809127258,"Y":-0.46193976625564326},
      {"X":-0.048772580504032166,"Y":-0.49039264020161516},
      {"X":-4.592425496802574e-17,"Y":-0.5},
      {"X":0.048772580504032076,"Y":-0.4903926402016152},
      {"X":0.0956708580912725,"Y":-0.4619397662556433},
      {"X":0.13889255825490046,"Y":-0.41573480615127273},
      {"X":0.17677669529663684,"Y":-0.35355339059327384},
      {"X":0.2078674030756363,"Y":-0.2777851165098011},
      {"X":0.23096988312782163,"Y":-0.1913417161825452},
      {"X":0.24519632010080758,"Y":-0.09754516100806436}
    ]]




  ],

  "initial_shape": [],

  /*
  "initial_shape" : [[
    { "X": -1/2, "Y": -1/2},
    { "X":  1/2, "Y": -1/2},
    { "X":  1/2, "Y":  1/2},
    { "X": -1/2, "Y":  1/2}
  ]],
  */


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

//--

function welcome() {
  let lines = [
    "  _           ",
    " (_)__ _ ___  ",
    " | / _` / _ \\ ",
    " |_\\__,_\\___/ ",
    "              "
  ];

  console.log(lines.join("\n"));
  console.log("Welcome, gentle programmer.");
  console.log("All code is libre/free. Please see individual files for license details.");
  console.log("");
  console.log("fxhash:", fxhash);
  console.log("Project:", g_info.PROJECT);
  console.log("Version", g_info.VERSION);



  console.log("");
  console.log("commands:");
  console.log("");
  console.log(" s   - save screenshot (PNG)");
  console.log("");

  console.log("Features:");
  for (let key in g_info.features) {
    console.log(key + ":", g_info.features[key]);
  }

}

//--

function _clip_union( rop_pgns, _pgns) {
  let clpr = new ClipperLib.Clipper();
  let joinType = ClipperLib.JoinType.jtRtound;
  let fillType = ClipperLib.PolyFillType.pftPositive;
  let subjPolyType = ClipperLib.PolyType.ptSubject;
  let clipPolyType = ClipperLib.PolyType.ptClip;
  let clipType = ClipperLib.ClipType.ctUnion;

  let scale = 16384;
  let sol_polytree= new ClipperLib.PolyTree();

  let pgns = [];
  for (let i=0; i<_pgns.length; i++) {
    let idx = pgns.length;
    pgns.push([]);
    for (let j=0; j<_pgns[i].length; j++) {
      pgns[idx].push( { "X": _pgns[i][j].X, "Y": _pgns[i][j].Y } );
    }
  }

  ClipperLib.JS.ScaleUpPaths(pgns, scale);

  clpr.AddPaths( pgns, subjPolyType );
  clpr.Execute( clipType, sol_polytree, fillType, fillType);

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

function _clip_intersect( rop_pgns, _pgnsA, _pgnsB ) {
  var clpr = new ClipperLib.Clipper();
  var joinType = ClipperLib.JoinType.jtRtound;
  var fillType = ClipperLib.PolyFillType.pftPositive;
  var subjPolyType = ClipperLib.PolyType.ptSubject;
  var clipPolyType = ClipperLib.PolyType.ptClip;
  var clipType = ClipperLib.ClipType.ctIntersection;

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

function _clip_xor( rop_pgns, _pgnsA, _pgnsB ) {
  var clpr = new ClipperLib.Clipper();
  var joinType = ClipperLib.JoinType.jtRtound;
  var fillType = ClipperLib.PolyFillType.pftPositive;
  var subjPolyType = ClipperLib.PolyType.ptSubject;
  var clipPolyType = ClipperLib.PolyType.ptClip;
  var clipType = ClipperLib.ClipType.ctXor;

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


  clpr.AddPolygons( pgnsA, subjPolyType );
  clpr.AddPolygons( pgnsB, clipPolyType );

  clpr.Execute(clipType, rop_pgns, fillType, fillType );

}

function _clip_offset( ofs_pgns, inp_pgns, ds ) {
  var joinType = ClipperLib.JoinType.jtRound;
  var miterLimit = 10;
  var autoFix = true;

  var clpr = new ClipperLib.Clipper();

  var t_pgns = clpr.OffsetPolygons( inp_pgns, ds, joinType, miterLimit, autoFix );

  for (var ind in t_pgns) {
    ofs_pgns.push(t_pgns[ind]);
  }

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

//--

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

function loading_screen() {

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

function anim() {

  let _cw = g_info.canvas.width;
  let _ch = g_info.canvas.height;
  let ctx = g_info.ctx;

  let cur_t = Date.now();

  clear(ctx, _cw, _ch, g_info.bg_color);
  g_info.tick++;
  window.requestAnimationFrame(anim);

  if (g_info.animation_capture) {
    g_info.capturer.capture( g_info.canvas );

    let _t = Date.now();

    console.log("!!", g_info.capture_end - _t);

    if (_t >= g_info.capture_end) {
      g_info.animation_capture = false;
      g_info.capturer.stop();
      g_info.capturer.save();
    }

  }


  if (!g_info.ready) {
    loading_screen();
    return;
  }

  //clear();

  let shadow_dx = -4;
  let shadow_dy =  4;

  for (let i=0; i<g_info.group.length; i++) {
    let cx = g_info.group[i].x;
    let cy = g_info.group[i].y;
    let shape = g_info.group[i].shape;
    let crack_type = g_info.group[i].type;

    let shimmer = g_info.group[i].shimmer;

    polygon_with_holes(ctx, cx+shadow_dx, cy+shadow_dy, shape, "rgba(5,5,5,0.1)");
    //polygon_with_holes(ctx, cx, cy, shape, "rgba(150, 134, 163, 0.5)");
    polygon_with_holes(ctx, cx, cy, shape, "rgba(75, 67, 82, 0.25)");

    for (let i=0; i<shimmer.length; i++) {
      let _shs = shimmer[i];

      if (cur_t > _shs.t_next) {
        if (_shs.state == "on") {
          _shs.t_next = cur_t + _shs.t_off;
          _shs.state = "off";
        }
        else {
          _shs.t_next = cur_t + _shs.t_on;
          _shs.state = "on";
        }
      }

      if (_shs.state == "on") {
        polygons(ctx, cx, cy, [shape[i]], "rgba(255,255,255,0.125)");
      }


    }

    let damp = 0.0;
    let initial_damp  = 0.005;
    if (crack_type == 1) {
      initial_damp = 0.025;
    }
    else if (crack_type == 2) {
      initial_damp = 0.005;
    }

    if (g_info.iter>g_info.max_iter) {
      damp = 0;
    }
    else {
      damp = initial_damp*(g_info.max_iter - g_info.iter) / g_info.max_iter;
    }

    let com_list = [];
    for (let i=0; i<shape.length; i++) {
      let com = { "X":0, "Y": 0};
      for (let idx=0; idx<shape[i].length; idx++) {
        com.X += shape[i][idx].X;
        com.Y += shape[i][idx].Y;
      }
      if (shape[i].length > 0) {
        com.X /= shape[i].length;
        com.Y /= shape[i].length;
      }

      com_list.push(com);
    }


    let fvec = [];
    for (let i=0; i<com_list.length ; i++) {
      let _dx = damp*fxrand()*5;
      let _dy = damp*fxrand()*5;
      let f = {"X": _dx, "Y": _dy };
      for (let j=0; j<com_list.length; j++) {
        if (i==j) { continue; }
        let dx = (com_list[i].X - com_list[j].X);
        let dy = (com_list[i].Y - com_list[j].Y);
        let len = Math.sqrt( dx*dx + dy*dy );

        if (len > 1) {
          f.X += damp*dx / len;
          f.Y += damp*dy / len;
        }

      }
      fvec.push(f);
    }


    for (let i=0; i<shape.length; i++) {
      for (let j=0; j<shape[i].length; j++) {
        shape[i][j].X += fvec[i].X;
        shape[i][j].Y += fvec[i].Y;
      }
    }




  }


  polygon_with_holes(ctx, _cw/2+shadow_dx, _ch/2+shadow_dy, g_info.shape, "rgba(5,5,5,0.9)");
  //polygon_with_holes(ctx, _cw/2, _ch/2, g_info.shape, "rgba(100,100,150,0.8)");
  //polygon_with_holes(ctx, _cw/2, _ch/2, g_info.shape, "rgba(192, 192, 192, 0.8)");
  polygon_with_holes(ctx, _cw/2, _ch/2, g_info.shape, "rgba(190, 194, 203, 0.9)");

  let com_list = [];
  for (let i=0; i<g_info.shape.length; i++) {
    let com = { "X":0, "Y": 0};
    for (let idx=0; idx<g_info.shape[i].length; idx++) {
      com.X += g_info.shape[i][idx].X;
      com.Y += g_info.shape[i][idx].Y;
    }
    if (g_info.shape[i].length > 0) {
      com.X /= g_info.shape[i].length;
      com.Y /= g_info.shape[i].length;
    }

    com_list.push(com);
  }

  for (let i=0; i<g_info.shimmer_state.length; i++) {
    let _shs = g_info.shimmer_state[i];

    if (cur_t > _shs.t_next) {
      if (_shs.state == "on") {
        _shs.t_next = cur_t + _shs.t_off;
        _shs.state = "off";
      }
      else {
        _shs.t_next = cur_t + _shs.t_on;
        _shs.state = "on";
      }
    }

    if (_shs.state == "on") {
      polygons(ctx, _cw/2, _ch/2, [g_info.shape[i]], "rgba(255,255,255,1.0)");
    }


  }

  let _mod = 256;
  let _wins = 100;
  let _winx = 120;
  if ((g_info.iter%_mod) < _wins) {
    let fired = 0;

    let s = 2*((g_info.iter%_mod)/_wins - 0.5);
    for (let i=0; i<com_list.length; i++) {
      if ( ((g_info.width*s-_winx) < com_list[i].X) && (com_list[i].X < (g_info.width*s)) ) {
        polygons(ctx, _cw/2, _ch/2, [g_info.shape[i]], "rgba(255,255,255,1.0)");
        fired++;
      }
    }

  }

  let damp = 0.0;
  let initial_damp  = 0.005;
  if (g_info.crack_type == 1) {
    initial_damp = 0.025;
  }
  else if (g_info.crack_type == 2) {
    initial_damp = 0.005;
  }

  if (g_info.iter>g_info.max_iter) {
    damp = 0;
  }
  else {
    damp = initial_damp*(g_info.max_iter - g_info.iter) / g_info.max_iter;
  }
  g_info.iter++;

  let fvec = [];
  for (let i=0; i<com_list.length ; i++) {
    let _dx = damp*fxrand()*5;
    let _dy = damp*fxrand()*5;
    let f = {"X": _dx, "Y": _dy };
    for (let j=0; j<com_list.length; j++) {
      if (i==j) { continue; }
      let dx = (com_list[i].X - com_list[j].X);
      let dy = (com_list[i].Y - com_list[j].Y);
      let len = Math.sqrt( dx*dx + dy*dy );

      if (len > 1) {
        f.X += damp*dx / len;
        f.Y += damp*dy / len;
      }

    }
    fvec.push(f);
  }


  for (let i=0; i<g_info.shape.length; i++) {
    for (let j=0; j<g_info.shape[i].length; j++) {
      g_info.shape[i][j].X += fvec[i].X;
      g_info.shape[i][j].Y += fvec[i].Y;
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

  g_info.size = dS;

  g_info.canvas = canvas;
  g_info.ctx = ctx;
  //g_info.size = Math.floor(dS - dS/3);
}

function init_fin() {
  let state_choice = ["on", "off"];
  let cur_t = Date.now();

  g_info.crack_type = Math.floor(fxrand()*3);

  console.log("crack_type:", g_info.crack_type);

  g_info.initial_shape = _copy_pgns( g_info.shape_choice[ Math.floor(g_info.shape_choice.length*fxrand()) ] );

  crack_shape();
  g_info.ready = true;


  let G = [];
  //for (let i=0; i<50; i++) {
  for (let i=0; i<1; i++) {
    let init_shape = _copy_pgns( g_info.initial_shape );
    let _shape = {};
    //let _scale = 0.125; //fxrand()*0.25 + 0.15;
    let _scale = 2; //fxrand()*0.25 + 0.15;
    let opt = {
      "size": _scale * g_info.width,
      "cut_count": 64
    };

    let crack_type = g_info.crack_type;

    if (crack_type == 0) {
      _shape = crack_shape0(init_shape, opt);
    }
    else if (crack_type == 1) {
      _shape = crack_shape1(init_shape, opt);
    }
    else if (crack_type == 2) {
      _shape = crack_shape2(init_shape, opt);
    }

    let _shimmer_state = [];
    for (let i=0; i<_shape.length; i++) {
      let cur_state = state_choice[Math.floor(fxrand()*2)];
      let t_on = fxrand()*350 + 50;
      let t_off = fxrand()*5000 + 1000;

      let t_nxt = 0;

      if (cur_state == "on") {
        t_nxt = t_on*fxrand() + cur_t;
      }
      else {
        t_nxt = t_off*fxrand() + cur_t;
      }

      _shimmer_state.push({
        "t_on": t_on,
        "t_off": t_off,
        "state": cur_state,
        "t_next": t_nxt
      });
    }

    let g = {
      //"x": fxrand()*g_info.width,
      //"y": fxrand()*g_info.height,
      "x": g_info.width/2,
      "y": g_info.height/2,
      "type": crack_type,
      "s": _scale,
      "shape": _shape,
      "shimmer": _shimmer_state
    };
    G.push(g);



  }

  g_info.group = G;

}

function crack_shape() {
  let init_shape = _copy_pgns( g_info.initial_shape );
  let s = {};

  let opt = {
    "size": g_info.shape_size_factor*g_info.size
  };

  if (g_info.crack_type == 0) {
    s = crack_shape0(init_shape, opt);
  }
  else if (g_info.crack_type == 1) {
    s = crack_shape1(init_shape, opt);
  }
  else if (g_info.crack_type == 2) {
    s = crack_shape2(init_shape, opt);
  }

  g_info.shape = s;

  let state_choice = ["on", "off"];

  let cur_t = Date.now();

  for (let i=0; i<g_info.shape.length; i++) {
    let cur_state = state_choice[Math.floor(fxrand()*2)];
    let t_on = fxrand()*350 + 50;
    let t_off = fxrand()*5000 + 1000;

    let t_nxt = 0;

    if (cur_state == "on") {
      t_nxt = t_on*fxrand() + cur_t;
    }
    else {
      t_nxt = t_off*fxrand() + cur_t;
    }

    //t_on*fxrand() + cur_t;

    //let t_nxt = fxrand()*5;
    g_info.shimmer_state.push({
      "t_on": t_on,
      "t_off": t_off,
      "state": cur_state,
      "t_next": t_nxt
    });
  }

}

//wip
//
function crack_shape3(init_shape, opt) {
  //let _w = 500;

  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);
  let _min_r = 10;

  //let cur_shape = g_info.initial_shape;
  let cur_shape = init_shape;
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }

  let cx = 2*(fxrand()-0.5)*_size;
  let cy = 2*(fxrand()-0.5)*_size;
  let r = fxrand()*_size/4 + _min_r;

  let crack_pgn = [];

  let maxR = 4;
  for (let ii=0; ii<maxR; ii++) {

    let n_seg = 32;

    let _c = Math.cos(Math.PI*2/n_seg);
    let _s = Math.sin(Math.PI*2/n_seg);
    for (let seg=0; seg<n_seg; seg++) {

      let s = (seg/n_seg);

      let dr = 1;

      let p = [
        { "X":  r*_c,       "Y": r*_s },
        { "X":  (r+dr)*_c,  "Y": (r+dr)*_s },
        { "X":  (r+dr)*_c,  "Y":-(r+dr)*_s },
        { "X":  r*_c,       "Y":-r*_s }
      ];

      for (let i=0; i<p.length; i++) {

      }

      crack_pgn.push(p);

    }

    r += fxrand()*_size/4 + _min_r;
  }

}

function crack_shape2(init_shape, opt) {
  //let _w = 500;
  //let _w = g_info.shape_size_factor*g_info.size;

  opt = ((typeof opt === "undefined") ? {} : opt);
  let ncut = ((typeof opt.cut_count === "undefined") ? 32 : opt.cut_count);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);


  let _min_r = 10;

  //let cur_shape = g_info.initial_shape;
  let cur_shape = init_shape;
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }


  let cx = (fxrand()-0.5)*_size;
  let cy = (fxrand()-0.5)*_size;
  let r = fxrand()*_size/4 + _min_r;

  let crack_pgn = [];

  let _jiggle_r = fxrand()*5;

  //let ncut = 32;
  for (let i=0; i<ncut; i++) {

    let cut_line = [];

    let choice = Math.floor(fxrand()*2);

    if (choice == 0) {
      let _x0=0, _x1=0, _y0=0, _y1=0;

      let slice_choice = Math.floor(fxrand()*4);

      let ds = 5;

      if (slice_choice==0) {

        _x0 = -(fxrand()*_size + _size/2);
        _y0 = -(fxrand()*_size + _size/2);
        _x1 =  (fxrand()*_size + _size/2);
        _y1 =  (fxrand()*_size + _size/2);

        cut_line.push( [
          { "X": _x0,   "Y": _y0 },
          { "X": _x0+ds, "Y": _y0 },
          { "X": _x1+ds, "Y": _y1 },
          { "X": _x1,   "Y": _y1 }
        ]);
      }

      else if (slice_choice==1) {
        _x0 =  (fxrand()*_size + _size/2);
        _y0 = -(fxrand()*_size + _size/2);
        _x1 = -(fxrand()*_size + _size/2);
        _y1 =  (fxrand()*_size + _size/2);

        cut_line.push( [
          { "X": _x0,   "Y": _y0 },
          { "X": _x0+ds, "Y": _y0 },
          { "X": _x1+ds, "Y": _y1 },
          { "X": _x1,   "Y": _y1 }
        ]);
      }

      else if (slice_choice==2) {
        ds = 3;
        _x0 =  (fxrand()-0.5)*_size;
        _y0 = -(fxrand()*_size + _size/2);
        _x1 =  (fxrand()-0.5)*_size;
        _y1 =  (fxrand()*_size + _size/2);

        cut_line.push( [
          { "X": _x0,   "Y": _y0 },
          { "X": _x0+ds, "Y": _y0 },
          { "X": _x1+ds, "Y": _y1 },
          { "X": _x1,   "Y": _y1 }
        ]);
      }

      else{
        ds = 3;
        _x0 = -(fxrand()*_size + _size/2);
        _y0 =  (fxrand()-0.5)*_size;
        _x1 =  (fxrand()*_size + _size/2);
        _y1 =  (fxrand()-0.5)*_size;

        cut_line.push( [
          { "X": _x0,   "Y": _y0 },
          { "X": _x1,   "Y": _y1 },
          { "X": _x1, "Y": _y1+ds },
          { "X": _x0, "Y": _y0+ds },
        ]);
      }

    }

    else {


      let a = fxrand()*Math.PI*2;
      let _cos = Math.cos(a);
      let _sin = Math.sin(a);

      let _r = 2*_size;
      let ds = 2;

      let dx = fxrand()*_jiggle_r;
      let dy = fxrand()*_jiggle_r;

      cut_line = [[
        { "X":  dx+_r, "Y": dy-ds },
        { "X":  dx+_r, "Y": dy+ds },
        { "X":  dx-_r, "Y": dy+ds },
        { "X":  dx-_r, "Y": dy-ds }
      ]];

      for (let j=0; j<cut_line[0].length; j++) {
        let _x = cut_line[0][j].X*_cos - cut_line[0][j].Y*_sin;
        let _y = cut_line[0][j].X*_sin + cut_line[0][j].Y*_cos;

        cut_line[0][j].X = _x + cx;
        cut_line[0][j].Y = _y + cy;
      }

    }

    let rop = [];
    _clip_difference(rop, cur_shape, cut_line);

    if (rop.length == 0) {
      console.log("skipping...");
      continue;
    }


    cur_shape = rop;

  }

  //g_info.shape = cur_shape;

  return cur_shape;
}

function crack_shape1(init_shape, opt) {
  //let _w = 500;
  //let _w = g_info.shape_size_factor*g_info.size;

  opt = ((typeof opt === "undefined") ? {} : opt);
  let ncut = ((typeof opt.cut_count === "undefined") ? 32 : opt.cut_count);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);



  let _min_r = 10;

  //let cur_shape = g_info.initial_shape;
  let cur_shape = init_shape;
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }


  let cx = (fxrand()-0.5)*_size;
  let cy = (fxrand()-0.5)*_size;
  let r = fxrand()*_size/4 + _min_r;

  let crack_pgn = [];

  let _jiggle_r = fxrand()*5;

  //let ncut = 32;
  for (let i=0; i<ncut; i++) {
    let a = fxrand()*Math.PI*2;
    let _cos = Math.cos(a);
    let _sin = Math.sin(a);

    let _r = 2*_size;
    let ds = 2;

    let dx = fxrand()*_jiggle_r;
    let dy = fxrand()*_jiggle_r;

    let cut_line = [[
      { "X":  dx+_r, "Y": dy-ds },
      { "X":  dx+_r, "Y": dy+ds },
      { "X":  dx-_r, "Y": dy+ds },
      { "X":  dx-_r, "Y": dy-ds }
    ]];

    for (let j=0; j<cut_line[0].length; j++) {
      let _x = cut_line[0][j].X*_cos - cut_line[0][j].Y*_sin;
      let _y = cut_line[0][j].X*_sin + cut_line[0][j].Y*_cos;

      cut_line[0][j].X = _x + cx;
      cut_line[0][j].Y = _y + cy;
    }

    let rop = [];
    _clip_difference(rop, cur_shape, cut_line);

    if (rop.length == 0) {
      console.log("skipping...");
      continue;
    }


    cur_shape = rop;

  }

  //g_info.shape = cur_shape;

  return cur_shape;
}

function crack_shape0(init_shape, opt) {
  //let _w = 500;
  //let _w = g_info.shape_size_factor*g_info.size;

  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);

  //let cur_shape = g_info.initial_shape;
  let cur_shape = init_shape;
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }

  for (let i=0; i<30; i++) {
    let _x0=0, _x1=0, _y0=0, _y1=0;

    let slice_choice = Math.floor(fxrand()*4);

    let ds = 5;

    let cut_line = [];

    if (slice_choice==0) {

      _x0 = -(fxrand()*_size + _size/2);
      _y0 = -(fxrand()*_size + _size/2);
      _x1 =  (fxrand()*_size + _size/2);
      _y1 =  (fxrand()*_size + _size/2);

      cut_line.push( [
        { "X": _x0,   "Y": _y0 },
        { "X": _x0+ds, "Y": _y0 },
        { "X": _x1+ds, "Y": _y1 },
        { "X": _x1,   "Y": _y1 }
      ]);
    }

    else if (slice_choice==1) {
      _x0 =  (fxrand()*_size + _size/2);
      _y0 = -(fxrand()*_size + _size/2);
      _x1 = -(fxrand()*_size + _size/2);
      _y1 =  (fxrand()*_size + _size/2);

      cut_line.push( [
        { "X": _x0,   "Y": _y0 },
        { "X": _x0+ds, "Y": _y0 },
        { "X": _x1+ds, "Y": _y1 },
        { "X": _x1,   "Y": _y1 }
      ]);
    }

    else if (slice_choice==2) {
      ds = 3;
      _x0 =  (fxrand()-0.5)*_size;
      _y0 = -(fxrand()*_size + _size/2);
      _x1 =  (fxrand()-0.5)*_size;
      _y1 =  (fxrand()*_size + _size/2);

      cut_line.push( [
        { "X": _x0,   "Y": _y0 },
        { "X": _x0+ds, "Y": _y0 },
        { "X": _x1+ds, "Y": _y1 },
        { "X": _x1,   "Y": _y1 }
      ]);
    }

    else{
      ds = 3;
      _x0 = -(fxrand()*_size + _size/2);
      _y0 =  (fxrand()-0.5)*_size;
      _x1 =  (fxrand()*_size + _size/2);
      _y1 =  (fxrand()-0.5)*_size;

      cut_line.push( [
        { "X": _x0,   "Y": _y0 },
        { "X": _x1,   "Y": _y1 },
        { "X": _x1, "Y": _y1+ds },
        { "X": _x0, "Y": _y0+ds },
      ]);
    }


    let rop = [];
    _clip_difference(rop, cur_shape, cut_line);

    if (rop.length == 0) {
      console.log("skipping...");
      continue;
    }


    cur_shape = rop;
  }

  //g_info.shape = cur_shape;

  return cur_shape;
}

function init() {
  setTimeout(function() { init_fin(); }, 50);
}

function init_global_param() {
}

(()=>{

  welcome();

  g_info.last_t = Date.now();

  initCanvas();

  console.log(g_info.size);

  init_global_param();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }


  init();

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 'a') {
      if (g_info.animation_capture) { console.log("already capturing!"); return; }
      g_info.capturer = new CCapture({"format":"webm"});
      g_info.capturer.start();
      g_info.animation_capture = true;

      g_info.capture_start = Date.now();
      g_info.capture_end = g_info.capture_start + g_info.capture_dt;

      console.log(">>>", g_info.capture_start, g_info.capture_end, g_info.capture_dt);
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
