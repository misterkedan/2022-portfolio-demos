import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Controls } from 'keda/three/Controls';

class BlockflowControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.amplitude = 0.5;
		this.intensity = 0.5;

		this.updateProjectorBounds();

		this.trackerEnabled = false;
		this.orbit = new OrbitControls( sketch.camera, sketch.sketchpad.canvas );

	}

	updateProjectorBounds() {

		const { multiplier } = this.sketch.settings.cursorProjector;
		const halfWidth = 0.5 * this.sketch.width * multiplier;
		const halfDepth = 0.5 * this.sketch.depth * multiplier;

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
		const { uniforms } = sketch.material;
		const { passes } = sketch.effects;
		const { VALUE } = Controls;

		const rebuild = () => sketch.rebuild();
		const grid = gui.addFolder( 'Grid' ).onFinishChange( rebuild );
		grid.add( settings.tile, 'countX', 1, 100 ).step( 1 ).name( 'columns' );
		grid.add( settings.tile, 'countZ', 1, 100 ).step( 1 ).name( 'rows' );
		grid.add( settings.tile, 'width', 0.1, 1 ).name( 'tile width' );
		grid.add( settings.tile, 'depth', 0.1, 1 ).name( 'tile depth' );
		grid.add( settings.tile.margin, 'x', 0, 1 ).name( 'margin width' );
		grid.add( settings.tile.margin, 'z', 0, 1 ).name( 'margin depth' );
		grid.add( settings.tile, 'height', 0.01, 0.5 ).name( 'base height' );
		grid.add( sketch.border, 'visible' ).name( 'border' );

		const animation = gui.addFolder( 'Animation' );
		animation.add( settings.speed, VALUE, 1, 10 ).name( 'speed' )
			.onFinishChange( () => sketch.setSpeed() );
		animation.add( uniforms.uAmplitude, VALUE, 1, 300 ).name( 'amplitude' );
		animation.add( uniforms.uThickness, VALUE, 0, 4 ).name( 'thickness' );
		animation.add( uniforms.uTurbulence, VALUE, 0, 5 ).name( 'turbulence' );
		animation.add( uniforms.uScale, VALUE, 0, 1 ).name( 'scale' );
		animation.add( this, 'trackerEnabled' ).name( 'cursorTracker' ).listen();

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background high' );
		colors.addColor( sketch.background, 'color2' ).name( 'background low' );
		colors.addColor( uniforms.uColorHigh, VALUE ).name( 'grid high' );
		colors.addColor( uniforms.uColorLow, VALUE ).name( 'grid low' );
		colors.add( uniforms.opacity, VALUE, 0.1, 1 ).name( 'opacity' );

		const bloom = gui.addFolder( 'Bloom' ).close();
		bloom.add( passes.bloom, 'strength', 0, 1 );
		bloom.add( passes.bloom, 'radius', 0, 1 );
		bloom.add( passes.bloom, 'threshold', 0, 1 );

	}

	tick( delta ) {

		super.tick( delta );

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

		if ( ! this.trackerEnabled ) return;

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

		this.refreshGUI();

	}

}

export { BlockflowControls };
