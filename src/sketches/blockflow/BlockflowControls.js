import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Raycaster
} from 'three';
import { Controls } from 'keda/three/Controls';
import { Vector3 } from 'three';

class BlockflowControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.initRaycaster();

		this.cameraRig.speed = this.sketch.settings.cameraRigSpeed;
		this.amplitude = 0.5;
		this.intensity = 0.5;

	}

	initRaycaster() {

		const { settings } = this.sketch;

		this.raycaster = new Raycaster();
		this.hitbox = new Mesh(
			new PlaneGeometry(
				this.sketch.width * settings.hitbox.sizeMultiplier,
				this.sketch.depth * settings.hitbox.sizeMultiplier
			),
			new MeshBasicMaterial( settings.hitbox.material )
		);
		this.hitbox.rotateX( - Math.PI / 2 );
		this.sketch.add( this.hitbox );

		const { size } = settings.cursor;
		this.cursor = new Mesh(
			new BoxGeometry( size, size, size ),
			new MeshBasicMaterial( settings.cursor.material )
		);
		this.sketch.add( this.cursor );
		this.cursor.tracker = new Vector3();

		if ( this.sketch.debug ) return;
		this.hitbox.visible = false;
		this.cursor.visible = false;

	}

	initGUI() {

		const { sketch } = this;
		const { settings } = sketch;
		const { uniforms } = sketch.shader;
		const { passes } = sketch.effects;
		const VALUE = 'value';

		const gui = new Controls.GUI( { title: settings.title.toUpperCase() } );

		const animation = gui.addFolder( 'Animation' );
		animation.add( settings.speed, VALUE, 1, 10 ).name( 'speed' )
			.onFinishChange( () => sketch.setSpeed() );
		animation.add( uniforms.uAmplitude, VALUE, 1, 300 ).name( 'amplitude' );
		animation.add( uniforms.uThickness, VALUE, 0, 4 ).name( 'thickness' );
		animation.add( uniforms.uTurbulence, VALUE, 0, 5 ).name( 'turbulence' );
		animation.add( uniforms.uScale, VALUE, 0, 1 ).name( 'scale' );

		const controls = gui.addFolder( 'Controls' );
		controls.add( this, 'trackerEnabled' ).name( 'cursorTracker' );
		controls.add( this, 'cameraRigEnabled' ).name( 'cameraRig' );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( uniforms.uHighColor, VALUE ).name( 'grid1' );
		colors.addColor( sketch.grid.material, 'color' ).name( 'grid2' );
		colors.add( sketch.grid.material, 'opacity', 0, 1 );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( passes.bloom, 'strength', 0, 1 );
		bloom.add( passes.bloom, 'radius', 0, 1 );
		bloom.add( passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
		this.gui = gui;

	}

	tick( delta ) {

		super.tick( delta );

		if ( ! this.trackerEnabled ) return;

		const { sketch, tracker, cursor, raycaster } = this;
		const { settings } = sketch;
		const { lerp } = Controls;

		// Raycaster

		cursor.tracker.set( tracker.polarizeX, tracker.reversePolarizeY );
		raycaster.setFromCamera( cursor.tracker, sketch.camera );
		const intersection = raycaster.intersectObjects( [ this.hitbox ] )[ 0 ];
		if ( intersection ) cursor.position.lerp(
			intersection.point,
			settings.cursor.lerpSpeed * delta
		);

		// Tracker

		const { uniforms } = sketch.shader;
		const lerpSpeed = settings.lerpSpeed * delta;

		this.amplitude = lerp( this.amplitude, tracker.reverseY, lerpSpeed );

		uniforms.uAmplitude.value = lerp(
			settings.amplitude.min,
			settings.amplitude.max,
			this.amplitude
		);
		sketch.grid.material.opacity = lerp(
			settings.opacity.max,
			settings.opacity.min,
			this.amplitude
		);
		settings.speed.value = lerp(
			settings.speed.min,
			settings.speed.max,
			this.amplitude
		);
		sketch.setSpeed();

		this.intensity = lerp( this.intensity, tracker.x, lerpSpeed );

		uniforms.uScale.value = lerp(
			settings.scale.min,
			settings.scale.max,
			this.intensity
		);
		uniforms.uThickness.value = lerp(
			settings.thickness.max,
			settings.thickness.min,
			this.intensity
		);
		uniforms.uTurbulence.value = lerp(
			settings.turbulence.min,
			settings.turbulence.max,
			this.intensity
		);

		if ( this.gui ) this.gui.controllersRecursive().forEach(
			controller => controller.updateDisplay()
		);

	}

}

export { BlockflowControls };
