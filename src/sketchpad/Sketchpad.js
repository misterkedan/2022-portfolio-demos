import { Ticker } from './misc/Ticker';
import { Renderer } from './three/Renderer';
import { Stage } from './three/Stage';

class Sketchpad {

	constructor( {
		fps = 60,
		// Stage
		background, camera, cameraStart, cameraLookAt,
		// Renderer
		container, renderer, sfx, stage,
	} = {} ) {

		if ( ! stage ) stage = new Stage( {
			background, camera, cameraStart, cameraLookAt
		} );
		this.stage = stage;
		this.renderer = new Renderer( { container, renderer, sfx, stage } );

		this.needsResize = true;

		this.fps = fps;
		this.onTick = this.tick.bind( this );
		this.ticker = new Ticker( this.onTick, fps );

	}

	init( sketch ) {

		this.sketch = sketch;

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

		this.stage.resize( width, height );
		this.sketch.resize( width, height );
		this.renderer.resize( width, height );
		this.needsResize = false;

	}

	tick( time, delta ) {

		if ( this.needsResize ) this.resize();
		this.sketch.tick( time, delta );
		this.renderer.tick( time, delta );

	}

}

export { Sketchpad };
