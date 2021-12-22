import { MathUtils, Vector3 } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { CursorTracker } from '../../sketchpad/misc/CursorTracker';
import { CameraLerper } from '../../sketchpad/three/CameraLerper';

class RainSketchControls {

	constructor( sketch, {
		gui = true,
	} = {} ) {

		this.sketch = sketch;

		const { cameraBounds, cameraIntro } = sketch.config;
		this.cameraLerper = new CameraLerper( sketch.stage.camera, {
			bounds: new Vector3( cameraBounds.x, cameraBounds.y, cameraBounds.z ),
		} ).set( cameraIntro.x, cameraIntro.y, cameraIntro.z );

		const { width, height } = sketch.sketchpad;
		this.tracker = new CursorTracker( { width, height } );
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

		if ( window.innerWidth < sketch.config.guiMinWidth ) this.gui.close();

	}

	resize( width, height ) {

		this.tracker.resize( width, height );

	}

	tick() {

		const {
			intensityLerpSpeed, materialOpacity, bloomStrength,
			speed, minCount, meshLerpSpeed,
		} = this.sketch.config;

		// XY
		this.cameraLerper.update( this.tracker.reversePolarizeX, this.tracker.y );

		// X
		this.targetIntensity = this.tracker.centerX;
		this.intensity = MathUtils.lerp(
			this.intensity, this.targetIntensity, intensityLerpSpeed
		);

		this.sketch.mesh.material.opacity = MathUtils.lerp(
			materialOpacity.min, materialOpacity.max, this.intensity
		);
		this.sketch.effects.passes.bloom.strength = MathUtils.lerp(
			bloomStrength.min, bloomStrength.max, this.intensity
		);
		this.sketch.speed = MathUtils.lerp(
			speed.min, speed.max, this.intensity
		);

		// Y
		this.targetCount = MathUtils.lerp(
			minCount, this.sketch.maxCount, this.tracker.y
		);
		this.sketch.mesh.count = Math.round( MathUtils.lerp(
			this.sketch.mesh.count, this.targetCount, meshLerpSpeed
		) );

	}

}

export { RainSketchControls };
