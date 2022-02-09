
function irnd(v) {
  return Math.floor(Math.random()*v);
}

let grid = [
];

let H = [ { "v":6, "p":0.1 }, { "v":7, "p":0.1 }, {"v":8, "p":0.8} ];
let W = [ { "v":7, "p":0.1 }, { "v":8, "p":0.4 }, {"v":9, "p":0.2}, {"v":10, "p":0.2}];



let h = H[irnd(3)].v;
let w = W[irnd(4)].v;

for (let iy=0; iy<h; iy++) {
  grid.push([]);
  for (let ix=0; ix<w; ix++)  {
    grid[iy].push('.');
  }
}

let le, re;
if ((w%2)==0) {
  le = Math.floor((w-1)/2)-1;
  re = Math.floor((w+1)/2)+1;
}
else {
  le = Math.floor((w)/2)-1;
  re = Math.floor((w)/2)+1;
}

let dh_eye = irnd(2) + 2;
let dw_eye = 1;

let eye_h, eye_w;
let eye_choice = irnd(3);

grid[dh_eye][le] = 'e';
grid[dh_eye][re] = 'e';

if (eye_choice == 0) {
  eye_w = 2;
  eye_h = 1;
  grid[dh_eye][le-1] = 'e';
  grid[dh_eye][re+1] = 'e';

  grid[dh_eye][le-2] = '*';
  grid[dh_eye][le+1] = '*';

  grid[dh_eye][re-1] = '*';
  grid[dh_eye][re+2] = '*';

  for (let i=0; i<4; i++) {
    grid[dh_eye+1][le-2+i] = '*';
    grid[dh_eye-1][le-2+i] = '*';
    grid[dh_eye+1][re-1+i] = '*';
    grid[dh_eye-1][re-1+i] = '*';
  }

}
else if (eye_choice ==1 ) {
  eye_w = 1;
  eye_h = 2;
  grid[dh_eye+1][le] = 'e';
  grid[dh_eye+1][re] = 'e';

  grid[dh_eye-1][le] = '*';
  grid[dh_eye+2][le] = '*';

  grid[dh_eye-1][re] = '*';
  grid[dh_eye+2][re] = '*';

  for (let i=0; i<4; i++) {
    grid[dh_eye-1+i][le-1] = '*';
    grid[dh_eye-1+i][le+1] = '*';
    grid[dh_eye-1+i][re-1] = '*';
    grid[dh_eye-1+i][re+1] = '*';
  }

}
else if (eye_choice == 2) {
  eye_w = 1;
  eye_h = 1;

  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      if ((i==1) && (j==1)) { continue; }
      grid[dh_eye-1+i][le-1+j] = '*';
      grid[dh_eye-1+i][re-1+j] = '*';
    }
  }

}

let mid_offset = 1-(w%2);

for (let i=0; i<(h); i++) {
  for (let j=0; j<(w/2); j++) {
    if (grid[i][j] != '.') { continue; }
    if (irnd(2) == 0) {
      grid[i][j] = '*';
      grid[i][w-1-j] = '*';
    }
  }
}


console.log("w:", w, "h:", h,"dh_eye:", dh_eye, "dw_eye:", dw_eye, "le:", le, "re:", re, "eye_choice:", eye_choice);


for (let i=0; i<h; i++) {
  let s = '';
  for (let j=0; j<w; j++) {
    s += grid[i][j];
  }
  console.log(s);
}



