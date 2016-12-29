// This assumes jquery has already been loaded.

function getCanvas(parent, width, height) {
    var canvasElement = $("<canvas>")
        .attr('width', '' + width + 'px')
        .attr('height', '' + height + 'px')
        .appendTo(parent);
    var canvas = canvasElement.get(0).getContext("2d");
    canvas.center = Vector(width / 2, height / 2);
    return canvas;
}
