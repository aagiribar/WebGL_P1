// Vertex shader source
const vertexShaderSource = `#version 300 es
      precision mediump float;

      in vec2 aCoordinates;

      void main(void) {
        gl_Position = vec4(aCoordinates, 0, 1);
        gl_PointSize = 10.0;
      }
`;

// Fragment shader source
const fragmentShaderSource = `#version 300 es
        precision mediump float;

        out vec4 fragColor;
        uniform vec4 uColor;

        void main(void) {
          fragColor = uColor;
      }
`;

var gl;
var colorLocation;
var canvas;
var vertex_buffer;

var objects = [];

function init() {
  // ============ STEP 1: Creating a canvas=================
  canvas = document.getElementById("my_Canvas");
  gl = canvas.getContext("webgl2");
  //========== STEP 2: Create and compile shaders ==========

  // Create a vertex shader object
  const vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertexShaderSource);

  // Compile the vertex shader
  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    console.log("vertShader: " + gl.getShaderInfoLog(vertShader));
  }

  // Create fragment shader object
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragmentShaderSource);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.log("fragShader: " + gl.getShaderInfoLog(fragShader));
  }

  // Create a shader program object to store
  // the combined shader program
  const shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  //======== STEP 3: Create buffer objects and associate shaders ========

  // Create an empty buffer object to store the vertex buffer
  vertex_buffer = gl.createBuffer();

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Get the attribute location
  const coordLocation = gl.getAttribLocation(shaderProgram, "aCoordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coordLocation, 2, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coordLocation);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // look up uniform locations
  colorLocation = gl.getUniformLocation(shaderProgram, "uColor");

  createRectangle(-0.2, 0.4, 0.3, 0.4, [0, 0, 1, 1], -0.001);
  createRectangle(0.2, 0.4, 0.3, 0.4, [0, 1, 0, 1], 0.002);
  createRectangle(-0.6, 0.4, 0.3, 0.4, [1, 1, 1, 1], 0.0015);
}

function render() {
  //========= STEP 4: Create the geometry and draw ===============

  // Clear the canvas
  gl.clearColor(0.8, 1.0, 0.5, 1.0);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the view port
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  //var vertices = [-0.5, 0.5, 0.0, 0.5, -0.25, 0.25, 0.5, 0.0];
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Draw geometry
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

  // Unbind the buffer

  for (let rectangle of objects) {
    if (rectangle.y <= -1 || rectangle.y >= 1 - rectangle.height) {
      rectangle.speed *= -1;
      rectangle.color = [Math.random(), Math.random(), Math.random(), 1];
    }

    rectangle.y += rectangle.speed;

    drawRectangle(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
      rectangle.color
    );
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // start animation loop
  window.requestAnimationFrame(render);
}

function drawRectangle(x, y, width, height, color) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  console.log(x, y, width, height, color);

  // Set a random color.
  gl.uniform4fv(colorLocation, color);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createRectangle(x, y, width, height, color, speed) {
  let object = {
    x: x,
    y: y,
    height: height,
    width: width,
    color: color,
    speed: speed,
  };

  objects.push(object);
}

init();
render();
console.log("hello world!");
