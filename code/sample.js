/**
 * Copyright (C) 2011 by Paul Lewis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Smiiiile, like you meeeean iiiiit! :)
 */
var AEROTWIST       = AEROTWIST || {};
AEROTWIST.A3        = AEROTWIST.A3 || {};
AEROTWIST.A3.Sample = new function() {

  // internal vars
  var $container    = $('#container'),

      renderer      = null,
      scene         = null,
      camera        = null,
      width         = $container.width(),
      height        = $container.height()-4,
      aspect        = width / height,
      time          = 100,
      attractor     = null,
      callbacks     = null,
      mouseDown     = false,
      lastMouseX    = null,
      lastMouseY    = null,
      explode       = false,
      me            = this,

  // set some constants
      DEPTH            = 900,
      WIDTH            = $container.width(),
      HEIGHT           = $container.height(),
      ASPECT           = WIDTH / HEIGHT,
      NEAR             = 0.1,
      FAR              = 3000,
      VIEW_ANGLE       = 45,
      LORENZ           = 1;
      ROSSLER          = 2;
      CHEN_LEE         = 3;
      QI_CHEN          = 4;
      RAYLEIGH_BENARD  = 5;
      CHEN_CELIKOVSKY  = 6;
      GENESIO_TESI     = 7;
      THOMAS           = 8;
      SAKARYA          = 9;
      HALVORSEN        = 10;
      DADRAS           = 11;

  this.iterations   = 100000;
  this.interval     = 0.005;
  this.fn           = 1;
  this.attractor_params = {
    1: {sigma : 10, rho : 28, beta : 2.67},
    2: {alpha : 0.2, beta : 0.2, zeta : 5.7},
    3: {alpha : 2, beta : -12, delta : -0.54},
    4: {alpha : 38, beta : 2.67, zeta : 80},
    5: {alpha : 9, r : 12, beta : 5},
    6: {alpha : 27, beta : 3, delta : 13},
    7: {alpha : 0.44, beta : 1.1, delta : 1.0},
    8: {beta : 0.19},
    9: {alpha : 0.4, beta : 0.3},
    10: {alpha : 1.4},
    11: {rho : 3, sigma : 2.7, r : 1.7, zeta : 2, epsilon : 9}
  }
  this.attractor    = 'LORENZ';

  /**
   * Initialize the scene
   */
  this.init = function() {

    setup();
    createGUI();
    createObjects();
    addEventListeners();
    render();

  };

  this.update = function() {
    createObjects();
  }

  function createGUI() {

    function updateGUIElements(attractor_id) {
        switch(attractor_id) {
            case 1:
                DEPTH            = 1000;
                VIEW_ANGLE       = 90;
                gui.add(AEROTWIST.A3.Sample.attractor_params[1], 'sigma').name('Sigma').min(1).max(30).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[1], 'rho').name('Rho').min(1).max(100).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[1], 'beta').name('Beta').min(0.01).max(4).step(0.01);
                break;

            case 2:
                DEPTH            = 900;
                VIEW_ANGLE       = 70;
                gui.add(AEROTWIST.A3.Sample.attractor_params[2], 'alpha').name('Alpha').min(0.1).max(1).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[2], 'beta').name('Beta').min(0.1).max(1).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[2], 'zeta').name('Zeta').min(0.1).max(7).step(0.1);
                break;

            case 3:
                DEPTH            = 1400;
                VIEW_ANGLE       = 100;
                gui.add(AEROTWIST.A3.Sample.attractor_params[3], 'alpha').name('Alpha').min(1).max(3).step(0.5);
                gui.add(AEROTWIST.A3.Sample.attractor_params[3], 'beta').name('Beta').min(-20).max(-5).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[3], 'delta').name('Delta').min(-1.0).max(-0.10).step(0.02);
                break;

            case 4:
                gui.add(AEROTWIST.A3.Sample.attractor_params[4], 'alpha').name('Alpha').min(1).max(50).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[4], 'beta').name('Beta').min(0.1).max(1).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[4], 'zeta').name('Zeta').min(0.01).max(4).step(0.01);
                break;

            case 5:
                gui.add(AEROTWIST.A3.Sample.attractor_params[5], 'alpha').name('Alpha').min(1).max(20).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[5], 'r').name('R').min(0).max(20).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[5], 'beta').name('Beta').min(1).max(20).step(1);
                break;

            case 6:
                DEPTH            = 1300;
                VIEW_ANGLE       = 45;
                gui.add(AEROTWIST.A3.Sample.attractor_params[6], 'alpha').name('Alpha').min(20).max(50).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[6], 'beta').name('Beta').min(1.5).max(6.1).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[6], 'delta').name('Delta').min(11).max(20).step(0.5);
                break;

            case 7:
                DEPTH            = 1000;
                VIEW_ANGLE       = 5;
                gui.add(AEROTWIST.A3.Sample.attractor_params[7], 'alpha').name('Alpha').min(0.44).max(0.66).step(0.01);
                gui.add(AEROTWIST.A3.Sample.attractor_params[7], 'beta').name('Beta').min(1.1).max(1.4).step(0.01);
                gui.add(AEROTWIST.A3.Sample.attractor_params[7], 'delta').name('Delta').min(0.4).max(1).step(0.01);
                break;

            case 8:
                gui.add(AEROTWIST.A3.Sample.attractor_params[8], 'beta').name('Beta').min(0.01).max(2).step(0.01);
                break;

            case 9:
                gui.add(AEROTWIST.A3.Sample.attractor_params[9], 'alpha').name('Alpha').min(0.1).max(1).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[9], 'beta').name('Beta').min(0.1).max(1).step(0.1);
                break;

            case 10:
                gui.add(AEROTWIST.A3.Sample.attractor_params[10], 'alpha').name('Alpha').min(0.1).max(3).step(0.1);
                break;

            case 11:
                DEPTH            = 900;
                VIEW_ANGLE       = 45;
                gui.add(AEROTWIST.A3.Sample.attractor_params[11], 'rho').name('Rho').min(1).max(10).step(1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[11], 'sigma').name('Sigma').min(0.1).max(5).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[11], 'r').name('R').min(0.1).max(3).step(0.05);
                gui.add(AEROTWIST.A3.Sample.attractor_params[11], 'zeta').name('Zeta').min(0.1).max(5).step(0.1);
                gui.add(AEROTWIST.A3.Sample.attractor_params[11], 'epsilon').name('Epsilon').min(1).max(20).step(1);
                break;
        }
    }

    var gui = new dat.GUI({height:291,autoPlace: false}),
    $gui  = $('#guidat');
    document.getElementById('my-gui-container').appendChild(gui.domElement);

    $gui.css({
      right: 'auto',
      left: 10
    });

    gui.add(AEROTWIST.A3.Sample, 'attractor', {
        LORENZ: 1,
        ROSSLER: 2,
        CHEN_LEE: 3,
        // QI_CHEN: 4,
        // RAYLEIGH_BENARD: 5,
        CHEN_CELIKOVSKY: 6,
        GENESIO_TESI: 7,
        // THOMAS: 8,
        // SAKARYA: 9,
        // HALVORSEN: 10,
        DADRAS: 11
    }).onChange(function (d) {
        $(".divider-before").nextUntil($(".divider-after")).remove();
        updateGUIElements(parseInt(d,10));
        me.fn = parseInt(d,10);
        var temp =  $(".cr.function").nextAll("li").detach(); //Performs the cut operation
        temp.insertAfter(".divider-before");
    });

    gui.add(AEROTWIST.A3.Sample, 'iterations').name('Iterations').min(10000).max(500000).step(1);
    gui.add(AEROTWIST.A3.Sample, 'interval').name('Interval').min(0.001).max(0.01);

    $(".dg.main ul").append("<li class='divider-before' style='height:1px'></li>");
    updateGUIElements(1);
    $(".dg.main ul").append("<li class='divider-after' style='height:1px'></li>");

    gui.add(AEROTWIST.A3.Sample, 'update').name('Go!');

  }

  /**
   * Sets up the scene, renderer and camera.
   */
  function setup() {
    renderer  = new A3.R(width, height, {clearColor: new A3.V4(0,0,0,1)}),
    scene     = new A3.Scene(),
    camera    = new A3.Camera(VIEW_ANGLE, aspect, NEAR, FAR);

    camera.position.z = DEPTH;

    $container.append(renderer.domElement);
    $container.bind('selectstart', false);
  }
  window.addEventListener('DOMMouseScroll', mousewheel, false);
  window.addEventListener('mousewheel', mousewheel, false);
  function mousewheel(e) {
      if (e.wheelDelta > 0) {
        width      -= 10;
        height     -= 10;
      } else if (width < $container.width() && height < $container.height()) {
        width      += 10;
        height     += 10;
      }
      aspect        = width / height;
    //   console.log(renderer, camera.projectionMatrix.toString())
    //   renderer.resize(width, height);
    //   camera.projectionMatrix.perspective(180, aspect, NEAR, FAR);
    //   renderer.render(scene, camera);
    //   camera.update();
  }
  /**
   * Seriously, read the function name. Take a guess.
   */
  function createObjects() {

    var iterations        = me.iterations,
        vertices          = [],
        colors            = [];

    var x        = 0.1, y = 0.1, z = 0.1,
        // a        = me.a, b = me.b, c = me.c,
        newX     = x, newY = y, newZ = z,
        interval = me.interval,
        minX     = minY = minZ = Number.POSITIVE_INFINITY,
        maxX     = maxY = maxZ = Number.NEGATIVE_INFINITY;

    while(iterations--) {

      switch(me.fn) {

        case 1:
          var a = me.attractor_params[1].sigma,
              b = me.attractor_params[1].rho,
              c = me.attractor_params[1].beta;
          newX = x - (a * x) * interval + (a * y) * interval;
          newY = y + (b * x) * interval - y * interval - (z * x) * interval;
          newZ = z - (c * z) * interval + (x * y) * interval;
          break;
        case 2:
          var a = me.attractor_params[2].alpha,
              b = me.attractor_params[2].beta,
              c = me.attractor_params[2].zeta;
          newX = x - (y * interval) - (z * interval);
          newY = y + (x * interval) + (y * a * interval);
          newZ = z + b * interval + (z * x * interval) - (z * c * interval);
          break;
        case 3:
          var a = me.attractor_params[3].alpha,
              b = me.attractor_params[3].beta,
              c = me.attractor_params[3].delta;
          newX = x + (a * x * interval) - (y * z * interval);
          newY = y + (b * y * interval) + (x * z * interval);
          newZ = z + (c * z * interval) + (x * y / 3 * interval);
          break;
        case 4:
          var a = me.attractor_params[4].alpha,
              b = me.attractor_params[4].beta,
              c = me.attractor_params[4].zeta;
          newX = x + (a * y * interval) - (a * x * interval) + (y * z * interval);
          newY = y + (c * x * interval) + (y * interval) - (x * z * interval);
          newZ = z + (x * y * interval) - (b * z * interval);
          break;
        case 5:
          var a = me.attractor_params[5].alpha,
              b = me.attractor_params[5].r,
              c = me.attractor_params[5].beta;
          newX = x - (a * x * interval) + (a * y * interval);
          newY = y + (b * x * interval) - (y * interval) - (x * z * interval);
          newZ = z + (x * y * interval) - (c * z * interval);
          break;
        case 6:
          var a = me.attractor_params[6].alpha,
              b = me.attractor_params[6].beta,
              c = me.attractor_params[6].delta;
          newX = x + (a * y * interval) - (a * x * interval);
          newY = y - (x * z * interval) + (c * y * interval);
          newZ = z + (x *  y * interval) - (b  * z * interval);
          break;
        case 7:
          var a = me.attractor_params[7].alpha,
              b = me.attractor_params[7].beta,
              c = me.attractor_params[7].delta;
          newX = x + (y * interval);
          newY = y + (z * interval);
          newZ = z - (c * x * interval) - (b * y * interval) - (a * z * interval) + (x * x * interval);
          break;
        case 8:
          var b = me.attractor_params[8].beta;
          newX = x + (b * x * interval) + (Math.sin(y) * interval);
          newY = y - (b * y * interval) + (Math.sin(z) * interval);
          newZ = z - (b * z * interval) + (Math.sin(x) * interval);
          break;
        case 9:
          var a = me.attractor_params[9].alpha,
              b = me.attractor_params[9].beta;
          newX = x - (x * interval) + (y * interval) + (y * z * interval);
          newY = y - (x * interval) - (y * interval) + (a * x * z * interval);
          newZ = z - (z * interval) - (b * x * y * interval);
          break;
        case 10:
          var a = me.attractor_params[10].alpha;
          newX = x - (a * x * interval) - (4 * y * interval) - (4 * z * interval) - (y * y * interval);
          newY = y - (a * y * interval) - (4 * z * interval) - (4 * x * interval) - (z * z * interval);
          newZ = z - (a * z * interval) - (4 * x * interval) - (4 * y * interval) - (x * x * interval);
          break;
        case 11:
          var a = me.attractor_params[11].rho,
              b = me.attractor_params[11].sigma,
              c = me.attractor_params[11].r,
              d = me.attractor_params[11].zeta,
              e = me.attractor_params[11].epsilon;
          newX = x + (y * interval) - (a * x * interval) + (b * y * z * interval);
          newY = y + (c * y * interval) - (x * z * interval) + (z * interval);
          newZ = z + (d * x * y * interval) - (e * z * interval);
          break;
      }

      minX = Math.min(minX, newX);
      minY = Math.min(minY, newY);
      minZ = Math.min(minZ, newZ);

      maxX = Math.max(maxX, newX);
      maxY = Math.max(maxY, newY);
      maxZ = Math.max(maxZ, newZ);

      vertices.push(new A3.Vertex(newX, newY, newZ - b));
      x = newX, y = newY, z = newZ;
    }

    var rangeX = (maxX - minX) * .45;
    var rangeY = (maxY - minY) * .5;
    var rangeZ = (maxZ - minZ);

    for(var v = 0; v < me.iterations; v++) {
      colors.push(
          new A3.V3(Math.pow(0.3, Math.abs(vertices[v].position.x / rangeX)) * .3,
                Math.pow(1, Math.abs(vertices[v].position.y / rangeY)) * .3,
                Math.pow(1, Math.abs((vertices[v].position.z - a)/ rangeZ)) * .3)
      );
    }

    scene.remove(attractor);
    attractor    = null;

    if(!attractor) {

      attractor = new A3.Mesh({
        geometry: new A3.Geometry({
          vertices: vertices,
          colors: colors}),
        shader: A3.ShaderLibrary.get({
          type:"Particle",
          particleSize:16
        }),
        renderType: "Particle",
        depthTest: false,
        blendType: "additive"
      });

      camera.projectionMatrix.perspective(VIEW_ANGLE, ASPECT, NEAR, FAR);
      camera.position.z = DEPTH;

      scene.add(attractor);
    } else {

      attractor.geometry.vertices = vertices;
      attractor.geometry.colors = colors;

      attractor.geometry.updateVertexPositionArray();
      attractor.geometry.updateVertexColorArray();

      // now we have to actually get our hands dirty
      // and update the mesh's buffer size
      attractor.buffers.vertices.size = me.iterations;
      attractor.buffers.colors.size = me.iterations;
    }

    attractor.scale = new A3.V3(30,30,30);
  }

  /**
   * Sets up the event listeners so we
   * can click and drag the cube around
   */
  function addEventListeners() {

    /*
     * Set up the callbacks
     */
    callbacks = {

      /**
       * When the mouse is depressed
       */
      onMouseDown: function(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
      },

      /**
       * When the mouse has cheered up
       */
      onMouseUp: function(event) {
        mouseDown = false;
      },

      /**
       * When the mouse gets his boogie on
       */
      onMouseMove: function(event) {

        if(mouseDown) {
          var thisMouseX = event.clientX;
          var thisMouseY = event.clientY;

          attractor.rotation.x += (thisMouseY - lastMouseY) * 0.01;
          attractor.rotation.y += (thisMouseX - lastMouseX) * 0.01;

          lastMouseY = thisMouseY;
          lastMouseX = thisMouseX;
        }
      },

      onWindowResize: function() {

        width         = $container.width();
        height        = $container.height();
        aspect        = width / height;

        renderer.resize(width, height);
        camera.projectionMatrix.perspective(VIEW_ANGLE, aspect, NEAR, FAR);

      }
    }

    $container.mousedown(callbacks.onMouseDown);
    $container.mouseup(callbacks.onMouseUp);
    $container.mousemove(callbacks.onMouseMove);
    $(window).resize(callbacks.onWindowResize);

  }

  /**
   * Do a render
   */
  function render() {

    requestAnimFrame(render);
    renderer.render(scene, camera);

  }
};

$("#close_modal").click(function () {
    $("#modal").remove();
});

$("#footer").width($("#footer").width()-20)

AEROTWIST.A3.Sample.init();
