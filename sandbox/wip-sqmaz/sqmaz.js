
function _rnd() {
  return Math.random();
}

/*

  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*

  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *-*-*-*-*-*
  |\|\|\|\|\|
  *1*-*-*-*-*


*/

// type : "stair", "path"
// dir  : 0 (lr), 1 (du), 2 (dr,dl), 3 (rl), 4 (ud), 5 (dl,dr)
// len  : 1 (half), 2 (full)
//

let _template = {
  "r": -1, "col": -1, "h": -1, "z": { "type": "-", "dir": -1, "len":-1 }
};

//             
//  -*   *- -*-
//             

//         
//  /-/ \-\
//         

//   |       | 
//   *   *   * 
//       |   | 

//   ^   v 
//   *   * 
//   ^   v 

//  \       \  
//   *   *   * 
//        \   \

//  +       +  
//   *   *   * 
//        +   +

// 12.
// 0.3
// .54

function staimaz_print(sm) {

  let g = [];

  for (let r=0; r<sm.length; r++) {

    g.push([]);
    for (let c=0; c<sm[r].length; c++) {

      let tplate = [
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ]
      ];

      let data = sm[r][c].z;
      for (let z=0; z<data.length; z++) {

        tplate[1][1] = '*';

        if (data[z].type == "path") {
          if      (data[z].dir == 0) { tplate[1][0] = '-'; }
          else if (data[z].dir == 1) { tplate[0][0] = '\\'; }
          else if (data[z].dir == 2) { tplate[0][1] = '|'; }
          else if (data[z].dir == 3) { tplate[1][2] = '-'; }
          else if (data[z].dir == 4) { tplate[2][2] = '\\'; }
          else if (data[z].dir == 5) { tplate[2][1] = '|'; }
        }

        else if (data[z].type == "stair0") {
          if      (data[z].dir == 0) { tplate[1][0] = '}'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = '^'; }
          else if (data[z].dir == 3) { tplate[1][2] = '}'; }
          else if (data[z].dir == 4) { tplate[2][2] = 'z'; }
          else if (data[z].dir == 5) { tplate[2][1] = '^'; }
        }

        else if (data[z].type == "stair1") {
          if      (data[z].dir == 0) { tplate[1][0] = '{'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = 'v'; }
          else if (data[z].dir == 3) { tplate[1][2] = '{'; }
          else if (data[z].dir == 4) { tplate[2][2] = 'z'; }
          else if (data[z].dir == 5) { tplate[2][1] = 'v'; }
        }

      }

      g[r].push(tplate);

    }
  }

  for (let r=0; r<g.length; r++) {
    let s = '';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][0][z]; }
      //s += '.';
    }
    console.log(s);
    s='';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][1][z]; }
      //s += '.';
    }
    console.log(s);
    s='';
    for (let c=0; c<g[r].length; c++) {
      for (let z=0; z<3; z++) { s += g[r][c][2][z]; }
      //s += '.';
    }
    console.log(s);
  }
}


function staimaz_init(n_row,n_col) {
  let _nod_pnt = [];
  for (let row=0; row<n_row; row++) {
    _nod_pnt.push([]);
    for (let col=0; col<n_col; col++) {
      _nod_pnt[row].push({ "r": row, "c": col, "h":0, "z": [] });
    }
  }
  return _nod_pnt;
}

function staimaz_gen(_opt)  {
  let opt = {};
  if (typeof _opt !== "undefined") { opt = _opt; }

  let n_row = opt.n_row;
  let n_col = opt.n_col;

  let min_l = ((typeof opt.min_step === "undefined") ? 2 : opt.min_step);
  let max_l = ((typeof opt.max_step === "undefined") ? 5 : opt.max_step);
  let n_it = ((typeof opt.max_iter === "undefined") ? 1 : opt.max_iter);



  let _nod_pnt = staimaz_init(n_row, n_col);

  //n_it = 1;

  /*
  for (let it=0; it<n_it; it++) {
    let cur_r = 0, cur_c = 0;

    while ((cur_r >= 0) && (cur_c >= 0) &&
           (cur_r < n_row) && (cur_c < n_col)) {
      let d = Math.floor(_rnd()*6);
      let len = Math.floor(_rnd()*(max_l-min_l)) + min_l;

    }
  }
*/

  for (let col=0; col<n_col; col++) {
    if (col>0) {
      _nod_pnt[n_row-1][col].z.push( {"type": "path", "dir": 0 });
    }

    if (col<(n_col-1)) {
      _nod_pnt[n_row-1][col].z.push( {"type": "path", "dir": 3 });
    }
  }

  for (let row=(n_row-1); row>=0; row--) {

    if (row>0) {
      _nod_pnt[row][n_col-1].z.push( {"type": "path", "dir": 2 });
    }

    if (row<(n_row-1)) {
      _nod_pnt[row][n_col-1].z.push( {"type": "path", "dir": 5 });
    }
  }

  return _nod_pnt;
}

let x = staimaz_gen({"n_row": 16,"n_col":16});

/*
for (let i=0; i<6; i++) {
  x[0][i].z.push({ "type": 'path', "dir": i });
}

for (let i=0; i<6; i++) {
  x[1][i].z.push({ "type": 'stair0', "dir": i });
}

for (let i=0; i<6; i++) {
  x[2][i].z.push({ "type": 'stair1', "dir": i });
}
*/

staimaz_print(x);

