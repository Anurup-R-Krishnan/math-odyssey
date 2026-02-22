import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { DrawingRecognizer } from "@/lib/drawingRecognizer";
import { TensorFlowRecognizer } from "@/lib/tensorflowRecognizer";

interface DrawingCanvasProps {
  onSubmit: (recognizedNumber: number | null) => void;
  onClear: () => void;
  isCorrect?: boolean;
  showFeedback?: boolean;
  useTensorFlow?: boolean;
}

export function DrawingCanvas({ onSubmit, onClear, isCorrect, showFeedback, useTensorFlow = true }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognizerRef = useRef(new DrawingRecognizer());
  const tfRecognizerRef = useRef<TensorFlowRecognizer | null>(null);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Configure drawing style
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Initialize TensorFlow model
    if (useTensorFlow && !tfRecognizerRef.current) {
      tfRecognizerRef.current = new TensorFlowRecognizer();
      setIsModelLoading(true);
      tfRecognizerRef.current.loadModel().then(() => {
        setIsModelLoading(false);
      });
    }

    return () => {
      if (tfRecognizerRef.current) {
        tfRecognizerRef.current.dispose();
      }
    };
  }, [useTensorFlow]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    currentStrokeRef.current = [{ x, y }];
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    e.preventDefault(); // Prevent scrolling on touch devices

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    currentStrokeRef.current.push({ x, y });
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && currentStrokeRef.current.length > 0) {
      recognizerRef.current.addStroke(currentStrokeRef.current);
      currentStrokeRef.current = [];
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recognizerRef.current.clear();
    currentStrokeRef.current = [];
    setHasDrawn(false);
    onClear();
  };

  const handleSubmit = async () => {
    if (!canvasRef.current) return;

    let recognized: number | null = null;

    if (useTensorFlow && tfRecognizerRef.current) {
      // Use TensorFlow recognition
      const result = await tfRecognizerRef.current.recognize(canvasRef.current);
      if (result && result.confidence > 0.6) {
        recognized = result.digit;
        setAnnouncement(`Recognized number: ${recognized} (${Math.round(result.confidence * 100)}% confident)`);
      } else {
        setAnnouncement("Could not recognize drawing with high confidence. Please try again.");
      }
    } else {
      // Fallback to geometric recognition
      recognized = recognizerRef.current.recognize();
      if (recognized !== null) {
        setAnnouncement(`Recognized number: ${recognized}`);
      } else {
        setAnnouncement("Could not recognize drawing. Please try again.");
      }
    }

    onSubmit(recognized);
  };

  return (
    <div className="space-y-4">
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`w-full h-48 border-2 rounded-2xl bg-white touch-none cursor-crosshair transition-all ${
            showFeedback 
              ? isCorrect 
                ? "border-secondary shadow-lg shadow-secondary/20 animate-correct-glow" 
                : "border-destructive shadow-lg shadow-destructive/20 animate-shake"
              : "border-primary/20"
          }`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          aria-label="Drawing canvas for answer"
          aria-invalid={showFeedback && !isCorrect}
          aria-describedby={showFeedback ? "canvas-feedback" : undefined}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-muted-foreground text-sm">Draw your answer here</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1 h-12 rounded-2xl"
          disabled={!hasDrawn || isModelLoading}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 rounded-2xl text-base font-bold"
          disabled={!hasDrawn || isModelLoading}
        >
          {isModelLoading ? "Loading AI..." : "Submit Drawing"}
        </Button>
      </div>
    </div>
  );
}
