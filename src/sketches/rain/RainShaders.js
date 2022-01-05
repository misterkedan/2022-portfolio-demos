import { Shaders } from 'keda/three/Shaders';

class RainShaders extends Shaders {}

/*-----------------------------------------------------------------------------/

	Main

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

RainShaders.edit = ( shader ) => Shaders.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

export { RainShaders };
