export type Point = { x: number; y: number };
export type Stroke = Point[];
export type GestureResult = 'yes' | 'no' | 'unknown';

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pathLength(points: Stroke): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += dist(points[i - 1], points[i]);
  return total;
}

function segmentIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const ccw = (p1: Point, p2: Point, p3: Point) => (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

function hasSelfIntersection(points: Stroke): boolean {
  for (let i = 0; i < points.length - 3; i += 1) {
    for (let j = i + 2; j < points.length - 1; j += 1) {
      if (segmentIntersect(points[i], points[i + 1], points[j], points[j + 1])) return true;
    }
  }
  return false;
}

function lineAngle(stroke: Stroke): number {
  const a = stroke[0];
  const b = stroke[stroke.length - 1];
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

export function isCircle(stroke: Stroke): boolean {
  if (!stroke || stroke.length < 20) return false;
  const len = pathLength(stroke);
  if (len < 220) return false;
  const close = dist(stroke[0], stroke[stroke.length - 1]);
  if (close > 45) return false;

  const cx = stroke.reduce((a, p) => a + p.x, 0) / stroke.length;
  const cy = stroke.reduce((a, p) => a + p.y, 0) / stroke.length;
  const radii = stroke.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const rMean = radii.reduce((a, b) => a + b, 0) / radii.length;
  if (rMean < 20) return false;
  const variance = radii.reduce((a, r) => a + Math.pow(r - rMean, 2), 0) / radii.length;
  const std = Math.sqrt(variance);
  return std / rMean < 0.45;
}

export function isCross(strokes: Stroke[]): boolean {
  if (strokes.length === 2) {
    const s1 = strokes[0];
    const s2 = strokes[1];
    if (s1.length < 3 || s2.length < 3) return false;
    const inter = segmentIntersect(s1[0], s1[s1.length - 1], s2[0], s2[s2.length - 1]);
    const a1 = lineAngle(s1);
    const a2 = lineAngle(s2);
    let diff = Math.abs(a1 - a2);
    if (diff > 90) diff = 180 - diff;
    return inter && diff > 25;
  }

  if (strokes.length === 1) {
    const s = strokes[0];
    return s.length > 18 && hasSelfIntersection(s);
  }

  return false;
}

export function classifyGesture(strokes: Stroke[]): GestureResult {
  if (strokes.length === 1 && isCircle(strokes[0])) return 'yes';
  if (isCross(strokes)) return 'no';
  return 'unknown';
}

export const gestureClassifierClientJs = String.raw`
(function(){
  function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
  function pathLength(points){ let t=0; for(let i=1;i<points.length;i++) t+=dist(points[i-1],points[i]); return t; }
  function segmentIntersect(a,b,c,d){
    const ccw=(p1,p2,p3)=> (p3.y-p1.y)*(p2.x-p1.x) > (p2.y-p1.y)*(p3.x-p1.x);
    return ccw(a,c,d)!==ccw(b,c,d) && ccw(a,b,c)!==ccw(a,b,d);
  }
  function hasSelfIntersection(points){
    for(let i=0;i<points.length-3;i++){
      for(let j=i+2;j<points.length-1;j++){
        if(segmentIntersect(points[i],points[i+1],points[j],points[j+1])) return true;
      }
    }
    return false;
  }
  function lineAngle(stroke){ const a=stroke[0], b=stroke[stroke.length-1]; return Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI; }
  function isCircle(stroke){
    if(!stroke || stroke.length<20) return false;
    const len=pathLength(stroke); if(len<220) return false;
    const close=dist(stroke[0], stroke[stroke.length-1]); if(close>45) return false;
    const cx=stroke.reduce((a,p)=>a+p.x,0)/stroke.length;
    const cy=stroke.reduce((a,p)=>a+p.y,0)/stroke.length;
    const radii=stroke.map((p)=>Math.hypot(p.x-cx,p.y-cy));
    const rMean=radii.reduce((a,b)=>a+b,0)/radii.length;
    if(rMean<20) return false;
    const variance=radii.reduce((a,r)=>a+Math.pow(r-rMean,2),0)/radii.length;
    const std=Math.sqrt(variance);
    return (std/rMean)<0.45;
  }
  function isCross(strokes){
    if(strokes.length===2){
      const s1=strokes[0], s2=strokes[1];
      if(s1.length<3 || s2.length<3) return false;
      const inter=segmentIntersect(s1[0], s1[s1.length-1], s2[0], s2[s2.length-1]);
      const a1=lineAngle(s1), a2=lineAngle(s2);
      let diff=Math.abs(a1-a2); if(diff>90) diff=180-diff;
      return inter && diff>25;
    }
    if(strokes.length===1){ const s=strokes[0]; return s.length>18 && hasSelfIntersection(s); }
    return false;
  }
  function classifyGesture(strokes){
    if(strokes.length===1 && isCircle(strokes[0])) return 'yes';
    if(isCross(strokes)) return 'no';
    return 'unknown';
  }
  window.__gestureClassifier = { classifyGesture };
})();
`;
