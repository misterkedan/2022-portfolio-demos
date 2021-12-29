import { PerspectiveCamera, Scene } from 'three';

class Stage {

	constructor( {
		background,
		camera = new PerspectiveCamera(),
		cameraNear = 0.1,
		cameraFar = 1000,
		cameraFov = 50,
		cameraStart = { x: 10, y: 10, z: 10 },
		cameraLookAt = { x: 0, y: 0, z: 0 },
	} = {} ) {

		this.scene = new Scene();

		if ( background ) this.scene.background = background;

		camera.near = cameraNear;
		camera.far = cameraFar;
		camera.fov = cameraFov;
		if ( cameraStart ) camera.position.set( cameraStart.x, cameraStart.y, cameraStart.z );
		if ( cameraLookAt ) camera.lookAt( cameraLookAt.x, cameraLookAt.y, cameraLookAt.z );
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
