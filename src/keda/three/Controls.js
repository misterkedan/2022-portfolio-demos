import { MathUtils } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { CursorTracker } from 'keda/misc/CursorTracker';
import { CameraLerper } from 'keda/three/utils/CameraLerper';

class Controls {

	constructor( sketch, {
		camera = true,
		tracker = true,
	} = {} ) {

		this.sketch = sketch;

		if ( tracker ) this.initTracker();
		if ( camera ) this.initCamera();

	}

	/*-------------------------------------------------------------------------/

		Init

	/-------------------------------------------------------------------------*/

	initTracker() {

		const { width, height } = this.sketch.sketchpad;
		this.tracker = new CursorTracker( { width, height } );

	}

	initCamera() {

		this.camera = new CameraLerper( this.sketch.stage.camera );

	}

	/*-------------------------------------------------------------------------/

		Update

	/-------------------------------------------------------------------------*/

	resize( width, height ) {

		this.tracker?.resize( width, height );

	}

	tick() {

		// Override

	}

}

/*-----------------------------------------------------------------------------/

	Static

/-----------------------------------------------------------------------------*/

Controls.GUI = GUI;
Controls.lerp = MathUtils.lerp;

export { Controls };
