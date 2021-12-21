import { WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FXAAPass } from './FXAAPass';

class PostProcessing {

	constructor( {
		passes = { fxaa: new FXAAPass() },
		renderer,
		stage,
		useRenderTarget = false,
	} = {} ) {

		this.renderTarget = ( useRenderTarget )
			? new WebGLRenderTarget()
			: undefined;

		this.composer = new EffectComposer( renderer, this.renderTarget );

		this.passes = {
			render: new RenderPass( stage.scene, stage.camera )
		};

		if ( passes instanceof Pass ) this.passes.sfx = passes;
		else Object.assign( this.passes, passes );

		Object.values( this.passes ).forEach(
			pass => this.composer.addPass( pass )
		);

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

export { PostProcessing };
