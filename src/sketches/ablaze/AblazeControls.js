import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

	}

}

export { AblazeControls };
