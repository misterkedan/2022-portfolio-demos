import { Controls } from 'keda/three/Controls';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.tracker.x = 1;
		this.orientation = 1;
		this.intensity = 0.5;

		const { curl } = sketch.settings;
		this.applyCurlSpeed = function () {

			sketch.curlSpeed.value = curl.speed / ( curl.epsilon * 2 );

		};

	}

	tick( delta ) {

		if ( ! this.trackerEnabled ) return;

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.orientation = lerp( this.orientation, tracker.polarizeX, lerpSpeed );
		this.intensity = lerp( this.intensity, tracker.reverseY, lerpSpeed );

		sketch.wind.value.x = this.orientation * 0.7;
		sketch.wind.value.y = lerp( 0.2, 0.5, this.intensity );
		sketch.wind.value.z = lerp( - 3.5, 3.5, this.intensity );

		this.sketch.settings.speed = lerp( 0.0006, 0.0018, this.intensity );
		sketch.settings.curl.speed = lerp( 0.12, 0.04, this.intensity );
		this.applyCurlSpeed();

	}

}

export { AblazeControls };
