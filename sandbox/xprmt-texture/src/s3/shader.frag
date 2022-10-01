varying vec2 vUv;
uniform sampler2D tex;

varying vec4 v_wpos;

void main() {

  float I;
  vec4 vI;

  //I = max(0.0, min(1.0, (v_wpos[1] + 256.0)/512.0));
  I = max(0.0, min(1.0, (v_wpos[1] + 256.0)/512.0));
  //I = v_wpos[1]/256.0;

  //I = 0.9;

  //vI = vec4(I,1.0,1.0,1.0);
  vI = vec4(I,I,I,1.0);

  gl_FragColor = vI*texture2D(tex, vUv);
}

