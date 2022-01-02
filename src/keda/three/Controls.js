import { MathUtils } from 'three';
import { GUI } from 'lil-gui';
import { CursorTracker } from 'keda/misc/CursorTracker';
import { CameraRig } from 'keda/three/misc/CameraRig';

class Controls {

	constructor( sketch, {
		cameraRig = true,
		tracker = true,
	} = {} ) {

		this.sketch = sketch;
		if ( tracker ) this.initTracker();
		if ( cameraRig ) this.initCamera();
		if ( sketch.settings.gui ) this.initGUI();

	}

	/*-------------------------------------------------------------------------/

		Init

	/-------------------------------------------------------------------------*/

	initTracker() {

		this.tracker = new CursorTracker();
		this.trackerEnabled = true;

	}

	initCamera() {

		const { settings, stage } = this.sketch;

		const lookAt = settings.cameraLookAt;
		const bounds = settings.cameraBounds;
		const speed = settings.cameraLerpSpeed;
		const intro = settings.cameraIntro;

		this.cameraRig = new CameraRig(
			stage.camera,
			{ lookAt, bounds, speed, intro }
		);
		this.cameraRigEnabled = true;

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

	tick( delta ) {

		if ( this.cameraRigEnabled ) this.cameraRig
			.update( this.tracker.reversePolarizeX, this.tracker.y )
			.tick( delta );

	}

}

/*-----------------------------------------------------------------------------/

	Static

/-----------------------------------------------------------------------------*/

Controls.GUI = GUI;
Controls.GUI_MINIFY_BREAKPOINT = 1000;
Controls.clamp = MathUtils.clamp;
Controls.lerp = MathUtils.lerp;

export { Controls };
