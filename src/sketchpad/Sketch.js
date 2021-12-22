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

	init( sketchpad ) {

		this.sketchpad = sketchpad;
		this.effects = new PostProcessing( {
			renderer: sketchpad.renderer,
			stage: this.stage
		} );

	}

	dispose() {

		//this.stage.dispose();
		this.effects.dispose();

	}

	resize( width, height, pixelRatio ) {

		this.stage.resize( width, height );
		this.effects?.resize( width, height, pixelRatio );

	}

	tick() {

		this.effects.tick();

	}

	/*-------------------------------------------------------------------------/

		Stage shortcutss

	/-------------------------------------------------------------------------*/

	add( object3D ) {

		this.stage.add( object3D );

	}

	remove( object3D ) {

		this.stage.remove( object3D );

	}

}

export { Sketch };
