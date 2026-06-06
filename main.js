import './styles/main.scss';
import { initCthulhuWatcher } from './scripts/CthulhuWatcher.js';
import { initGSAPAnimations } from './scripts/GSAPAnimations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cthulhu Watcher in the header
  initCthulhuWatcher('watcher-canvas-container');
  
  // Initialize all GSAP animations (Hero, Scrollbar, Intercept clicks)
  initGSAPAnimations();
});
