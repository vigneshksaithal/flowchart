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
  client.interface
    .trigger('showModal', {
      title: 'Flowchart',
      template: 'index.html',
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function handleErr(err = 'None') {
  console.error(`Error occured. Details:`, err);
}

var canvas = (this.__canvas = new fabric.Canvas('canvas-box'));
var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'hsl(217, 0%, 72%)';
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

function addText() {
  var dimensionText = new fabric.IText('Edit Text', {
    fontFamily: 'Helvetica, sans-serif',
    fontSize: 18,
    fontWeight: 600,
    stroke: '#000',
    strokeWidth: 0,
    fill: '#000',
    padding: 6,
    top: 50,
    left: 50,
  });

  canvas.add(dimensionText);
  canvas.setActiveObject(dimensionText);
}

function addRectangle() {
  let rect = new fabric.Rect({
    fill: '#fff',
    width: 150,
    height: 50,
    stroke: 'black',
    strokeWidth: 1,
    left: 50,
    top: 50,
  });

  canvas.add(rect).setActiveObject(rect);
}

function addCircle() {
  let circle = new fabric.Circle({
    fill: '#fff',
    radius: 50,
    stroke: 'black',
    strokeWidth: 1,
    borderWidth: 5,
    borderRadius: 50,
    objectCaching: false,
    left: 50,
    top: 50,
  });

  canvas.add(circle);
  canvas.setActiveObject(circle);
}

function addTriangle() {
  let circle = new fabric.Triangle({
    fill: '#fff',
    stroke: 'black',
    strokeWidth: 1,
    radius: 50,
    height: 100,
    width: 100,
    borderWidth: 5,
    borderRadius: 50,
    objectCaching: false,
    left: 50,
    top: 50,
  });

  canvas.add(circle);
  canvas.setActiveObject(circle);
}

function addArrow() {
  var triangle = new fabric.Triangle({
    width: 20,
    height: 15,
    fill: 'black',
    left: 235,
    top: 60,
    angle: 90,
  });

  var line = new fabric.Line([50, 100, 200, 100], {
    left: 75,
    top: 70,
    stroke: 'black',
    strokeWidth: 1,
  });

  var objs = [line, triangle];

  var alltogetherObj = new fabric.Group(objs, {
    padding: 20,
    angle: -45,
    left: 50,
    top: 150,
  });
  canvas.add(alltogetherObj).setActiveObject(alltogetherObj);
}
