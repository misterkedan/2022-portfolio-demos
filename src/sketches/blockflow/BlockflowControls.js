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

		this.raycaster = new Raycaster();
		this.hitbox = new Mesh(
			new PlaneGeometry( 50, 50 ),
			new MeshBasicMaterial( {
				color: 'red',
				opacity: 0.25,
				transparent:true,
			} )
		);
		this.hitbox.rotateX( - Math.PI / 2 );
		sketch.add( this.hitbox );

		const cursorSize = 1;
		this.cursor = new Mesh(
			new BoxGeometry( cursorSize, cursorSize, cursorSize ),
			new MeshBasicMaterial( { color: 'red', wireframe: true } )
		);
		sketch.add( this.cursor );
		this.cursor.tracker = new Vector3();

		this.hitbox.visible = false;
		this.cursor.visible = false;

		this.cameraLerper.speed = 0.00075;
		this.tracker.x = 0.1;
		this.tracker.y = 0.4;

	}

	initGUI() {

		const { sketch } = this;
		const { settings } = sketch;
		const { uniforms } = sketch.shader;
		const { passes } = sketch.effects;
		const VALUE = 'value';

		const gui = new Controls.GUI( { title: settings.title.toUpperCase() } );

		const animation = gui.addFolder( 'Animation' );
		animation.add( settings.speed, VALUE, settings.speed.min, settings.speed.max )
			.name( 'speed' ).onFinishChange( () => sketch.setSpeed() );
		animation.add( uniforms.uAmplitude, VALUE, 1, 300 ).name( 'amplitude' );
		animation.add( uniforms.uThickness, VALUE, 0, 4 ).name( 'thickness' );
		animation.add( uniforms.uTurbulence, VALUE, 0, 5 ).name( 'turbulence' );
		animation.add( uniforms.uScale, VALUE, 0, 1 ).name( 'scale' );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( uniforms.uColor, VALUE ).name( 'grid1' );
		colors.addColor( sketch.grid.material, 'color' ).name( 'grid2' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( passes.bloom, 'strength', 0, 1 );
		bloom.add( passes.bloom, 'radius', 0, 1 );
		bloom.add( passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
		this.gui = gui;

	}

	tick( delta ) {

		super.tick( delta );

		const { tracker, cursor, hitbox, raycaster } = this;
		const { camera } = this.sketch.stage;

		cursor.tracker.set( tracker.polarizeX, tracker.reversePolarizeY );
		this.raycaster.setFromCamera( cursor.tracker, camera );
		const intersection = raycaster.intersectObjects( [ hitbox ] )[ 0 ];
		if ( intersection ) cursor.position.copy( intersection.point );

	}

}

export { BlockflowControls };
