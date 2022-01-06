import { MathUtils } from 'three';
import { CursorTracker } from 'keda/CursorTracker';
import { CameraRig } from 'keda/three/misc/CameraRig';
import { CursorProjector } from 'keda/three/misc/CursorProjector';

class Controls {

	constructor( sketch ) {

		this.sketch = sketch;

		if ( sketch.settings.cursorTracker !== false ) this.initTracker();
		if ( sketch.settings.cursorProjector ) this.initProjector();
		if ( sketch.settings.cameraRig ) this.initCameraRig();
		if ( sketch.settings.gui ) this.initGUI();

	}

	/*-------------------------------------------------------------------------/

		Init

	/-------------------------------------------------------------------------*/

	initTracker() {

		this.tracker = new CursorTracker();
		this.trackerEnabled = true;

	}

	initProjector() {

		this.projector = new CursorProjector(
			this.sketch,
			this.sketch.settings.cursorProjector
		);
		this.cursor = this.projector.cursor;

	}

	initCameraRig() {

		const { settings } = this.sketch;

		const lookAt = settings.camera.lookAt;
		const bounds = settings.cameraRig.bounds;
		const speed = settings.cameraRig.speed;
		const intro = settings.cameraRig.intro;

		this.cameraRig = new CameraRig(
			this.sketch.camera,
			{ lookAt, bounds, speed, intro }
		);
		this.cameraRigEnabled = true;

	}

	initGUI() {

		this.gui = new Controls.GUI();
		this.gui.title( this.sketch.name.toUpperCase() );
		this.autoCloseGUI();

	}

	/*-------------------------------------------------------------------------/

		Update

	/-------------------------------------------------------------------------*/

	autoCloseGUI() {

		if ( ! this.gui ) return;
		if ( ! this.sketch.sketchpad.wide ) this.gui.close();

	}

	refreshGUI() {

		if ( ! this.gui || this.gui._closed ) return;

		this.gui.controllersRecursive().forEach(
			controller => controller.updateDisplay()
		);

	}

	resize( width, height ) {

		this.tracker?.resize( width, height );
		this.autoCloseGUI();

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

Controls.GUI = window.GUI; // External
Controls.VALUE = 'value';
Controls.clamp = MathUtils.clamp;
Controls.lerp = MathUtils.lerp;

export { Controls };
