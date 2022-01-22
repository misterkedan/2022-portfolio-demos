import { NormalBlending } from 'three';
import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import parabola from 'keda/glsl/functions/parabola.glsl';
import rotateX from 'keda/glsl/transform/rotateX.glsl';
import rotateY from 'keda/glsl/transform/rotateY.glsl';
import rotateZ from 'keda/glsl/transform/rotateZ.glsl';
import scale from 'keda/glsl/transform/scale.glsl';
import bayerMatrixDither from 'keda/glsl/bayerMatrixDither.glsl';
import linearGradient from 'keda/glsl/linearGradient.glsl';
import loopValue from 'keda/glsl/loopValue.glsl';
import simplex3D from 'keda/glsl/simplex3D.glsl';

const ShaderUtils = {

	parabola,
	rotateX,
	rotateY,
	rotateZ,
	scale,
	bayerMatrixDither,
	linearGradient,
	loopValue,
	simplex3D,

	floatPack: FloatPack.glsl,

	getBase: () => {

		return {
			blending: NormalBlending,
			transparent: true,
		};

	},

	editBasic: (
		shader,
		vertexHead,
		vertexBody,
		fragmentHead,
		fragmentBody,
	) => {

		const NEW_LINE = '\n';
		const TAB = '\t';

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

		if ( ShaderUtils.debug ) {

			console.log( shader.vertexShader );
			console.log( shader.fragmentShader );

		}

		return shader;

	},

};

export { ShaderUtils };
