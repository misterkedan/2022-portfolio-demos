import rotateX from 'keda/glsl/transform/rotateX.glsl';
import rotateY from 'keda/glsl/transform/rotateY.glsl';
import rotateZ from 'keda/glsl/transform/rotateZ.glsl';
import scale from 'keda/glsl/transform/scale.glsl';
import bayerMatrixDither from 'keda/glsl/bayerMatrixDither.glsl';
import linearGradient from 'keda/glsl/linearGradient.glsl';
import loopValue from 'keda/glsl/loopValue.glsl';
import simplex3D from 'keda/glsl/simplex3D.glsl';

import { FloatPack } from 'keda/three/gpgpu/FloatPack';

const NEW_LINE = '\n';
const TAB = '\t';

class Shaders {}

Shaders.rotateX = rotateX;
Shaders.rotateY = rotateY;
Shaders.rotateZ = rotateZ;
Shaders.scale = scale;
Shaders.bayerMatrixDither = bayerMatrixDither;
Shaders.linearGradient = linearGradient;
Shaders.loopValue = loopValue;
Shaders.simplex3D = simplex3D;

Shaders.floatPack = FloatPack.glsl;

Shaders.editBasic = (
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody,
) => {

	// THREE tokens ( r136 )
	const common = '#include <common>';
	const beginVertex = '#include <begin_vertex>';
	const logdepthbuf = '#include <logdepthbuf_fragment>';

	if ( vertexHead ) shader.vertexShader = shader.vertexShader.replace(
		common,
		common + NEW_LINE + vertexHead
	);

	if ( vertexBody ) shader.vertexShader = shader.vertexShader.replace(
		beginVertex,
		beginVertex + NEW_LINE + vertexBody
	);

	if ( fragmentHead ) shader.fragmentShader = shader.fragmentShader.replace(
		common,
		common + NEW_LINE + fragmentHead
	);

	if ( fragmentBody ) shader.fragmentShader = shader.fragmentShader.replace(
		logdepthbuf,
		fragmentBody + NEW_LINE + TAB + logdepthbuf
	);

	if ( Shaders.debug ) {

		console.log( shader.vertexShader );
		console.log( shader.fragmentShader );

	}

	return shader;

};

export { Shaders };
