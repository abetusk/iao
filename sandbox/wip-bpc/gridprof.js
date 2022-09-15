
function init_grid() {
  let dim = [6,6,6];
  let D = 3;
  let B = 48;

  let gr = [];
  for (let z=0; z<dim[2]; z++) {
    gr.push([]);
    for (let y=0; y<dim[1]; y++) {
      gr[z].push([]);
      for (let x=0; x<dim[0]; x++) {
        gr[z][y].push([]);
        for (let b=0; b<B; b++) {

          gr[z][y][x].push([]);

          for (let d=0; d<(2*D); d++) {
            gr[z][y][x][b].push({ "val" : 0 });
          }
        }
      }
    }
  }

  return gr;
}

function grid_prof(gr){

  let prof_s = (new Date().getTime() / 1000);

  for (let z=0; z<gr.length; z++) {
    for (let y=0; y<gr[z].length; y++) {
      for (let x=0; x<gr[z][y].length; x++) {
        for (let b=0; b<gr[z][y][x].length; b++) {
          for (let d=0; d<gr[z][y][x][b].length; d++) {
            gr[z][y][x][b][d].val = Math.random();
          }
        }
      }
    }
  }

  let prof_e = (new Date().getTime() / 1000);
  return prof_e - prof_s;
}

function init_packgrid() {
  let dim = [6,6,6];
  let D = 3;
  let B = 48;

  let gr = new Array( dim[0]*dim[1]*dim[2]*D*2*B );
  let n = gr.length;

  for (let i=0; i<n; i++) {
    gr[i] = 0.0;
  }

  return gr;
}

function packgrid_prof(gr) {
  let n = gr.length;

  let prof_s = (new Date().getTime() / 1000);

  for (let i=0; i<n; i++) {
    gr[i] = Math.random();
  }

  let prof_e = (new Date().getTime() / 1000);
  return prof_e - prof_s;
}

function packgrid_prof2(gr, info) {
  let n = gr.length;

  let Z = info.dim[2],
      Y = info.dim[1],
      X = info.dim[0],
      D = info.d*2,
      B = info.b;

  let prof_s = (new Date().getTime() / 1000);

  let u_0 = Z*Y*X*D*B;
  let u_z = Y*X*D*B;
  let u_y = X*D*B;
  let u_x = D*B;
  let u_d = B;

  let count=0;

  for (let z=0; z<Z; z++) {
    for (let y=0; y<Y; y++) {
      for (let x=0; x<X; x++) {
        for (let d=0; d<D; d++) {
          for (let b=0; b<B; b++) {

            let idx = u_z*z + u_y*y + u_x*x + u_d*d + b;
            if (idx >= u_0) { console.log("ffff"); }
            gr[idx] = Math.random();
            count++;
          }
        }
      }
    }
  }

  console.log("count:", count);


  let prof_e = (new Date().getTime() / 1000);
  return prof_e - prof_s;
}

let gr = init_grid();
console.log(">>>", 1000*grid_prof(gr));

let grp = init_packgrid();
console.log(">>>", 1000*packgrid_prof(grp));
console.log(">>>", 1000*packgrid_prof2(grp, {"dim":[6,6,6], "d": 3, "b": 48} ));
