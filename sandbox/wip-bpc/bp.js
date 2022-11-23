//
// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
//    
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

"use strict";

// failing on : ooC6uQvNTjxJ5zBVNGZWJ1z8G3XyXXj6zDPVqsA1DGALBnQGw8A
//

function _profiler() {
  this.data = { "GLOBAL": { "start":-1, "end": -1 } };
  this.start();
  return this;
}

_profiler.prototype.start = function(name) {
  name = ((typeof name === "undefined") ? "GLOBAL" : name);
  if (!(name in this.data)) {
    this.data[name] = { "start": -1, "end": -1 };
  }
  this.data[name].start = new Date().getTime();
}

_profiler.prototype.end = function(name) {
  name = ((typeof name === "undefined") ? "GLOBAL" : name);
  this.data[name].end = new Date().getTime();
  return this.dt(name);
}

_profiler.prototype.dt = function(name) {
  name = ((typeof name === "undefined") ? "GLOBAL" : name);
  return this.data[name].end - this.data[name].start;
}

// buf          - array and backbuffer of message values
// cell_tile_n  - number of tiles at cell position
// cell_tile    - list of itles at cell position
// tile_id      - integer code to name of tile mapping
// pdf          - probability distribution function of tiless
// dxyz         - mapping of integer code to delta change
// dxyz_inv     - inverse mapping of dxyz
// dxyz_inv_idx - inverse index of dxyz
// Fs           - adjacency function for tiles for each direction
//
// eps          - local epsilon for floating point fomparison
// FM[XYZ]      - size of dimension [xyz]
// tilesize     - number of tile options
// step_n       - number of buffers (2)
// step_idx     - which time step of step_n are we in
// D            - spatial dimension (3)
// n            - total size of `buf`
// STRIDE[0-5]  - stride variables for accessing `buf`
//
//
function BeliefPropagationCollapse(data, x, width, height, depth, opt) {
  width = ((typeof width === "undefined") ? 8 : width);
  height = ((typeof height === "undefined") ? 8 : height);
  depth = ((typeof depth === "undefined") ? 8 : depth);
  opt = ((typeof opt === "undefined") ? {} : opt);

  this.data = data;

  this.tile_name = data.tile_name;
  this.tile_id = {};
  for (let ii=0; ii<this.tile_name.length; ii++) {
    this.tile_id[ii] = this.tile_name[ii];
  }

  this.eps = (1/(1024*1024));
  this.zero_eps = (1/(1024*1024*1024*1024));
  this.max_iter = 1000;

  this.FMX = width;
  this.FMY = height;
  this.FMZ = depth;

  this.FMXxFMYxFMZ = width*height*depth;
  this.tilesize = this.tile_name.length;
  this.step_n = 2;
  this.D = 3;

  this.step_idx = 0;

  this.n = this.step_n*this.FMX*this.FMY*this.FMZ*2*this.D*this.tilesize;

  this.STRIDE0 = this.step_n*this.FMZ*this.FMY*this.FMX*2*this.D*this.tilesize;
  this.STRIDE1 = this.FMZ*this.FMY*this.FMX*2*this.D*this.tilesize;
  this.STRIDE2 = this.FMY*this.FMX*2*this.D*this.tilesize;
  this.STRIDE3 = this.FMX*2*this.D*this.tilesize;
  this.STRIDE4 = 2*this.D*this.tilesize;
  this.STRIDE5 = this.tilesize;

  //this.pdf = data.pdf;
  this.pdf = new Array(this.tilesize);
  for (let ii=0; ii<this.pdf.length; ii++) { this.pdf[ii] = 1/this.pdf.length; }

  //DEBUG
  // fiddle with pdf
  this.pdf[0] *= 1.024;
  for (let ii=0; ii<this.pdf.length; ii++) {
    if (this.tile_name[ii].charAt(0) == '^') {
      this.pdf[ii] *= 1.025;
    }
  }
  let pdf_S = 0;
  for (let ii=0; ii<this.pdf.length; ii++) { pdf_S += this.pdf[ii]; }
  for (let ii=0; ii<this.pdf.length; ii++) { this.pdf[ii] /= pdf_S; }

  this.buf = new Array(this.n);

  this.dxyz = [
    [-1, 0, 0 ], [ 1, 0, 0],
    [ 0,-1, 0 ], [ 0, 1, 0],
    [ 0, 0,-1 ], [ 0, 0, 1]
  ];
  this.dxyz_inv_idx = [ 1, 0, 3, 2, 5, 4 ];
  this.dxyz_inv = [
    [ 1, 0, 0 ], [-1, 0, 0],
    [ 0, 1, 0 ], [ 0,-1, 0],
    [ 0, 0, 1 ], [ 0, 0,-1]
  ];

  //--

  this.CELL_STRIDE_N0 = this.FMZ*this.FMY*this.FMX;
  this.CELL_STRIDE_N1 = this.FMY*this.FMX;
  this.CELL_STRIDE_N2 = this.FMX;

  this.CELL_STRIDE0 = this.FMZ*this.FMY*this.FMX*this.tilesize;
  this.CELL_STRIDE1 = this.FMY*this.FMX*this.tilesize;
  this.CELL_STRIDE2 = this.FMX*this.tilesize;
  this.CELL_STRIDE3 = this.tilesize;

  this.cell_tile_n = new Array(this.FMZ*this.FMY*this.FMX);
  for (let ii=0; ii<this.cell_tile_n.length; ii++) {
    this.cell_tile_n[ii] = this.tilesize;
  }

  this.cell_tile = new Array(this.FMZ*this.FMY*this.FMX*this.tilesize);
  for (let z=0; z<this.FMZ; z++) {
    for (let y=0; y<this.FMY; y++) {
      for (let x=0; x<this.FMX; x++) {
        for (let b=0; b<this.tilesize; b++) {
          let idx = z*this.CELL_STRIDE1 +
                    y*this.CELL_STRIDE2 +
                    x*this.CELL_STRIDE3 +
                    b;
          this.cell_tile[idx] = b;
        }
      }
    }
  }

  //--

  this.visited = new Array(this.FMZ*this.FMY*this.FMX);
  this.VISITED_STRIDE0 = this.FMZ*this.FMY*this.FMX;
  this.VISITED_STRIDE1 = this.FMY*this.FMX;
  this.VISITED_STRIDE2 = this.FMX;
  for (let ii=0; ii<this.VISITED_STRIDE0; ii++) {
    this.visited[ii] = 0;
  }

  this.grid_note = new Array(this.step_n*this.FMZ*this.FMY*this.FMX);
  this.GRID_NOTE_STRIDE0 = this.step_n*this.FMZ*this.FMY*this.FMX;
  this.GRID_NOTE_STRIDE1 = this.FMZ*this.FMY*this.FMX;
  this.GRID_NOTE_STRIDE2 = this.FMY*this.FMX;
  this.GRID_NOTE_STRIDE2 = this.FMX;
  for (let ii=0; ii<this.GRID_NOTE_STRIDE0; ii++) {
    this.grid_note[ii] = 0;
  }

  this.grid_note_v_sz = this.step_n*this.FMZ*this.FMY*this.FMX*this.D;
  this.GRID_NOTE_V_STRIDE0 = this.step_n*this.FMZ*this.FMY*this.FMX*this.D;
  this.GRID_NOTE_V_STRIDE1 = this.FMZ*this.FMY*this.FMX*this.D;
  this.grid_note_v_n = [0,0];
  this.grid_note_v = new Array(this.grid_note_v_sz);
  for (let ii=0; ii<this.GRID_NOTE_V_STRIDE0; ii++) {
    this.grid_note_v[ii] = 0;
  }

  this.grid_note_idx = 0;


  //--

  this.F = new Array( this.tilesize*this.tilesize );
  this.F_STRIDE0 = this.tilesize*this.tilesize;
  this.F_STRIDE1 = this.tilesize;
  for (let a=0; a<this.tilesize; a++) {
    for (let b=0; b<this.tilesize; b++) {
      this.F[ a*this.tilesize + b ]=0;
    }
  }

  //--

  this.Fs = new Array( this.tilesize*this.tilesize*this.D*2 );
  this.FS_STRIDE0 = 2*this.D*this.tilesize*this.tilesize;
  this.FS_STRIDE1 = this.tilesize*this.tilesize;
  this.FS_STRIDE2 = this.tilesize;

  this.Cn = new Array( this.tilesize*this.tilesize*this.D*2 );

  this.tile_conn = new Array( this.tilesize*this.D*2 );
  this.TILE_CONN_STRIDE0 = this.tilesize*this.D*2;
  this.TILE_CONN_STRIDE1 = this.D*2;

  for (let sdir=0; sdir<this.dxyz.length; sdir++) {
    for (let a=0; a<this.tilesize; a++) {

      let has_conn = 0;

      for (let b=0; b<this.tilesize; b++) {
        let dv_key = this.dxyz[sdir].join(":");
        this.Fs[ sdir*this.FS_STRIDE1 + a*this.FS_STRIDE2 + b ] = data.F[dv_key][a][b];

        let src_name = this.tile_name[a];
        let dst_name = this.tile_name[b];
        let conn_val = 0;
        if ( src_name in this.data.admissible_nei ) {
          if ( dst_name in this.data.admissible_nei[src_name][dv_key] ) {
            conn_val = ( this.data.admissible_nei[src_name][dv_key][dst_name].conn ? 1 : 0 );

            if (conn_val>0) { has_conn=1; }
          }
        }

        this.Cn[ sdir*this.FS_STRIDE1 + a*this.FS_STRIDE2 + b ] = conn_val;
      }

      this.tile_conn[ a*this.TILE_CONN_STRIDE1 + sdir ] = has_conn;
    }


  }

  //---


  //---

  for (let ii=0; ii<this.n; ii++) { this.buf[ii] = Math.random(); }

  this.opt = {
    "periodic" : "z"
  };

  this.rnd = Math.random;
  if ("rnd" in opt) {
    this.rnd = opt.rnd;
  }


  this.h_v = new Array(this.tilesize);
  this.mu_v = new Array(this.tilesize);
  this.u_v = []; //new Array(this.tilesize);

  this.svd = {};
  this.SVs = [];
  this.Us = [];

  if (typeof numeric !== "undefined") {

    let testA = [];
    
    for (let sdir=0; sdir<this.dxyz.length; sdir++) {

      let dv_key = this.dxyz[sdir].join(":");

      let _F = data.F[dv_key];

      for (let ii=0; ii<_F.length; ii++) { testA.push(_F[ii]); }

      let svd = numeric.svd( _F );

      let _SVt = [];
      let _U = [];

      let Vt = numeric.transpose(svd.V);
      let S = [];
      let nz_count = 0;

      for (let ii=0; ii<svd.S.length; ii++) {
        S.push([]);
        for (let jj=0; jj<svd.S.length; jj++) {
          S[ii].push( (ii==jj) ? svd.S[ii] : 0 );
        }
        if (Math.abs(svd.S[ii]) > this.eps) { nz_count++; }
      }

      let SVt_all = numeric.dot(S, numeric.transpose(svd.V));

      for (let ii=0; ii<nz_count; ii++) { _SVt.push(SVt_all[ii]); }

      for (let ii=0; ii<svd.U.length; ii++) {
        _U.push([]);
        for (let jj=0; jj<nz_count; jj++) {
          _U[ii].push( svd.U[ii][jj] );
        }
      }


      //DEBUG
      //console.log("s:", sdir, "nz_count:", nz_count, "/", _F.length, _F[0].length);

      this.SVs.push(_SVt);
      this.Us.push(_U);

      let max_d = -1;
      let checkM = numeric.dot(this.Us[sdir], this.SVs[sdir]);
      for (let ii=0; ii<checkM.length; ii++) {
        for (let jj=0; jj<checkM[ii].length; jj++) {
          let d = Math.abs( checkM[ii][jj] - _F[ii][jj]);
          if (max_d < d) { max_d = d; }
        }
      }
      //DEBUG
      //console.log("GOT: s:", sdir, ", max_d:", max_d);

      this.u_v = new Array(nz_count);

      //DEBUG
      //console.log("this.SVs[", this.SVs[0].length, this.SVs[0][0].length, "], this.Us[", this.Us[0].length, this.Us[0][0].length, ")");
    }

    let test_nz_count=0;
    let test_svd = numeric.svd( testA );
    for (let ii=0; ii<test_svd.S.length; ii++) {
      if (Math.abs(test_svd.S[ii]) > this.eps) { test_nz_count++; }
    }
    //DEBUG
    //console.log("test_nz_count:", test_nz_count, "/", testA.length);

  }


  // some debugging statistics
  //
  this.debug_count_a = [];
  this.debug_count_step = 0;

  return this;
}

BeliefPropagationCollapse.prototype.uMv = function(u,M,v) {
  let a,b, n,m;

  n = M.length;
  m = v.length;

  //console.log("uMv: n:", n, "m:", m, "u:", u.length, "M:", M.length, M[0].length, "v:", v.length);

  for (a=0; a<n; a++) {
    u[a] = 0;
    for (b=0; b<m; b++) {
      u[a] += M[a][b]*v[b];
    }
  }


}

BeliefPropagationCollapse.prototype.debug_print_FC = function() {

  for (let sdir=0; sdir<this.dxyz.length; sdir++) {

    console.log("Fs;Cn:", this.dxyz[sdir].join(":"));
    console.log("x,", this.tile_name.join(","));

    for (let a=0; a<this.tilesize; a++) {
      let ss = this.tile_name[a];
      for (let b=0; b<this.tilesize; b++) {
        let idx = sdir*this.FS_STRIDE1 + a*this.FS_STRIDE2 + b;
        ss += "," + this.Fs[idx].toString() + ";" + this.Cn[idx].toString();
      }
      console.log(ss);
    }

  }

}



// u = Fs[s] . v
//
BeliefPropagationCollapse.prototype.Fs_dot_v = function(u,s,v) {
  let a,b,n;

  n = this.tilesize;
  for (a=0; a<n; a++) {
    u[a] = 0;
    for (b=0; b<n; b++) {
      u[a] += this.Fs[s*this.FS_STRIDE1 + a*this.FS_STRIDE2 + b] * v[b];
    }
  }

}

BeliefPropagationCollapse.prototype.idx = function(t,x,y,z,b,s) {
  return this.STRIDE1*t +
         this.STRIDE2*z +
         this.STRIDE3*y +
         this.STRIDE4*x +
         this.STRIDE5*s +
         b;
}

// considering msg^t_{i,j}(b)
//
// Return current value of incoming message to node j (x+dx,y+dy,z+dz)
// from node i (x,y,z) for tile value b at timestep t.
//
BeliefPropagationCollapse.prototype.msg_ij = function(t,x,y,z, dx,dy,dz, b) {
  let s = 0;
  if      (dx >  0.5) { s = 1; }
  else if (dy < -0.5) { s = 2; }
  else if (dy >  0.5) { s = 3; }
  else if (dz < -0.5) { s = 4; }
  else if (dz >  0.5) { s = 5; }

  let idx = this.idx(t,x,y,z,b,s);
  return this.buf[idx];
}

BeliefPropagationCollapse.prototype.f = function(a,b) {
  return this.F[ this.F_STRIDE1*a + b ];
}

BeliefPropagationCollapse.prototype.f_s = function(sdir,a,b) {
  return this.Fs[ this.FS_STRIDE1*sdir + this.FS_STRIDE2*a + b ];
}

//BeliefPropagationCollapse.prototype.pdf = function(b) { return this.pdf[b]; }

BeliefPropagationCollapse.prototype.msg = function(t,x,y,z, dx,dy,dz, b) {
  return this.msg_ij(t,x,y,z,dx,dy,dz,b);
}


BeliefPropagationCollapse.prototype.oob = function(x,y,z) {
  if ( (x<0) || (x>=this.FMX) ||
       (y<0) || (y>=this.FMY) ||
       (z<0) || (z>=this.FMZ)) { return true; }
  return false;
}

BeliefPropagationCollapse.prototype.pos_n = function(vxyz, x,y,z) {
  vxyz[0] = x;
  vxyz[1] = y;
  vxyz[2] = z;
}

BeliefPropagationCollapse.prototype.pos_z = function(vxyz, x,y,z) {
  vxyz[0] = x;
  vxyz[1] = y;
  vxyz[2] = z % this.FMZ;
}

BeliefPropagationCollapse.prototype.pos = function(vxyz, x,y,z) {
  return this.pos_n(vxyz,x,y,z);
}


BeliefPropagationCollapse.prototype.renormalize_x = function(t_cur) {
  t_cur = ((typeof t_cur === "undefined") ? this.step_idx : t_cur);

  let anch_z=0,
      anch_y=0,
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let S = 0,
      Sinv = 0,
      idx=0;

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          S=0;
          for (anch_b=0; anch_b<this.tilesize; anch_b++) {
            idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
            S += this.buf[idx];
          }

          Sinv = ((S<this.eps) ? 0 : (1/S));

          for (anch_b=0; anch_b<this.tilesize; anch_b++) {
            idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
            this.buf[idx] *= Sinv;
          }

        }
      }
    }
  }

}

BeliefPropagationCollapse.prototype.renormalize = function(t_cur) {
  t_cur = ((typeof t_cur === "undefined") ? this.step_idx : t_cur);

  let anch_z=0,
      anch_y=0,
      anch_x=0,
      anch_b=0, anch_b_idx=0,
      anch_s=0;
  let S = 0,
      Sinv = 0,
      idx=0;

  let ntile = 0;

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          ntile = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];

          S=0;
          for (anch_b_idx=0; anch_b_idx<ntile; anch_b_idx++) {
            anch_b = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
            idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
            S += this.buf[idx];
          }

          // If the sum of the probabilities are less then our threshold value,
          // assume all probabilities equally distributed
          //
          if (S<this.eps) {

            for (anch_b_idx=0; anch_b_idx<ntile; anch_b_idx++) {
              anch_b = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
              idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
              this.buf[idx] = 1/ntile;
            }

          }

          // Otherwise, we can renormalize as desired
          //
          else {

            Sinv = 1/S;
            for (anch_b_idx=0; anch_b_idx<ntile; anch_b_idx++) {
              anch_b = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
              idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
              this.buf[idx] *= Sinv;
            }

          }

        }
      }
    }
  }

}

BeliefPropagationCollapse.prototype.maxdiff_naive = function(t_cur, t_nxt) {
  t_cur = ((typeof t_cur === "undefined") ? this.step_idx : t_cur);
  t_nxt = ((typeof t_nxt === "undefined") ? (1-t_cur) : t_nxt);

  let anch_z=0,
      anch_y=0,
      anch_x=0,
      anch_b_val=0,
      anch_b_idx=0,
      anch_b=0,
      anch_s=0,
      anch_cell_tile_n=0,
      anch_idx=0;
  let maxdiff=-1,
      d = 0,
      cur_idx=0,
      nxt_idx=0;

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          for (anch_b=0; anch_b<this.tilesize; anch_b++) {
            cur_idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);
            nxt_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b, anch_s);
            d = Math.abs(this.buf[cur_idx] - this.buf[nxt_idx])
            if (maxdiff < d) { maxdiff = d; }
          }

        }
      }
    }
  }

  return maxdiff;
}

BeliefPropagationCollapse.prototype.maxdiff = function(t_cur, t_nxt) {
  t_cur = ((typeof t_cur === "undefined") ? this.step_idx : t_cur);
  t_nxt = ((typeof t_nxt === "undefined") ? (1-t_cur) : t_nxt);

  let anch_z=0,
      anch_y=0,
      anch_x=0,
      anch_b_val=0,
      anch_b_idx=0,
      anch_b=0,
      anch_s=0,
      anch_cell_tile_n=0,
      anch_idx=0;
  let maxdiff=-1,
      d = 0,
      cur_idx=0,
      nxt_idx=0;

  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        for (anch_b_idx=0; anch_b_idx<anch_cell_tile_n; anch_b_idx++) {

          anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
          for (anch_s=0; anch_s<(2*this.D); anch_s++) {
            anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);

            cur_idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            nxt_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            d = Math.abs(this.buf[cur_idx] - this.buf[nxt_idx])
            if (maxdiff < d) { maxdiff = d; }

          }

        }

      }
    }
  }

  return maxdiff;
}


BeliefPropagationCollapse.prototype.clear = function(t) {
  t = ((typeof t === "undefined") ? this.step_idx : t);

  let anch_z=0,
      anch_y=0, 
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let anch_idx=0;

  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {
          for (anch_b=0; anch_b<this.tilesize; anch_b++) {
            anch_idx = this.idx(t, anch_x, anch_y, anch_z, anch_b, anch_s);
            this.buf[anch_idx] = 0;
          }
        }
      }
    }
  }

}

//---

BeliefPropagationCollapse.prototype.tile_remove = function(anch_x, anch_y, anch_z, anch_b_idx) {
  let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
  if (anch_cell_tile_n == 0) { return false; }
  anch_cell_tile_n--;

  let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ]; 

  let _tmp = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_cell_tile_n ];
  this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_cell_tile_n ] = anch_b_val;
  this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ] = _tmp;
  this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ]--;

  return true;
}

BeliefPropagationCollapse.prototype.cull_boundary = function() {

  // cull edge
  //

  let anch_z=0,
      anch_y=0,
      anch_x=0,
      anch_b_val=0,
      anch_b_idx=0,
      anch_s=0,
      anch_v = [0,0,0];
  let nei_v = [0,0,0];
  let anch_cell_tile_n=0,
      anch_cell_tile = {};

  let dv = this.dxyz;
  let cull_tile = false,
      _tmp = 0;

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        anch_v[0] = anch_x;
        anch_v[1] = anch_y;
        anch_v[2] = anch_z;

        anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        if (anch_cell_tile_n<=1) { continue; }

        anch_b_idx = 0;
        while (anch_b_idx < anch_cell_tile_n) {
        //for (anch_b_idx=0; anch_b_idx<anch_cell_tile_n; anch_b_idx++) {
          anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ]; 

          cull_tile = false;

          for (anch_s=0; anch_s<(2*this.D); anch_s++) {

            this.pos(nei_v, anch_x+dv[anch_s][0], anch_y+dv[anch_s][1], anch_z+dv[anch_s][2]);
            if ( (this.oob(nei_v[0], nei_v[1], nei_v[2])) &&
                 (this.tile_conn[ this.TILE_CONN_STRIDE1*anch_b_val + anch_s ] == 1) ) {
              cull_tile  = true;
              break;
            }
          }

          if (cull_tile) {
            anch_cell_tile_n--;
            _tmp = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_cell_tile_n ];
            this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_cell_tile_n ] = anch_b_val;
            this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ] = _tmp;
            this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ]--;
            continue;
          }
          anch_b_idx++;

        }

      }
    }
  }

}

BeliefPropagationCollapse.prototype.cell_idx_collapse = function(x,y,z,b_idx) {
  if ((x<0) || (x>=this.FMX) ||
      (y<0) || (y>=this.FMY) ||
      (z<0) || (z>=this.FMZ)) { return false; }

  let n_cell = this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ];
  if (b_idx >= n_cell) { return false; }
  if (b_idx < 0) { return false; }

  let idx = z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3;
  let b_val = this.cell_tile[idx+b_idx];
  this.cell_tile[idx+b_idx] = this.cell_tile[idx];
  this.cell_tile[idx] = b_val;
  this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ] = 1;

  return true;
}

BeliefPropagationCollapse.prototype.cell_belief = function(cell_info) {
  let t=0, x=0, y=0, z=0, cell_tile_n=0, b_idx=0, b_val=0, sidx=0;
  let idx=0, max_belief=-1, S=1, nei_cell_tile_n=0, nei_v=[0,0,0];

  t = this.step_idx;

  cell_info[0] = 0;
  cell_info[1] = 0;
  cell_info[2] = 0;
  cell_info[3] = 0;

  let _eps = this.zero_eps;
  let d = 0;
  let n_dup = 0;

  // experimental
  //
  let max_belief_a = [];

  for (z=0; z<this.FMZ; z++) {
    for (y=0; y<this.FMY; y++) {
      for (x=0; x<this.FMX; x++) {

        cell_tile_n = this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ];
        if (cell_tile_n<=1) { continue; }

        for (b_idx=0; b_idx<cell_tile_n; b_idx++) {
          b_val = this.cell_tile[ z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3 + b_idx ];

          S = 1.0;
          for (sidx=0; sidx<(this.D*2); sidx++) {

            this.pos(nei_v, x+this.dxyz[sidx][0], y+this.dxyz[sidx][1], z+this.dxyz[sidx][2]);
            if (this.oob(nei_v[0], nei_v[1], nei_v[2])) { continue; }
            nei_cell_tile_n = this.cell_tile_n[ nei_v[2]*this.CELL_STRIDE_N1 + nei_v[1]*this.CELL_STRIDE_N2 + nei_v[0] ];
            if (nei_cell_tile_n<=1) { continue; }

            idx = this.idx(t, x, y, z, b_val, sidx);
            S *= this.pdf[b_val] * this.buf[idx];
          }

          // There's an element of randomness involved with the initial setup of mu
          // which allows for some variation of choice if the beliefs are similar
          //
          if ((S - max_belief) > _eps) {
            max_belief = S;
            cell_info[0] = x;
            cell_info[1] = y;
            cell_info[2] = z;
            cell_info[3] = b_idx;
            cell_info[4] = b_val;
            n_dup = 1;
            max_belief_a = [ [x,y,z,b_idx,b_val] ];
          }
          else if (Math.abs(S - max_belief) <= _eps) {
            max_belief_a.push( [x,y,z,b_idx,b_val] );
          }

        }

      }
    }
  }

  if (max_belief>=0) {
    let max_idx = Math.floor( Math.random() * max_belief_a.length );
    cell_info[0] = max_belief_a[max_idx][0];
    cell_info[1] = max_belief_a[max_idx][1];
    cell_info[2] = max_belief_a[max_idx][2];
    cell_info[3] = max_belief_a[max_idx][3];
    cell_info[4] = max_belief_a[max_idx][4];
  }

  return max_belief;
}

BeliefPropagationCollapse.prototype.__fill_accessed = function(accessed, x,y,z) {
  let v = [0,0,0];
  for (let sidx=0; sidx<(2*this.D); sidx++) {
    this.pos(v, x+this.dxyz[sidx][0], y+this.dxyz[sidx][1], z+this.dxyz[sidx][2]);
    if (this.oob(v[0], v[1], v[2])) { continue; }
    accessed[ v.join(":") ] = [v[0], v[1], v[2]];
  }
}

BeliefPropagationCollapse.prototype._fill_accessed_one = function(x,y,z,gn_idx) {
  if (this.visited[ z*this.VISITED_STRIDE1 + y*this.VISITED_STRIDE2 + x ]!=0) {
    return;
  }
  let base = gn_idx*this.GRID_NOTE_V_STRIDE1;
  let n = this.grid_note_v_n[gn_idx];
  this.visited[ z*this.VISITED_STRIDE1 + y*this.VISITED_STRIDE2 + x ] = 1;
  this.grid_note_v[base + n+0] = x;
  this.grid_note_v[base + n+1] = y;
  this.grid_note_v[base + n+2] = z;
  this.grid_note_v_n[gn_idx] += 3;
}

BeliefPropagationCollapse.prototype._fill_accessed = function(x,y,z,gn_idx) {
  let nei_v = [0,0,0];
  let n = 0;

  let base = gn_idx*this.GRID_NOTE_V_STRIDE1;

  for (let sidx=0; sidx<(2*this.D); sidx++) {
    let dv = this.dxyz[sidx];

    this.pos(nei_v, x+dv[0], y+dv[1], z+dv[2]);
    if (this.oob(nei_v[0], nei_v[1], nei_v[2])) {
      continue;
    }

    if (this.visited[ nei_v[2]*this.VISITED_STRIDE1 + nei_v[1]*this.VISITED_STRIDE2 + nei_v[0] ]!=0) {
      continue;
    }

    n = this.grid_note_v_n[gn_idx];

    this.visited[ nei_v[2]*this.VISITED_STRIDE1 + nei_v[1]*this.VISITED_STRIDE2 + nei_v[0] ] = 1;

    this.grid_note_v[base + n+0] = nei_v[0];
    this.grid_note_v[base + n+1] = nei_v[1];
    this.grid_note_v[base + n+2] = nei_v[2];
    this.grid_note_v_n[gn_idx] += 3;
  }

}

BeliefPropagationCollapse.prototype._unfill_accessed = function(gn_idx) {
  let v = [0,0,0];
  let n = 0;

  let base = gn_idx*this.GRID_NOTE_V_STRIDE1; 
  for (let ii=0; ii < this.grid_note_v_n[gn_idx]; ii+=3) {
    v[0] = this.grid_note_v[base + ii+0];
    v[1] = this.grid_note_v[base + ii+1];
    v[2] = this.grid_note_v[base + ii+2];
    this.visited[ v[2]*this.VISITED_STRIDE1 + v[1]*this.VISITED_STRIDE2 + v[0] ] = 0;
  }
  
}

BeliefPropagationCollapse.prototype._sanity_accessed = function(gn_idx) {
  let n = this.VISITED_STRIDE0;
  let valid = true;
  for (let ii=0; ii<n; ii++) {
    if (this.visited[ii] != 0) { valid = false; break; }
  }
  return valid;
}

// info
//   .consider_list - list of x,y,z positions to consider for culling
//   .consider_n    - length of list (not incuding stride=3)
//   .collapse_list - list of x,y,z,b tile position/value to collapse
//   .collapse_n    - length of list (not including stride=4)
//
// there are two major tests to cull a tile at a cell:
// * if it connects outward to an out-of-bound area, cull it
// * if it does not have a valid connection to a neighboring cell, cull it
//
// The algorithm uses a list of cell positions to consider to make it more efficient.
//
// In pseudo-code:
//
// while (consider_list non-empty) {
//   for (anch_v in consider_lit) {
//     for (tile in anch_v position) {
//       if (tile @ anch_v has connection, out of bounds) {
//         cull it
//         add neighbors to consider_list
//       }
//       if oob triggered, skip neighbor test
//       if (tile @ anch_v does not have at least one valid connection to neighboring tiles) {
//         cull it
//         add neighbors to consider_list
//       }
//     }
//   }
//     
// }
//
// A simple array is kept to add the cell positions to consider, only adding if the
// temporary 'visited' array is not already set.
// At the end of the loop, unwind the 'visited' marks instead of doing a whole sweep,
// for efficiency reasons
//
//
BeliefPropagationCollapse.prototype.cell_constraint_propagate = function() {
  let ii=0,
      collapse_stride = 4,
      consider_stride = 3,
      anch_v = [0,0,0,0],
      nei_v = [0,0,0,0];

  let anch_x = 0,
      anch_y = 0,
      anch_z = 0,
      anch_b_idx = 0,
      anch_b_val = 0,
      anch_n_tile = 0;

  let anch_s = 0,
      nei_s  = 0,
      nei_a_idx = 0,
      nei_a_val = 0,
      nei_n_tile = 0;

  let tc = this.tile_conn,
      tc_stride = this.TILE_CONN_STRIDE1;

  let gn_idx = this.grid_note_idx;
  this._unfill_accessed(gn_idx);

  //DEBUG
  //console.log(">>gn_idx:", gn_idx);
  //console.log("DEBUG: start: grid_note_v:", this.grid_note_v.join(","));
  //console.log("DEBUG: start: visited:", this.visited.join(","));

  let base_idx = 0;
  let still_culling = true;
  while (still_culling) {

    let gnv_stride = this.GRID_NOTE_V_STRIDE1;

    //console.log("ccp: grid_note_v_n[", gn_idx, "]:", this.grid_note_v_n[gn_idx],
    //  this.grid_note_v.slice(gn_idx*gnv_stride, gn_idx*gnv_stride+this.grid_note_v_n[gn_idx]).join(","));

    for (ii=0; ii<this.grid_note_v_n[gn_idx]; ii+=this.D) {
      anch_v[0] = this.grid_note_v[gn_idx*gnv_stride + ii+0];
      anch_v[1] = this.grid_note_v[gn_idx*gnv_stride + ii+1];
      anch_v[2] = this.grid_note_v[gn_idx*gnv_stride + ii+2];

      //DEBUG
      //console.log("considering(", anch_v.join(","),")");

      let anch_n_tile = this.cell_tile_n[ anch_v[2]*this.CELL_STRIDE_N1 + anch_v[1]*this.CELL_STRIDE_N2 + anch_v[0] ];
      for (anch_b_idx=0; anch_b_idx < anch_n_tile; anch_b_idx++) {

        let tile_valid = true;
        anch_b_val = this.cell_tile[ anch_v[2]*this.CELL_STRIDE1 + anch_v[1]*this.CELL_STRIDE2 + anch_v[0]*this.CELL_STRIDE3 + anch_b_idx ];

        //DEBUG
        //console.log(" considering(", anch_v.join(","),")", this.tile_name[anch_b_val], anch_b_idx);


        // First do a "connected" out o fbound test,
        // testing if the anchor tile has a connection that falls out of bounds.
        // If so, remove it, add to the 'considered' list continue
        //
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {
          let dv = this.dxyz[anch_s];
          this.pos(nei_v, anch_v[0]+dv[0], anch_v[1]+dv[1], anch_v[2]+dv[2]);

          if ( (this.oob(nei_v[0], nei_v[1], nei_v[2])) &&
               (this.tile_conn[ this.TILE_CONN_STRIDE1*anch_b_val + anch_s ] == 1) ) {

            //DEBUG
            //console.log("  CULL.oob:", anch_v[0], anch_v[1], anch_v[2], anch_b_idx, "(", this.tile_name[anch_b_val], ")");

            this.tile_remove(anch_v[0], anch_v[1], anch_v[2], anch_b_idx);
            anch_b_idx--;
            anch_n_tile--;

            if (anch_n_tile==0) { return false; }

            tile_valid = false;

            this._fill_accessed(anch_v[0], anch_v[1], anch_v[2], 1-gn_idx);
            break;
          }
        }

        if (!tile_valid) { continue; }


        // Test for at least one valid neighbor
        //
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {
          let dv = this.dxyz[anch_s];
          this.pos(nei_v, anch_v[0]+dv[0], anch_v[1]+dv[1], anch_v[2]+dv[2]);

          // ignore oob as it would have been caught above
          //
          if (this.oob(nei_v[0], nei_v[1], nei_v[2])) { continue; }

          let anchor_has_valid_conn = false;

          nei_n_tile = this.cell_tile_n[ nei_v[2]*this.CELL_STRIDE_N1 + nei_v[1]*this.CELL_STRIDE_N2 + nei_v[0] ];
          for (nei_a_idx=0; nei_a_idx < nei_n_tile; nei_a_idx++) {
            nei_a_val = this.cell_tile[ nei_v[2]*this.CELL_STRIDE1 + nei_v[1]*this.CELL_STRIDE2 + nei_v[0]*this.CELL_STRIDE3 + nei_a_idx ];

            //DEBUG
            //console.log("  ??", this.tile_name[anch_b_val], "--(" + this.dxyz[anch_s].join(":") + ")-->", this.tile_name[nei_a_val],
            //  "(", this.f_s(anch_s, anch_b_val, nei_a_val), ")");

            if (this.f_s(anch_s, anch_b_val, nei_a_val)==1) {
              anchor_has_valid_conn = true;
              break;
            }
          }

          if (!anchor_has_valid_conn) {
            tile_valid = false;

            //DEBUG
            //console.log("  CULL.nei:", anch_v[0], anch_v[1], anch_v[2], anch_b_idx, "(", this.tile_name[anch_b_val], ")");

            this.tile_remove(anch_v[0], anch_v[1], anch_v[2], anch_b_idx);
            anch_b_idx--;
            anch_n_tile--;

            if (anch_n_tile==0) { return false; }

            this._fill_accessed(anch_v[0], anch_v[1], anch_v[2], 1-gn_idx);
            break;
          }

        }

        if (!tile_valid) { continue; }

      }

    }

    this._unfill_accessed(1-gn_idx);

    /*
    if (!this._sanity_accessed(gn_idx)) {
      console.log("ERROR: VISITED NOT ZERO");
      console.log("(", gn_idx, ") grid_note_v[", this.grid_note_v_n[gn_idx], "]:", this.grid_note_v.join(","));
    }
    */

    this.grid_note_v_n[gn_idx]=0;
    gn_idx = 1-gn_idx;
    this.grid_note_idx = gn_idx;

    if (this.grid_note_v_n[gn_idx]==0) { still_culling = false; }

  }

  return true;
}

/*
function grid_cull_remove_invalid(gr) {
  let _ret = { "status": "success", "state":"done", "msg":"...", "data": []};

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {

        let idx = 0;
        while (idx < gr[z][y][x].length) {
          if (!(gr[z][y][x][idx].valid)) {
            let u = gr[z][y][x][idx].name;
            gr[z][y][x][idx] = gr[z][y][x][ gr[z][y][x].length-1 ];
            gr[z][y][x].pop();

            _ret.state = "processing";
            _ret.data.push( {"name":u, "pos":[x,y,z] });
            continue;
          }
          idx++;
        }

      }
    }
  }

  return _ret;

}
*/

/*
function grid_cull_propagate(gr, debug) {
  let _ret = { "status": "success", "state":"processing", "msg":"..." };

  let admissible_nei = g_template.admissible_nei;
  let admissible_pos = g_template.admissible_pos;
  let oppo = g_template.oppo;

  let still_processing = true;
  while (still_processing) {

    still_processing = false;

    let _rrp = grid_cull_remove_invalid(gr);
    if (_rrp.status != "success") {
      _ret.status = "error";
      _ret.msg = "grid_cull_remove_invalid:" + _rrp.msg;
      continue;
    }

    for (let z=0; z<gr.length; z++) {
      for (let y=0; y<gr[z].length; y++) {
        for (let x=0; x<gr[z][y].length; x++) {


          let gr_cell = gr[z][y][x];
          for (let cidx=0; cidx<gr_cell.length; cidx++) {
            let key_anchor = gr_cell[cidx].name;

            let tile_valid = true;

            for (let posidx=0; posidx<admissible_pos.length; posidx++) {
              let dv_key = admissible_pos[posidx].dv_key;
              let dv = admissible_pos[posidx].dv;

              let _p = _posbc(gr, x+dv[0], y+dv[1], z+dv[2]);
              let ux = _p[0],
                  uy = _p[1],
                  uz = _p[2];

              if (!(dv_key in admissible_nei[key_anchor])) { continue; }

              // oob check
              //
              for (let key_nei in admissible_nei[key_anchor][dv_key]) {
                if (admissible_nei[key_anchor][dv_key][key_nei].conn) {

                  if (_oob(gr, ux,uy,uz)) {
                    tile_valid = false;
                    break;
                  }
                }
              }

              if (!(tile_valid)) {
                gr_cell[cidx].valid = false;
                still_processing = true;
                break;;
              }

              if (_oob(gr, ux,uy,uz)) {
                continue;
              }


              let anchor_has_valid_conn = false;

              let gr_nei = gr[uz][uy][ux];
              for (let nei_idx=0; nei_idx<gr_nei.length; nei_idx++) {
                let dv_nei_key = oppo[dv_key];
                let key_nei = gr_nei[nei_idx].name;

                // if anchor has hvaid connection to at least one
                // tile ...
                //
                if (key_nei in admissible_nei[key_anchor][dv_key]) {
                  let dv_nei_key = oppo[dv_key];
                  if (admissible_nei[key_anchor][dv_key][key_nei].conn == admissible_nei[key_nei][dv_nei_key][key_anchor].conn) {
                    anchor_has_valid_conn = true;

                    break;
                  }
                }

              }

              if (!anchor_has_valid_conn) {
                tile_valid = false;

                gr_cell[cidx].valid = false;
                still_processing = true;
                break;
              }

            }

          }

        }
      }
    }

  }

  return _ret;
}
*/

//---

BeliefPropagationCollapse.prototype.bp_step_naive_x = function() {
  let t_cur = this.step_idx;
  let t_nxt = 1-this.step_idx;

  let iter=0;
  let anch_z=0,
      anch_y=0, 
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let nei_z=0,
      nei_y=0,
      nei_x=0,
      nei_a=0,
      nei_s=0;

  let nei_v = [0,0,0];
  let dv = this.dxyz;

  let anch_idx = 0,
      anch_s_inv = 0,
      nxt_anch_idx = 0;
  let nei_idx=0,
      nei_k_v=[0,0,0];

  let mu_ij_b = 0,
      P_mu_kj_a=1;

  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {
          for (anch_b=0; anch_b<this.tilesize; anch_b++) {
            anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b, anch_s);
            this.buf[anch_idx] = 1;
          }
        }
      }
    }
  }

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {
        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          this.pos(nei_v, anch_x+dv[anch_s][0], anch_y+dv[anch_s][1], anch_z+dv[anch_s][2]);

          //if (nei_v.join(":") == "1:0:0") { console.log("FUCK YOU"); }

          let _x = anch_x + dv[anch_s][0],
              _y = anch_y + dv[anch_s][1],
              _z = anch_z + dv[anch_s][2];

          //console.log("anch (", anch_x, anch_y, anch_z, ") dv[", anch_s, "](", dv[anch_s].join(":"), ") -> nei(", nei_v[0], nei_v[1], nei_v[2], ")");

          if (this.oob(nei_v[0], nei_v[1], nei_v[2])) {
            for (let ii=0; ii<this.tilesize; ii++) {
              this.buf[ this.idx(t_nxt, anch_x,anch_y,anch_z, ii, anch_s) ] = this.f_s(anch_s, ii, 0);

              //console.log("setting", anch_x, anch_y, anch_z, "(", this.tile_id[ii], ") (", nei_v.join(":"), ") =", this.f_s(anch_s, ii, 0));
            }
            continue;
          }

          //if (nei_v.join(":") == "1:0:0") { console.log("FUCK YOU 1"); }


          anch_s_inv = this.dxyz_inv_idx[anch_s];
          for (anch_b=0; anch_b<this.tilesize; anch_b++) {

            anch_idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b, anch_s);

            mu_ij_b = 0;
            for (nei_a=0; nei_a<this.tilesize; nei_a++) {

              P_mu_kj_a = 1.0;
              P_mu_kj_a *= this.f_s(anch_s, anch_b, nei_a);
              P_mu_kj_a *= this.pdf[nei_a];

          //if (nei_v.join(":") == "1:0:0") { console.log("FUCK YOU 2"); }

              //DEBUG
              //console.log(anch_x,anch_y,anch_z,anch_s,anch_b, "P_mu_kj_a", P_mu_kj_a);

              for (nei_s=0; nei_s<(2*this.D); nei_s++) {
                if (nei_s == anch_s_inv) { continue; }

                this.pos(nei_k_v, nei_v[0]+dv[nei_s][0], nei_v[1]+dv[nei_s][1], nei_v[2]+dv[nei_s][2]);

                //if (nei_v.join(":") == "1:0:0") { console.log("FUCK YOU 3", nei_k_v.join(":")); }


                if (this.oob(nei_k_v[0], nei_k_v[1], nei_k_v[2])) {


                  //if ((nei_v.join(":") == "1:0:0") && (nei_a == 1)) { console.log("FFUFU;ADFUIOJL;KsdgUHAJKLPWDGH K;", this.f_s(nei_s, nei_a, 0)); }

                  P_mu_kj_a *= this.f_s(nei_s, nei_a, 0);

                  continue;
                }

                nei_idx = this.idx(t_cur, nei_v[0], nei_v[1], nei_v[2], nei_a, nei_s);

                P_mu_kj_a *= this.buf[nei_idx];

                //DEBUG
                //console.log("nei_idx:", nei_idx, "(", nei_v.join(","), ")", "->", "P_mu_kj_a", P_mu_kj_a);
              }

              mu_ij_b += P_mu_kj_a;
            }

            nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b, anch_s);

            //DEBUG
            //console.log("nxt", nxt_anch_idx, "<==", mu_ij_b);

            this.buf[nxt_anch_idx] = mu_ij_b;


          }
        }
      }
    }
  }

  //console.log("BEFORE");
  //this.debug_print(t_nxt);


  this.renormalize_x(t_nxt);

  //console.log("AFTER");
  //this.debug_print(t_nxt);
  //console.log("---");

  return this.maxdiff(t_cur, t_nxt);

}

BeliefPropagationCollapse.prototype.bp_step_naive = function() {
  let t_cur = this.step_idx;
  let t_nxt = 1-this.step_idx;

  let iter=0;
  let anch_z=0,
      anch_y=0, 
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let nei_s=0;

  let anch_v = [0,0,0];
  let nei_v = [0,0,0];
  let dv = this.dxyz;

  let anch_idx = 0,
      anch_s_inv = 0,
      nxt_anch_idx = 0;
  let nei_idx=0,
      nei_k_v=[0,0,0];

  let mu_ij_b = 0,
      P_mu_kj_a=1;

  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        for (let anch_b_idx=0; anch_b_idx<anch_cell_tile_n; anch_b_idx++) {

          let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
          for (anch_s=0; anch_s<(2*this.D); anch_s++) {
            anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[anch_idx] = 1;
          }

        }

      }
    }
  }

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        anch_v[0] = anch_x;
        anch_v[1] = anch_y;
        anch_v[2] = anch_z;


        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        if (anch_cell_tile_n<=1) {

          //DEBUG
          //console.log("anchor tile", anch_x, anch_y, anch_z, "(", anch_cell_tile_n, ") ...  skipping");

          continue;
        }


        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          this.pos(nei_v, anch_x+dv[anch_s][0], anch_y+dv[anch_s][1], anch_z+dv[anch_s][2]);
          if (this.oob(nei_v[0], nei_v[1], nei_v[2])) {

            //DEBUG
            //console.log("  oob neighbor tile", nei_v[0], nei_v[1], nei_v[2], "... skipping");

            continue;
          }

          //DEBUG
          ///console.log("anchor", anch_x, anch_y, anch_z, "s" + anch_s.toString(), "(dv:", dv[anch_s], ")", "(n:", anch_cell_tile_n, ")");

          anch_s_inv = this.dxyz_inv_idx[anch_s];

          for (let anch_b_idx=0; anch_b_idx < anch_cell_tile_n; anch_b_idx++) {
            let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];

            //DEBUG
            //console.log("  anch[", anch_x, anch_y, anch_z, "]:", "b:", anch_b_val, this.tile_id[anch_b_val], "(bidx:", anch_b_idx,")");

            //anch_idx = this.idx(t_cur, anch_x, anch_y, anch_z, anch_b_val, anch_s);

            mu_ij_b = 0;

            let nei_cell_tile_n = this.cell_tile_n[ nei_v[2]*this.CELL_STRIDE_N1 + nei_v[1]*this.CELL_STRIDE_N2 + nei_v[0]];
            if (nei_cell_tile_n<=1) { continue; }
            for (let nei_a_idx=0; nei_a_idx < nei_cell_tile_n; nei_a_idx++) {
              let nei_a_val = this.cell_tile[ nei_v[2]*this.CELL_STRIDE1 + nei_v[1]*this.CELL_STRIDE2 + nei_v[0]*this.CELL_STRIDE3 + nei_a_idx ];

              P_mu_kj_a = 1.0;
              P_mu_kj_a *= this.f_s(anch_s, anch_b_val, nei_a_val);
              P_mu_kj_a *= this.pdf[nei_a_val];

              //DEBUG
              //console.log("   g(nei:" + this.tile_name[nei_a_val] +")",
              //  "f_s(s" + anch_s.toString() + ",anch:" + this.tile_name[anch_b_val] + ",nei:" + this.tile_name[nei_a_val] +") =",
              //  this.f_s(anch_s, anch_b_val, nei_a_val), this.pdf[nei_a_val] );

              for (nei_s=0; nei_s<(2*this.D); nei_s++) {
                if (nei_s == anch_s_inv) { continue; }

                this.pos(nei_k_v, nei_v[0]+dv[nei_s][0], nei_v[1]+dv[nei_s][1], nei_v[2]+dv[nei_s][2]);
                if (this.oob(nei_k_v[0], nei_k_v[1], nei_k_v[2])) { continue; }

                nei_idx = this.idx(t_cur, nei_v[0], nei_v[1], nei_v[2], nei_a_val, nei_s);
                P_mu_kj_a *= this.buf[nei_idx];

                //XXX
                //DEBUG
                //console.log("    mu_{[" + nei_k_v.toString() + "],[" + nei_v.toString() + "]}(" + this.tile_name[nei_a_val] +") =",
                //  this.buf[nei_idx], "(t_cur:", t_cur, ", t_nxt:", t_nxt, ")");
              }

              mu_ij_b += P_mu_kj_a;
            }

            //DEBUG
            //console.log(" mu_{[", nei_v.join(","), "],[", anch_v.join(","), "]}(", this.tile_name[anch_b_val], ") =", mu_ij_b);
            //console.log("");

            nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[nxt_anch_idx] = mu_ij_b;
          }
        }
      }
    }
  }

  this.renormalize(t_nxt);

  return this.maxdiff(t_cur, t_nxt);
}

BeliefPropagationCollapse.prototype.bp_step_mat = function() {
  let t_cur = this.step_idx;
  let t_nxt = 1-this.step_idx;

  let iter=0;
  let anch_z=0,
      anch_y=0, 
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let nei_s=0;

  let anch_v = [0,0,0];
  let nei_v = [0,0,0];
  let dv = this.dxyz;

  let anch_idx = 0,
      anch_s_inv = 0,
      nxt_anch_idx = 0;
  let nei_idx=0,
      nei_k_v=[0,0,0];

  let mu_ij_b = 0,
      P_mu_kj_a=1,
      h_ij_a = 1;


  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        for (let anch_b_idx=0; anch_b_idx<anch_cell_tile_n; anch_b_idx++) {

          let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
          for (anch_s=0; anch_s<(2*this.D); anch_s++) {
            anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[anch_idx] = 1;
          }

        }

      }
    }
  }


  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        anch_v[0] = anch_x;
        anch_v[1] = anch_y;
        anch_v[2] = anch_z;

        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        if (anch_cell_tile_n<=1) { continue; }

        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          this.pos(nei_v, anch_x+dv[anch_s][0], anch_y+dv[anch_s][1], anch_z+dv[anch_s][2]);
          if (this.oob(nei_v[0], nei_v[1], nei_v[2])) {

            // fill in with placeholder value
            //
            for (let anch_b_idx=0; anch_b_idx < anch_cell_tile_n; anch_b_idx++) {
              let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
              nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
              this.buf[nxt_anch_idx] = 1;
            }

            continue;
          }

          anch_s_inv = this.dxyz_inv_idx[anch_s];

          // init our h^t_{i,j}(a) vector
          //
          for (let ii=0; ii<this.h_v.length; ii++) { this.h_v[ii] = 0; }

          // fill in h_v vector
          //
          let nei_cell_tile_n = this.cell_tile_n[ nei_v[2]*this.CELL_STRIDE_N1 + nei_v[1]*this.CELL_STRIDE_N2 + nei_v[0]];
          if (nei_cell_tile_n<=1) {

            // fill in with placeholder value
            //
            for (let anch_b_idx=0; anch_b_idx < anch_cell_tile_n; anch_b_idx++) {
              let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
              nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
              this.buf[nxt_anch_idx] = 1;
            }

            continue;
          }

          for (let nei_a_idx=0; nei_a_idx < nei_cell_tile_n; nei_a_idx++) {
            let nei_a_val = this.cell_tile[ nei_v[2]*this.CELL_STRIDE1 + nei_v[1]*this.CELL_STRIDE2 + nei_v[0]*this.CELL_STRIDE3 + nei_a_idx ];

            this.h_v[nei_a_val] = this.pdf[nei_a_val];
            for (nei_s=0; nei_s<(2*this.D); nei_s++) {
              if (nei_s == anch_s_inv) { continue; }
              nei_idx = this.idx(t_cur, nei_v[0], nei_v[1], nei_v[2], nei_a_val, nei_s);
              this.h_v[nei_a_val] *= this.buf[nei_idx];
            }

          }

          // Custom function to do the F . h_v = mu_vmatrix-vector multiplication.
          // Once the multiplication is done, populate the mu buffer with results
          //
          this.Fs_dot_v(this.mu_v, anch_s, this.h_v);
          for (let anch_b_idx=0; anch_b_idx < anch_cell_tile_n; anch_b_idx++) {
            let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
            nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[nxt_anch_idx] = this.mu_v[anch_b_val];
          }

        }
      }
    }
  }

  this.renormalize(t_nxt);

  return this.maxdiff(t_cur, t_nxt);
}

BeliefPropagationCollapse.prototype.bp_step_svd = function() {
  let t_cur = this.step_idx;
  let t_nxt = 1-this.step_idx;

  let iter=0;
  let anch_z=0,
      anch_y=0, 
      anch_x=0,
      anch_b=0,
      anch_s=0;
  let nei_s=0;

  let anch_v = [0,0,0];
  let nei_v = [0,0,0];
  let dv = this.dxyz;

  let anch_idx = 0,
      anch_s_inv = 0,
      nxt_anch_idx = 0;
  let nei_idx=0,
      nei_k_v=[0,0,0];

  let mu_ij_b = 0,
      P_mu_kj_a=1,
      h_ij_a = 1;


  // clear out destination messages
  //
  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        for (let anch_b_idx=0; anch_b_idx<anch_cell_tile_n; anch_b_idx++) {

          let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];
          for (anch_s=0; anch_s<(2*this.D); anch_s++) {
            anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[anch_idx] = 1;
          }

        }

      }
    }
  }

  let debug_stat_count = 0;

  for (anch_z=0; anch_z<this.FMZ; anch_z++) {
    for (anch_y=0; anch_y<this.FMY; anch_y++) {
      for (anch_x=0; anch_x<this.FMX; anch_x++) {

        anch_v[0] = anch_x;
        anch_v[1] = anch_y;
        anch_v[2] = anch_z;

        let anch_cell_tile_n = this.cell_tile_n[ anch_z*this.CELL_STRIDE_N1 + anch_y*this.CELL_STRIDE_N2 + anch_x ];
        if (anch_cell_tile_n<=1) { continue; }

        for (anch_s=0; anch_s<(2*this.D); anch_s++) {

          this.pos(nei_v, anch_x+dv[anch_s][0], anch_y+dv[anch_s][1], anch_z+dv[anch_s][2]);
          if (this.oob(nei_v[0], nei_v[1], nei_v[2])) { continue; }
          anch_s_inv = this.dxyz_inv_idx[anch_s];

          // init our h^t_{i,j}(a) vector
          //
          for (let ii=0; ii<this.h_v.length; ii++) { this.h_v[ii] = 0; }

          // fill in h_v vector
          //
          let nei_cell_tile_n = this.cell_tile_n[ nei_v[2]*this.CELL_STRIDE_N1 + nei_v[1]*this.CELL_STRIDE_N2 + nei_v[0]];
          if (nei_cell_tile_n<=1) { continue; }
          for (let nei_a_idx=0; nei_a_idx < nei_cell_tile_n; nei_a_idx++) {
            let nei_a_val = this.cell_tile[ nei_v[2]*this.CELL_STRIDE1 + nei_v[1]*this.CELL_STRIDE2 + nei_v[0]*this.CELL_STRIDE3 + nei_a_idx ];

            this.h_v[nei_a_val] = this.pdf[nei_a_val];

            for (nei_s=0; nei_s<(2*this.D); nei_s++) {
              if (nei_s == anch_s_inv) { continue; }
              nei_idx = this.idx(t_cur, nei_v[0], nei_v[1], nei_v[2], nei_a_val, nei_s);
              this.h_v[nei_a_val] *= this.buf[nei_idx];

              debug_stat_count++;
            }

          }

          this.uMv(this.u_v, this.SVs[anch_s], this.h_v);
          this.uMv(this.mu_v, this.Us[anch_s], this.u_v);

          for (let anch_b_idx=0; anch_b_idx < anch_cell_tile_n; anch_b_idx++) {
            let anch_b_val = this.cell_tile[ anch_z*this.CELL_STRIDE1 + anch_y*this.CELL_STRIDE2 + anch_x*this.CELL_STRIDE3 + anch_b_idx ];

            nxt_anch_idx = this.idx(t_nxt, anch_x, anch_y, anch_z, anch_b_val, anch_s);
            this.buf[nxt_anch_idx] = this.mu_v[anch_b_val];

            debug_stat_count++;
          }

        }
      }
    }
  }

  this.debug_count_step++;
  this.debug_count_a.push(debug_stat_count);

  this.renormalize(t_nxt);

  return this.maxdiff(t_cur, t_nxt);
}

BeliefPropagationCollapse.prototype.debug_avg_stat_count = function() {
  if (this.debug_count_step==0) { return ; }

  let s = 0;
  for (let ii=0; ii<this.debug_count_a.length; ii++) {
    s+= this.debug_count_a[ii];
  }

  let avg = s / this.debug_count_step;

  console.log(avg);

  return avg;

}

BeliefPropagationCollapse.prototype.debug_print_x = function(t, _digit) {
  t = ((typeof t === "undefined") ? this.step_idx : t);
  _digit = ((typeof _digit == "undefined") ? 3 : _digit);

  let space_width = 16;
  let B = Math.pow(10, _digit);

  for (let z=0; z<this.FMZ; z++) {
    for (let y=0; y<this.FMY; y++) {
      for (let x=0; x<this.FMX; x++) {

        console.log(x,y,z);

        for (let b=0; b<this.tilesize; b++) {

          let valid = false;
          for (let s=0; s<(this.D*2); s++) {
            let idx = this.idx(t,x,y,z,b,s);
            if ( this.buf[idx] > this.eps ) { valid = true; break; }
          }
          if (!valid) { continue; }

          let count = 0;
          let sfx = "";
          for (let dvidx=0; dvidx<this.dxyz.length; dvidx++) {
            let dv_key = this.dxyz[dvidx].join(":");
            if (count>0) { sfx += " "; }

            let idx = this.idx(t,x,y,z,b,dvidx);

            let v = this.buf[idx];
            let vs = (Math.floor(v*B)/B).toString();

            if (vs == "0") { vs = "" ; }
            else { vs = "(" + vs + ")"; }
            let str_ele = dv_key + " " + vs  ;
            if (str_ele.length < space_width) {
              str_ele += " ".repeat(space_width - str_ele.length);
            }
            sfx += str_ele;
            count++;
          }

          console.log("  ", this.tile_name[b], sfx);

        }

      }

    }
  }
}

BeliefPropagationCollapse.prototype.create_pgr = function() {
  let pgr = [];

  for (let z=0; z<this.FMZ; z++) {
    pgr.push([]);
    for (let y=0; y<this.FMY; y++) {
      pgr[z].push([]);
      for (let x=0; x<this.FMX; x++) {
        pgr[z][y].push([]);

        let ntile = this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ];

        for (let b_idx=0; b_idx<ntile; b_idx++) {
          let b = this.cell_tile[ z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3 + b_idx ];

          pgr[z][y][x].push( {"name":this.tile_name[b], "valid":true, "cgroup":-1} );
        }
      }
    }
  }

  return pgr;
}

BeliefPropagationCollapse.prototype.debug_print = function(t, _digit) {
  t = ((typeof t === "undefined") ? this.step_idx : t);
  _digit = ((typeof _digit == "undefined") ? 3 : _digit);

  let space_width = 16;
  let B = Math.pow(10, _digit);

  //for (let ii=0; ii<this.cell_tile_n.length; ii++) { console.log("cell_tile_n[", ii, "]", this.cell_tile_n[ii]); }
  //for (let ii=0; ii<this.cell_tile.length; ii++) { console.log("cell_tile[", ii, "]", this.cell_tile[ii]); }

  console.log("step:", t);

  for (let z=0; z<this.FMZ; z++) {
    for (let y=0; y<this.FMY; y++) {
      for (let x=0; x<this.FMX; x++) {

        console.log("[", x,y,z, "]", "(n:", this._cell_tile_n(x,y,z) , ")");

        let ntile = this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ];

        for (let b_idx=0; b_idx<ntile; b_idx++) {
          let b = this.cell_tile[ z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3 + b_idx ];

          /*
          let valid = false;
          for (let s=0; s<(this.D*2); s++) {
            let idx = this.idx(t,x,y,z,b,s);
            if ( this.buf[idx] > this.eps ) { valid = true; break; }
          }
          if (!valid) { continue; }
          */

          let count = 0;
          let sfx = "";
          for (let dvidx=0; dvidx<this.dxyz.length; dvidx++) {
            let dv_key = this.dxyz[dvidx].join(":");
            if (count>0) { sfx += " "; }

            let idx = this.idx(t,x,y,z,b,dvidx);

            let v = this.buf[idx];
            let vs = (Math.floor(v*B)/B).toString();

            if (vs == "0") { vs = "" ; }
            else { vs = "(" + vs + ")"; }
            let str_ele = dv_key + " " + vs  ;
            if (str_ele.length < space_width) {
              str_ele += " ".repeat(space_width - str_ele.length);
            }
            sfx += str_ele;
            count++;
          }

          console.log("  ", this.tile_name[b] + "(" + b.toString() + ")", sfx);

        }

      }

    }
  }
}

BeliefPropagationCollapse.prototype._cell_tile_n = function(x,y,z) {
  return this.cell_tile_n[ z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x ];
}

BeliefPropagationCollapse.prototype._cell_tile_n_idx = function(x,y,z) {
  return z*this.CELL_STRIDE_N1 + y*this.CELL_STRIDE_N2 + x;
}

BeliefPropagationCollapse.prototype._cell_tile_idx = function(x,y,z,idx) {
  return z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3 + idx;
}

BeliefPropagationCollapse.prototype._cell_tile = function(x,y,z,idx) {
  return this.cell_tile[ z*this.CELL_STRIDE1 + y*this.CELL_STRIDE2 + x*this.CELL_STRIDE3 + idx ];
}

BeliefPropagationCollapse.prototype.filter_keep = function(x,y,z, tile_map) {

  let ctn_idx = this._cell_tile_n_idx(x,y,z);

  let ntile = this.cell_tile_n[ ctn_idx ];
  for (let idx=0; idx<ntile; idx++) {
    let ct_idx = this._cell_tile_idx(x,y,z,idx);
    let tile_id = this.cell_tile[ ct_idx ];
    let tile_name = this.tile_id[ tile_id ];

    if (tile_name in tile_map) { continue; }

    ntile--;
    let ct_idx_end = this._cell_tile_idx(x,y,z,ntile);

    let a = this.cell_tile[ ct_idx ];
    this.cell_tile[ ct_idx ] = this.cell_tile[ ct_idx_end ];
    this.cell_tile[ ct_idx_end ] = a;
    idx--;

  }

  this.cell_tile_n[ ctn_idx ] = ntile;
}

BeliefPropagationCollapse.prototype.filter_discard = function(x,y,z, tile_map) {

  let ctn_idx = this._cell_tile_n_idx(x,y,z);

  let ntile = this.cell_tile_n[ ctn_idx ];
  for (let idx=0; idx<ntile; idx++) {
    let ct_idx = this._cell_tile_idx(x,y,z,idx);
    let tile_id = this.cell_tile[ ct_idx ];
    let tile_name = this.tile_id[ tile_id ];
    if (!(tile_name in tile_map)) { continue; }

    ntile--;
    let ct_idx_end = this._cell_tile_idx(x,y,z,ntile);

    let a = this.cell_tile[ ct_idx ];
    this.cell_tile[ ct_idx ] = this.cell_tile[ ct_idx_end ];
    this.cell_tile[ ct_idx_end ] = a;
    idx--;

  }

  this.cell_tile_n[ ctn_idx ] = ntile;
}

BeliefPropagationCollapse.prototype.simple_realize = function() {

  this.cull_boundary();
  this.renormalize();

  let cell_info = [0,0,0,0,0];
  let cell_belief = 0;

  let count = 0;

  while (cell_belief >= 0) {
    if ((count%10)==0) {
      console.log(">>", count);
    }
    count++;

    let iter = 0, max_it = 1000, maxdiff=-1;
    for (iter=0; iter<max_it; iter++) {

      //console.log("ITER[", iter, "]: step_idx:", this.step_idx, "\n---");
      //console.log("maxdiff:", maxdiff, "\n---\n");

      maxdiff = this.bp_step_svd();

      this.step_idx = 1-this.step_idx
      if (Math.abs(maxdiff) < this.eps) { break; }
    }

    //this.debug_print(this.step_idx);
    cell_belief = this.cell_belief(cell_info);

    //console.log("belief:", cell_belief, ", cell:[", cell_info.join(","), "]");

    this.cell_idx_collapse(cell_info[0], cell_info[1], cell_info[2], cell_info[3]);
    this.renormalize();

    this._fill_accessed(cell_info[0], cell_info[1], cell_info[2], this.grid_note_idx);
    this.cell_constraint_propagate();

    //console.log("after fix ([", cell_info.join(","), "])");
    //this.debug_print(this.step_idx);
    //console.log("\n\n");
  }

}


if (typeof module !== "undefined") {

  var fs = require("fs");
  var numeric = require("./numeric.js");

  function _load(fn) {
    let data = fs.readFileSync(fn);
    let tilelib = JSON.parse(data);
    return tilelib;
  }

  function test0() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 2,2,1);

    let keep_map = {
      ".000" : true,
      "r000" : true,
      "|000" : true
    };

    bpc.filter_keep(0,0,0, keep_map);
    bpc.filter_keep(0,1,0, keep_map);
    bpc.filter_keep(1,0,0, keep_map);
    bpc.filter_keep(1,1,0, keep_map);

    bpc.renormalize();
    bpc.debug_print();

  }

  function test1() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 4,3,1);

    bpc.filter_keep(0,2,0, {"r000":1});
    bpc.filter_keep(0,1,0, {"|000":1,"T003":1});
    bpc.filter_keep(0,0,0, {"r003":1});

    bpc.filter_keep(1,2,0, {"|001":1});
    bpc.filter_keep(1,1,0, {".000":1,"|001":1});
    bpc.filter_keep(1,0,0, {"|001":1});

    bpc.filter_keep(2,2,0, {"|001":1, "T000":1});
    bpc.filter_keep(2,1,0, {'|000':1, '|001':1, '+000':1, 'T000':1, 'T001':1, 'T002':1, 'T003':1, 'r000':1, 'r001':1, 'r002':1, 'r003':1, '.000':1 });
    bpc.filter_keep(2,0,0, {"|001":1, "T002":1 });

    bpc.filter_keep(3,2,0, {"r001":1});
    bpc.filter_keep(3,1,0, {"|000":1,"T001":1});
    bpc.filter_keep(3,0,0, {"r002":1});

    bpc.renormalize();
    bpc.debug_print();

  }

  function test2() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 4,3,1);

    bpc.filter_keep(0,2,0, {"r000":1});
    bpc.filter_keep(0,1,0, {"|000":1,"T003":1});
    bpc.filter_keep(0,0,0, {"r003":1});

    bpc.filter_keep(1,2,0, {"|001":1});
    bpc.filter_keep(1,1,0, {".000":1,"|001":1});
    bpc.filter_keep(1,0,0, {"|001":1});

    bpc.filter_keep(2,2,0, {"|001":1, "T000":1});
    bpc.filter_keep(2,1,0, {'|000':1, '|001':1, '+000':1, 'T000':1, 'T001':1, 'T002':1, 'T003':1, 'r000':1, 'r001':1, 'r002':1, 'r003':1, '.000':1 });
    bpc.filter_keep(2,0,0, {"|001":1, "T002":1 });

    bpc.filter_keep(3,2,0, {"r001":1});
    bpc.filter_keep(3,1,0, {"|000":1,"T001":1});
    bpc.filter_keep(3,0,0, {"r002":1});

    console.log("INIT:\n---");
    bpc.debug_print(bpc.step_idx);
    console.log("---\n");


    bpc.renormalize();

    let n_it = 1;

    for (let ii=0; ii<n_it; ii++) {
      bpc.bp_step_naive();
      bpc.step_idx = 1-bpc.step_idx
    }


    bpc.debug_print(1-bpc.step_idx);

  }

  function test3() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 3,3,1);

    bpc.filter_keep(0,2,0, {"r000":1});
    bpc.filter_keep(0,1,0, {"|000":1,"T003":1});
    bpc.filter_keep(0,0,0, {"r003":1});

    bpc.filter_keep(1,2,0, {"|001":1,"T000":1});
    bpc.filter_keep(1,1,0, {".000":1,"|001":1,"r002":1,"r003":1,"T002":1});
    bpc.filter_keep(1,0,0, {"|001":1});

    bpc.filter_keep(2,2,0, {"r001":1});
    bpc.filter_keep(2,1,0, {'|000':1,"T001":1});
    bpc.filter_keep(2,0,0, {"r002":1});

    // expect:
    //
    // 0,1,0: 2/5 |000, 3/5 T003
    // 2,1,0: 2/5 |000, 3/5 T001
    // 1,2,0: 2/5 |001, 3/5 T000
    // 1,1,0: 1/5 all
    //

    bpc.renormalize();

    let iter = 0, max_it = 1000;
    let maxdiff = -1;

    for (iter=0; iter<max_it; iter++) {

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      bpc.debug_print(bpc.step_idx);
      console.log("maxdiff:", maxdiff, "\n---\n");

      maxdiff = bpc.bp_step_naive();
      bpc.step_idx = 1-bpc.step_idx

      if (Math.abs(maxdiff) < bpc.eps) { break; }

    }

    console.log("fin maxdiff:", maxdiff, "(", bpc.eps, ")");

    bpc.debug_print(bpc.step_idx);

  }

  function test4() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 3,3,1);

    bpc.filter_keep(0,2,0, {"r000":1});
    bpc.filter_keep(0,1,0, {"|000":1,"T003":1});
    bpc.filter_keep(0,0,0, {"r003":1});

    bpc.filter_keep(1,2,0, {"|001":1,"T000":1});
    bpc.filter_keep(1,1,0, {".000":1,"|001":1,"r002":1,"r003":1,"T002":1});
    bpc.filter_keep(1,0,0, {"|001":1});

    bpc.filter_keep(2,2,0, {"r001":1});
    bpc.filter_keep(2,1,0, {'|000':1,"T001":1});
    bpc.filter_keep(2,0,0, {"r002":1});

    // expect:
    //
    // 0,1,0: 2/5 |000, 3/5 T003
    // 2,1,0: 2/5 |000, 3/5 T001
    // 1,2,0: 2/5 |001, 3/5 T000
    // 1,1,0: 1/5 all
    //

    bpc.renormalize();

    let iter = 0, max_it = 1000;
    let maxdiff = -1;

    for (iter=0; iter<max_it; iter++) {

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      bpc.debug_print(bpc.step_idx);
      console.log("maxdiff:", maxdiff, "\n---\n");

      maxdiff = bpc.bp_step_mat();
      bpc.step_idx = 1-bpc.step_idx

      if (Math.abs(maxdiff) < bpc.eps) { break; }

    }

    console.log("fin maxdiff:", maxdiff, "(", bpc.eps, ")");

    bpc.debug_print(bpc.step_idx);

  }

  function test5() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 3,3,1);

    bpc.filter_keep(0,2,0, {"r000":1});
    bpc.filter_keep(0,1,0, {"|000":1,"T003":1});
    bpc.filter_keep(0,0,0, {"r003":1});

    bpc.filter_keep(1,2,0, {"|001":1,"T000":1});
    bpc.filter_keep(1,1,0, {".000":1,"|001":1,"r002":1,"r003":1,"T002":1});
    bpc.filter_keep(1,0,0, {"|001":1});

    bpc.filter_keep(2,2,0, {"r001":1});
    bpc.filter_keep(2,1,0, {'|000':1,"T001":1});
    bpc.filter_keep(2,0,0, {"r002":1});

    // expect:
    //
    // 0,1,0: 2/5 |000, 3/5 T003
    // 2,1,0: 2/5 |000, 3/5 T001
    // 1,2,0: 2/5 |001, 3/5 T000
    // 1,1,0: 1/5 all
    //

    bpc.renormalize();

    let iter = 0, max_it = 1000;
    let maxdiff = -1;

    for (iter=0; iter<max_it; iter++) {

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      bpc.debug_print(bpc.step_idx);
      console.log("maxdiff:", maxdiff, "\n---\n");

      maxdiff = bpc.bp_step_svd();
      bpc.step_idx = 1-bpc.step_idx

      if (Math.abs(maxdiff) < bpc.eps) { break; }

    }

    console.log("fin maxdiff:", maxdiff, "(", bpc.eps, ")");

    bpc.debug_print(bpc.step_idx);

  }

  function test6() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 3,3,1);
    bpc.cull_boundary();
    bpc.renormalize();
    bpc.debug_print(bpc.step_idx);
  }

  function test6_1() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 3,3,1);
    bpc.cull_boundary();
    bpc.renormalize();

    let _prof = new _profiler();

    let iter = 0, max_it = 1000, maxdiff=-1;
    for (iter=0; iter<max_it; iter++) {

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      //bpc.debug_print(bpc.step_idx);
      console.log("maxdiff:", maxdiff, "\n---\n");

      _prof.start();
      maxdiff = bpc.bp_step_naive();
      console.log("dt:", _prof.end());

      bpc.step_idx = 1-bpc.step_idx

      if (Math.abs(maxdiff) < bpc.eps) { break; }

    }


    bpc.debug_print(bpc.step_idx);
  }

  function test7(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);
    bpc.cull_boundary();
    bpc.renormalize();

    let _prof = new _profiler();

    let iter = 0, max_it = 1000, maxdiff=-1;
    for (iter=0; iter<max_it; iter++) {

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      //bpc.debug_print(bpc.step_idx);
      console.log("maxdiff:", maxdiff, "\n---\n");

      _prof.start();
      maxdiff = bpc.bp_step_svd();
      console.log("dt:", _prof.end());

      bpc.step_idx = 1-bpc.step_idx

      if (Math.abs(maxdiff) < bpc.eps) { break; }

    }

    console.log("fin maxdiff:", maxdiff, "(", bpc.eps, ")");

    //bpc.debug_print(bpc.step_idx);
  }

  function test8(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);
    bpc.cull_boundary();
    bpc.renormalize();

    let cell_info = [0,0,0,0,0];


    let iter = 0, max_it = 1000, maxdiff=-1;
    for (iter=0; iter<max_it; iter++) {

      //bpc.debug_print(bpc.step_idx);

      console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
      console.log("maxdiff:", maxdiff, "\n---\n");

      //maxdiff = bpc.bp_step_naive();
      //maxdiff = bpc.bp_step_mat();
      maxdiff = bpc.bp_step_svd();

      bpc.step_idx = 1-bpc.step_idx
      if (Math.abs(maxdiff) < bpc.eps) { break; }
    }

    bpc.debug_print(bpc.step_idx);
    let _belief = bpc.cell_belief(cell_info);

    console.log("belief:", _belief, cell_info.join(","));

  }

  function test9(X,Y,Z) {
    X = ((typeof X === "undefined") ? 2 : X);
    Y = ((typeof Y === "undefined") ? 2 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);

    bpc._fill_accessed_one(0,0,0,0);
    bpc.visited[0] = 0;

    bpc.cell_constraint_propagate();

    bpc.debug_print(bpc.step_idx);


  }

  function test10(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 3 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);

    bpc._fill_accessed_one(1,1,1,0);
    let p = bpc.VISITED_STRIDE1*1 + bpc.VISITED_STRIDE2*1 + 1;
    bpc.visited[p] = 0;

    bpc.cell_constraint_propagate();

    bpc.debug_print(bpc.step_idx);
  }

  function test11(X,Y,Z) {
    X = ((typeof X === "undefined") ? 2 : X);
    Y = ((typeof Y === "undefined") ? 2 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);

    let bad_tile_idx = 0;
    for (let ii=0; ii<bpc.tile_name.length; ii++) {
      if (bpc.tile_name[ii] == "|000") { bad_tile_idx=ii; break; }
    }

    bpc.cell_idx_collapse(0,0,0,bad_tile_idx);

    bpc._fill_accessed_one(0,0,0,0);
    let p = bpc.VISITED_STRIDE1*0 + bpc.VISITED_STRIDE2*0 + 0;
    bpc.visited[p] = 0;

    let res = bpc.cell_constraint_propagate();
    
    console.log(">>>", res);

    bpc.debug_print(bpc.step_idx);
  }

  function test12(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);

    let cell_info = [0,0,0,0,0];

    let blank_idx = 0;
    for (let ii=0; ii<bpc.tile_name.length; ii++) {
      if (bpc.tile_name[ii] == ".000") { blank_idx=0; break; }
    }

    for (let z=0; z<Z; z++) {
      for (let y=0; y<Y; y++) {
        for (let x=0; x<X; x++) {
          bpc.cell_idx_collapse(x,y,z,blank_idx);
        }
      }
    }

    let v = bpc.cell_belief(cell_info);
    console.log(">>>", v, cell_info.join(","));

    bpc.debug_print(bpc.step_idx);

  }

  function test13(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);
    bpc.cull_boundary();
    bpc.renormalize();

    let cell_info = [0,0,0,0,0];
    let cell_belief = 0;

    while (cell_belief >= 0) {

      let iter = 0, max_it = 1000, maxdiff=-1;
      for (iter=0; iter<max_it; iter++) {

        console.log("ITER[", iter, "]: step_idx:", bpc.step_idx, "\n---");
        console.log("maxdiff:", maxdiff, "\n---\n");

        maxdiff = bpc.bp_step_svd();

        bpc.step_idx = 1-bpc.step_idx
        if (Math.abs(maxdiff) < bpc.eps) { break; }
      }

      bpc.debug_print(bpc.step_idx);
      cell_belief = bpc.cell_belief(cell_info);

      console.log("belief:", cell_belief, ", cell:[", cell_info.join(","), "]");

      bpc.cell_idx_collapse(cell_info[0], cell_info[1], cell_info[2], cell_info[3]);
      bpc.renormalize();

      bpc._fill_accessed(cell_info[0], cell_info[1], cell_info[2], bpc.grid_note_idx);
      bpc.cell_constraint_propagate();

      console.log("after fix ([", cell_info.join(","), "])");
      bpc.debug_print(bpc.step_idx);

      console.log("\n\n");
    }

  }

  function test14(X,Y,Z) {
    X = ((typeof X === "undefined") ? 3 : X);
    Y = ((typeof Y === "undefined") ? 3 : Y);
    Z = ((typeof Z === "undefined") ? 1 : Z);
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, X,Y,Z);

    bpc.simple_realize(X,Y,Z);
    bpc.debug_print();
  }


  function debugg___() {
    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 2,3,4);
    for (let t=0; t<2; t++) {
      for (let z=0; z<4; z++) {
        for (let y=0; y<3; y++) {
          for (let x=0; x<2; x++) {
            for (let s=0; s<6; s++) {
              for (let b=0; b<bpc.tilesize; b++) {
                let idx = bpc.idx(t,x,y,z,b,s);
                console.log(t,x,y,z,b,s, "-->", idx);
              }
            }
          }
        }
      }
    }
  }

  function main() {

    //debugg___();
    //process.exit();

    //test0();
    //console.log("---");
    //test1();
    //console.log("---");
    //test2();
    //console.log("---");
    //test3();
    //console.log("---");
    test4();
    console.log("---");
    //test5();
    //console.log("---");

    //test6();
    //test7();
    //test7(10,10,10);
    //test7(20,20,20);
    //test7(30,30,30);
    //test8(3,3,1);
    //test9(2,2,1);
    //test9(3,2,1);
    //test9(3,3,1);
    //test9(3,3,3);
    //test10(3,3,3);
    //test11();
    //test12();
    //test13();
    //test13(3,3,3);

    //test14(10,10,6); // 1m43s
    //test14(10,10,10); // 1m43s
    //test14(11,11,11); // 3m10s
    //test14(12,12,12); // 5m56s
    //test14(13,13,13); // 9m1s
    //test14(16,16,8); // 9m23s
    //test14(6,6,6); // 21s

    //test6_1(3,3,1);
    process.exit();

    let tilelib = _load("./data/stair.json");
    let bpc = new BeliefPropagationCollapse(tilelib,null, 4,3,1);

    console.log(">>", bpc.n);

    for (let ii=0; ii<1; ii++) {
      bpc.bp_step_naive();
      bpc.step_idx = 1-bpc.step_idx
    }

    bpc.debug_print(bpc.step_idx);
  }

  main();

  module.exports = BeliefPropagationCollapse;
}
