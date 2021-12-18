import { WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FXAAPass } from './postprocessing/FXAAPass';
import { Stage } from './Stage';

class Renderer {

	constructor( {
		container = 'sketch',
		renderer = new WebGLRenderer( {
			powerPreference: 'high-performance',
			antialias: false,
			stencil: false,
			depth: false
		} ),
		sfx = {
			fxaa: new FXAAPass(),
		},
		stage = new Stage(),
	} = {} ) {

		if ( typeof container === 'string' )
			container = document.getElementById( container );
		if ( ! container ) container = document.body;

		this.renderer = renderer;
		this.canvas = renderer.domElement;
		container.appendChild( this.canvas );

		this.pixelRatio = Math.min( window.devicePixelRatio, 2 );
		renderer.setPixelRatio( this.pixelRatio );

		this.sfx = sfx;

		this.composer = new EffectComposer( renderer );
		this.composer.addPass( new RenderPass( stage.scene, stage.camera ) );
		Object.values( sfx ).forEach( pass => this.composer.addPass( pass ) );

	}

	resize( width = window.innerWidth, height = window.innerHeight ) {

		this.renderer.setSize( width, height );
		this.composer.setSize( width, height );

		Object.values( this.sfx ).forEach( ( pass ) => {

			if ( pass.setSize ) pass.setSize( width, height, this.pixelRatio );

		} );

	}

	tick() {

		this.composer.render();

	}

}

export { Renderer };
