import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CursorTracker } from 'keda/CursorTracker';
import { Controls } from 'keda/three/Controls';

class NavscanControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.amplitude = 0.5;
		this.intensity = 0.5;

		this.orbit = new OrbitControls( sketch.camera, sketch.sketchpad.canvas );
		this.orbit.enabled = false;

	}

	initTracker() {

		this.tracker = new CursorTracker( { margin: 0.2 } );
		this.trackerEnabled = false;

	}

	initGUI() {

		super.initGUI();

		const { gui, sketch } = this;
		const { settings } = sketch;
		const { VALUE } = Controls;

		const rebuild = () => sketch.rebuild();
		const grid = gui.addFolder( 'Grid' ).onFinishChange( rebuild );
		grid.add( settings.tiles, 'x', 1, 400 ).step( 1 ).name( 'columns' );
		grid.add( settings.tiles, 'z', 10, 400 ).step( 1 ).name( 'rows' );
		grid.add( settings.tiles, 'width', 0.1, 20 );
		grid.add( settings.tiles, 'depth', 0.1, 20 );

		const animation = gui.addFolder( 'Animation' );
		animation.add( sketch.amp, VALUE, 0.1, 5 ).name( 'amplifier' );
		animation.add( sketch.noiseScale.value, 'x', 0.001, 1 ).name( 'noiseScale.x' );
		animation.add( sketch.noiseScale.value, 'y', 0.001, 1 ).name( 'noiseScale.y' );
		animation.add( sketch.noiseScale.value, 'z', 0.001, 1 ).name( 'noiseScale.z' );
		animation.add( this, 'trackerEnabled' ).name( 'cursorTracker' );
		animation.add( this, 'cameraRigEnabled' ).name( 'cameraRig' )
			.onChange( () => this.orbit.enabled = ! ( this.cameraRigEnabled ) );


		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.color, VALUE ).name( 'grid' );

		const bloom = gui.addFolder( 'Bloom' ).close();
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
			.update( tracker.reversePolarizeX, tracker.y )
			.tick( delta );

		if ( ! this.trackerEnabled ) return;

		// X

		const targetAmplitude = tracker.x;
		this.amplitude = lerp( this.amplitude, targetAmplitude, lerpSpeed );

		const noiseScale = sketch.noiseScale.value;
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

		sketch.amp.value = lerp(
			settings.amp.min,
			settings.amp.max,
			this.amplitude
		);

		// Y

		const targetIntensity = tracker.reverseY;
		this.intensity = lerp( this.intensity, targetIntensity, lerpSpeed );

		sketch.opacity.value = lerp(
			settings.opacity.min,
			settings.opacity.max,
			this.intensity
		);

		settings.speed.value = lerp(
			settings.speed.min,
			settings.speed.max,
			this.intensity
		);

		this.refreshGUI();

	}

}

export { NavscanControls };
