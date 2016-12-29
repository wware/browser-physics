// This assumes jquery has already been loaded.

function getCanvas(parent, width, height) {
    var canvasElement = $(
        "<canvas width='" + width +
        "px' height='" + height + "px'></canvas>"
    ).appendTo(parent);
    var canvas = canvasElement.get(0).getContext("2d");
    canvas.center = Vector(width / 2, height / 2);
    return canvas;
}
