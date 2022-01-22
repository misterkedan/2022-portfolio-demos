import { Vector2 } from 'three';
import { Controls } from 'keda/three/Controls';

class RainControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.intensity = 1;

		this.cursorPrevious = new Vector2( 0.5, 0.5 );
		this.cursorCurrent = new Vector2();

	}

	tick( delta ) {

		super.tick( delta );

		if ( ! this.trackerEnabled ) return;

		const { clamp, lerp } = Controls;
		const { sketch, tracker, projector } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		// Random impacts

		const targetIntensity = tracker.centerX;
		this.intensity = lerp(
			this.intensity,
			targetIntensity,
			lerpSpeed
		);

		sketch.mesh.material.opacity = lerp(
			settings.opacity.min,
			settings.opacity.max,
			this.intensity
		);

		sketch.speed = lerp(
			settings.speed.min,
			settings.speed.max,
			this.intensity
		);

		const targetCount = lerp(
			settings.minCount,
			sketch.maxCount,
			tracker.centerY
		);
		sketch.mesh.count = lerp( sketch.mesh.count, targetCount, lerpSpeed );

		// Targeted impacts

		const {
			delay, growth, decay,
		} = settings.targeted;

		sketch.targeted.uniforms.opacity.value = sketch.mesh.material.opacity;

		projector.set( tracker.polarizeX, tracker.reversePolarizeY );
		projector.tick( delta );

		this.cursorCurrent.set( tracker.x, tracker.y );
		const cursorMotion =  this.cursorCurrent.distanceTo( this.cursorPrevious );
		this.cursorPrevious.copy( this.cursorCurrent );

		sketch.activity = clamp(
			sketch.activity + cursorMotion * growth - decay * delta,
			0,
			1
		);

		sketch.baseDelay = Math.max(
			delay.max - sketch.activity * delay.max,
			delay.min
		);

		sketch.delay = delay.min + sketch.baseDelay;

		//sketch.delay = delay.min
		//	+ ( 0.5 + sketch.noise * 0.5 ) * sketch.baseDelay
		//	* ( 0.5 + tracker.reverseCenterY * 0.5 );

	}

}

export { RainControls };
