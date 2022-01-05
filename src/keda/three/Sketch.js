import { Color } from 'three';
import { Random } from 'vesuna';
import { LinearGradient } from './misc/LinearGradient';
import { Effects } from './postprocessing/Effects';
import { Controls } from './Controls';
import { Stage } from './Stage';
import { Sketchpad } from './Sketchpad';

class Sketch {

	constructor( {
		defaults = {},
		settings = {},
		stage,
		background,
		camera,
		random,
	} = {} ) {

		settings = { ...defaults, ...settings };
		this.settings = settings;

		if ( ! stage ) stage = new Stage( { ...settings, background, camera } );
		this.stage = stage;

		const sketchpad = settings.sketchpad || new Sketchpad();
		this.sketchpad = sketchpad;
		this.effects = new Effects( { renderer: sketchpad.renderer, stage } );

		this.random = random || ( settings.random ) ? new Random() : null;

		if ( ! background && settings.background ) this.initBackground();


	}

	initBackground() {

		const { background } = this.settings;

		// Solid color

		const color = ( background instanceof Color )
			? background
			: ( typeof background === 'string' || typeof background === 'number' )
				? new Color( background )
				: false;
		if ( color ) return this.stage.background = color;

		// Linear gradient

		if ( background.color1 && background.color2 ) {

			this.background = new LinearGradient( background );
			this.add( this.background );

		}

	}

	init( ControlClass = Controls ) {

		this.initScene();

		if ( ControlClass ) this.controls = new ControlClass( this );

	}

	initScene() {

		// Build sketch in subclasses

	}

	dispose() {

		this.stage.dispose();
		this.effects.dispose();

	}

	resize( width, height, pixelRatio ) {

		this.stage.resize( width, height );
		this.controls?.resize( width, height );
		this.effects?.resize( width, height, pixelRatio );

	}

	tick( delta, time ) {

		this.controls?.tick( delta, time );
		this.effects.tick( delta, time );

	}

	/*-------------------------------------------------------------------------/

		Stage shortcutss

	/-------------------------------------------------------------------------*/

	add( object3D ) {

		this.stage.add( object3D );

	}

	remove( object3D ) {

		this.stage.remove( object3D );

	}

	/*-------------------------------------------------------------------------/

		Read-only

	/-------------------------------------------------------------------------*/

	get camera() {

		return this.stage.camera;

	}

	get debug() {

		return this.sketchpad.debug;

	}

}

export { Sketch };
