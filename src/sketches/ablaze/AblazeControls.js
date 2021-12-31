import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

	}

	tick( delta ) {

		if ( ! this.trackerEnabled ) return;

		this.sketch.wind.x = this.tracker.polarizeX * 0.2;
		this.sketch.wind.y = 0.1 + this.tracker.reverseY * 0.4;
		this.sketch.wind.z = this.tracker.reversePolarizeY * 0.05;

	}

}

export { AblazeControls };
