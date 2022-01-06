import { Controls } from 'keda/three/Controls';

class NavscanControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.amplitude = 0.5;
		this.intensity = 0.5;

	}

	initGUI() {

		super.initGUI();

		const { gui, sketch } = this;

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.grid.material, 'color' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

	}

	tick( delta ) {

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;
		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		if ( this.cameraRigEnabled ) this.cameraRig
			.update( tracker.reversePolarizeX, tracker.reverseY )
			.tick( delta );

		// X

		const targetAmplitude = tracker.x;
		this.amplitude = lerp( this.amplitude, targetAmplitude, lerpSpeed );

		const noiseScale = sketch.shader.uniforms.uNoiseScale.value;
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

		sketch.shader.uniforms.uAmp.value = lerp(
			settings.amp.min,
			settings.amp.max,
			this.amplitude
		);

		// Y

		const targetIntensity = tracker.y;
		this.intensity = lerp( this.intensity, targetIntensity, lerpSpeed );

		sketch.grid.material.opacity = lerp(
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
