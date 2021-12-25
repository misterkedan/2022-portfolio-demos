import { MathUtils } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { CursorTracker } from 'keda/misc/CursorTracker';
import { CameraLerper } from 'keda/three/misc/CameraLerper';

class Controls {

	constructor( sketch, {
		camera = true,
		tracker = true,
	} = {} ) {

		this.sketch = sketch;
		if ( tracker ) this.initTracker();
		if ( camera ) this.initCamera();
		if ( sketch.settings.gui ) this.initGUI();

	}

	/*-------------------------------------------------------------------------/

		Init

	/-------------------------------------------------------------------------*/

	initTracker() {

		const { width, height } = this.sketch.sketchpad;
		this.tracker = new CursorTracker( { width, height } );

	}

	initCamera() {

		const { settings, stage } = this.sketch;

		const lookAt = settings.cameraLookAt;
		const bounds = settings.cameraBounds;
		const speed = settings.cameraLerpSpeed;
		const intro = settings.cameraIntro;

		this.cameraLerper = new CameraLerper(
			stage.camera, { lookAt, bounds, speed, intro }
		);

	}

	initGUI() {

		this.gui = new GUI();

	}

	/*-------------------------------------------------------------------------/

		Update

	/-------------------------------------------------------------------------*/

	resize( width, height ) {

		this.tracker?.resize( width, height );

	}

	tick( time, delta ) {

		if ( this.tracker && this.cameraLerper ) {

			this.cameraLerper.update(
				this.tracker.reversePolarizeX,
				this.tracker.y
			);
			this.cameraLerper.tick( time, delta );

		}

	}

}

/*-----------------------------------------------------------------------------/

	Static

/-----------------------------------------------------------------------------*/

Controls.GUI = GUI;
Controls.GUI_MINIFY_BREAKPOINT = 1000;
Controls.lerp = MathUtils.lerp;

export { Controls };
