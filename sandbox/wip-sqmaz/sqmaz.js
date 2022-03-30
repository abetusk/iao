
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

  let hcharmap = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // 12.
  // 0.3
  // .54

  console.log("| 12.");
  console.log("| 0.3");
  console.log("| .54");

  for (let r=0; r<sm.length; r++) {

    g.push([]);
    for (let c=0; c<sm[r].length; c++) {

      let tplate = [
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ],
        [ ' ', ' ', ' ' ]
      ];

      let hmax=0;
      let data = sm[r][c].z;
      for (let z=0; z<data.length; z++) {
        if (data[z].h > hmax) { hmax = data[z].h; }
      }

      for (let z=0; z<data.length; z++) {

        let n = hcharmap.length;

        //tplate[1][1] = '*';
        tplate[1][1] = hcharmap.charAt( hmax%n );

        if (data[z].type == "path") {
          if      (data[z].dir == 0) { tplate[1][0] = '-'; }
          else if (data[z].dir == 1) { tplate[0][0] = '\\'; }
          else if (data[z].dir == 2) { tplate[0][1] = '|'; }
          else if (data[z].dir == 3) { tplate[1][2] = '-'; }
          else if (data[z].dir == 4) { tplate[2][2] = '\\'; }
          else if (data[z].dir == 5) { tplate[2][1] = '|'; }
        }

        else if (data[z].type == "stair0") {
          //if      (data[z].dir == 0) { tplate[1][0] = '}'; }
          if      (data[z].dir == 0) { tplate[1][0] = 'v'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = '^'; }
          //else if (data[z].dir == 3) { tplate[1][2] = '}'; }
          else if (data[z].dir == 3) { tplate[1][2] = 'v'; }
          else if (data[z].dir == 4) { tplate[2][2] = 'z'; }
          else if (data[z].dir == 5) { tplate[2][1] = '^'; }
        }

        else if (data[z].type == "stair1") {
          //if      (data[z].dir == 0) { tplate[1][0] = '{'; }
          if      (data[z].dir == 0) { tplate[1][0] = '^'; }
          else if (data[z].dir == 1) { tplate[0][0] = 'z'; }
          else if (data[z].dir == 2) { tplate[0][1] = 'v'; }
          //else if (data[z].dir == 3) { tplate[1][2] = '{'; }
          else if (data[z].dir == 3) { tplate[1][2] = '^'; }
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

function staimaz_consistency(_grid) {

  let nr = _grid.length;
  let nc = _grid[0].length;

  for (let r=0; r<nr; r++) {
    for (let c=0; c<nc; c++) {

      let _m = {};

      for (let z=0; z<_grid[r][c].z.length; z++) {
        let _key = _grid[r][c].z[z].h + ":" + _grid[r][c].z[z].dir;
        if (_key in _m) { return { "msg": "duplicate entry", "code": -1, "data": {"r": r, "c":c, "zidx":z }}; }
        _m[_key] = true;
      }
    }
  }
  return {"msg":"", "code":0};
}

function staimaz_gen(_opt)  {
  let opt = {};
  if (typeof _opt !== "undefined") { opt = _opt; }

  let path_choice = [ "path", "stair0", "stair1" ];

  let n_row = opt.n_row;
  let n_col = opt.n_col;

  let min_l = ((typeof opt.min_step === "undefined") ? 2 : opt.min_step);
  let max_l = ((typeof opt.max_step === "undefined") ? 5 : opt.max_step);
  let n_it = ((typeof opt.max_iter === "undefined") ? 1 : opt.max_iter);


  let dir_lookup = [
    { "dr":  0, "dc": -1 },
    { "dr": -1, "dc": -1 },
    { "dr": -1, "dc":  0 },
    { "dr":  0, "dc":  1 },
    { "dr":  1, "dc":  1 },
    { "dr":  1, "dc":  0 },
  ];

  let opposite_dir_lookup = [ 3, 4, 5, 0, 1, 2 ];

  let _nod_pnt = staimaz_init(n_row, n_col);

  let _start_nod = [ {"r": n_row-1, "c": 0, "h": 0} ];

  let min_height = 0;

  for (let it=0; it<n_it; it++) {

    let _sn = _start_nod[ Math.floor(_rnd() * _start_nod.length) ];

    // starting point
    //
    //let cur_r = n_row-1, cur_c = 0;
    let cur_r = _sn.r, cur_c = _sn.c;

    let _prv_dir = -1;
    let _cur_height = _sn.h;

    //console.log("--");
    //console.log("[", it, "] r:", cur_r, "c:", cur_c);

    // trace out path
    //
    while ((cur_r >= 0) && (cur_c >= 0) &&
           (cur_r < n_row) && (cur_c < n_col)) {

      // check to see we still have a direction to
      // get out of
      //
      let dir_count=0;
      let za = _nod_pnt[cur_r][cur_c].z;
      for (let ii=0; ii<za.length; ii++) {
        if (za[ii].h != _cur_height) { continue; }
        dir_count++;
      }

      //console.log(":dir_count:", dir_count);

      if (dir_count==6) { break; }

      let _dir = Math.floor(_rnd()*6);

      // don't backtrack (simple rejection method)
      //
      if (opposite_dir_lookup[_dir] == _prv_dir) { continue; }
      _prv_dir = _dir;

      let _len = Math.floor(_rnd()*(max_l-min_l)) + min_l;

      let _dir_del = dir_lookup[_dir];

      //console.log("[", it, "] jump: d:", _dir, "len:", _len, "dir:", _dir_del);

      let _path_type = path_choice[ Math.floor( _rnd()*path_choice.length) ];

      //DEBUG
      _path_type = "path";

      let step = 0;
      for (step=0; step<_len; step++) {

        if ((cur_r < 0) || (cur_r >= n_row) ||
            (cur_c < 0) || (cur_c >= n_col)) { break; }

        let zidx=0;
        for (zidx=0; zidx<_nod_pnt[cur_r][cur_c].z.length; zidx++) {
          if ((_nod_pnt[cur_r][cur_c].z[zidx].h == _cur_height) &&
              (_nod_pnt[cur_r][cur_c].z[zidx].dir == _dir)) {
            //console.log("collision? cur:", cur_r, cur_c, "h:", _cur_height, "d:", _dir, "zidx:", zidx, _nod_pnt[cur_r][cur_c].z[zidx]);
            break;
          }
        }
        if (zidx < _nod_pnt[cur_r][cur_c].z.length) { break; }

        let _dh=0;
        if      (_path_type == "stair0") { _dh =  1; }
        else if (_path_type == "stair1") { _dh = -1; }

        let _pt = "path";
        if (step>0) {
          _pt = _path_type;
        }

        //console.log("[", it, "] step: d:", _dir, "r:", cur_r, "c:", cur_c);
        //_nod_pnt[cur_r][cur_c].z.push( {"type": "path", "h": _cur_height, "dir": _dir });
        _nod_pnt[cur_r][cur_c].z.push( {"type": _pt, "h": _cur_height, "dir": _dir });

        if (_cur_height < min_height) { min_height = _cur_height; }

        cur_r += _dir_del.dr;
        cur_c += _dir_del.dc;

        _cur_height += _dh;


        //if ((cur_r < 0) || (cur_r >= n_row) ||
        //    (cur_c < 0) || (cur_c >= n_col)) { break; }
        //_nod_pnt[cur_r][cur_c].z.push( {"type": "path", "h": _cur_height, "dir": opposite_dir_lookup[_dir] });

      }

      if (step == _len) {
        _start_nod.push( {"r": cur_r, "c": cur_c, "h": _cur_height });
      }



    }
  }

  for (let r=0; r<_nod_pnt.length; r++) {
    for (let c=0; c<_nod_pnt[r].length; c++) {
      for (let z=0; z<_nod_pnt[r][c].z.length; z++) {
        _nod_pnt[r][c].z[z].h -= min_height;
      }
    }
  }

  // test simple path
  //
  /*
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
  */

  //let _e = staimaz_consistency(_nod_pnt);
  //console.log(_e);

  return _nod_pnt;
}

let x = staimaz_gen({"n_row": 16,"n_col":16, "max_iter": 10});

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

