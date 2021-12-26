import { Controls } from 'keda/three/Controls';

class HoloscanControls extends Controls {

	initCamera() {

		super.initCamera();

		this.amplitude = 0.5;
		this.intensity = 0.5;

	}

	initGUI() {

		const { sketch } = this;
		const gui = new Controls.GUI( { title: sketch.settings.title } );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.grid.material, 'color' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
		this.gui = gui;

	}

	tick( delta ) {

		const { lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;
		const lerpSpeed = this.sketch.settings.lerpSpeed * delta;

		this.cameraLerper
			.update( tracker.reversePolarizeX, tracker.reverseY )
			.tick( delta );

		// X

		const targetAmplitude = tracker.x;
		this.amplitude = lerp( this.amplitude, targetAmplitude, lerpSpeed );

		const noiseScale = this.sketch.shader.uniforms.uNoiseScale.value;
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

export { HoloscanControls };
