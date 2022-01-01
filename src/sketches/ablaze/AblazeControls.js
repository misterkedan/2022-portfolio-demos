import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

		this.tracker.x = 1;
		this.orientation = 1;
		this.intensity = 0.5;

	}

	tick( delta ) {

		if ( ! this.trackerEnabled ) return;

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.orientation = lerp( this.orientation, tracker.polarizeX, lerpSpeed );
		this.intensity = lerp( this.intensity, tracker.reverseY, lerpSpeed );

		this.sketch.wind.x = this.orientation * 0.7;
		this.sketch.wind.y = lerp( 0.2, 0.5, this.intensity );
		this.sketch.wind.z = lerp( - 4, 4, this.intensity );

		this.sketch.curlSpeed.value = lerp( 60, 10, this.intensity );


	}

}

export { AblazeControls };
