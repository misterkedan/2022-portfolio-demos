import { Controls } from 'keda/three/Controls';

class RetroControls extends Controls {

	//constructor( sketch ) {

	//	super( sketch );

	//	if ( sketch.settings.gui ) this.initGUI();

	//}

	tick() {

		this.camera.update(
			this.tracker.polarizeX,
			this.tracker.reverseY
		);

	}

}

export { RetroControls };
