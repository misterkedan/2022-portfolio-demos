
import { Controls } from 'keda/three/Controls';

class RainControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.intensity = 0.5;

		if ( sketch.settings.gui ) this.initGUI();

	}

	initGUI() {

		const { sketch } = this;

		this.gui = new Controls.GUI( { title: sketch.settings.title } );

		const colors = this.gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.mesh.material, 'color' );

		const bloom = this.gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < sketch.settings.guiMinWidth ) this.gui.close();

	}

	initCamera() {

		super.initCamera();

		const { cameraBounds, cameraIntro } = this.sketch.settings;
		this.camera.bounds.set( cameraBounds.x, cameraBounds.y, cameraBounds.z );
		this.camera.set( cameraIntro.x, cameraIntro.y, cameraIntro.z );

	}

	tick() {

		const { lerp } = Controls;
		const { sketch, tracker } = this;
		const {
			intensityLerpSpeed, materialOpacity, bloomStrength,
			speed, minCount, meshLerpSpeed,
		} = sketch.settings;

		// XY
		this.camera.update( tracker.reversePolarizeX, tracker.y );

		// X
		this.targetIntensity = tracker.centerX;
		this.intensity = lerp(
			this.intensity, this.targetIntensity,
			intensityLerpSpeed
		);

		sketch.mesh.material.opacity = lerp(
			materialOpacity.min, materialOpacity.max,
			this.intensity
		);
		sketch.effects.passes.bloom.strength = lerp(
			bloomStrength.min, bloomStrength.max,
			this.intensity
		);
		sketch.speed = lerp(
			speed.min, speed.max,
			this.intensity
		);

		// Y
		this.targetCount = lerp(
			minCount, sketch.maxCount,
			tracker.y
		);
		sketch.mesh.count = Math.round( lerp(
			sketch.mesh.count, this.targetCount,
			meshLerpSpeed
		) );

	}

}

export { RainControls };
