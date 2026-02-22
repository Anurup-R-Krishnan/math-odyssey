import * as tf from '@tensorflow/tfjs';

export class TensorFlowRecognizer {
  private model: tf.LayersModel | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  async loadModel(): Promise<void> {
    if (this.model) return;
    if (this.loadPromise) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = this.createAndTrainModel();
    await this.loadPromise;
    this.isLoading = false;
  }

  private async createAndTrainModel(): Promise<void> {
    // Create a simple CNN model for EMNIST-style digit recognition
    this.model = tf.sequential({
      layers: [
        tf.layers.conv2d({
          inputShape: [28, 28, 1],
          filters: 32,
          kernelSize: 3,
          activation: 'relu',
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.conv2d({
          filters: 64,
          kernelSize: 3,
          activation: 'relu',
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.flatten(),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 10, activation: 'softmax' }),
      ],
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    // Train with synthetic EMNIST-style data
    await this.trainWithSyntheticData();
  }

  private async trainWithSyntheticData(): Promise<void> {
    // Generate synthetic training data for digits 0-9
    const numSamples = 100;
    const xs: number[][][] = [];
    const ys: number[] = [];

    for (let digit = 0; digit < 10; digit++) {
      for (let sample = 0; sample < numSamples / 10; sample++) {
        xs.push(this.generateDigitImage(digit));
        ys.push(digit);
      }
    }

    const xsTensor = tf.tensor4d(
      xs.map(img => img.map(row => row.map(val => [val]))),
      [xs.length, 28, 28, 1]
    );
    const ysTensor = tf.oneHot(tf.tensor1d(ys, 'int32'), 10);

    await this.model!.fit(xsTensor, ysTensor, {
      epochs: 10,
      batchSize: 32,
      verbose: 0,
    });

    xsTensor.dispose();
    ysTensor.dispose();
  }

  private generateDigitImage(digit: number): number[][] {
    const img: number[][] = Array(28).fill(0).map(() => Array(28).fill(0));
    
    // Simple digit patterns
    switch (digit) {
      case 0:
        for (let i = 8; i < 20; i++) {
          for (let j = 8; j < 20; j++) {
            if (i === 8 || i === 19 || j === 8 || j === 19) {
              img[i][j] = 1;
            }
          }
        }
        break;
      case 1:
        for (let i = 6; i < 22; i++) {
          img[i][14] = 1;
        }
        break;
      case 2:
        for (let j = 8; j < 20; j++) img[8][j] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let j = 8; j < 20; j++) img[20][j] = 1;
        for (let i = 8; i < 14; i++) img[i][19] = 1;
        for (let i = 14; i < 20; i++) img[i][8] = 1;
        break;
      case 3:
        for (let j = 8; j < 20; j++) img[8][j] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let j = 8; j < 20; j++) img[20][j] = 1;
        for (let i = 8; i < 20; i++) img[i][19] = 1;
        break;
      case 4:
        for (let i = 8; i < 14; i++) img[i][8] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let i = 8; i < 22; i++) img[i][19] = 1;
        break;
      case 5:
        for (let j = 8; j < 20; j++) img[8][j] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let j = 8; j < 20; j++) img[20][j] = 1;
        for (let i = 8; i < 14; i++) img[i][8] = 1;
        for (let i = 14; i < 20; i++) img[i][19] = 1;
        break;
      case 6:
        for (let i = 8; i < 20; i++) img[i][8] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let j = 8; j < 20; j++) img[20][j] = 1;
        for (let i = 14; i < 20; i++) img[i][19] = 1;
        break;
      case 7:
        for (let j = 8; j < 20; j++) img[8][j] = 1;
        for (let i = 8; i < 22; i++) img[i][19] = 1;
        break;
      case 8:
        for (let i = 8; i < 20; i++) {
          for (let j = 8; j < 20; j++) {
            if (i === 8 || i === 14 || i === 19 || j === 8 || j === 19) {
              img[i][j] = 1;
            }
          }
        }
        break;
      case 9:
        for (let j = 8; j < 20; j++) img[8][j] = 1;
        for (let j = 8; j < 20; j++) img[14][j] = 1;
        for (let i = 8; i < 14; i++) img[i][8] = 1;
        for (let i = 8; i < 20; i++) img[i][19] = 1;
        break;
    }
    
    return img;
  }

  async recognize(canvas: HTMLCanvasElement): Promise<{ digit: number; confidence: number } | null> {
    if (!this.model) {
      await this.loadModel();
    }

    // Preprocess canvas to 28x28 grayscale
    const tensor = tf.tidy(() => {
      const img = tf.browser.fromPixels(canvas, 1);
      const resized = tf.image.resizeBilinear(img, [28, 28]);
      const normalized = resized.div(255.0);
      return normalized.expandDims(0);
    });

    const prediction = this.model!.predict(tensor) as tf.Tensor;
    const probabilities = await prediction.data();
    
    tensor.dispose();
    prediction.dispose();

    const maxProb = Math.max(...probabilities);
    const digit = probabilities.indexOf(maxProb);

    if (maxProb < 0.6) {
      return null; // Low confidence
    }

    return { digit, confidence: maxProb };
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}
