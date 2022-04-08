
if (typeof module !== "undefined") {

function _rnd() {
  return Math.random();
}




// https://stackoverflow.com/a/1968345
// CC-BY-SA Gavin (https://stackoverflow.com/users/78216/gavin)
//
/*
char get_line_intersection(float p0_x, float p0_y, float p1_x, float p1_y, 
    float p2_x, float p2_y, float p3_x, float p3_y, float *i_x, float *i_y)
{
    float s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    float s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        if (i_x != NULL)
            *i_x = p0_x + (t * s1_x);
        if (i_y != NULL)
            *i_y = p0_y + (t * s1_y);
        return 1;
    }

    return 0; // No collision
}
*/

}

function line_intersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
  let ret = false;
  let _eps = Number.EPSILON;

  let s1_x = p1_x - p0_x;
  let s1_y = p1_y - p0_y;
  let s2_x = p3_x - p2_x;
  let s2_y = p3_y - p2_y;

  let d0 = (-s2_x*s1_y + s1_x*s2_y);
  let d1 = (-s2_x*s1_y + s1_x*s2_y);

  if ((Math.abs(d0) < Number.EPSILON) ||
      (Math.abs(d1) < Number.EPSILON)) {
    return { "r": ret, "t":undefined, "s":undefined };
  }
  let t = (-s1_y*(p0_x - p2_x) + s1_x*(p0_y - p2_y)) / (-s2_x*s1_y + s1_x*s2_y);
  let s = ( s2_x*(p0_y - p2_y) - s2_y*(p0_x - p2_x)) / (-s2_x*s1_y + s1_x*s2_y);

  let x = p0_x + s*s1_x;
  let y = p0_y + s*s1_y;

  if ((s>=_eps) && (s<=(1-_eps)) && (t>=_eps) && (t<=(1-_eps))) {
    ret = true;
  }

  return { "r": ret, "s": s, "t": t, "x": x, "y": y };
}

function vec_ang( pa, pb, pc ) {
  let v0 = {"x": pb.x - pa.x, "y":pb.y - pa.y };
  let v1 = {"x": pc.x - pa.x, "y":pc.y - pa.y };

  let a0 = Math.atan2( v0.y, v0.x );
  let a1 = Math.atan2( v1.y, v1.x );

  return a1 - a0;
}

function vec_len(pa,pb) {
  if (typeof pb === "undefined") {
    return Math.sqrt( (pa.x)*(pa.x) + (pa.y)*(pa.y) );
  }
  return Math.sqrt( (pb.x - pa.x)*(pb.x - pa.x) + (pb.y - pa.y)*(pb.y - pa.y) );
}

function vec_add(a,b) {
  return {"x": a.x + b.x, "y": a.y + b.y };
}

function vec_sub(a,b) {
  return {"x": a.x - b.x, "y": a.y - b.y };
}

function vec_mul(v,f) {
  return {"x": f*v.x, "y": f*v.y };
}

function vec_rot(a, theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return {"x": a.x*c + a.y*s, "y": -a.x*s + a.y*c };
}

function vec_norm(a) {
  let l = vec_len(a);
  return {"x":a.x/l, "y":a.y/l};
}

function vec_diff(a,b) {
  return {"x":a.x-b.x, "y":a.y-b.y};
}



function _line_intersect_test() {
  let p0 = [0,0], p1 = [1,0];
  let p2 = [0,1], p3 = [1,1];
  console.log( line_intersect(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]) );

  p0 = [0,0], p1 = [1,1];
  p2 = [0,1], p3 = [1,0];
  console.log( line_intersect(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]) );

  p0 = [-1,-1], p1 = [0,0];
  p2 = [0,1], p3 = [1,0];
  console.log( line_intersect(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]) );

  p0 = [-1,-1], p1 = [0.5,0];
  p2 = [0,1], p3 = [1,0];
  console.log( line_intersect(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]) );
}

function rinth_cut(_lseg, lines) {
  let _debug = false;

  let lseg = [ {"x": _lseg[0].x, "y": _lseg[0].y}, {"x":_lseg[1].x, "y":_lseg[1].y}];

  //let _eps = 1/1024;
  let _eps = Number.EPSILON;

  let max_t = 1.0;

  for (let i=0; i<lines.length; i++) {
    let _r = line_intersect(lseg[0].x, lseg[0].y,
                            lseg[1].x, lseg[1].y,
                            lines[i][0].x, lines[i][0].y,
                            lines[i][1].x, lines[i][1].y);
    if (!_r.r) { continue; }

    if (_debug) {
      console.log("#rinth_cut:", i, JSON.stringify(_r));
    }

    if ((_r.s > _eps) &&
        (_r.s < (1-_eps))) {
      //console.log(i, ">>", lseg, "got:", _r);
      max_t = _r.s;
      lseg[1].x = _r.x;
      lseg[1].y = _r.y;

      if (_debug) {
        console.log("##", max_t, lseg[0].x, lseg[0].y, lseg[1].x, lseg[1].y);
      }
    }

  }

  return lseg;

}

//var _debug = false;

function rinth_create(_opt) {
  opt = ((typeof _opt === "undefined") ? {} : _opt);

  let N = ((typeof opt.N === "undefined") ? 10000 : opt.N);
  let _base_off_ang = ((typeof opt.base_angle === "undefined") ? (Math.PI/2) : (opt.base_angle));
  //let _range_ang = ((typeof opt.range_angle === "undefined") ? (Math.PI/4) : (opt.range_angle));
  //let _range_ang = ((typeof opt.range_angle === "undefined") ? (Math.PI/100) : (opt.range_angle));
  //let _range_ang = ((typeof opt.range_angle === "undefined") ? (Math.PI/24) : (opt.range_angle));
  let _range_ang = ((typeof opt.range_angle === "undefined") ? (Math.PI/100) : (opt.range_angle));
  //let _range_ang = ((typeof opt.range_angle === "undefined") ? (0) : (opt.range_angle));
  let _vec_base_len = ((typeof opt.base_length === "undefined") ? (2) : (opt.base_length));
  //let _vec_base_len = ((typeof opt.base_length === "undefined") ? (80) : (opt.base_length));
  let _vec_range = ((typeof opt.range_length === "undefined") ? (0.5) : (opt.range_length));
  //let _vec_range = ((typeof opt.range_length === "undefined") ? (0.125) : (opt.range_length));
  let _eps = ((typeof opt.epsilon === "undefined") ? (1/(1024*1024)) : (opt.epsilon));
  let _debug = ((typeof opt.debug === "undefined") ? false : (opt.debug));

  let line_seg = ((typeof opt.line_seg === "undefined") ? [] : opt.line_seg);

  let p0 = {"x": _rnd()-1, "y": _rnd()-1 };
  let p1 = {"x": _rnd()+1, "y": _rnd()+1 };

  //let p0 = {"x": _rnd()-_vec_base_len/2, "y": _rnd()-_vec_base_len/2 };
  //let p1 = {"x": _rnd()+_vec_base_len/2, "y": _rnd()+_vec_base_len/2 };

  let max_choice = 3;
  let choice_count = {};

  choice_count[0] = max_choice;

  line_seg.push( [p0, p1] );
  for (let i=1; i<N; i++) {

    choice_count[i] = max_choice;

    let ind = Math.floor(_rnd()*line_seg.length);
    while (choice_count[ind]==0) {
      ind = Math.floor(_rnd()*line_seg.length);
    }
    choice_count[ind]--;

    let _q0 = line_seg[ind][0];
    let _q1 = line_seg[ind][1];
    let tpos = (1-_rnd()/3);

    let _dqlen = vec_len(vec_sub(_q1, _q0));
    if (_dqlen < _eps) { continue; }

    if (_debug) {
      console.log("ok:", ind, _q0, _q1, tpos);
    }

    let _s = vec_add( vec_mul( vec_sub( _q1, _q0 ), tpos), _q0 );

    if (_debug) {
      console.log("q1:", _q1, "q0:", _q0);
      console.log("vec_sub:", vec_sub(_q1, _q0));
      console.log("vec_norm(vec_sub):", vec_norm(vec_sub(_q1, _q0)));
      console.log("vec_rot(vec_norm(vec_sub), pi/2):", vec_rot(vec_norm(vec_sub(_q1, _q0)), Math.PI/2) );
    }

    let _sgn = ((_rnd()<0.5) ? -1 : 1);

    let _ang  = _sgn*_base_off_ang + (_rnd()-0.5)*_range_ang;

    let _vlen = _vec_base_len + (_rnd() - 0.5)*(_vec_range);

    let _dv = vec_rot(vec_mul(vec_norm(vec_sub( _q1, _q0 )), _vlen), _ang);

    if (vec_len(_dv) < _eps) { continue; }

    let _v = vec_add( _s, _dv );

    if (_debug) {
      console.log("  OK::", _s, _v);
      console.log("# cutting line", i);
    }

    let _res_seg = rinth_cut( [_s,_v], line_seg );

    let w = _rnd() + 1
    let a = 0.5*_rnd() ;

    let _candidate_line = [ {"x": _s.x, "y": _s.y, "w": w, "a":a }, { "x": _res_seg[1].x, "y": _res_seg[1].y, "w": w, "a":a} ];

    if (vec_len(vec_sub(_candidate_line[0], _candidate_line[1])) < _eps) { continue; }

    line_seg.push( _candidate_line );
  }
  return line_seg;
}

function print_line(line) {
  for (let i=0; i<line.length; i++) {
    console.log(line[i][0].x, line[i][0].y);
    console.log(line[i][1].x, line[i][1].y);
    console.log("");
  }
}

if (typeof module !== "undefined") {
let _l = rinth_create();
function check_consistency(_l) {
  for (let i=0; i<_l.length; i++) {
    for (let j=(i+1); j<_l.length; j++) {
      let _r = line_intersect( _l[i][0].x, _l[i][0].y, _l[i][1].x, _l[i][1].y,
                               _l[j][0].x, _l[j][0].y, _l[j][1].x, _l[j][1].y);
      if ((_r.r) && 
          ((_r.s > (1/1024)) && (_r.s < (1-1/1024))) &&
          ((_r.t > (1/1024)) && (_r.t < (1-1/1024)))) {
        console.log("## !!", i,j, JSON.stringify(_r));
        console.log("##", JSON.stringify(_l[i]));
        console.log("##", JSON.stringify(_l[j]));
      }
    }
  }
}
print_line(_l);
}
