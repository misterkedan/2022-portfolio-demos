import { CursorTracker } from './misc/CursorTracker';

class Sketch {

	constructor( sketchpad ) {

		this.sketchpad = sketchpad;
		this.stage = sketchpad.stage;
		this.renderer = sketchpad.renderer;

		this.tracker = new CursorTracker( {
			target: this.renderer.canvas,
			x: CursorTracker.SIGNED,
			y: CursorTracker.SIGNED_INVERT,
			margin:{
				left: 0.1,
				right: 0.1,
			},
		} );
		this.tracker.onChange = this.tracker.log;

	}

	resize( width, height ) {

		this.tracker.resize( width, height );

	}

	tick() {



	}

}

export { Sketch };
