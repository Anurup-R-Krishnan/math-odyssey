import * as tf from "@tensorflow/tfjs";
import * as path from "path";
import * as fs from "fs";
import * as zlib from "zlib";
import { createRequire } from "module";


const require = createRequire(import.meta.url);

const DATASET_DIR = process.env.EMNIST_DIR ?? path.join(process.cwd(), "datasets");
const MODEL_DIR = path.join(process.cwd(), "public", "model");
const TRAIN_SAMPLES = Number(process.env.TRAIN_SAMPLES ?? "60000");
const TEST_SAMPLES = Number(process.env.TEST_SAMPLES ?? "10000");
const EPOCHS = Number(process.env.EPOCHS ?? "12");
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? "128");
const FIX_ORIENTATION = (process.env.EMNIST_FIX_ORIENTATION ?? "true") !== "false";
const INVERT_PIXELS = (process.env.EMNIST_INVERT ?? "false") === "true";

async function ensureFastNodeBackend() {
  // Skip tfjs-node backends which are broken on newer Node.js versions
  // (isNullOrUndefined removed from util module). Use default CPU backend.
  console.log("Using default TensorFlow.js CPU backend (pure JS).");
  await tf.ready();
}

class NodeFileSystemHandler {
  constructor(modelDir) {
    this.modelDir = modelDir;
  }

  async save(modelArtifacts) {
    if (!fs.existsSync(this.modelDir)) {
      fs.mkdirSync(this.modelDir, { recursive: true });
    }

    const modelJsonPath = path.join(this.modelDir, "model.json");
    const modelJson = {
      modelTopology: modelArtifacts.modelTopology,
      format: modelArtifacts.format,
      generatedBy: modelArtifacts.generatedBy,
      convertedBy: modelArtifacts.convertedBy,
      weightsManifest: [
        {
          paths: ["./weights.bin"],
          weights: modelArtifacts.weightSpecs,
        },
      ],
    };

    fs.writeFileSync(modelJsonPath, JSON.stringify(modelJson));

    if (modelArtifacts.weightData) {
      const weightsPath = path.join(this.modelDir, "weights.bin");
      fs.writeFileSync(weightsPath, Buffer.from(modelArtifacts.weightData));
    }

    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: "JSON",
      },
    };
  }
}

function readBinaryMaybeGzip(filePath) {
  const raw = fs.readFileSync(filePath);
  const isGzip = raw.length > 2 && raw[0] === 0x1f && raw[1] === 0x8b;
  return isGzip ? zlib.gunzipSync(raw) : raw;
}

function resolveDatasetFile(baseDir, candidates) {
  for (const name of candidates) {
    const fullPath = path.join(baseDir, name);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  throw new Error(`Dataset file not found. Tried: ${candidates.join(", ")} in ${baseDir}`);
}

function readInt32BE(buf, offset) {
  return buf.readUInt32BE(offset);
}

function parseIdxImages(filePath) {
  const buf = readBinaryMaybeGzip(filePath);
  const magic = readInt32BE(buf, 0);
  if (magic !== 2051) {
    throw new Error(`Invalid IDX image magic number in ${filePath}: ${magic}`);
  }

  const count = readInt32BE(buf, 4);
  const rows = readInt32BE(buf, 8);
  const cols = readInt32BE(buf, 12);
  const expectedSize = 16 + count * rows * cols;
  if (buf.length < expectedSize) {
    throw new Error(`Corrupt image IDX file ${filePath}: expected >= ${expectedSize}, got ${buf.length}`);
  }

  return {
    count,
    rows,
    cols,
    pixels: new Uint8Array(buf.subarray(16, expectedSize)),
  };
}

function parseIdxLabels(filePath) {
  const buf = readBinaryMaybeGzip(filePath);
  const magic = readInt32BE(buf, 0);
  if (magic !== 2049) {
    throw new Error(`Invalid IDX label magic number in ${filePath}: ${magic}`);
  }

  const count = readInt32BE(buf, 4);
  const expectedSize = 8 + count;
  if (buf.length < expectedSize) {
    throw new Error(`Corrupt label IDX file ${filePath}: expected >= ${expectedSize}, got ${buf.length}`);
  }

  return {
    count,
    labels: new Uint8Array(buf.subarray(8, expectedSize)),
  };
}

function getPixel(pixels, imageIdx, rows, cols, row, col) {
  const imageOffset = imageIdx * rows * cols;
  let srcRow = row;
  let srcCol = col;

  // EMNIST is commonly rotated; this maps it to upright orientation.
  if (FIX_ORIENTATION) {
    srcRow = col;
    srcCol = rows - 1 - row;
  }

  const srcIndex = imageOffset + srcRow * cols + srcCol;
  return pixels[srcIndex];
}

function toTensor4d(images, limit) {
  const sampleCount = Math.min(limit, images.count);
  const data = new Float32Array(sampleCount * images.rows * images.cols);

  for (let i = 0; i < sampleCount; i++) {
    for (let r = 0; r < images.rows; r++) {
      for (let c = 0; c < images.cols; c++) {
        const raw = getPixel(images.pixels, i, images.rows, images.cols, r, c) / 255;
        const value = INVERT_PIXELS ? 1 - raw : raw;
        data[i * images.rows * images.cols + r * images.cols + c] = value;
      }
    }
  }

  return tf.tensor4d(data, [sampleCount, images.rows, images.cols, 1], "float32");
}

function toTensor1d(labels, limit) {
  const sampleCount = Math.min(limit, labels.count);
  const data = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    data[i] = labels.labels[i];
  }

  return tf.tensor1d(data, "float32");
}

function buildModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: "relu",
      }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: "relu",
      }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.flatten(),
      tf.layers.dense({ units: 128, activation: "relu" }),
      tf.layers.dropout({ rate: 0.25 }),
      tf.layers.dense({ units: 10, activation: "softmax" }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(1e-3),
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

async function trainAndSave() {
  await ensureFastNodeBackend();
  console.log(`Loading EMNIST dataset from ${DATASET_DIR}`);

  const trainImagesPath = resolveDatasetFile(DATASET_DIR, [
    "emnist-digits-train-images-idx3-ubyte.gz",
    "emnist-digits-train-images-idx3-ubyte",
    "emnist-digits-train-images-idx3-ubyte",
    "emnist-digits-train-images-idx3-ubyte.gz",
  ]);
  const trainLabelsPath = resolveDatasetFile(DATASET_DIR, [
    "emnist-digits-train-labels-idx1-ubyte.gz",
    "emnist-digits-train-labels-idx1-ubyte",
    "emnist-digits-train-labels-idx1-ubyte",
    "emnist-digits-train-labels-idx1-ubyte.gz",
  ]);
  const testImagesPath = resolveDatasetFile(DATASET_DIR, [
    "emnist-digits-test-images-idx3-ubyte.gz",
    "emnist-digits-test-images-idx3-ubyte",
    "emnist-digits-test-images-idx3-ubyte",
    "emnist-digits-test-images-idx3-ubyte.gz",
  ]);
  const testLabelsPath = resolveDatasetFile(DATASET_DIR, [
    "emnist-digits-test-labels-idx1-ubyte.gz",
    "emnist-digits-test-labels-idx1-ubyte",
    "emnist-digits-test-labels-idx1-ubyte",
    "emnist-digits-test-labels-idx1-ubyte.gz",
  ]);

  const trainImages = parseIdxImages(trainImagesPath);
  const trainLabels = parseIdxLabels(trainLabelsPath);
  const testImages = parseIdxImages(testImagesPath);
  const testLabels = parseIdxLabels(testLabelsPath);

  if (trainImages.count !== trainLabels.count) {
    throw new Error(`Train image/label count mismatch: ${trainImages.count} vs ${trainLabels.count}`);
  }
  if (testImages.count !== testLabels.count) {
    throw new Error(`Test image/label count mismatch: ${testImages.count} vs ${testLabels.count}`);
  }

  const trainCount = Math.min(TRAIN_SAMPLES, trainImages.count);
  const testCount = Math.min(TEST_SAMPLES, testImages.count);
  console.log(`Using ${trainCount} train samples and ${testCount} test samples`);
  console.log(`Orientation fix: ${FIX_ORIENTATION ? "on" : "off"}, invert pixels: ${INVERT_PIXELS ? "on" : "off"}`);

  const xTrain = toTensor4d(trainImages, trainCount);
  const yTrain = toTensor1d(trainLabels, trainCount);
  const xTest = toTensor4d(testImages, testCount);
  const yTest = toTensor1d(testLabels, testCount);

  const model = buildModel();
  model.summary();

  console.log("Training model...");
  await model.fit(xTrain, yTrain, {
    epochs: EPOCHS,
    batchSize: BATCH_SIZE,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        const acc = logs?.acc ?? logs?.accuracy;
        const valAcc = logs?.val_acc ?? logs?.val_accuracy;
        console.log(
          `Epoch ${epoch + 1}/${EPOCHS} - loss=${logs?.loss?.toFixed(4)} acc=${acc?.toFixed(4)} val_acc=${valAcc?.toFixed(4)}`
        );
      },
    },
  });

  const evalResult = model.evaluate(xTest, yTest);
  const metrics = Array.isArray(evalResult) ? evalResult : [evalResult];
  const loss = (await metrics[0].data())[0];
  const accuracy = metrics[1] ? (await metrics[1].data())[0] : NaN;
  console.log(`Test loss=${loss.toFixed(4)} accuracy=${Number.isNaN(accuracy) ? "n/a" : accuracy.toFixed(4)}`);

  console.log(`Saving model to ${MODEL_DIR}`);
  const handler = new NodeFileSystemHandler(MODEL_DIR);
  await model.save(handler);
  console.log("Model saved to public/model (model.json + weights.bin)");

  tf.dispose([xTrain, yTrain, xTest, yTest]);
  model.dispose();
}

trainAndSave().catch((err) => {
  console.error("Training failed:", err);
  process.exit(1);
});
