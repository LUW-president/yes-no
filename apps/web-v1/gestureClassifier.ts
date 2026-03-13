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
  let a = stroke[0];
  let b = stroke[stroke.length - 1];
  let maxD = -1;
  for (let i = 0; i < stroke.length - 1; i += 1) {
    for (let j = i + 1; j < stroke.length; j += 1) {
      const d = dist(stroke[i], stroke[j]);
      if (d > maxD) {
        maxD = d;
        a = stroke[i];
        b = stroke[j];
      }
    }
  }
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function strokesIntersect(a: Stroke, b: Stroke): boolean {
  for (let i = 0; i < a.length - 1; i += 1) {
    for (let j = 0; j < b.length - 1; j += 1) {
      if (segmentIntersect(a[i], a[i + 1], b[j], b[j + 1])) return true;
    }
  }
  return false;
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
    if (pathLength(s1) < 40 || pathLength(s2) < 40) return false;
    const inter = strokesIntersect(s1, s2);
    const a1 = lineAngle(s1);
    const a2 = lineAngle(s2);
    let diff = Math.abs(a1 - a2);
    if (diff > 90) diff = 180 - diff;
    return inter && diff > 20;
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

export function predictEarlyIntent(stroke: Stroke): GestureResult {
  if (!stroke || stroke.length < 6) return 'unknown';
  const segmentLength = Math.max(6, Math.ceil(stroke.length * 0.3));
  const earlyStroke = stroke.slice(0, segmentLength);
  const earlyPath = pathLength(earlyStroke);
  if (earlyPath < 24) return 'unknown';

  const displacement = dist(earlyStroke[0], earlyStroke[earlyStroke.length - 1]);
  const straightness = displacement / earlyPath;

  let totalTurn = 0;
  for (let i = 2; i < earlyStroke.length; i += 1) {
    const p0 = earlyStroke[i - 2];
    const p1 = earlyStroke[i - 1];
    const p2 = earlyStroke[i];
    const v1x = p1.x - p0.x;
    const v1y = p1.y - p0.y;
    const v2x = p2.x - p1.x;
    const v2y = p2.y - p1.y;
    const mag1 = Math.hypot(v1x, v1y);
    const mag2 = Math.hypot(v2x, v2y);
    if (mag1 < 1e-6 || mag2 < 1e-6) continue;
    const dot = v1x * v2x + v1y * v2y;
    const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    totalTurn += Math.acos(cos);
  }

  const meanTurn = totalTurn / Math.max(1, earlyStroke.length - 2);
  const curvedStart = straightness < 0.91 || meanTurn > 0.2;
  const straightStart = straightness > 0.96 && meanTurn < 0.1;

  if (straightStart) return 'no';
  if (curvedStart) return 'yes';
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
  function lineAngle(stroke){
    let a=stroke[0], b=stroke[stroke.length-1], maxD=-1;
    for(let i=0;i<stroke.length-1;i++){
      for(let j=i+1;j<stroke.length;j++){
        const d=dist(stroke[i], stroke[j]);
        if(d>maxD){ maxD=d; a=stroke[i]; b=stroke[j]; }
      }
    }
    return Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
  }
  function strokesIntersect(a,b){
    for(let i=0;i<a.length-1;i++){
      for(let j=0;j<b.length-1;j++){
        if(segmentIntersect(a[i],a[i+1],b[j],b[j+1])) return true;
      }
    }
    return false;
  }
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
      if(pathLength(s1)<40 || pathLength(s2)<40) return false;
      const inter=strokesIntersect(s1,s2);
      const a1=lineAngle(s1), a2=lineAngle(s2);
      let diff=Math.abs(a1-a2); if(diff>90) diff=180-diff;
      return inter && diff>20;
    }
    if(strokes.length===1){ const s=strokes[0]; return s.length>18 && hasSelfIntersection(s); }
    return false;
  }
  function classifyGesture(strokes){
    if(strokes.length===1 && isCircle(strokes[0])) return 'yes';
    if(isCross(strokes)) return 'no';
    return 'unknown';
  }
  function predictEarlyIntent(stroke){
    if(!stroke || stroke.length<6) return 'unknown';
    const segmentLength=Math.max(6, Math.ceil(stroke.length*0.3));
    const earlyStroke=stroke.slice(0, segmentLength);
    const earlyPath=pathLength(earlyStroke);
    if(earlyPath<24) return 'unknown';

    const displacement=dist(earlyStroke[0], earlyStroke[earlyStroke.length-1]);
    const straightness=displacement/earlyPath;

    let totalTurn=0;
    for(let i=2;i<earlyStroke.length;i++){
      const p0=earlyStroke[i-2], p1=earlyStroke[i-1], p2=earlyStroke[i];
      const v1x=p1.x-p0.x, v1y=p1.y-p0.y;
      const v2x=p2.x-p1.x, v2y=p2.y-p1.y;
      const mag1=Math.hypot(v1x,v1y), mag2=Math.hypot(v2x,v2y);
      if(mag1<1e-6 || mag2<1e-6) continue;
      const dot=v1x*v2x+v1y*v2y;
      const cos=Math.max(-1,Math.min(1,dot/(mag1*mag2)));
      totalTurn+=Math.acos(cos);
    }

    const meanTurn=totalTurn/Math.max(1,earlyStroke.length-2);
    const curvedStart=straightness<0.91 || meanTurn>0.2;
    const straightStart=straightness>0.96 && meanTurn<0.1;

    if(straightStart) return 'no';
    if(curvedStart) return 'yes';
    return 'unknown';
  }
  window.__gestureClassifier = { classifyGesture, predictEarlyIntent };
})();
`;
