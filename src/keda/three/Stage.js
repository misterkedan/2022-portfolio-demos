import { Camera, PerspectiveCamera, Scene } from 'three';

class Stage {

	constructor( {
		background,
		camera
	} = {} ) {

		this.scene = new Scene();

		if ( background ) this.scene.background = background;

		if ( ! camera ) camera = new PerspectiveCamera();
		else if ( camera instanceof Camera === false ) {

			const start = camera.start;
			const lookAt = camera.lookAt;

			camera = new PerspectiveCamera(
				camera.fov,
				camera.aspect,
				camera.near,
				camera.far
			);

			if ( start ) camera.position.set( start.x, start.y, start.z );
			if ( lookAt ) camera.lookAt( lookAt.x, lookAt.y, lookAt.z );

		}

		this.camera = camera;

	}

	add( object3D ) {

		this.scene.add( object3D );

	}

	remove( object3D ) {

		this.scene.remove( object3D );

	}

	resize( width, height ) {

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

	}

}

export { Stage };
