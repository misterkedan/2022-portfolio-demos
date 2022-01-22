import { WebGLRenderer } from 'three';
import { Ticker } from 'keda/Ticker';

class Sketchpad {

	constructor( {
		container = 'sketch',
		width,
		height,
		fps,
		renderer = new WebGLRenderer( {
			powerPreference: 'high-performance',
			antialias: false,
			stencil: false,
			depth: false
		} ),
		debug,
		stats,
	} = {} ) {

		this.renderer = renderer;
		this.canvas = renderer.domElement;
		this.pixelRatio = Math.min( window.devicePixelRatio, 2 );

		if ( typeof container === 'string' )
			container = document.getElementById( container );
		if ( ! container ) container = document.body;
		container.appendChild( this.canvas );
		container.style.touchAction = 'none';

		this.width = ( width > 0 ) ? width : undefined;
		this.height = ( height > 0 ) ? height : undefined;

		this.debug = debug;
		this.fps = ( debug ) ? 0 : fps;
		this.ticker = new Ticker( this.tick.bind( this ), fps );

		if ( stats || debug ) {

			this.stats = new Sketchpad.Stats();
			container.appendChild( this.stats.domElement );

			const updateStats = function () {

				this.stats.update();

			}.bind( this );
			this.ticker.add( updateStats );

		}

	}

	init( sketch = this.sketch ) {

		this.sketch = sketch;
		this.resize();
		this.sketch.init();

		this.onResize = function () {

			this.needsResize = true;

		}.bind( this );
		window.addEventListener( 'resize', this.onResize );

		this.tick( 0, 0 );
		this.ticker.start();

	}

	dispose() {

		this.ticker.stop();
		window.removeEventListener( 'resize', this.onResize );
		window.removeEventListener( 'touchstart', this.onTouchStart );

	}

	resize( width = this.width, height = this.height ) {

		if ( ! width ) width = window.innerWidth;
		if ( ! height ) height = window.innerHeight;

		this.renderer.setPixelRatio( this.pixelRatio );
		this.renderer.setSize( width, height );
		this.sketch.resize( width, height, this.pixelRatio );

		this.wide = width > 1000;

		this.needsResize = false;

	}

	tick( delta, time ) {

		if ( this.needsResize ) this.resize();
		this.renderer.clear();
		this.sketch.tick( delta, time );

	}

}

Sketchpad.Stats = window.Stats; // External

export { Sketchpad };
