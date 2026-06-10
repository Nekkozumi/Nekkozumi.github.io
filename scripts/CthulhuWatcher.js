import * as PIXI from 'pixi.js';

export let cthulhuWatcherApp;
let eyeOpenProgress = 0; // 0 = closed, 1 = open

export function openCthulhuEye(duration = 2000) {
  const startTime = performance.now();
  
  function animateEye(time) {
    let progress = (time - startTime) / duration;
    if (progress > 1) progress = 1;
    
    // Easing function (easeOutExpo)
    eyeOpenProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    if (progress < 1) {
      requestAnimationFrame(animateEye);
    }
  }
  requestAnimationFrame(animateEye);
}

export async function initCthulhuWatcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const app = new PIXI.Application();
  cthulhuWatcherApp = app;
  
  await app.init({
    width: window.innerWidth,
    height: 300,
    backgroundAlpha: 0,
    antialias: true,
  });

  container.appendChild(app.canvas);

  const centerX = app.screen.width / 2;
  const centerY = app.screen.height / 2;
  const eyeWidth = 100;
  const maxEyeHeight = 50;

  // --- PROCEDURAL TENTACLES ---
  const tentaclesContainer = new PIXI.Container();
  app.stage.addChild(tentaclesContainer);

  const tentacles = [];
  const numTentacles = 8;
  
  for (let i = 0; i < numTentacles; i++) {
    const t = new PIXI.Graphics();
    tentaclesContainer.addChild(t);
    
    const angle = (i / numTentacles) * Math.PI * 2;
    if (angle > Math.PI * 0.3 && angle < Math.PI * 0.7) continue; 
    if (angle > Math.PI * 1.3 && angle < Math.PI * 1.7) continue;

    tentacles.push({
      gfx: t,
      angle: angle,
      length: 300 + Math.random() * 300, // Longer tentacles
      thickness: 15 + Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.02,
      waviness: 20 + Math.random() * 20,
      segments: 20
    });
  }

  let time = 0;

  // Static Elements container
  const eyeContainer = new PIXI.Container();
  app.stage.addChild(eyeContainer);

  const scleraBase = new PIXI.Graphics();
  const mask = new PIXI.Graphics();
  
  // --- PUPIL ---
  const pupil = new PIXI.Graphics();
  pupil.beginFill(0x5A0E0E); pupil.drawCircle(0, 0, 26); pupil.endFill();
  pupil.beginFill(0x8A1E1E); pupil.drawCircle(0, 0, 24); pupil.endFill();
  pupil.beginFill(0xD74343); pupil.drawCircle(0, 0, 18); pupil.endFill();
  pupil.lineStyle(2, 0xA17F67, 0.6); pupil.drawCircle(0, 0, 12); pupil.lineStyle(0);
  pupil.beginFill(0x05080A); pupil.drawEllipse(0, 0, 4, 16);
  pupil.beginFill(0xffffff, 0.8); pupil.drawCircle(5, -8, 2);
  pupil.beginFill(0xffffff, 0.3); pupil.drawCircle(-4, 10, 1); pupil.endFill();
  
  pupil.mask = mask;
  
  eyeContainer.addChild(scleraBase);
  eyeContainer.addChild(mask);
  eyeContainer.addChild(pupil);

  const eyelid = new PIXI.Graphics();
  eyeContainer.addChild(eyelid);

  let targetX = centerX;
  let targetY = centerY;
  const maxRadiusX = 40;
  const maxRadiusY = 20;

  // Touch and Mouse Tracking
  function updateTarget(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const globalCenterX = rect.left + rect.width / 2;
    const globalCenterY = rect.top + rect.height / 2;

    const dx = clientX - globalCenterX;
    const dy = clientY - globalCenterY;

    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const limitDist = Math.min(distance * 0.1, maxRadiusX);

    targetX = centerX + Math.cos(angle) * limitDist;
    targetY = centerY + Math.sin(angle) * (limitDist * (maxRadiusY/maxRadiusX));
  }

  if (isMobile) {
    window.addEventListener('touchstart', (e) => {
      if(e.touches.length > 0) updateTarget(e.touches[0].clientX, e.touches[0].clientY);
    });
    window.addEventListener('touchmove', (e) => {
      if(e.touches.length > 0) updateTarget(e.touches[0].clientX, e.touches[0].clientY);
    });
    window.addEventListener('touchend', () => {
      // Slowly return to center
      targetX = centerX;
      targetY = centerY;
    });
  } else {
    window.addEventListener('mousemove', (e) => {
      updateTarget(e.clientX, e.clientY);
    });
  }

  // Set initial pupil position
  pupil.x = centerX;
  pupil.y = centerY;

  // --- ANIMATION LOOP ---
  app.ticker.add(() => {
    time += 1;

    // Pupil movement
    pupil.x += (targetX - pupil.x) * 0.1;
    pupil.y += (targetY - pupil.y) * 0.1;

    // Redraw Eyelids & Mask based on eyeOpenProgress
    const currentEyeHeight = maxEyeHeight * 1.5 * eyeOpenProgress;
    
    scleraBase.clear();
    mask.clear();
    eyelid.clear();

    if (eyeOpenProgress > 0.01) {
      scleraBase.beginFill(0x111111);
      scleraBase.moveTo(centerX - eyeWidth, centerY);
      scleraBase.quadraticCurveTo(centerX, centerY - currentEyeHeight, centerX + eyeWidth, centerY);
      scleraBase.quadraticCurveTo(centerX, centerY + currentEyeHeight, centerX - eyeWidth, centerY);
      scleraBase.endFill();
      
      // Simple veins
      scleraBase.lineStyle(1, 0x550000, 0.4);
      for(let i=0; i<15; i++) {
        const vAngle = (i/15) * Math.PI * 2;
        scleraBase.moveTo(centerX, centerY);
        scleraBase.lineTo(centerX + Math.cos(vAngle) * eyeWidth*0.7, centerY + Math.sin(vAngle) * currentEyeHeight*0.7);
      }

      mask.beginFill(0xffffff);
      mask.moveTo(centerX - eyeWidth, centerY);
      mask.quadraticCurveTo(centerX, centerY - currentEyeHeight, centerX + eyeWidth, centerY);
      mask.quadraticCurveTo(centerX, centerY + currentEyeHeight, centerX - eyeWidth, centerY);
      mask.endFill();
    } else {
      // Completely closed, draw a dark line
      scleraBase.lineStyle(4, 0x111111);
      scleraBase.moveTo(centerX - eyeWidth, centerY);
      scleraBase.lineTo(centerX + eyeWidth, centerY);
    }

    eyelid.lineStyle(8, 0x1A1512, 1);
    eyelid.moveTo(centerX - eyeWidth, centerY);
    eyelid.quadraticCurveTo(centerX, centerY - currentEyeHeight, centerX + eyeWidth, centerY);
    eyelid.quadraticCurveTo(centerX, centerY + currentEyeHeight, centerX - eyeWidth, centerY);
    
    eyelid.lineStyle(2, 0x3A251A, 0.8);
    eyelid.moveTo(centerX - eyeWidth + 2, centerY);
    eyelid.quadraticCurveTo(centerX, centerY - currentEyeHeight*0.9, centerX + eyeWidth - 2, centerY);
    eyelid.quadraticCurveTo(centerX, centerY + currentEyeHeight*0.9, centerX - eyeWidth + 2, centerY);

    // Tentacle procedural animation
    tentacles.forEach(t => {
      t.gfx.clear();
      const segmentLen = t.length / t.segments;
      for(let s = 0; s < t.segments; s++) {
        const segDist = s * segmentLen;
        const width = t.thickness * (1 - s/t.segments);
        const wave = Math.sin(time * t.speed + t.phase + s * 0.2) * (t.waviness * (s/t.segments));
        const currentAngle = t.angle + wave * 0.01;
        
        const px = centerX + Math.cos(currentAngle) * segDist;
        const py = centerY + Math.sin(currentAngle) * segDist;
        
        t.gfx.beginFill(0x151515);
        t.gfx.drawCircle(px, py, width);
        t.gfx.endFill();
        
        if (s % 3 === 0 && s > 0 && s < t.segments - 2) {
          t.gfx.beginFill(0x3A1515);
          t.gfx.drawCircle(px + Math.cos(currentAngle + Math.PI/2) * (width * 0.8), py + Math.sin(currentAngle + Math.PI/2) * (width * 0.8), width * 0.3);
          t.gfx.endFill();
        }
      }
    });
  });

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, 300);
  });
}
