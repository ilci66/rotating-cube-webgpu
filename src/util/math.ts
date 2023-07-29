import { vec3, mat4 } from "wgpu-matrix";

function getMvpMatrix(
  aspect: number,
  position: { x: number; y: number; z: number },
  rotation: { x: number; y: number; z: number },
  scale: { x: number; y: number; z: number }
) {
  const modelViewMatrix = getModelViewMatrix(position, rotation, scale);
  const projectionMatrix = getProjectionMatrix(aspect);

  const mvpMatrix = mat4.create();

  mat4.multiply(mvpMatrix, projectionMatrix, modelViewMatrix);

  return mvpMatrix as Float32Array;
}

function getModelViewMatrix(
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  scale = { x: 1, y: 1, z: 1 }
) {
  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    vec3.fromValues(position.x, position.y, position.z)
  );

  // This is the way it's done in gl-matrix library
  // mat4.rotateX(modelViewMatrix,modelViewMatrix, rotation.x)

  mat4.rotateX(modelViewMatrix, rotation.x);
  mat4.rotateX(modelViewMatrix, rotation.x);
  mat4.rotateX(modelViewMatrix, rotation.x);

  mat4.scale(modelViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z));

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
  const cameraView = mat4.create();
  const eye = vec3.fromValues(position.x, position.y, position.z);
  mat4.translate(cameraView, cameraView, eye);
  mat4.lookAt(cameraView, eye, center, up);

  // get a perspective matrix
  const projectionMatrix = mat4.create();
  mat4.perspective(fov, aspect, near, far, projectionMatrix);
  mat4.multiply(cameraView, projectionMatrix, projectionMatrix);

  return projectionMatrix as Float32Array;
}

export { getMvpMatrix, getModelViewMatrix, getProjectionMatrix };
