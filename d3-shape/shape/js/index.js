function CreateBaseShape(shape, svg) {
    if (shape === 'rect') {
    	return new Rect(svg);
    }
    else if (shape === 'ellipse') {
    	return new Ellipse(svg);
    }
    else if (shape === 'triangle') {
        return new Triangle(svg);
    }
}