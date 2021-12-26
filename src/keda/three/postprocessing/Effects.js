import { WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

class Effects {

	constructor( {
		renderer,
		stage,
		useRenderTarget = false,
	} = {} ) {

		if ( useRenderTarget ) this.renderTarget = new WebGLRenderTarget();

		this.composer = new EffectComposer( renderer, this.renderTarget );
		this.composer.renderToScreen = ( ! useRenderTarget );

		this.passes = {};
		this.add( 'render', new RenderPass( stage.scene, stage.camera ) );

	}

	add( name, pass ) {

		this.passes[ name ] = pass;
		this.composer.addPass( pass );

	}

	remove( name ) {

		const pass = this.passes[ name ];
		if ( ! pass ) return;

		this.composer.removePass( pass );
		pass?.dispose?.();
		delete this.passes[ name ];

	}

	resize( width, height, pixelRatio ) {

		this.composer.setSize( width, height );

		Object.values( this.passes ).forEach(
			pass => pass?.setSize( width, height, pixelRatio )
		);

	}

	tick() {

		this.composer.render();

	}

	dispose() {

		Object.values( this.passes ).forEach( pass => pass?.dispose?.() );
		Object.values( this ).forEach( property => property?.dispose?.() );

	}

}

export { Effects };
