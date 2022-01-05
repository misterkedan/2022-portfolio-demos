import { Controls } from 'keda/three/Controls';

class RainControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.intensity = 0.5;

	}

	initGUI() {

		const { sketch } = this;

		const gui = new Controls.GUI();

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.mesh.material, 'color' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

		this.gui = gui;

	}

	initCamera() {

		super.initCamera();

		const { cameraBounds, cameraIntro } = this.sketch.settings;
		this.cameraRig.bounds.set( cameraBounds.x, cameraBounds.y, cameraBounds.z );
		this.cameraRig.set( cameraIntro.x, cameraIntro.y, cameraIntro.z );

	}

	tick( delta ) {

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.cameraRig
			.update( tracker.reversePolarizeX, tracker.y )
			.tick( delta );

		// X

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
		sketch.effects.passes.bloom.strength = lerp(
			settings.bloomStrength.min,
			settings.bloomStrength.max,
			this.intensity
		);
		sketch.speed = lerp(
			settings.speed.min,
			settings.speed.max,
			this.intensity
		);

		// Y

		const targetCount = lerp(
			settings.minCount,
			sketch.maxCount,
			tracker.y
		);
		sketch.mesh.count = lerp( sketch.mesh.count, targetCount, lerpSpeed );

	}

}

export { RainControls };
