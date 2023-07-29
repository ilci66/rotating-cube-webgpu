const vertex = new Float32Array([
  // float3 position, float2 uv
  // face1
  +1, -1, +1, 1, 1, // UV Part wasn't in the tutorial
  -1, -1, +1, 0, 1, // UV Part wasn't in the tutorial
  -1, -1, -1, 0, 0, // UV Part wasn't in the tutorial
  +1, -1, -1, 1, 0, // UV Part wasn't in the tutorial
  +1, -1, +1, 1, 1, // UV Part wasn't in the tutorial
  -1, -1, -1, 0, 0, // UV Part wasn't in the tutorial
  // face2
  +1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  +1, -1, +1, 0, 1, // UV Part wasn't in the tutorial
  +1, -1, -1, 0, 0, // UV Part wasn't in the tutorial
  +1, +1, -1, 1, 0, // UV Part wasn't in the tutorial
  +1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  +1, -1, -1, 0, 0, // UV Part wasn't in the tutorial
  // face3
  -1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  +1, +1, +1, 0, 1, // UV Part wasn't in the tutorial
  +1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
  -1, +1, -1, 1, 0, // UV Part wasn't in the tutorial
  -1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  +1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
  // face4
  -1, -1, +1, 1, 1, // UV Part wasn't in the tutorial
  -1, +1, +1, 0, 1, // UV Part wasn't in the tutorial
  -1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
  -1, -1, -1, 1, 0, // UV Part wasn't in the tutorial
  -1, -1, +1, 1, 1, // UV Part wasn't in the tutorial
  -1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
  // face5
  +1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  -1, +1, +1, 0, 1, // UV Part wasn't in the tutorial
  -1, -1, +1, 0, 0, // UV Part wasn't in the tutorial
  -1, -1, +1, 0, 0, // UV Part wasn't in the tutorial
  +1, -1, +1, 1, 0, // UV Part wasn't in the tutorial
  +1, +1, +1, 1, 1, // UV Part wasn't in the tutorial
  // face6
  +1, -1, -1, 1, 1, // UV Part wasn't in the tutorial
  -1, -1, -1, 0, 1, // UV Part wasn't in the tutorial
  -1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
  +1, +1, -1, 1, 0, // UV Part wasn't in the tutorial
  +1, -1, -1, 1, 1, // UV Part wasn't in the tutorial
  -1, +1, -1, 0, 0, // UV Part wasn't in the tutorial
])

const vertexCount = 36

export { vertex, vertexCount }