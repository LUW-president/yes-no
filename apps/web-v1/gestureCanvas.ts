export const gestureCanvasClientJs = String.raw`
(function(){
  function mountGestureCanvas(options){
    const { canvas, hintEl, classifyGesture, predictEarlyIntent, onSubmit, onUnknown, onDetected, onEarlyIntent } = options;
    if(!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let drawing=false;
    let currentStroke=[];
    let strokes=[];
    let classifyTimer=null;
    let earlyIntent='unknown';

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
      if(kind==='yes') canvas.style.boxShadow='0 0 24px #33d17a88';
      else if(kind==='no') canvas.style.boxShadow='0 0 24px #ff6b6b88';
      else canvas.style.boxShadow='0 0 24px #7aa2ff66';
      setTimeout(()=>{ canvas.style.boxShadow='none'; }, 280);
    }

    async function finalizeGesture(){
      if(!strokes.length) return;
      const result=classifyGesture(strokes);
      if(onDetected) onDetected(result, strokes);
      flash(result);
      earlyIntent='unknown';
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
      const p=pos(ev);
      currentStroke.push(p);
      earlyIntent='unknown';
      if(hintEl) hintEl.textContent='Tracing gesture...';
    }
    function move(ev){
      if(!drawing || !ctx) return;
      const p=pos(ev);
      currentStroke.push(p);
      if(predictEarlyIntent && currentStroke.length>=6){
        const candidate=predictEarlyIntent(currentStroke);
        if(candidate!==earlyIntent){
          earlyIntent=candidate;
          if(onEarlyIntent) onEarlyIntent(candidate);
        }
      }
      const prev=currentStroke[currentStroke.length-2];
      if(prev){
        ctx.strokeStyle='#dbeafe';
        ctx.lineWidth=3;
        ctx.lineCap='round';
        ctx.shadowBlur=6;
        ctx.shadowColor='#7aa2ff88';
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
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
