class Sketch {

	constructor( sketchpad ) {

		this.sketchpad = sketchpad;
		this.stage = sketchpad.stage;
		this.renderer = sketchpad.renderer;

	}

	tick() {

		// Override in subclasses

	}

	resize() {

		// Override in subclasses

	}

}

export { Sketch };
