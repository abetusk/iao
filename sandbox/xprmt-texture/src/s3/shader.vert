varying vec2 vUv;

varying vec4 v_wpos;

void main() {
  vUv = uv;

  //v_wpos = modelViewMatrix * vec4(position, 1.0);
  v_wpos = vec4(position, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
