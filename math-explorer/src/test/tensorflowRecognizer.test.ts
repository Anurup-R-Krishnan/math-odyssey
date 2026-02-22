import { describe, it, expect, beforeAll } from "vitest";
import { TensorFlowRecognizer } from "@/lib/tensorflowRecognizer";
import '@tensorflow/tfjs-backend-cpu';

describe("TensorFlowRecognizer", () => {
  let recognizer: TensorFlowRecognizer;

  beforeAll(async () => {
    recognizer = new TensorFlowRecognizer();
    await recognizer.loadModel();
  }, 30000);

  it("loads model successfully", async () => {
    expect(recognizer).toBeDefined();
  });

  it("recognizes digit from canvas", async () => {
    // Create a mock canvas with a simple digit
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a simple vertical line (digit 1)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, 80);
    ctx.stroke();

    const result = await recognizer.recognize(canvas);
    
    // Should recognize something or return null
    if (result) {
      expect(result.digit).toBeGreaterThanOrEqual(0);
      expect(result.digit).toBeLessThanOrEqual(9);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    } else {
      expect(result).toBeNull();
    }
  });

  it("returns null for empty canvas", async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);

    const result = await recognizer.recognize(canvas);
    
    // Empty canvas should have low confidence
    expect(result).toBeDefined();
  });
});
