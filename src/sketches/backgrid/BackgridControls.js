import { Controls } from 'keda/three/Controls';

class BackgridControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.intensity = 0;

	}

	tick( delta ) {

		const { sketch, tracker } = this;
		const { settings } = sketch;
		const { lerp } = Controls;

		// CursorProjector

		this.projector.set( tracker.polarizeX, tracker.reversePolarizeY );
		this.projector.tick( delta );

		// Tracker

		const targetIntensity = ( sketch.camera.aspect > 1 )
			? tracker.centerX
			: tracker.centerY
		;

		this.intensity = lerp(
			this.intensity,
			targetIntensity,
			settings.lerpSpeed
		);

		sketch.depth.value = lerp(
			settings.depth.max,
			settings.depth.min,
			this.intensity
		);

		sketch.noiseScale.value = lerp(
			settings.noiseScale.min,
			settings.noiseScale.max,
			Math.pow( this.intensity * 2.0, 2.0 )
		);

	}

}

export { BackgridControls };
