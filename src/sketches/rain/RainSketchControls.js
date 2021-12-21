import { MathUtils, Vector3 } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { CursorTracker } from '../../sketchpad/misc/CursorTracker';
import { CameraLerper } from '../../sketchpad/three/CameraLerper';

class RainSketchControls {

	constructor( sketch, {
		gui = true,
	} = {} ) {

		this.sketch = sketch;

		this.cameraLerper = new CameraLerper( sketch.stage.camera, {
			bounds: new Vector3( 3, 10, 0 ),
		} );
		this.cameraLerper.camera.position.setY( 5 );

		this.tracker = new CursorTracker( {
			y: CursorTracker.NORMALIZE,
			margin:{
				top: 0.1, right: 0.1, bottom: 0.1, left: 0.1
			}
		} );
		this.intensity = 0.5;

		if ( gui ) this.buildGUI();

	}

	buildGUI() {

		const { sketch } = this;

		this.gui = new GUI( { title: 'Rain II' } );

		const colors = this.gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.mesh.material, 'color' );

		const bloom = this.gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < 1000 ) this.gui.close();

	}

	tick() {

		// XY
		this.cameraLerper.update( 1 - 2 * this.tracker.x, this.tracker.y );

		// X
		this.targetIntensity = 1 - Math.abs( this.tracker.x - 0.5 ) * 2;
		this.intensity = MathUtils.lerp(
			this.intensity, this.targetIntensity, 0.03
		);

		this.sketch.mesh.material.opacity = MathUtils.lerp(
			0.6, 1, this.intensity
		);
		this.sketch.effects.passes.bloom.strength = MathUtils.lerp(
			0.3, 0.8, this.intensity
		);
		this.sketch.speed = MathUtils.lerp(
			0.003, 0.008, this.intensity
		);

		// Y
		this.targetCount = MathUtils.lerp(
			40, this.sketch.maxCount, this.tracker.y
		);
		this.sketch.mesh.count = Math.round( MathUtils.lerp(
			this.sketch.mesh.count, this.targetCount, 0.015
		) );

	}

}

export { RainSketchControls };
