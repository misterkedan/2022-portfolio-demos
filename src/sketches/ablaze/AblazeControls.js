import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

	}

	tick() {

		if ( ! this.trackerEnabled ) return;



		this.sketch.wind.x = this.tracker.polarizeX * 0.5;
		this.sketch.wind.y = 0.3 + this.tracker.reverseY * 0.3;
		this.sketch.wind.z = this.tracker.polarizeY;

	}

}

export { AblazeControls };
