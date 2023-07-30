import "./style.css";
import basicVert from "./shaders/basic.vert.wgsl?raw";
import positionFrag from "./shaders/position.frag.wgsl?raw";
import * as cube from "./util/cube";
import { getMvpMatrix } from "./util/math";

async function initWebGPU(canvas: HTMLCanvasElement) {
  if (!navigator.gpu) throw new Error("There is no WebGPU support");

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) throw new Error("There is no adapter");

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();

  const devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const size = { width: canvas.width, height: canvas.height };

  context.configure({
    device,
    format,
    alphaMode: "opaque",
  });
  return { device, context, format, size };
}

async function initPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  size: { width: number; height: number }
) {
  const pipeline = await device.createRenderPipelineAsync({
    label: "Basic Pipeline",
    layout: "auto",
    vertex: {
      module: device.createShaderModule({
        code: basicVert,
      }),
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 5 * 4,
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
            },
            // uv
            { shaderLocation: 1, offset: 3 * 4, format: "float32x2" },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: positionFrag,
      }),
      entryPoint: "main",
      targets: [{ format: format }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
      frontFace: "ccw",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus",
    },
  } as GPURenderPipelineDescriptor);

  const depthTexture = device.createTexture({
    size,
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
  const depthView = depthTexture.createView();

  // creating vertex buffer
  const vertexBuffer = device.createBuffer({
    label: "GPUBuffer store vertex",
    size: cube.vertex.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, cube.vertex);

  // create a mvp matrix buffer
  const mvpBuffer = device.createBuffer({
    label: "GPUBuffer store 4x4 matrix",
    size: 4 * 4 * 4, // 4 x 4 x float32
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformGroup = device.createBindGroup({
    label: "Uniform Group with Matrix",
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: mvpBuffer,
        },
      },
    ],
  });
  return {
    pipeline,
    vertexBuffer,
    mvpBuffer,
    uniformGroup,
    depthTexture,
    depthView,
  };
}

function draw(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipelineObj: {
    pipeline: GPURenderPipeline;
    vertexBuffer: GPUBuffer;
    mvpBuffer: GPUBuffer;
    uniformGroup: GPUBindGroup;
    depthView: GPUTextureView;
  }
) {
  // start encoder
  const commandEncoder = device.createCommandEncoder();
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: pipelineObj.depthView,
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipelineObj.pipeline);
  // set vertex
  passEncoder.setVertexBuffer(0, pipelineObj.vertexBuffer);
  // set uniformGroup
  passEncoder.setBindGroup(0, pipelineObj.uniformGroup);
  // draw vertex count of cube
  passEncoder.draw(cube.vertexCount);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}

async function run() {
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("No Canvas");
  const { device, context, format, size } = await initWebGPU(canvas);
  const pipelineObj = await initPipeline(device, format, size);
  // default state
  let aspect = size.width / size.height;
  const position = { x: 0, y: 0, z: -5 };
  const scale = { x: 1, y: 1, z: 1 };
  const rotation = { x: 0, y: 0, z: 0 };
  // start loop
  function frame() {
    // rotate by time, and update transform matrix
    const now = Date.now() / 1000;
    rotation.x = Math.sin(now);
    rotation.y = Math.cos(now);
    const mvpMatrix = getMvpMatrix(aspect, position, rotation, scale);
    device.queue.writeBuffer(pipelineObj.mvpBuffer, 0, mvpMatrix.buffer);
    // then draw
    draw(device, context, pipelineObj);
    requestAnimationFrame(frame);
  }
  frame();

  // TOFIX: Resize method breaks app
  // re-configure context on resize
  // window.addEventListener("resize", () => {
  //   size.width = canvas.width = canvas.clientWidth * devicePixelRatio;
  //   size.height = canvas.height = canvas.clientHeight * devicePixelRatio;
  //   // don't need to recall context.configure() after v104
  //   // re-create depth texture
  //   pipelineObj.depthTexture.destroy();
  //   pipelineObj.depthTexture = device.createTexture({
  //     size,
  //     format: "depth24plus",
  //     usage: GPUTextureUsage.RENDER_ATTACHMENT,
  //   });
  //   pipelineObj.depthView = pipelineObj.depthTexture.createView();
  //   // update aspect
  //   aspect = size.width / size.height;
  // });
}
run();
