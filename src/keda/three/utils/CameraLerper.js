import { Vector3 } from 'three';

class CameraLerper {

	constructor( camera, {
		lookAt = { x: 0, y: 0, z: 0 },
		bounds = { x: 5, y: 5, z: 0 },
		speed = 0.02,
	} = {} ) {

		this.camera = camera;

		this.lookAt = new Vector3( lookAt.x, lookAt.y, lookAt.z );
		this.bounds = new Vector3( bounds.x, bounds.y, bounds.z );
		this.speed = speed;

		this.target = new Vector3();
		this.origin = new Vector3().copy( camera.position );

		return this;

	}

	set( x = 0, y = 0, z = 0 ) {

		this.camera.position.set( x, y, z );

		return this;

	}

	update( x = 0, y = 0, z = 0 ) {

		this.target.x = this.origin.x + this.bounds.x * x;
		this.target.y = this.origin.y + this.bounds.y * y;
		this.target.z = this.origin.z + this.bounds.z * z;

		this.camera.position.lerp( this.target, this.speed );
		this.camera.lookAt( this.lookAt );

		return this;

	}

}

export { CameraLerper };
