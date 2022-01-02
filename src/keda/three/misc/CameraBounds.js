import { Vector3 } from 'three';

class CameraBounds {

	constructor( camera, near, far ) {

		if ( ! far ) far = near;

		this.camera = camera;
		this.near = near;
		this.far = far;
		this.depth = Math.abs( far - near );

		this.x = new Vector3();
		this.y = new Vector3();
		this.z = new Vector3();

	}

	update() {

		const height = this.getVisibleHeight( this.far );
		const width = height * this.camera.aspect;

		this.height = height;
		this.width = width;
		this.left = - width * 0.5;
		this.right = width * 0.5;
		this.top = height * 0.5;
		this.bottom = - height * 0.5;

		this.x.set( this.left, this.right, this.width );
		this.y.set( this.bottom, this.top, this.height );
		this.z.set( this.far, this.near, this.depth );

		this.needsUpdate = false;

	}

	getVisibleHeight( z ) {

		return CameraBounds.getVisibleHeight( this.camera, z );

	}

	getVisibleWidth( z ) {

		return CameraBounds.getVisibleWidth( this.camera, z );

	}

}

// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269

CameraBounds.getVisibleHeight = ( camera, z ) => {

	const cameraZ = camera.position.z;
	if ( z === undefined ) z = cameraZ;

	const offset = ( z < cameraZ ) ? - cameraZ : cameraZ;
	z += offset;

	const verticalFOV = camera.fov * Math.PI / 180;
	return 2 * Math.tan( verticalFOV / 2 ) * Math.abs( z );

};

CameraBounds.getVisibleWidth = ( camera, z ) => {

	return CameraBounds.getVisibleHeight( camera, z ) * camera.aspect;

};

export { CameraBounds };
