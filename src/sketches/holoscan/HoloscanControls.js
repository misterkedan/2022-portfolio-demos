import { Controls } from 'keda/three/Controls';

class HoloscanControls extends Controls {

	initTracker() {

		super.initTracker();

		this.tracker.y = 0.75;
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

	tick() {

		this.camera.update( this.tracker.reversePolarizeX, this.tracker.reverseY );

		const { lerp } = Controls;
		const {
			lerpSpeed, noiseScaleX, noiseScaleY, amp, opacity, speed,
		} = this.sketch.settings;

		this.targetIntensity = this.tracker.x;
		this.intensity = lerp( this.intensity, this.targetIntensity, lerpSpeed );

		const noiseScale = this.sketch.shader.uniforms.uNoiseScale.value;
		noiseScale.x = lerp( noiseScaleX.min, noiseScaleX.max, this.intensity );
		noiseScale.y = lerp( noiseScaleY.min, noiseScaleY.max, this.intensity );

		this.sketch.shader.uniforms.uAmp.value = lerp(
			amp.min, amp.max, this.intensity
		);

		this.sketch.grid.material.opacity = lerp(
			opacity.min, opacity.max, this.tracker.y
		);

		this.sketch.settings.speed.value = lerp(
			speed.min, speed.max, this.tracker.y
		);

	}

}

export { HoloscanControls };
