import { ShaderMaterial, Vector2 } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import varyingUV from 'keda/glsl/varyingUV.vert.glsl';
import bayerMatrixDither from 'keda/glsl/bayerMatrixDither.glsl';

class RadialBlurPass extends ShaderPass {

	constructor( {
		strength = 0.2,
		resolution = new Vector2( window.innerWidth, window.innerHeight ),
		origin = new Vector2( window.innerWidth / 2, window.innerHeight / 2 ),
	} = {} ) {

		super( new ShaderMaterial( {
			uniforms: {
				tDiffuse   : { value: null },
				uOrigin    : { value: origin },
				uResolution: { value: resolution },
				uStrength  : { value: strength },
			},
			vertexShader: varyingUV,
			fragmentShader: RadialBlurPass.frag
		} ) );

	}

	setSize( width, height, devicePixelRatio = 1 ) {

		if ( devicePixelRatio > 1 ) {

			width /= devicePixelRatio;
			height /= devicePixelRatio;

		}

		this.material.uniforms.uResolution.value = new Vector2( width, height );
		this.material.uniforms.uOrigin.value = new Vector2( width / 2, height / 2 );

	}

	get strength() {

		return this.material.uniforms.uStrength.value;

	}

	set strength( value ) {

		this.material.uniforms.uStrength.value = value;

	}

	get x() {

		return this.material.uniforms.uOrigin.value.x;

	}

	set x( value ) {

		this.material.uniforms.uOrigin.value.x = value;

	}

	get y() {

		return this.material.uniforms.uOrigin.value.y;

	}

	set y( value ) {

		this.material.uniforms.uOrigin.value.y = value;

	}

}

RadialBlurPass.frag = /*glsl*/`
        
    uniform sampler2D tDiffuse;
    uniform vec2 uOrigin;
    uniform vec2 uResolution;
    uniform float uStrength;
    varying vec2 vUv;

    ${ bayerMatrixDither }

    float random( vec3 scale, float seed ){ return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

    void main() {

        vec2 uv = vUv;

        vec4 color = vec4( 0.0 );
        float total = 0.0;
        vec2 toCenter = uOrigin - vUv * uResolution;
        float offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0);
        for( float t=0.0; t <= 40.0; t++ ){
            float percent = ( t + offset ) / 40.0;
            float weight = 4.0 * ( percent - percent * percent );
            vec4 blurSample = texture2D(
                tDiffuse, 
                vUv + toCenter * percent * uStrength / uResolution
            );
            blurSample.rgb *= blurSample.a;
            color += blurSample * weight;
            total += weight;
        }
        color /= total;

        color.xyz = bayerMatrixDither( color.xyz );

        gl_FragColor = color;

    }

`;

export { RadialBlurPass };
