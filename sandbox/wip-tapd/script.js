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
  "PROJECT" : "Through a Pixel, Darkly",

  "debug_idx": 0,

  "EPS" : (1.0/10000000.0),
  "download_filename": "through_a_pixel_darkly.png",
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
  //"capture_dt":1000,

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

  "crack_type_count": 3,
  "crack_shape": 0,
  "shape_size_factor": 1/1000,
  "size":0,

  "reset_info": {
    "shape": {},
    "group": []
  },

  "group": [],

  "shimmer_state" : [],

  "shape_name": [ "Square", "Circle", "Heart", "Wide Oval", "Tall Oval"],

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

  "color_choice": [
    {
      "name": "dt01",
      "shape_color": "rgba(23, 42, 137, 0.9)",
      "group_color": "rgba(23, 42, 137, 0.3)",
      "bg_color" : "rgba(247, 247, 243,1.0)"
    },

    { "name": "dt05",
      "shape_color": "rgba(238, 93, 100, 0.9)",
      "group_color": "rgba(238, 93, 100, 0.3)",
      "bg_color" : "rgba(240, 229, 203, 1.0)"
    },

    { "name": "hilda02",
      "shape_color": "rgba(78, 158, 184, 0.9)",
      "group_color": "rgba(78, 158, 184, 0.3)",
      "bg_color" : "rgba(247, 245, 208, 1.0)"
    },

    { "name": "system.#05",
      "shape_color": "rgba(163, 201, 211, 0.9)",
      "group_color": "rgba(209, 225, 225, 0.3)",
      "bg_color" : "rgba(220, 217, 208, 1.0)"
    },

    { "name": "foxshelter",
      "shape_color": "rgba(0, 120, 98, 0.9)",
      "group_color": "rgba(0, 120, 98, 0.3)",
      "bg_color" : "rgba(221,221,221, 1.0)"
    },

    { "name": "florida_citrus",
      "shape_color": "rgba(235, 247, 240, 0.9)",
      "group_color": "rgba(235, 247, 240, 0.3)",
      "bg_color" : "rgba(5,1,0, 1.0)"
    },

    { "name": "verena",
      "shape_color": "rgba(136, 95, 164, 0.9)",
      "group_color": "rgba(136, 95, 164, 0.3)",
      "bg_color" : "rgba(226, 230, 232, 1.0)"
    }
  ],


  "shape_color": "rgba(136, 95, 164, 0.9)",
  "group_color": "rgba(136, 95, 164, 0.3)",
  "bg_color" : "rgba(226, 230, 232, 1.0)",

  "clear_color" : "#000"

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
  console.log(" a   - save animation (webm)");
  console.log(" s   - save screenshot (PNG)");
  console.log(" r   - reset animation");
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

function polygon_with_holes(ctx, x, y, pgn, color, _scale) {
  _scale = ((typeof _scale === "undefined") ? 1.0 : _scale);
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  for (let i=0; i<pgn.length; i++) {
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ctx.moveTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
        continue;
      }
      ctx.lineTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
    }
  }

  ctx.fill();
}

function polygon_outline(ctx, x, y, pgn, color, _scale) {
  _scale = ((typeof _scale === "undefined") ? 1.0 : _scale);
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  //ctx.beginPath();

  //ctx.moveTo(x,y);
  for (let i=0; i<pgn.length; i++) {
    ctx.beginPath();
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ctx.moveTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
        continue;
      }
      ctx.lineTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
    }
    ctx.stroke();
  }

}

function polygons(ctx, x, y, pgn, color, _scale) {
  _scale = ((typeof _scale === "undefined") ? 1.0 : _scale);
  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x,y);
  for (let i=0; i<pgn.length; i++) {
    for (let j=0; j<pgn[i].length; j++) {
      if (j==0) {
        ctx.moveTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
        continue;
      }
      ctx.lineTo(x + _scale*pgn[i][j].X, y + _scale*pgn[i][j].Y);
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

  if (!g_info.ready) {
    loading_screen();
    window.requestAnimationFrame(anim);
    return;
  }

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

  clear(ctx, _cw, _ch, g_info.bg_color);
  //clear(ctx, _cw, _ch, g_info.clear_color);
  g_info.tick++;

  let shadow_dx = -4;
  let shadow_dy =  4;

  //g_info.group_color = "rgba(255,0,0,0.5)";

  //DEBUG
  //DEBUG
  //DEBUG

  /*

  for (let i=0; i<g_info.group.length; i++) {
    let cx = g_info.group[i].x;
    let cy = g_info.group[i].y;
    let shape = g_info.group[i].hist[ g_info.debug_idx ] ;

    cx = g_info.width/2;
    cy = g_info.height/2;

    //polygon_with_holes(ctx, cx+shadow_dx, cy+shadow_dy, shape, "rgba(5,5,5,0.1)", g_info.size);
    polygon_with_holes(ctx, cx, cy, shape, g_info.group_color, g_info.size/3);

  }

  return;
  */

  //DEBUG
  //DEBUG
  //DEBUG

  let _debug_step = false;

  if (!_debug_step) {

  for (let i=0; i<g_info.group.length; i++) {
    let cx = g_info.group[i].x * g_info.width;
    let cy = g_info.group[i].y * g_info.height;
    let s = g_info.group[i].s ;
    let shape = g_info.group[i].shape;

    //cx = g_info.width / 2;
    //cy = g_info.height / 2;

    //polygon_with_holes(ctx, cx+shadow_dx, cy+shadow_dy, shape, "rgba(5,5,5,0.1)", g_info.size);
    //polygon_with_holes(ctx, cx, cy, shape, g_info.group_color, g_info.size/(i+1));
    polygon_with_holes(ctx, cx, cy, shape, g_info.group_color, g_info.size/3);

  }
  }

  else{

  for (let i=0; i<g_info.group.length; i++) {
    let cx = g_info.group[i].x * g_info.width;
    let cy = g_info.group[i].y * g_info.height;
    let s = g_info.group[i].s ;
    let shape = g_info.group[i].hist[g_info.debug_idx];

    //cx = g_info.width / 2;
    //cy = g_info.height / 2;

    //polygon_with_holes(ctx, cx+shadow_dx, cy+shadow_dy, shape, "rgba(5,5,5,0.1)", g_info.size);
    //polygon_with_holes(ctx, cx, cy, shape, g_info.group_color, g_info.size/(i+1));
    polygon_with_holes(ctx, cx, cy, shape, g_info.group_color, g_info.size/3);

  }

  //DEBUG


    /*
  for (let i=0; i<g_info.group.length; i++) {

    let cx = g_info.group[i].x;
    let cy = g_info.group[i].y;
    let shape = g_info.group[i].shape;

    cx = g_info.width/2;
    cy = g_info.height/2;

    polygon_outline(ctx, cx, cy, shape, "rgba(127,127,127,0.5)", g_info.size/1.5);

  }
  */
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

function reset_animation() {
  g_info.shape = _copy_pgns( g_info.reset_info.shape );

  for (let i=0; i<g_info.group.length; i++) {
    g_info.group[i].shape = _copy_pgns( g_info.reset_info.group[i].shape );
  }

  g_info.iter=0;
}

function init_fin() {
  g_info.ready = true;
}

function init_shapes() {
  let state_choice = ["on", "off"];
  let cur_t = Date.now();

  let shape_name = g_info.shape_name; 

  let shape_idx = Math.floor(g_info.shape_choice.length*fxrand());

  g_info.features["Crack Type"] = g_info.crack_type;
  g_info.features["Shape Type"] = shape_name[ shape_idx ];

  g_info.initial_shape = _copy_pgns( g_info.shape_choice[ shape_idx ] );

  let color_idx = Math.floor(fxrand()*g_info.color_choice.length);
  g_info.color_idx = color_idx;

  g_info.shape_color = g_info.color_choice[color_idx].shape_color;
  g_info.group_color = g_info.color_choice[color_idx].group_color;
  g_info.bg_color = g_info.color_choice[color_idx].bg_color;

  g_info.features["Color Scheme"] = g_info.color_choice[color_idx].name;


  // groups
  //


  let ngroup = 1;
  for (let n=0; n<ngroup; n++) {
    let _scale = 1.0;
    //let _scale = 1.0 - (0.75*fxrand());
    //_scale = (0.25)*fxrand() + 0.15;
    let _shape_idx = Math.floor(g_info.shape_choice.length*fxrand());
    let _shape = _copy_pgns( g_info.shape_choice[ _shape_idx ] );
    let _opt = { "size" : _scale };
    let _ret = crack_shape( _shape, _opt );

    g_info.features["Background Crack Type"] = _ret.crack_type;
    g_info.features["Background Shape Type"] = shape_name[_shape_idx];

    //let x = 0, y = 0;
    let x = (0.8*fxrand()) + 0.1;
    let y = (0.8*fxrand()) + 0.1;

    if (n==0) { x=0.5; y=0.5; }

    /*
    if (n==0) { x=g_info.width/2; y=g_info.height/2; }
    else if (n==1) { x = g_info.width/4; y = g_info.height/4; }
    else if (n==2) { x = 3*g_info.width/4; y = g_info.height/4; }
    else if (n==3) { x = 3*g_info.width/4; y = 3*g_info.height/4; }
    else if (n==4) { x = g_info.width/4; y = 3*g_info.height/4; }
    */

    let _shape_scale = 1.0 - (0.75*fxrand());

    g_info.group.push({
      "x": x,
      "y": y,
      "s": _shape_scale,
      "shape": _ret.shape,
      "hist": _ret.hist,
      "sched": _ret.sched
    });

    // reset information
    //
    //g_info.reset_info.shape = _copy_pgns( _ret.shape );
    for (let i=0; i<g_info.group.length; i++) {
      g_info.reset_info.group.push( { "shape": _copy_pgns( g_info.group[i].shape ) } );
    }

  }

}

function crack_shape(init_shape, opt) {
  //let init_shape = _copy_pgns( g_info.initial_shape );

  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ? 1 : opt.size);
  let crack_type = ((typeof opt.crack_type === "undefined") ? 0 : opt.crack_type);

  let s = {};

  console.log("_size:", _size);

  let cur_shape = init_shape;

  let crack_sched = [];
  let crack_hist = [];

  let ncrack = 20;

  crack_hist.push( _copy_pgns(cur_shape) );

  for (let i=0; i<ncrack; i++) {

    let shape_opt = {
      //"size": g_info.shape_size_factor*g_info.size
      "size": _size
    };


    let rnda = fxrand()*Math.PI*2;
    shape_opt["x0"] = Math.cos(rnda)*100;
    shape_opt["y0"] = Math.sin(rnda)*100;

    shape_opt["x1"] = Math.cos(rnda + Math.PI)*100;
    shape_opt["y1"] = Math.sin(rnda + Math.PI)*100;

    shape_opt["a"] = rnda;
    shape_opt["r"] = (1/8)*(fxrand() + 0.5);

    shape_opt["s"] = fxrand()/8 + 1.0;


    if (i==0) {
      crack_sched.push( { "type": "line", "opt": shape_opt } );

      s = crack_faultline(cur_shape, shape_opt);
    }
    else {
      let choice = fxrand();

      let ichoice = Math.floor(fxrand()*3);

      if (ichoice==0) {
        crack_sched.push( { "type": "line", "opt": shape_opt } );
        s = crack_faultline(cur_shape, shape_opt);
      }
      else if (ichoice==1) {
        crack_sched.push( { "type": "circle", "opt": shape_opt } );
        s = crack_circle(cur_shape, shape_opt);
      }
      else if (ichoice==2) {
        crack_sched.push( { "type": "scale", "opt": shape_opt } );
        s = crack_scale(cur_shape, shape_opt);
      }

      /*
      if (choice < 0.75) {
        crack_sched.push( { "type": "line", "opt": shape_opt } );
        s = crack_faultline(cur_shape, shape_opt);
      }
      else {
        crack_sched.push( { "type": "circle", "opt": shape_opt } );
        s = crack_circle(cur_shape, shape_opt);
      }
      */

    }


    cur_shape = s;
    crack_hist.push( _copy_pgns(cur_shape) );
  }

  /*
  //if (g_info.crack_type == 0) {
  if (crack_type == 0) {
    s = crack_shape0(init_shape, shape_opt);
  }
  //else if (g_info.crack_type == 1) {
  else if (crack_type == 1) {
    s = crack_shape1(init_shape, shape_opt);
  }
  //else if (g_info.crack_type == 2) {
  else if (crack_type == 2) {
    s = crack_shape2(init_shape, shape_opt);
  }
  */

  //g_info.shape = s;

  let state_choice = ["on", "off"];

  let cur_t = Date.now();

  return { "shape":s, "sched": crack_sched , "hist": crack_hist };

}

function crack_scale(init_shape, opt) {
  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);
  let _scale = ((typeof opt.s === "undefined") ? 2 : opt.s);


  let cur_shape = _copy_pgns( init_shape );
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size * _scale;
      cur_shape[i][j].Y *= _size * _scale;
    }
  }

  return cur_shape;
}

function crack_circle(init_shape, opt) {
  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);

  let nseg = ((typeof opt.nseg === "undefined") ? 64 : opt.nseg);

  let r0 = ((typeof opt.r === "undefined") ? (1/8) : opt.r);
  let ds = ((typeof opt.ds === "undefined") ? 0.01 : opt.ds);
  let r1 = r0 + ds;

  /*
  r0 *= _size;
  ds *= _size;
  r1 *= _size;
  */


  let cur_shape = _copy_pgns( init_shape );
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }

  //console.log("crack_circle:", cur_shape);

  let circle_pgn = [[],[]];

  for (let i=0; i<nseg; i++) {
    let a = -(i/nseg)*Math.PI*2;
    let x = Math.cos(a)*r0;
    let y = Math.sin(a)*r0;

    circle_pgn[0].push({ "X": x, "Y": y });
  }

  for (let i=0; i<nseg; i++) {
    let a = (i/nseg)*Math.PI*2;
    let x = Math.cos(a)*r1;
    let y = Math.sin(a)*r1;

    circle_pgn[1].push({ "X": x, "Y": y });
  }

  let rop = [];
  _clip_difference(rop, cur_shape, circle_pgn);


  let group_idx = [[], []];
  for (let i=0; i<rop.length; i++) {
    if (rop[i].length==0) { continue; }
    let x = rop[i][0].X;
    let y = rop[i][0].Y;

    let max_len = 0;
    for (let j=0; j<rop[i].length; j++) {
      let x = rop[i][j].X;
      let y = rop[i][j].Y;
      let _len = Math.sqrt(x*x + y*y);
      if (_len > max_len) { max_len = _len; }
    }

    //if (Math.sqrt(x*x + y*y) < r1) {
    if (max_len < r1) {

      //console.log("!!", x, y, "->", Math.sqrt(x*x + y*y), "<?", r1, "(r0:", r0, "ds:", ds, "idx:", i, ")");

      group_idx[0].push(i);
    }
    else {
      group_idx[1].push(i);
    }
  }

  let da = fxrand()*Math.PI*2;
  for (let gidx=0; gidx<2; gidx++) {
    let sgn = ((gidx==0) ? -1 : 1);

    if (gidx==1) { continue; }

    let _cosa = Math.cos(sgn*da);
    let _sina = Math.sin(sgn*da);

    for (let i=0; i<group_idx[gidx].length; i++) {
      let idx = group_idx[gidx][i];

      for (let j=0; j<rop[idx].length; j++) {
        let x = rop[idx][j].X;
        let y = rop[idx][j].Y;

        rop[idx][j].X =  x*_cosa + y*_sina;
        rop[idx][j].Y = -x*_sina + y*_cosa;
      }
    }
    
  }


  return rop;
}


function crack_faultline(init_shape, opt) {
  opt = ((typeof opt === "undefined") ? {} : opt);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);

  let cut_line = [];
  let cur_shape = init_shape;
  for (let i=0; i<cur_shape.length; i++) {
    for (let j=0; j<cur_shape[i].length; j++) {
      cur_shape[i][j].X *= _size;
      cur_shape[i][j].Y *= _size;
    }
  }

  let _x0 =0, _y0 = -100,
      _x1 = 0, _y1 = 100,
      ds = 0.005;

  //_x0 = 10; _y0 = -10;
  //_x1 = -10; _y1 = 10;

  if (typeof opt.x0 !== "undefined") { _x0 = opt.x0; }
  if (typeof opt.y0 !== "undefined") { _y0 = opt.y0; }

  if (typeof opt.x1 !== "undefined") { _x1 = opt.x1; }
  if (typeof opt.y1 !== "undefined") { _y1 = opt.y1; }

  if (typeof opt.ds !== "undefined") { _ds = opt.ds; }

  let a = Math.atan2(_y1-_y0, _x1-_x0);

  let a0 = a + Math.PI/2;
  let a1 = a - Math.PI/2;
  let _cosa0 = Math.cos(a0);
  let _sina0 = Math.sin(a0);

  let _cosa1 = Math.cos(a1);
  let _sina1 = Math.sin(a1);

  let dx0 = _cosa0*ds/2;
  let dy0 = _sina0*ds/2;

  let dx1 = _cosa1*ds/2;
  let dy1 = _sina1*ds/2;

  cut_line.push( [
    { "X": _x0+dx0, "Y": _y0+dy0 },
    { "X": _x0+dx1, "Y": _y0+dy1 },
    { "X": _x1+dx1, "Y": _y1+dy1 },
    { "X": _x1+dx0, "Y": _y1+dx0 }
  ]);

  let rop = [];
  _clip_difference(rop, cur_shape, cut_line);

  let group_idx = [ [], [] ];

  for (let i=0; i<rop.length; i++) {
    if (rop[i].length==0) { continue; }
    let px = rop[i][0].X;
    let py = rop[i][0].Y;

    let z = Math.atan2( py-_y0, px-_x0 ) - a;

    if (z < 0) {
      group_idx[0].push(i);
    }
    else {
      group_idx[1].push(i);
    }

  }

  let scale_fac = 0.125;

  let dx = Math.cos(a) * scale_fac;
  let dy = Math.sin(a) * scale_fac;

  for (let i=0; i<group_idx[0].length; i++) {
    let idx = group_idx[0][i];
    for (let j=0; j<rop[idx].length; j++) {
      rop[idx][j].X += dx;
      rop[idx][j].Y += dy;
    }
  }

  dx = Math.cos(a + Math.PI) * scale_fac;
  dy = Math.sin(a + Math.PI) * scale_fac;

  for (let i=0; i<group_idx[1].length; i++) {
    let idx = group_idx[1][i];
    for (let j=0; j<rop[idx].length; j++) {
      rop[idx][j].X += dx;
      rop[idx][j].Y += dy;
    }
  }

  //console.log("---");


  return rop;
}

function crack_shape2(init_shape, opt) {
  //let _w = 500;
  //let _w = g_info.shape_size_factor*g_info.size;

  opt = ((typeof opt === "undefined") ? {} : opt);
  let ncut = ((typeof opt.cut_count === "undefined") ? 32 : opt.cut_count);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);


  let _min_r = (10/500)*_size;

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

  let _jiggle_r = fxrand()*(5/500)*_size;

  //let ncut = 32;
  for (let i=0; i<ncut; i++) {

    let cut_line = [];

    let choice = Math.floor(fxrand()*2);

    if (choice == 0) {
      let _x0=0, _x1=0, _y0=0, _y1=0;

      let slice_choice = Math.floor(fxrand()*4);

      //let ds = 5;
      let ds = (5/500)*_size;

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
        //ds = 3;
        ds = (3/500)*_size;
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
        //ds = 3;
        ds = (3/500)*_size;
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
      //let ds = 2;
      let ds = (2/500)*_size;

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
  let ncut = ((typeof opt.cut_count === "undefined") ? 64: opt.cut_count);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);

  let _min_r = (10/500)*_size;

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

  let _jiggle_r = fxrand()*(5/500)*_size;

  //let ncut = 32;
  for (let i=0; i<ncut; i++) {
    let a = fxrand()*Math.PI*2;
    let _cos = Math.cos(a);
    let _sin = Math.sin(a);

    let _r = 2*_size;
    let ds = (2/500)*_size;

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
  //let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor*g_info.size) : opt.size);
  let _size = ((typeof opt.size === "undefined") ?  (g_info.shape_size_factor) : opt.size);

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

    //let ds = 5;
    let ds = (5/500)*_size;

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
      ds = (3/500)*_size;
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
      //ds = 3;
      ds = (3/500)*_size;
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
  init_fin();
}

function init_global_param() {
  init_shapes();

  window.$fxhashFeatures = g_info.features;
}

(()=>{


  g_info.last_t = Date.now();

  initCanvas();

  init_global_param();

  welcome();

  // have some persistent global random numbers for later use
  //
  for (let i=0; i<10; i++) { g_info.rnd.push( fxrand() ); }


  init();

  document.addEventListener('keydown', function(ev) {
    if (ev.key == 'a') {
      if (g_info.animation_capture) { console.log("already capturing!"); return; }

      reset_animation();

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
    else if (ev.key == 'r') {
      reset_animation();
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
