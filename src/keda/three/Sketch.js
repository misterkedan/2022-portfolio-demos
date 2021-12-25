import { Random } from 'vesuna';
import { Effects } from './postprocessing/Effects';
import { Stage } from './Stage';

class Sketch {

	constructor( {
		stage,
		background,
		camera,
		cameraStart,
		cameraLookAt,
		random = new Random(),
	} = {} ) {

		if ( ! stage ) stage = new Stage( {
			background, camera, cameraStart, cameraLookAt
		} );
		this.stage = stage;

		if ( random ) this.random = random;

	}

	init( sketchpad ) {

		this.sketchpad = sketchpad;
		this.effects = new Effects( {
			renderer: sketchpad.renderer,
			stage: this.stage
		} );

	}

	dispose() {

		this.stage.dispose();
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
