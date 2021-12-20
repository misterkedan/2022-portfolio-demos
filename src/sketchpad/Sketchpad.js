import { WebGLRenderer } from 'three';
import { Ticker } from './misc/Ticker';

class Sketchpad {

	constructor( {
		container = 'sketch',
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

		this.needsResize = true;

		this.fps = fps;
		this.onTick = this.tick.bind( this );
		this.ticker = new Ticker( this.onTick, fps );

	}

	init( sketch ) {

		this.sketch = sketch;
		this.sketch.init( this.renderer );

		this.onResize = function () {

			this.needsResize = true;

		}.bind( this );
		window.addEventListener( 'resize', this.onResize );

		this.ticker.start();

	}

	dispose() {

		this.ticker.stop();
		window.removeEventListener( 'resize', this.onResize );

	}

	resize( width = window.innerWidth, height = window.innerHeight ) {

		this.renderer.setPixelRatio( this.pixelRatio );
		this.renderer.setSize( width, height );
		this.sketch.resize( width, height, this.pixelRatio );
		this.needsResize = false;

	}

	tick( time, delta ) {

		if ( this.needsResize ) this.resize();
		this.sketch.tick( time, delta );

	}

}

export { Sketchpad };
