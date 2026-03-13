export const gestureCanvasClientJs = String.raw`
(function(){
  function mountGestureCanvas(options){
    const { canvas, hintEl, classifyGesture, earlyStrokeIntent, onSubmit, onUnknown, onDetected } = options;
    if(!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let drawing=false;
    let currentStroke=[];
    let strokes=[];
    let classifyTimer=null;
    let lastIntentHint='unknown';

    function clearCanvas(){
      if(!ctx) return;
      ctx.fillStyle='#000';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      canvas.style.boxShadow='none';
    }
    function pos(ev){
      const r=canvas.getBoundingClientRect();
      return { x:(ev.clientX-r.left)*(canvas.width/r.width), y:(ev.clientY-r.top)*(canvas.height/r.height) };
    }
    function flash(kind){
      if(kind==='yes') canvas.style.boxShadow='0 0 26px #3be98799';
      else if(kind==='no') canvas.style.boxShadow='0 0 26px #ff767699';
      else canvas.style.boxShadow='0 0 24px #7aa2ff66';
      setTimeout(()=>{ canvas.style.boxShadow='none'; }, 280);
    }

    async function finalizeGesture(){
      if(!strokes.length) return;
      const result=classifyGesture(strokes);
      if(onDetected) onDetected(result, strokes);
      flash(result);
      if (result === 'unknown') {
        if(hintEl) hintEl.textContent='Gesture not recognized. Draw a clear circle (YES) or cross (NO).';
        setTimeout(clearCanvas, 220);
        strokes=[];
        if(onUnknown) onUnknown();
        return;
      }
      if (result === 'yes' || result === 'no') {
        if(hintEl) hintEl.textContent = result==='yes' ? 'YES recognized.' : 'NO recognized.';
        setTimeout(clearCanvas, 220);
        strokes=[];
        await onSubmit(result);
      }
    }

    clearCanvas();
    function begin(ev){
      if(classifyTimer){ clearTimeout(classifyTimer); classifyTimer=null; }
      drawing=true;
      currentStroke=[];
      lastIntentHint='unknown';
      const p=pos(ev);
      currentStroke.push(p);
      if(hintEl) hintEl.textContent='Tracing gesture...';
    }
    function move(ev){
      if(!drawing || !ctx) return;
      const p=pos(ev);
      currentStroke.push(p);
      const prev=currentStroke[currentStroke.length-2];
      if(prev){
        const segLen = Math.hypot(p.x - prev.x, p.y - prev.y);
        const speed = Math.min(1, segLen / 14);
        const dynamicWidth = 8 - (speed * 2.2);

        // soft ink plume layer
        ctx.strokeStyle='rgba(219, 234, 254, 0.28)';
        ctx.lineWidth=dynamicWidth + 2.8;
        ctx.lineCap='round';
        ctx.lineJoin='round';
        ctx.shadowBlur=14;
        ctx.shadowColor='rgba(122, 162, 255, 0.42)';
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // ink core layer
        ctx.strokeStyle='rgba(241, 245, 249, 0.94)';
        ctx.lineWidth=dynamicWidth;
        ctx.lineCap='round';
        ctx.lineJoin='round';
        ctx.shadowBlur=4;
        ctx.shadowColor='rgba(122, 162, 255, 0.25)';
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      if (typeof earlyStrokeIntent === 'function' && currentStroke.length >= 8) {
        const candidate = earlyStrokeIntent(currentStroke);
        if (candidate !== lastIntentHint) {
          lastIntentHint = candidate;
          if (candidate === 'no') {
            if (hintEl) hintEl.textContent = 'NO candidate detected... keep drawing to confirm.';
            console.log(JSON.stringify({ event: 'gesture_intent_candidate', candidate: 'no' }));
          } else if (candidate === 'yes') {
            if (hintEl) hintEl.textContent = 'YES candidate detected... keep drawing to confirm.';
            console.log(JSON.stringify({ event: 'gesture_intent_candidate', candidate: 'yes' }));
          }
        }
      }
    }
    function end(){
      if(!drawing) return;
      drawing=false;
      if(currentStroke.length>2) strokes.push(currentStroke);
      classifyTimer=setTimeout(()=>{ void finalizeGesture(); }, 240);
    }

    canvas.addEventListener('pointerdown', begin);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointerleave', end);
  }

  window.__mountGestureCanvas = mountGestureCanvas;
})();
`;
