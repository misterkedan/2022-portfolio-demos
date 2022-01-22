import { Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Controls } from 'keda/three/Controls';

class RainControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.intensity = 1;

		this.cursorPrevious = new Vector2( 0.5, 0.5 );
		this.cursorCurrent = new Vector2();

		this.orbit = new OrbitControls( sketch.camera, sketch.sketchpad.canvas );
		this.trackerEnabled = false;

	}

	initGUI() {

		super.initGUI();

		const { gui, sketch } = this;
		const { settings } = sketch;
		const { targeted } = settings;

		const matchMaterials = () => {

			sketch.targeted.uniforms.color.value.copy(
				sketch.mesh.material.color
			);

			sketch.targeted.uniforms.opacity.value = sketch.mesh.material.opacity;

		};

		const animation = gui.addFolder( 'Animation' );
		animation.add( this, 'trackerEnabled' ).name( 'cursorTracker' ).listen();
		animation.add( sketch.mesh, 'count', 0, settings.instances )
			.step( 1 ).name( 'density' );
		animation.add( sketch, 'speed', 0.0001, 0.002 );
		animation.add( settings, 'spread', 0.1, 2 )
			.onFinishChange( () => sketch.updateAspect() );

		const cursor = gui.addFolder( 'Cursor Generation' );
		cursor.add( targeted, 'scatter', 0, 1 );
		cursor.add( targeted, 'spread', 0, 10 );
		cursor.add( targeted.delay, 'min', 0, 0.02 ).name( 'spacing' );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.mesh.material, 'color' ).onChange( matchMaterials );
		colors.add( sketch.mesh.material, 'opacity', 0, 1 ).onChange( matchMaterials );

		const bloom = gui.addFolder( 'Bloom' ).close();
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

	}

	tick( delta ) {

		super.tick( delta );

		const { clamp, lerp } = Controls;
		const { sketch, tracker, projector } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		// Random impacts

		if ( this.trackerEnabled ) {

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

		}


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

		if ( this.trackerEnabled ) this.refreshGUI();

	}

}

export { RainControls };
