import { Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import varyingUV from '../glsl/varyingUV.vert.glsl';
import bayerMatrixDither from '../glsl/bayerMatrixDither.glsl';
import linearGradient from '../glsl/linearGradient.glsl';

class LinearGradient extends Mesh {

	constructor( {
		color1 = 0xffffff,
		color2 = 0x000000,
		angle = 90,
	} = {} ) {

		const geometry = new PlaneGeometry( 2, 2 );
		const material = new ShaderMaterial( {
			...LinearGradient.shader,
			uniforms: {
				uAngle:  { value: 0 },
				uColor1: { value: 0 },
				uColor2: { value: 0 },
			},
		} );

		super( geometry, material );

		this.angle = angle;
		this.color1 = color1;
		this.color2 = color2;

	}

	get angle() {

		return this.material.uniforms.uAngle.value;

	}

	set angle( value ) {

		this.material.uniforms.uAngle.value = value;

	}

	get color1() {

		return this.material.uniforms.uColor1.value;

	}

	set color1( value ) {

		this.material.uniforms.uColor1.value = new Color( value );

	}

	get color2() {

		return this.material.uniforms.uColor2.value;

	}

	set color2( value ) {

		this.material.uniforms.uColor2.value = new Color( value );

	}

}

LinearGradient.shader =  {
	depthWrite: false,
	depthTest: false,
	vertexShader: varyingUV,
	fragmentShader: /*glsl*/`
		uniform float uAngle;
		uniform vec3 uColor1;
		uniform vec3 uColor2;
		varying vec2 vUv;
		
		${ linearGradient }
		${ bayerMatrixDither }

		void main() {

			vec2 origin = vec2( 0.5, 0.5 );
			vec2 target = vUv - origin;
			vec3 color = linearGradient( origin, target, uColor1, uColor2, uAngle );
			
			color = bayerMatrixDither( color );

			gl_FragColor = vec4( color, 1.0 );
			
		}`
	,
};

export { LinearGradient };
