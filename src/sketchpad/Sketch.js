import { PostProcessing } from './three/postprocessing/PostProcessing';
import { Stage } from './three/Stage';

class Sketch {

	constructor( {
		stage,
		background,
		camera,
		cameraStart,
		cameraLookAt,
	} = {} ) {

		if ( ! stage ) stage = new Stage( {
			background, camera, cameraStart, cameraLookAt
		} );
		this.stage = stage;

	}

	init( renderer ) {

		this.effects = new PostProcessing( { renderer, stage: this.stage } );

	}

	resize( width, height, pixelRatio ) {

		this.stage.resize( width, height, pixelRatio );
		this.effects.resize( width, height, pixelRatio );

	}

	tick() {

		this.effects.tick();

	}

}

export { Sketch };
