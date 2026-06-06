import * as PIXI from 'pixi.js';

export async function initCthulhuWatcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Detect mobile
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Initialize PixiJS Application
  const app = new PIXI.Application();
  await app.init({
    width: 200,
    height: 200,
    backgroundAlpha: 0, // Transparent background
    antialias: true,
  });

  container.appendChild(app.canvas);

  // Center coordinates
  const centerX = app.screen.width / 2;
  const centerY = app.screen.height / 2;
  const eyeWidth = 100;
  const eyeHeight = 50;

  // 1. Create the Sclera Base (Background of the eye)
  const scleraBase = new PIXI.Graphics();
  scleraBase.beginFill(0x1a1a1a); // Dark void inside the eye
  scleraBase.moveTo(centerX - eyeWidth, centerY);
  scleraBase.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  scleraBase.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  scleraBase.endFill();
  app.stage.addChild(scleraBase);

  // 2. Create the Mask (to clip the pupil exactly to the eye bounds)
  const mask = new PIXI.Graphics();
  mask.beginFill(0xffffff);
  mask.moveTo(centerX - eyeWidth, centerY);
  mask.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  mask.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  mask.endFill();
  app.stage.addChild(mask);

  // 3. Create the complex Pupil/Iris
  const pupil = new PIXI.Graphics();
  
  // Outer Iris Ring (Darker Crimson)
  pupil.beginFill(0x8A1E1E);
  pupil.drawCircle(0, 0, 24);
  pupil.endFill();

  // Inner Iris (Bright Crimson)
  pupil.beginFill(0xD74343);
  pupil.drawCircle(0, 0, 18);
  pupil.endFill();

  // Golden/Taupe ring detail for mystical vibe
  pupil.lineStyle(2, 0xA17F67, 0.6);
  pupil.drawCircle(0, 0, 12);
  pupil.lineStyle(0); // reset line style

  // The Void Slit (The actual black pupil)
  pupil.beginFill(0x080C14);
  pupil.drawEllipse(0, 0, 4, 16);
  // Add a tiny catchlight (reflection) to make it look wet/alive
  pupil.beginFill(0xffffff, 0.6);
  pupil.drawCircle(5, -8, 2);
  pupil.endFill();

  pupil.x = centerX;
  pupil.y = centerY;
  pupil.mask = mask; // Apply mask
  app.stage.addChild(pupil);

  // 4. Create the Eyelid Overlay (The thick border drawn ON TOP of the pupil)
  // This completely hides any "spilling" effect because the pupil slides UNDER the eyelid
  const eyelid = new PIXI.Graphics();
  eyelid.lineStyle(6, 0xA17F67, 0.9); // Thicker Taupe border
  eyelid.moveTo(centerX - eyeWidth, centerY);
  eyelid.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  eyelid.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  app.stage.addChild(eyelid);

  if (isMobile) {
    // Mobile: Look straight, no event tracking
    pupil.x = centerX;
    pupil.y = centerY;
    return;
  }

  // Desktop: Mouse tracking
  // We need to track mouse position globally
  let targetX = centerX;
  let targetY = centerY;
  
  // Max distance the pupil can move from the center
  const maxRadiusX = 40;
  const maxRadiusY = 20;

  window.addEventListener('mousemove', (e) => {
    // Get container bounds to find relative center on screen
    const rect = container.getBoundingClientRect();
    const globalCenterX = rect.left + rect.width / 2;
    const globalCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - globalCenterX;
    const dy = e.clientY - globalCenterY;
    
    // Angle and raw distance
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Limit the movement based on the ellipse ratio
    // A simple approximation for boundary
    const limitDist = Math.min(distance * 0.1, maxRadiusX); // Scale down movement
    
    // Calculate new target position
    targetX = centerX + Math.cos(angle) * limitDist;
    targetY = centerY + Math.sin(angle) * (limitDist * (maxRadiusY/maxRadiusX));
  });

  // Animation loop for smooth movement (lerp)
  app.ticker.add(() => {
    pupil.x += (targetX - pupil.x) * 0.1;
    pupil.y += (targetY - pupil.y) * 0.1;
  });
}
