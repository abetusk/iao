//
// To the extent possible under law, the person who associated CC0 with
// this code has waived all copyright and related or neighboring rights
// to this code.
//
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


// some small explicit test examples to test our bp algorithm
//

function example0(ctx) {
  let dim = [4,3,1];
  let pgr = ctx.init_pgr(dim);

  ctx.grid_cull_boundary(pgr);
  ctx.grid_cull_propagate(pgr);


  ctx.force_tile_gr(pgr, 0, 2, 0, [ 'r000' ]);
  ctx.force_tile_gr(pgr, 0, 1, 0, [ '|000', 'T003' ]);
  ctx.force_tile_gr(pgr, 0, 0, 0, [ 'r003' ]);

  ctx.force_tile_gr(pgr, 1, 2, 0, [ '|001' ]);
  ctx.force_tile_gr(pgr, 1, 1, 0, [ '.000', '|001' ]);
  ctx.force_tile_gr(pgr, 1, 0, 0, [ '|001' ]);

  ctx.force_tile_gr(pgr, 2, 2, 0, [ '|001', 'T000' ]);
  ctx.force_tile_gr(pgr, 2, 1, 0, [ '|000', '|001', '+000', 'T000', 'T001', 'T002', 'T003', 'r000', 'r001', 'r002', 'r003', '.000' ]);
  ctx.force_tile_gr(pgr, 2, 0, 0, [ '|001', 'T002' ]);

  ctx.force_tile_gr(pgr, 3, 2, 0, [ 'r001' ]);
  ctx.force_tile_gr(pgr, 3, 1, 0, [ '|000', 'T001' ]);
  ctx.force_tile_gr(pgr, 3, 0, 0, [ 'r002' ]);

  ctx.grid_cull_propagate(pgr);

  let _eps = (1/(1024*1024));
  let t_idx = 0;
  for (let i=0; i<10; i++) {
    let r = ctx.grid_bp(pgr, t_idx, _eps);
    console.log(">>>", r);
    t_idx = 1-t_idx;
    if (Math.abs(r)<_eps) { break; }
  }


  ctx.debug_print_p(pgr, 1);

  return pgr;
}

function example1(ctx) {
  let dim = [4,3,1];
  let pgr = ctx.init_pgr(dim);

  ctx.grid_cull_boundary(pgr);
  ctx.grid_cull_propagate(pgr);


  ctx.force_tile_gr(pgr, 0, 2, 0, [ 'r000' ]);
  ctx.force_tile_gr(pgr, 0, 1, 0, [ '|000', 'T003' ]);
  ctx.force_tile_gr(pgr, 0, 0, 0, [ 'r003' ]);

  ctx.force_tile_gr(pgr, 1, 2, 0, [ '|001' ]);
  ctx.force_tile_gr(pgr, 1, 1, 0, [ '.000', '|001' ]);
  ctx.force_tile_gr(pgr, 1, 0, 0, [ '|001' ]);

  ctx.force_tile_gr(pgr, 2, 2, 0, [ '|001', 'T000' ]);
  ctx.force_tile_gr(pgr, 2, 1, 0, [ '|000', '|001', '+000', 'T000', 'T001', 'T002', 'T003', 'r000', 'r001', 'r002', 'r003', '.000' ]);
  ctx.force_tile_gr(pgr, 2, 0, 0, [ '|001', 'T002' ]);

  ctx.force_tile_gr(pgr, 3, 2, 0, [ 'r001' ]);
  ctx.force_tile_gr(pgr, 3, 1, 0, [ '|000', 'T001' ]);
  ctx.force_tile_gr(pgr, 3, 0, 0, [ 'r002' ]);

  ctx.grid_cull_propagate(pgr);

  let _eps = (1/(1024*1024));
  let t_idx = 0;
  for (let i=0; i<10; i++) {
    let r = ctx.grid_bp_mat(pgr, t_idx, _eps);
    console.log(">>>", r);
    t_idx = 1-t_idx;
    if (Math.abs(r)<_eps) { break; }
  }

  ctx.debug_print_p(pgr, t_idx);

  return pgr;
}

if (typeof module !== "undefined") {

  module.exports[ "example0" ] = example0;
  module.exports[ "example1" ] = example1;

  /*
  var bpc = require("./script.js");

  var init_pgr = bpc.init_pgr;
  var debugp_print_p = bpc.debug_print_p;
  var grid_cull_boundary = bpc.grid_cull_boundary;
  var grid_cull_propagate = bpc.grid_cull_propagate;

  var grid_bpc = bpc.grid_bpc;
  var gird_bp = bpc.grid_bp;

  var grid_bpc_mat = bpc.grid_bpc_mat;
  var grid_bp_mat = bpc.grid_bp_mat;
  */

}
