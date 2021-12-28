import { Sketch } from 'keda/three/Sketch';
import { NewSketchControls } from './NewSketchControls';
import { NewSketchSettings } from './NewSketchSettings';

class NewSketch extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: NewSketchSettings, settings } );

	}

	init() {

		super.init();

		this.controls = new NewSketchControls( this );

	}

}

export { NewSketch };
