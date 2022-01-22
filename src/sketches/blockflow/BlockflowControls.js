import { Controls } from 'keda/three/Controls';

class BlockflowControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.amplitude = 0.5;
		this.intensity = 0.5;

		const { multiplier } = this.sketch.settings.cursorProjector;
		const halfWidth = 0.5 * sketch.width * multiplier;
		const halfDepth = 0.5 * sketch.depth * multiplier;

		this.projector.bounds = {
			x: {
				min: - halfWidth,
				max: halfWidth,
			},
			z: {
				min: - halfDepth,
				max: halfDepth
			},
		};

	}

	tick( delta ) {

		super.tick( delta );

		if ( ! this.trackerEnabled ) return;

		const { sketch, tracker, projector } = this;
		const { settings } = sketch;
		const { clamp, lerp } = Controls;

		// CursorProjector

		projector.set( tracker.polarizeX, tracker.reversePolarizeY );
		projector.tick( delta );
		projector.cursor.position.x = clamp(
			projector.cursor.position.x,
			projector.bounds.x.min,
			projector.bounds.x.max,
		);
		projector.cursor.position.z = clamp(
			projector.cursor.position.z,
			projector.bounds.z.min,
			projector.bounds.z.max,
		);

		// Tracker

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.amplitude = lerp( this.amplitude, tracker.reverseY, lerpSpeed );

		sketch.amplitude.value = lerp(
			settings.amplitude.min,
			settings.amplitude.max,
			this.amplitude
		);
		sketch.opacity.value = lerp(
			settings.opacity.max,
			settings.opacity.min,
			this.amplitude
		);
		settings.speed.value = lerp(
			settings.speed.min,
			settings.speed.max,
			this.amplitude
		);
		sketch.setSpeed();

		this.intensity = lerp( this.intensity, tracker.x, lerpSpeed );

		sketch.scale.value = lerp(
			settings.scale.min,
			settings.scale.max,
			this.intensity
		);
		sketch.thickness.value = lerp(
			settings.thickness.max,
			settings.thickness.min,
			this.intensity
		);
		sketch.turbulence.value = lerp(
			settings.turbulence.min,
			settings.turbulence.max,
			this.intensity
		);

	}

}

export { BlockflowControls };
