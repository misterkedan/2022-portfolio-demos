import { MathUtils, Vector3 } from 'three';

class CameraRig {

	constructor( camera, {
		lookAt = { x: 0, y: 0, z: 0 },
		bounds = { x: 5, y: 5, z: 0 },
		speed = 0.002,
		intro,
	} = {} ) {

		this.camera = camera;

		this.lookAt = new Vector3( lookAt.x, lookAt.y, lookAt.z );
		this.bounds = new Vector3( bounds.x, bounds.y, bounds.z );
		this.speed = speed;

		this.origin = new Vector3().copy( camera.position );
		this.target = new Vector3();

		if ( intro ) this.set( intro.x, intro.y, intro.z );

	}

	set( x = 0, y = 0, z = 0 ) {

		this.camera.position.set( x, y, z );
		return this;

	}

	update( x = 0, y = 0, z = 0 ) {

		this.target.x = this.origin.x + this.bounds.x * x;
		this.target.y = this.origin.y + this.bounds.y * y;
		this.target.z = this.origin.z + this.bounds.z * z;
		return this;

	}

	tick( delta ) {

		const lerpSpeed = MathUtils.clamp( this.speed * delta, 0, 1 );
		this.camera.position.lerp( this.target, lerpSpeed );
		this.camera.lookAt( this.lookAt );
		return this;

	}

}

export { CameraRig };
