import { Shaders } from 'keda/three/Shaders';

class NewSketchShaders extends Shaders {}

/*-----------------------------------------------------------------------------/

	Main

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`

`;

const vertexBody =  /*glsl*/`
	
`;

const fragmentHead = /*glsl*/`

`;

const fragmentBody = /*glsl*/`
	
`;

NewSketchShaders.edit = ( shader ) => Shaders.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

export { NewSketchShaders };
