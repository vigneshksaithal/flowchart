document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit
      .then(function getClient(_client) {
        window.client = _client;
        client.events.on('app.activated', onActivate);
      })
      .catch(handleErr);
  }
};

function onActivate() {
  getCanvas();

  client.interface
    .trigger('showModal', {
      title: 'Draw it',
      template: 'index.html',
    })
    .then(function (data) {
      // data - success message
      alert(`success `);
      getCanvas();
    })
    .catch(function (error) {
      // error - error object
      alert(`success `);

      alert(`error: ${error.message}`);
    });
}

function handleErr(err = 'None') {
  console.error(`Error occured. Details:`, err);
}

function saveCanvas() {
  var JSONcanvas = JSON.stringify(canvas);
  client.db.set('canvas', { jc: JSONcanvas }).then(
    function (data) {
      alert('suc');
      // success operation
      // "data" value is { "Created" : true }
    },
    function (error) {
      // failure operation
      console.log(error);
    }
  );
}

var canvas = (this.__canvas = new fabric.Canvas('canvas-box'));
var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetY: 16,
  cursorStyle: 'pointer',
  mouseUpHandler: deleteObject,
  render: renderIcon,
  cornerSize: 20,
});

function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Double-click event handler
var fabricDblClick = function (obj, handler) {
  return function () {
    if (obj.clicked) handler(obj);
    else {
      obj.clicked = true;
      setTimeout(function () {
        obj.clicked = false;
      }, 500);
    }
  };
};

// ungroup objects in group
var items;
var ungroup = function (group) {
  items = group._objects;
  group._restoreObjectsState();
  canvas.remove(group);
  canvas.renderAll();
  for (var i = 0; i < items.length; i++) {
    canvas.add(items[i]);
  }
  // if you have disabled render on addition
  canvas.renderAll();
};

// Re-group when text editing finishes
var dimensionText = new fabric.IText('Edit Text', {
  fontFamily: 'Helvetica, sans-serif',
  fontSize: 16,
  fontWeight: 600,
  stroke: '#000',
  strokeWidth: 0,
  fill: '#000',
  originX: 'center',
  originY: 'center',
});
dimensionText.on('editing:exited', function () {
  for (var i = 0; i < items.length; i++) {
    canvas.remove(items[i]);
  }
  var grp = new fabric.Group(items, {});
  canvas.add(grp);
  grp.on(
    'mousedown',
    fabricDblClick(grp, function (obj) {
      ungroup(grp);
      canvas.setActiveObject(dimensionText);
      dimensionText.enterEditing();
      dimensionText.selectAll();
    })
  );
});

function addTextBox() {
  var rectangle = new fabric.Rect({
    fill: 'hsl(192, 96%, 70%)',
    width: 160,
    height: 60,
    borderWidth: 5,
    borderRadius: 50,
    objectCaching: false,
    originX: 'center',
    originY: 'center',
  });

  var dimension_group = new fabric.Group([rectangle, dimensionText], {
    left: 80,
    top: 40,
  });
  canvas.add(dimension_group);
  canvas.setActiveObject(dimension_group);

  dimension_group.on(
    'mousedown',
    fabricDblClick(dimension_group, function (obj) {
      ungroup(dimension_group);
      canvas.setActiveObject(dimensionText);
      dimensionText.enterEditing();
      dimensionText.selectAll();
      canvas.renderAll();
    })
  );
}
addTextBox();

function addTextBox2() {
  var dimensionText = new fabric.IText('Edit Text', {
    fontFamily: 'Helvetica, sans-serif',
    fontSize: 18,
    fontWeight: 600,
    stroke: '#000',
    strokeWidth: 0,
    fill: '#000',
    backgroundColor: 'hsl(192, 96%, 70%)',
    padding: 8,
    top: 50,
    left: 50,
  });

  canvas.add(dimensionText);
  canvas.setActiveObject(dimensionText);
}

addTextBox2();

function loadCanvas(c) {
  alert('loadfromcan', c);
  canvas.loadFromJSON(c);
}

function getCanvas() {
  var JSONCanvas;
  client.db.get('canvas').then(
    function (data) {
      alert('success db' + data.jc);
      JSONCanvas = data.jc;
      const canvas = new fabric.Canvas('canvas-box2');

      canvas.loadFromJSON(data.jc);

      alert(data.jc);
    },
    function (error) {
      // failure operation
      console.log(error);
      alert('error');
    }
  );
}
