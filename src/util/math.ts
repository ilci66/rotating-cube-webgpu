import { vec3, mat4 } from "wgpu-matrix";

function getMvpMatrix(
  aspect: number,
  position: { x: number; y: number; z: number },
  rotation: { x: number; y: number; z: number },
  scale: { x: number; y: number; z: number }
) {
  // get modelView Matrix
  const modelViewMatrix = getModelViewMatrix(position, rotation, scale);
  // get projection Matrix
  const projectionMatrix = getProjectionMatrix(aspect);
  // get mvp matrix
  const mvpMatrix = mat4.create();
  mat4.multiply(projectionMatrix, modelViewMatrix, mvpMatrix);

  // return matrix as Float32Array
  return mvpMatrix as Float32Array;
}

function getModelViewMatrix(
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  scale = { x: 1, y: 1, z: 1 }
) {
  // get modelView Matrix
  // identity instead of create
  const modelViewMatrix = mat4.identity();
  // translate position
  mat4.translate(
    modelViewMatrix,
    vec3.fromValues(position.x, position.y, position.z),
    modelViewMatrix
  );
  // rotate
  mat4.rotateX(modelViewMatrix, rotation.x, modelViewMatrix);
  mat4.rotateY(modelViewMatrix, rotation.y, modelViewMatrix);
  mat4.rotateZ(modelViewMatrix, rotation.z, modelViewMatrix);
  // scale
  mat4.scale(
    modelViewMatrix,
    vec3.fromValues(scale.x, scale.y, scale.z),
    modelViewMatrix
  );

  // return matrix as Float32Array
  return modelViewMatrix as Float32Array;
}

const center = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);

function getProjectionMatrix(
  aspect: number,
  fov: number = (60 / 180) * Math.PI,
  near: number = 0.1,
  far: number = 100.0,
  position = { x: 0, y: 0, z: 0 }
) {
  // create cameraview
  const cameraView = mat4.identity();
  const eye = vec3.fromValues(position.x, position.y, position.z);

  mat4.translate(cameraView, cameraView, eye);
  mat4.lookAt(cameraView, eye, center, up);
  // get a perspective Matrix
  const projectionMatrix = mat4.identity();

  mat4.perspective(fov, aspect, near, far, projectionMatrix);
  mat4.multiply(cameraView, projectionMatrix, projectionMatrix);
  // return matrix as Float32Array
  return projectionMatrix as Float32Array;
}

export { getMvpMatrix, getModelViewMatrix, getProjectionMatrix };
