varying vec3 vNormal;
uniform vec3 uLightDirection;

void main() {
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
