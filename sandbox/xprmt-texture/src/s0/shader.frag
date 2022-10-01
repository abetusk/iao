//Again, space for variables

void main() {
  //Just as vertex shader, fragment shader must in the end set this variable (gl_FragColor)
  //We set it to a pink color.
  gl_FragColor = vec4(1.0,  // R
                      0.0,  // G
                      1.0,  // B
                      1.0); // A
}
