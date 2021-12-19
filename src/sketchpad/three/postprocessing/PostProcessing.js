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
			render: new RenderPass()
		};

		if ( passes instanceof Pass ) this.passes.sfx = passes;
		else Object.assign( this.passes, passes );

		Object.values( this.passes ).forEach(
			pass => this.composer.addPass( pass )
		);

		if ( stage ) this.stage = stage;

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

	get stage() {

		return this._stage;

	}

	set stage( stage ) {

		this._stage = stage;
		this.passes.render.scene = stage.scene;
		this.passes.render.camera = stage.camera;

	}

}

export { PostProcessing };
