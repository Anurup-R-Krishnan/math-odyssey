import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
function applyDrawingStyle(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

type Point = { x: number; y: number };

interface DrawingCanvasProps {
  onSubmit: (recognizedNumber: number | null) => void;
  onClear: () => void;
  isCorrect?: boolean;
  showFeedback?: boolean;
}

export function DrawingCanvas({ onSubmit, onClear, isCorrect, showFeedback }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 1);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      if (typeof ctx.setTransform === "function") {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else if (typeof ctx.scale === "function") {
        // Reset any prior scaling before applying new scale.
        if (typeof ctx.resetTransform === "function") {
          ctx.resetTransform();
        } else if (typeof ctx.setTransform === "function") {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#ffffff";
      if (typeof ctx.fillRect === "function") {
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      // Resizing the canvas resets drawing styles, so re-apply them here.
      applyDrawingStyle(ctx);
    };

    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Defensive: if a resize happened, ensure brush style is correct.
    applyDrawingStyle(ctx);

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    currentStrokeRef.current = [{ x, y }];
    strokesRef.current.push(currentStrokeRef.current);
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
      // Keep stroke points for OCR rendering; just end current stroke.
      currentStrokeRef.current = [];
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#ffffff";
    if (typeof ctx.fillRect === "function") {
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
    currentStrokeRef.current = [];
    strokesRef.current = [];
    setHasDrawn(false);
    onClear();
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecognizing(true);
    let recognized: number | null = null;
    try {
      // Capture canvas as base64
      const imageData = canvas.toDataURL("image/png");

      // Call backend API
      const response = await fetch("http://localhost:8000/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.digit !== undefined && data.digit !== null) {
        recognized = Number.parseInt(data.digit, 10);
        setAnnouncement(`Recognized number: ${recognized}`);
      } else {
        setAnnouncement("Could not recognize number. Please try again.");
      }
    } catch (error) {
      console.error("Recognition error:", error);
      setAnnouncement("Recognition failed. Please try again.");
    } finally {
      setIsRecognizing(false);
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
          className={`w-full h-48 border-2 rounded-2xl bg-white touch-none cursor-crosshair transition-all ${showFeedback
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
          disabled={!hasDrawn || isRecognizing}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 rounded-2xl text-base font-bold"
          disabled={!hasDrawn || isRecognizing}
        >
          {isRecognizing ? "Recognizing..." : "Submit Drawing"}
        </Button>
      </div>
    </div>
  );
}
