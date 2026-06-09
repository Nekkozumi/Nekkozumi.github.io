import * as PIXI from 'pixi.js';

export async function initCthulhuWatcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const app = new PIXI.Application();
  await app.init({
    width: 200,
    height: 200,
    backgroundAlpha: 0,
    antialias: true,
  });

  container.appendChild(app.canvas);

  const centerX = app.screen.width / 2;
  const centerY = app.screen.height / 2;
  const eyeWidth = 100;
  const eyeHeight = 50;

  const scleraBase = new PIXI.Graphics();
  scleraBase.beginFill(0x1a1a1a);
  scleraBase.moveTo(centerX - eyeWidth, centerY);
  scleraBase.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  scleraBase.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  scleraBase.endFill();
  app.stage.addChild(scleraBase);

  const mask = new PIXI.Graphics();
  mask.beginFill(0xffffff);
  mask.moveTo(centerX - eyeWidth, centerY);
  mask.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  mask.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  mask.endFill();
  app.stage.addChild(mask);

  const pupil = new PIXI.Graphics();

  pupil.beginFill(0x8A1E1E);
  pupil.drawCircle(0, 0, 24);
  pupil.endFill();

  pupil.beginFill(0xD74343);
  pupil.drawCircle(0, 0, 18);
  pupil.endFill();

  pupil.lineStyle(2, 0xA17F67, 0.6);
  pupil.drawCircle(0, 0, 12);
  pupil.lineStyle(0);

  pupil.beginFill(0x080C14);
  pupil.drawEllipse(0, 0, 4, 16);
  pupil.beginFill(0xffffff, 0.6);
  pupil.drawCircle(5, -8, 2);
  pupil.endFill();

  pupil.x = centerX;
  pupil.y = centerY;
  pupil.mask = mask;
  app.stage.addChild(pupil);

  const eyelid = new PIXI.Graphics();
  eyelid.lineStyle(6, 0xA17F67, 0.9);
  eyelid.moveTo(centerX - eyeWidth, centerY);
  eyelid.quadraticCurveTo(centerX, centerY - eyeHeight * 1.5, centerX + eyeWidth, centerY);
  eyelid.quadraticCurveTo(centerX, centerY + eyeHeight * 1.5, centerX - eyeWidth, centerY);
  app.stage.addChild(eyelid);

  if (isMobile) {
    pupil.x = centerX;
    pupil.y = centerY;
    return;
  }

  let targetX = centerX;
  let targetY = centerY;

  const maxRadiusX = 40;
  const maxRadiusY = 20;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const globalCenterX = rect.left + rect.width / 2;
    const globalCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - globalCenterX;
    const dy = e.clientY - globalCenterY;

    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const limitDist = Math.min(distance * 0.1, maxRadiusX);

    targetX = centerX + Math.cos(angle) * limitDist;
    targetY = centerY + Math.sin(angle) * (limitDist * (maxRadiusY/maxRadiusX));
  });

  app.ticker.add(() => {
    pupil.x += (targetX - pupil.x) * 0.1;
    pupil.y += (targetY - pupil.y) * 0.1;
  });
}
