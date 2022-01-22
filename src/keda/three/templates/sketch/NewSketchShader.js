import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const NewSketchShader = ShaderUtils.getBase();

NewSketchShader.vertexShader = /*glsl*/`


void main() {

	vec3 transformed = position;

	

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

NewSketchShader.fragmentShader =  /*glsl*/`
uniform vec3 color;
uniform float opacity;

void main() {

	

	gl_FragColor = vec4( color, opacity );

}
`;

export { NewSketchShader };
