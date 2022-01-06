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

	initGUI() {

		super.initGUI();

		const { gui, sketch } = this;
		const { settings } = sketch;
		const { uniforms } = sketch.shader;
		const { passes } = sketch.effects;
		const { VALUE } = Controls;

		const animation = gui.addFolder( 'Animation' );
		animation.add( settings.speed, VALUE, 1, 10 ).name( 'speed' )
			.onFinishChange( () => sketch.setSpeed() );
		animation.add( uniforms.uAmplitude, VALUE, 1, 300 ).name( 'amplitude' );
		animation.add( uniforms.uThickness, VALUE, 0, 4 ).name( 'thickness' );
		animation.add( uniforms.uTurbulence, VALUE, 0, 5 ).name( 'turbulence' );
		animation.add( uniforms.uScale, VALUE, 0, 1 ).name( 'scale' );

		const controls = gui.addFolder( 'Controls' );
		controls.add( this, 'trackerEnabled' ).name( 'cursorTracker' );
		controls.add( this, 'cameraRigEnabled' ).name( 'cameraRig' );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( uniforms.uHighColor, VALUE ).name( 'grid1' );
		colors.addColor( sketch.grid.material, 'color' ).name( 'grid2' );
		colors.add( sketch.grid.material, 'opacity', 0, 1 );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( passes.bloom, 'strength', 0, 1 );
		bloom.add( passes.bloom, 'radius', 0, 1 );
		bloom.add( passes.bloom, 'threshold', 0, 1 );

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

		const { uniforms } = sketch.shader;
		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.amplitude = lerp( this.amplitude, tracker.reverseY, lerpSpeed );

		uniforms.uAmplitude.value = lerp(
			settings.amplitude.min,
			settings.amplitude.max,
			this.amplitude
		);
		sketch.grid.material.opacity = lerp(
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

		uniforms.uScale.value = lerp(
			settings.scale.min,
			settings.scale.max,
			this.intensity
		);
		uniforms.uThickness.value = lerp(
			settings.thickness.max,
			settings.thickness.min,
			this.intensity
		);
		uniforms.uTurbulence.value = lerp(
			settings.turbulence.min,
			settings.turbulence.max,
			this.intensity
		);

		this.refreshGUI();

	}

}

export { BlockflowControls };
