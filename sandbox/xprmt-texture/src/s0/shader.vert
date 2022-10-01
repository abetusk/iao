//Here's the space for variables

//The built-in main function
void main() {
  //Every vertex shader must eventually set 'gl_Position'
  //And in this case, we multiply the vertex position with the camera view and screen matrix to get the final output.
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}
