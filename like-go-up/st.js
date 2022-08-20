
function wfc_z(data) {
}

function wfc_print(data) {
  for (let i=0; i<data.length; i++) {
    console.log("");
    for (let j=0; j<data[i].length; j++) {
      let s = '';
      for (let k=0; k<data[i][j].length; k++) {
        s += " ";
        s += data[i][j][k].join("");
      }
      console.log(s);
    }
  }
  console.log("");
}

g_tile_list = ["u", "d", "l", "r", "f", "b", "\\", "/", "v", "^", "D", "4", "." ];

// ^ y
// |   7 z
// |  /
// | /
// . ----> x
//
function wfc_create() {
  let info = {
    "d" : [ 2, 3, 3 ],
    "n_tile": 13,
    "tile_list" : ["u", "d", "l", "r", "f", "b", "\\", "/", "v", "^", "D", "4", "." ],
    "m": {
      "u": "up",
      "d": "down",
      "l": "left",
      "r": "right",
      "f": "front",
      "b": "back",

      "\\": "upper left, lower right",
      "/": "upper right, lower left",
      "v": "upper front, lower back",
      "^": "upper back, lower front",
      "D": "left front, right back",
      "4": "right front, left back",
      ".": "blank"
    },

    "conn" : {

      "u|" : [ { "dv": [ 0, 0, 1], "A":[ "u|", "ur", "u7", "v"  ] }, { "dv": [ 0, 0,-1], "A":[ "u|", "uJ", "uL", "^"  ] } ],
      "u-" : [ { "dv": [ 1, 0, 0], "A":[ "u-", "u7", "uJ", "\\" ] }, { "dv": [-1, 0, 0], "A":[ "u-", "ur", "uL", "/"  ] } ],

      "ur" : [ { "dv": [ 1, 0, 0], "A":[ "u-", "u7", "uJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "u|", "uJ", "uL", "^"  ] } ],
      "uL" : [ { "dv": [ 1, 0, 0], "A":[ "u-", "u7", "uJ", "\\" ] }, { "dv": [ 0, 0, 1], "A":[ "u|", "ur", "u7", "v"  ] } ],

      "uJ" : [ { "dv": [-1, 0, 0], "A":[ "u-", "ur", "uL", "/"  ] }, { "dv": [ 0, 0, 1], "A":[ "u|", "ur", "u7", "v"  ] } ],
      "u7" : [ { "dv": [-1, 0, 0], "A":[ "u-", "ur", "uL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "u|", "uJ", "uL", "^"  ] } ],

      //--

      "d|" : [ { "dv": [ 0, 0, 1], "A":[ "d|", "dr", "d7", "^"  ] }, { "dv": [ 0, 0,-1], "A":[ "d|", "dJ", "dL", "v"  ] } ],
      "d-" : [ { "dv": [ 1, 0, 0], "A":[ "d-", "d7", "dJ", "\\" ] }, { "dv": [-1, 0, 0], "A":[ "d-", "dr", "dL", "/"  ] } ],

      "dr" : [ { "dv": [ 1, 0, 0], "A":[ "d-", "d7", "dJ", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "d|", "dJ", "dL", "v"  ] } ],
      "d7" : [ { "dv": [-1, 0, 0], "A":[ "d-", "dr", "dL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "d|", "dJ", "dL", "v"  ] } ],

      "dL" : [ { "dv": [ 1, 0, 0], "A":[ "d-", "d7", "dJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "d|", "dr", "d7", "v"  ] } ],
      "dJ" : [ { "dv": [-1, 0, 0], "A":[ "d-", "dr", "dL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "d|", "dr", "d7", "v"  ] } ],

      //--

      "l-" : [ { "dv": [ 0, 0, 1], "A":[ "l-", "l7", "lJ", "4"  ] }, { "dv": [ 0, 0,-1], "A":[ "l-", "lr", "lL", "D"  ] } ],
      "l|" : [ { "dv": [ 0, 1, 0], "A":[ "l|", "lr", "l7", "^"  ] }, { "dv": [ 0,-1, 0], "A":[ "l|", "lJ", "lL", "v"  ] } ],

      "lr" : [ { "dv": [ 1, 0, 0], "A":[ "l-", "l7", "lJ", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "l|", "lJ", "lL", "v"  ] } ],
      "l7" : [ { "dv": [-1, 0, 0], "A":[ "l-", "lr", "lL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "l|", "lJ", "lL", "v"  ] } ],

      "lL" : [ { "dv": [ 1, 0, 0], "A":[ "l-", "l7", "lJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "l|", "lr", "l7", "v"  ] } ],
      "lJ" : [ { "dv": [-1, 0, 0], "A":[ "l-", "lr", "lL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "l|", "lr", "l7", "v"  ] } ],

      //--

      "r|" : [ { "dv": [ 0, 0, 1], "A":[ "r|", "rr", "r7", "^"  ] }, { "dv": [ 0, 0,-1], "A":[ "r|", "rJ", "rL", "v"  ] } ],
      "r-" : [ { "dv": [ 1, 0, 0], "A":[ "r-", "r7", "rJ", "\\" ] }, { "dv": [-1, 0, 0], "A":[ "r-", "rr", "rL", "/"  ] } ],

      "rr" : [ { "dv": [ 1, 0, 0], "A":[ "r-", "r7", "rJ", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "r|", "rJ", "rL", "v"  ] } ],
      "r7" : [ { "dv": [-1, 0, 0], "A":[ "r-", "rr", "rL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "r|", "rJ", "rL", "v"  ] } ],

      "rL" : [ { "dv": [ 1, 0, 0], "A":[ "r-", "r7", "rJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "r|", "rr", "r7", "v"  ] } ],
      "rJ" : [ { "dv": [-1, 0, 0], "A":[ "r-", "rr", "rL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "r|", "rr", "r7", "v"  ] } ],

      //--

      "f|" : [ { "dv": [ 0, 0, 1], "A":[ "f|", "fr", "f7", "^"  ] }, { "dv": [ 0, 0,-1], "A":[ "f|", "fJ", "fL", "v"  ] } ],
      "f-" : [ { "dv": [ 1, 0, 0], "A":[ "f-", "f7", "fJ", "\\" ] }, { "dv": [-1, 0, 0], "A":[ "f-", "fr", "fL", "/"  ] } ],

      "fr" : [ { "dv": [ 1, 0, 0], "A":[ "f-", "f7", "fJ", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "f|", "fJ", "fL", "v"  ] } ],
      "f7" : [ { "dv": [-1, 0, 0], "A":[ "f-", "fr", "fL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "f|", "fJ", "fL", "v"  ] } ],

      "fL" : [ { "dv": [ 1, 0, 0], "A":[ "f-", "f7", "fJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "f|", "fr", "f7", "v"  ] } ],
      "fJ" : [ { "dv": [-1, 0, 0], "A":[ "f-", "fr", "fL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "f|", "fr", "f7", "v"  ] } ],

      //--

      "b|" : [ { "dv": [ 0, 0, 1], "A":[ "b|", "br", "b7", "^"  ] }, { "dv": [ 0, 0,-1], "A":[ "b|", "bJ", "bL", "v"  ] } ],
      "b-" : [ { "dv": [ 1, 0, 0], "A":[ "b-", "b7", "bJ", "\\" ] }, { "dv": [-1, 0, 0], "A":[ "b-", "br", "bL", "/"  ] } ],

      "br" : [ { "dv": [ 1, 0, 0], "A":[ "b-", "b7", "bJ", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "b|", "bJ", "bL", "v"  ] } ],
      "b7" : [ { "dv": [-1, 0, 0], "A":[ "b-", "br", "bL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "b|", "bJ", "bL", "v"  ] } ],

      "bL" : [ { "dv": [ 1, 0, 0], "A":[ "b-", "b7", "bJ", "\\" ] }, { "dv": [ 0, 0,-1], "A":[ "b|", "br", "b7", "v"  ] } ],
      "bJ" : [ { "dv": [-1, 0, 0], "A":[ "b-", "br", "bL", "/"  ] }, { "dv": [ 0, 0,-1], "A":[ "b|", "br", "b7", "v"  ] } ],

    }

    "pattern": {
      [
        [ [[], [], [] ],
          [[], [], [] ],
          [[], [], [] ] ],

        [ [[], [], [] ],
          [[], ['u'], [] ],
          [[], [], [] ] ],

        [ [[], [], [] ],
          [[], [], [] ],
          [[], [], [] ] ]
      ],

      [ [], [], [] ]
    },

    "must_have": {
      "u": [
        { "dv":[ 1, 0, 0] "l":["u", "\\"] },
        { "dv":[-1, 0, 0] "l":["u", "/"] },
        { "dv":[ 0, 1, 0] "l":[".", "u"] },
        { "dv":[ 1, 1, 0] "l":[".", "u"] },
        //{ "dv":[ 0,-1, 0] "l":g_tile_list },

        { "dv":[ 1, 1, 0] "l":["d", "/"] },
      ]
    },
    "data" : []
  };

  return info;
}

function wfc_init(info) {
  for (let i=0; i<info.d[0]; i++) {
    info.data.push([]);
    for (let j=0; j<info.d[1]; j++) {
      info.data[i].push([]);
      for (let k=0; k<info.d[2]; k++) {
        info.data[i][j].push([]);
        info.data[i][j][k] = ["u", "d", "l", "r", "f", "b", "\\", "/", "v", "^", "D", "4" ];
      }
    }
  }
}

function _irnd(z) {
  z = ((typeof z === "undefined") ? 2 : z);

  return Math.floor( Math.random() * z );
}

function wfc_iter(info) {
  let x = _irnd( info.d[2] );
  let y = _irnd( info.d[1] );
  let z = _irnd( info.d[0] );

  let min_choice = info.n_tile;

  let min_x = -1, min_y = -1, min_z = -1;

  for (let z_i=0; z_i<info.d[0]; z_i++) {
    for (let y_i=0; y_i<info.d[1]; y_i++) {
      for (let x_i=0; x_i<info.d[2]; x_i++) {
        let _n = info.data[z_i][y_i][x_i].length;

        if (min_choice > _n) {
          min_choice = _n;
          min_x = x_i;
          min_y = y_i;
          min_z = z_i;
        }

      }
    }
  }

  let candidate = [];

  for (let z_i=0; z_i<info.d[0]; z_i++) {
    for (let y_i=0; y_i<info.d[1]; y_i++) {
      for (let x_i=0; x_i<info.d[2]; x_i++) {
        if (info.data[z_i][y_i][x_i].length == min_choice) {
          candidate.push( [z_i, y_i, x_i] );
        }
      }
    }
  }

  let candidate_idx = _irnd( candidate.length );

  let cand_pick = candidate[ candidate_idx ];

  console.log(cand_pick);

  let _z = cand_pick[0];
  let _y = cand_pick[1];
  let _x = cand_pick[2];

  let _choice_idx = _irnd( info.data[_z][_y][_x].length );

  let _choice = info.data[_z][_y][_x][_choice_idx];

  info.data[_z][_y][_x] = [ _choice ];

  console.log("cand_pick:", cand_pick);

  let updated_pos = [ [ _z, _y, _x ] ];
  while (updated_pos.length > 0) {

    for (let ii=0; ii<updated_pos.length; ii++) {
      for (let dz=-1; dz<2; dz++) {
        for (let dy=-1; dy<2; dy++) {
          for (let dx=-1; dx<2; dx++) {
            let _z = updated_pos[ii][0] + dz;
            let _y = updated_pos[ii][1] + dy;
            let _x = updated_pos[ii][2] + dx;

            if ((_z < 0) || (_z >= info.d[0]) ||
                (_y < 0) || (_y >= info.d[1]) ||
                (_x < 0) || (_x >= info.d[2])) {
              continue;
            }
            if ((dz==0) && (dy==0) && (dx==0)) {
              continue;
            }




          }
        }
      }
    }

  }



}

let info = wfc_create();
wfc_init(info);
wfc_print(info.data);

wfc_iter(info);

wfc_print(info.data);







