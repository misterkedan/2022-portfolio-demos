import { Controls } from 'keda/three/Controls';
import { AblazeShaders } from './AblazeShaders';

class AblazeControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.tracker.x = 1;
		this.orientation = 1;
		this.intensity = 0.5;

		const { curl } = sketch.settings;
		this.applyCurlSpeed = function () {

			sketch.curlSpeed.value = curl.speed / ( curl.epsilon * 2 );

		};

		this.trackerEnabled = false;

	}

	initGUI() {

		super.initGUI();

		const { gui, sketch } = this;
		const { settings, background } = sketch;
		const { passes } = sketch.effects;
		const { uniforms } = AblazeShaders.material;
		const { VALUE } = Controls;

		gui.add( this, 'trackerEnabled' ).name( 'cursorTracker' ).listen();
		gui.add( sketch.core, 'visible' ).name( 'core' );

		const curl = gui.addFolder( 'Curl Noise' );
		curl.add( settings.curl, 'speed', 0.01, 0.5 )
			.onChange( () => this.applyCurlSpeed() );
		curl.add( sketch.curlScale, VALUE, 0.01, 2.0 ).name( 'scale' );
		curl.add( sketch.curlStrength.value, 'x', 0.0, 1.0 ).name( 'strength.x' );
		curl.add( sketch.curlStrength.value, 'y', 0.0, 1.0 ).name( 'strength.y' );
		curl.add( sketch.curlStrength.value, 'z', 0.0, 1.0 ).name( 'strength.z' );

		const wind = gui.addFolder( 'Wind' );
		wind.add( sketch.wind.value, 'x', - 1.5, 1.5 );
		wind.add( sketch.wind.value, 'y', - 1.5, 1.5 );
		wind.add( sketch.wind.value, 'z', - 10, 10 );

		const animation = gui.addFolder( 'Animation' );
		animation.add( settings, 'speed', 0.0001, 0.002 );
		animation.add( uniforms.uRotation, VALUE, 0, 360 ).step( 1 )
			.name( 'rotation' );
		animation.add( uniforms.uScale.value, 'x', 0, 1 ).name( 'scale.top' );
		animation.add( uniforms.uScale.value, 'y', 0, 1 ).name( 'scale.bottom' );
		animation.add( uniforms.uScale.value, 'z', 0, 1 ).name( 'scale.gradient' );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( background, 'color1' ).name( 'background high' );
		colors.addColor( background, 'color2' ).name( 'background low' );
		colors.addColor( uniforms.uColorHigh, VALUE ).name( 'particle high' );
		colors.addColor( uniforms.uColorLow, VALUE ).name( 'particle low' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( passes.bloom, 'strength', 0, 1 );
		bloom.add( passes.bloom, 'radius', 0, 1 );
		bloom.add( passes.bloom, 'threshold', 0, 1 );

	}

	tick( delta ) {

		if ( ! this.trackerEnabled ) return;

		const { clamp, lerp } = Controls;
		const { sketch, tracker } = this;
		const { settings } = sketch;

		const lerpSpeed = clamp( settings.lerpSpeed * delta, 0, 1 );

		this.orientation = lerp( this.orientation, tracker.polarizeX, lerpSpeed );
		this.intensity = lerp( this.intensity, tracker.reverseY, lerpSpeed );

		sketch.wind.value.x = this.orientation * 0.7;
		sketch.wind.value.y = lerp( 0.2, 0.5, this.intensity );
		sketch.wind.value.z = lerp( - 3.5, 3.5, this.intensity );

		this.sketch.settings.speed = lerp( 0.0006, 0.0018, this.intensity );
		sketch.settings.curl.speed = lerp( 0.12, 0.04, this.intensity );
		this.applyCurlSpeed();

		this.refreshGUI();

	}

}

export { AblazeControls };
