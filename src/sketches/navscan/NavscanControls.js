import { CursorTracker } from 'keda/CursorTracker';
import { Controls } from 'keda/three/Controls';

class NavscanControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.amplitude = 0.5;
		this.intensity = 0.5;

	}

	initTracker() {

		this.tracker = new CursorTracker( { margin: 0.2 } );
		this.trackerEnabled = true;

	}

	tick( delta ) {

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;
		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		if ( this.cameraRigEnabled ) this.cameraRig
			.update( tracker.reversePolarizeX, tracker.y )
			.tick( delta );

		// X

		const targetAmplitude = tracker.x;
		this.amplitude = lerp( this.amplitude, targetAmplitude, lerpSpeed );

		const noiseScale = sketch.noiseScale.value;
		noiseScale.x = lerp(
			settings.noiseScaleX.min,
			settings.noiseScaleX.max,
			this.amplitude
		);

		noiseScale.y = lerp(
			settings.noiseScaleY.min,
			settings.noiseScaleY.max,
			this.amplitude
		);

		sketch.amp.value = lerp(
			settings.amp.min,
			settings.amp.max,
			this.amplitude
		);

		// Y

		const targetIntensity = tracker.reverseY;
		this.intensity = lerp( this.intensity, targetIntensity, lerpSpeed );

		sketch.opacity.value = lerp(
			settings.opacity.min,
			settings.opacity.max,
			this.intensity
		);

		settings.speed.value = lerp(
			settings.speed.min,
			settings.speed.max,
			this.intensity
		);

	}

}

export { NavscanControls };
