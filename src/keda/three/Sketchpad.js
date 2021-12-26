import { WebGLRenderer } from 'three';
import { Ticker } from 'keda/misc/Ticker';

class Sketchpad {

	constructor( {
		container = 'sketch',
		width,
		height,
		fps = 60,
		renderer = new WebGLRenderer( {
			powerPreference: 'high-performance',
			antialias: false,
			stencil: false,
			depth: false
		} ),
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

		this.fps = fps;
		this.onTick = this.tick.bind( this );
		this.ticker = new Ticker( this.onTick, fps );

	}

	init( sketch = this.sketch ) {

		this.sketch = sketch;
		this.resize();
		this.sketch.init();

		this.onResize = function () {

			this.needsResize = true;

		}.bind( this );
		window.addEventListener( 'resize', this.onResize );

		this.onTouchStart = event => event.preventDefault();
		this.canvas.addEventListener( 'touchstart', this.onTouchStart );

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

		this.needsResize = false;

	}

	tick( delta, time ) {

		if ( this.needsResize ) this.resize();
		this.sketch.tick( delta, time );

	}

}

export { Sketchpad };
