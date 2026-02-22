interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export class DrawingRecognizer {
  private strokes: Stroke[] = [];
  
  addStroke(points: Point[]) {
    if (points.length > 0) {
      this.strokes.push({ points });
    }
  }
  
  clear() {
    this.strokes = [];
  }
  
  private getBoundingBox(): BoundingBox | null {
    if (this.strokes.length === 0) return null;
    
    const allPoints = this.strokes.flatMap(s => s.points);
    if (allPoints.length === 0) return null;
    
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxY = Math.max(...allPoints.map(p => p.y));
    
    return {
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    };
  }
  
  private hasTopStroke(box: BoundingBox): boolean {
    const topThird = box.minY + box.height * 0.33;
    return this.strokes.some(s => 
      s.points.some(p => p.y < topThird && p.x > box.minX + box.width * 0.2 && p.x < box.maxX - box.width * 0.2)
    );
  }
  
  private hasBottomStroke(box: BoundingBox): boolean {
    const bottomThird = box.maxY - box.height * 0.33;
    return this.strokes.some(s => 
      s.points.some(p => p.y > bottomThird && p.x > box.minX + box.width * 0.2 && p.x < box.maxX - box.width * 0.2)
    );
  }
  
  private hasMiddleStroke(box: BoundingBox): boolean {
    const middleTop = box.centerY - box.height * 0.15;
    const middleBottom = box.centerY + box.height * 0.15;
    return this.strokes.some(s => 
      s.points.some(p => p.y > middleTop && p.y < middleBottom && p.x > box.minX + box.width * 0.2)
    );
  }
  
  private hasVerticalStroke(box: BoundingBox, side: 'left' | 'right'): boolean {
    const xThreshold = side === 'left' 
      ? box.minX + box.width * 0.5 
      : box.maxX - box.width * 0.5;
    
    return this.strokes.some(s => {
      const relevantPoints = s.points.filter(p => 
        side === 'left' ? p.x <= xThreshold : p.x >= xThreshold
      );
      if (relevantPoints.length < 3) return false;
      
      const minY = Math.min(...relevantPoints.map(p => p.y));
      const maxY = Math.max(...relevantPoints.map(p => p.y));
      return (maxY - minY) > box.height * 0.4;
    });
  }
  
  private isClosed(): boolean {
    if (this.strokes.length === 0) return false;
    
    const allPoints = this.strokes.flatMap(s => s.points);
    if (allPoints.length < 10) return false;
    
    const first = allPoints[0];
    const last = allPoints[allPoints.length - 1];
    const distance = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2));
    
    const box = this.getBoundingBox();
    if (!box) return false;
    
    const avgDimension = (box.width + box.height) / 2;
    return distance < avgDimension * 0.3;
  }
  
  recognize(): number | null {
    if (this.strokes.length === 0) return null;
    
    const box = this.getBoundingBox();
    if (!box) return null;
    
    // Minimum size check - but allow thin vertical lines
    if (box.height < 5) return null;
    
    const aspectRatio = box.height / Math.max(box.width, 1);
    const hasTop = this.hasTopStroke(box);
    const hasBottom = this.hasBottomStroke(box);
    const hasMiddle = this.hasMiddleStroke(box);
    const hasLeft = this.hasVerticalStroke(box, 'left');
    const hasRight = this.hasVerticalStroke(box, 'right');
    const closed = this.isClosed();
    
    // 1: single vertical stroke (tall and narrow)
    if (this.strokes.length === 1 && aspectRatio > 1.5 && (hasLeft || hasRight)) return 1;
    
    // 0: closed loop without middle
    if (closed && !hasMiddle) return 0;
    
    // 8: closed with middle (or two loops)
    if (closed && hasMiddle) return 8;
    
    // 2: has all three horizontal strokes
    if (hasTop && hasMiddle && hasBottom && !closed) return 2;
    
    // 3: top, middle, bottom on right side
    if (hasTop && hasMiddle && hasBottom && hasRight && !hasLeft) return 3;
    
    // 4: vertical left, vertical right, middle
    if (hasLeft && hasRight && hasMiddle && hasTop && !hasBottom) return 4;
    
    // 5: top, middle, bottom with left
    if (hasTop && hasMiddle && hasBottom && hasLeft && !hasRight) return 5;
    
    // 6: closed with middle and left
    if (hasMiddle && hasLeft && !hasRight) return 6;
    
    // 7: top and diagonal right (tall)
    if (hasTop && hasRight && !hasMiddle && !hasBottom && aspectRatio > 1.2) return 7;
    
    // 9: closed with middle and right
    if (hasMiddle && hasRight && !hasLeft) return 9;
    
    return null;
  }
}
