import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

		this.tracker.x = 1;

	}

	tick() {

		if ( ! this.trackerEnabled ) return;

		this.sketch.wind.x = this.tracker.polarizeX * 0.7;
		this.sketch.wind.y = 0.2 + this.tracker.reverseY * 0.3;
		this.sketch.wind.z = this.tracker.polarizeY;

	}

}

export { AblazeControls };
