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

		this.sketch.wind.value.x = this.orientation * 0.7;
		this.sketch.wind.value.y = lerp( 0.2, 0.5, this.intensity );
		this.sketch.wind.value.z = lerp( - 3.5, 3.5, this.intensity );

		this.sketch.curlSpeed.value = lerp( 70, 20, this.intensity );
		this.sketch.settings.speed = lerp( 0.0006, 0.0016, this.intensity );

	}

}

export { AblazeControls };
