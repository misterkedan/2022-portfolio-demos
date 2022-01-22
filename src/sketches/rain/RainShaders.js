import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const RainShaders = {};

/*-----------------------------------------------------------------------------/

	Random

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`
attribute float aProgress;
varying float vProgress;
`;

const vertexBody =  /*glsl*/`
	vProgress = aProgress;
`;

const fragmentHead = /*glsl*/`
varying float vProgress;
`;

const fragmentBody = /*glsl*/`
	diffuseColor.a *= mod( 1.0 - vProgress, 1.0 );
`;

RainShaders.edit = ( shader ) => ShaderUtils.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

/*-----------------------------------------------------------------------------/

	Impact

/-----------------------------------------------------------------------------*/

RainShaders.impact = ShaderUtils.getBase();

RainShaders.impact.vertexShader = /*glsl*/`
attribute vec3 aOffset;
attribute float aLife;
uniform float uScaleMin;
uniform float uScaleMax;
varying float vLife;

${ShaderUtils.rotateZ}

void main() {

	vLife = clamp( aLife, 0.0, 1.0 );

	vec3 transformed = aOffset + position * ( uScaleMin + vLife * uScaleMax );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

RainShaders.impact.fragmentShader =  /*glsl*/`
uniform vec3 color;
uniform float opacity;
varying float vLife;

void main() {

	float dynamicOpacity = ( 1.0 - vLife ) * opacity;

	gl_FragColor = vec4( color, dynamicOpacity );

}
`;

export { RainShaders };
