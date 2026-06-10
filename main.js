import './styles/main.scss';
import { initCthulhuWatcher } from './scripts/CthulhuWatcher.js';
import { initGSAPAnimations } from './scripts/GSAPAnimations.js';
import { initBackgroundVoid } from './scripts/BackgroundVoid.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize the new interactive background
  await initBackgroundVoid();

  // 2. Initialize the main header Watcher
  await initCthulhuWatcher('watcher-canvas-container');
  
  // 3. Initialize GSAP (Animations and Interactions)
  initGSAPAnimations();
});
