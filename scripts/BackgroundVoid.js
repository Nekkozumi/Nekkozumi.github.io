import * as PIXI from 'pixi.js';

export async function initBackgroundVoid() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const app = new PIXI.Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    background: 0x05070a, // Gloomy very dark blue/grey
    antialias: false, // background doesn't need high antialias
  });

  // Style the canvas to sit fixed at the bottom
  app.canvas.style.position = 'fixed';
  app.canvas.style.top = '0';
  app.canvas.style.left = '0';
  app.canvas.style.width = '100vw';
  app.canvas.style.height = '100vh';
  app.canvas.style.zIndex = '-2';
  app.canvas.style.pointerEvents = 'none';

  document.body.prepend(app.canvas);

  const tentaclesContainer = new PIXI.Container();
  // Add strong blur to push them into the background
  const blurFilter = new PIXI.BlurFilter();
  blurFilter.blur = 15;
  tentaclesContainer.filters = [blurFilter];
  tentaclesContainer.alpha = 0.5;

  app.stage.addChild(tentaclesContainer);

  const tentacles = [];
  const numTentacles = isMobile ? 8 : 15;

  for (let i = 0; i < numTentacles; i++) {
    const t = new PIXI.Graphics();
    tentaclesContainer.addChild(t);

    tentacles.push({
      gfx: t,
      baseX: Math.random() * window.innerWidth,
      baseY: Math.random() * window.innerHeight,
      angle: Math.random() * Math.PI * 2,
      length: 500 + Math.random() * 500,
      thickness: 40 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      waviness: 40 + Math.random() * 60,
      segments: 15,
      // Color: Dark greenish/brownish grey
      color: Math.random() > 0.5 ? 0x0a1210 : 0x120a0a 
    });
  }

  let time = 0;
  let mouseX = -1000;
  let mouseY = -1000;

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    // Remove mouse when it leaves window
    document.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });
  }

  app.ticker.add(() => {
    time += 1;

    tentacles.forEach(t => {
      t.gfx.clear();
      
      const segmentLen = t.length / t.segments;
      let prevX = t.baseX;
      let prevY = t.baseY;

      // Slow drifting of base position
      t.baseX += Math.cos(t.angle) * 0.2;
      t.baseY += Math.sin(t.angle) * 0.2;

      // Wrap around screen
      if (t.baseX > window.innerWidth + 200) t.baseX = -200;
      if (t.baseX < -200) t.baseX = window.innerWidth + 200;
      if (t.baseY > window.innerHeight + 200) t.baseY = -200;
      if (t.baseY < -200) t.baseY = window.innerHeight + 200;

      for(let s = 0; s < t.segments; s++) {
        const segDist = s * segmentLen;
        const width = t.thickness * (1 - s/t.segments);
        
        let wave = Math.sin(time * t.speed + t.phase + s * 0.1) * (t.waviness * (s/t.segments));
        let currentAngle = t.angle + wave * 0.01;
        
        let px = t.baseX + Math.cos(currentAngle) * segDist;
        let py = t.baseY + Math.sin(currentAngle) * segDist;

        // Repulsion from mouse (only if not mobile)
        if (!isMobile) {
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 300) {
            const force = (300 - dist) / 300; // 0 to 1
            px += (dx / dist) * force * 50; // Push away
            py += (dy / dist) * force * 50;
          }
        }

        t.gfx.beginFill(t.color);
        t.gfx.drawCircle(px, py, width);
        t.gfx.endFill();
      }
    });
  });

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
}
