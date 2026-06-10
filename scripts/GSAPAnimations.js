import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { openCthulhuEye } from './CthulhuWatcher.js';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  // --- INTRO SEQUENCE ---
  const tlIntro = gsap.timeline();

  // Initial state: Eye is large and in the center of the screen
  gsap.set('#cthulhu-header', { y: '30vh', scale: 3, transformOrigin: 'center center' });
  gsap.set('#app-content', { opacity: 0 });

  // 1. Wait in the dark for 1 second
  tlIntro.to({}, { duration: 1 })
  // 2. Open Eye
  .add(() => {
    openCthulhuEye(2000); // Takes 2 seconds to open fully
  })
  .to({}, { duration: 2 }) // Wait for eye to open
  // 3. Zoom out to header position
  .to('#cthulhu-header', { 
    y: 0, 
    scale: 1, 
    duration: 2.5, 
    ease: 'power3.inOut' 
  })
  // 4. Fade in the rest of the site content
  .to('#app-content', { 
    opacity: 1, 
    duration: 2, 
    ease: 'power2.out' 
  }, "-=1.5");

  // Hero text animations (after intro)
  gsap.to('.hero-title', {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 2.5,
    ease: 'power3.out',
    delay: 4
  });


  // --- TENTACLE SCROLLBAR ---
  const tentaclePath = document.querySelector('.tentacle-path');
  if (tentaclePath) {
    const pathLength = tentaclePath.getTotalLength();
    gsap.set(tentaclePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    gsap.to(tentaclePath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }

  // --- BUTTON HOVER & CLICK INTERCEPT ---
  const buttons = document.querySelectorAll('.game-btn');
  const strikeTentacle = document.querySelector('.strike-tentacle');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btn.getAttribute('data-target');

      // Tentacle strike animation
      gsap.to(strikeTentacle, {
        top: '20vh',
        ease: 'power4.out',
        duration: 0.3,
        onComplete: () => {
          // Intense Glitch Effect
          gsap.to('.noise-overlay', { opacity: 0.9, duration: 0.1 });
          
          const glitchTween = gsap.to('body', { 
            x: 'random(-15, 15)', 
            y: 'random(-15, 15)', 
            rotate: 'random(-2, 2)',
            filter: 'invert(1) hue-rotate(90deg)',
            duration: 0.05, 
            yoyo: true, 
            repeat: 18 // even number so yoyo ends on "normal" state
          });
          
          // Wait for glitch to fully finish, then clean up
          glitchTween.then(() => {
            // Kill any leftover tweens on body
            gsap.killTweensOf('body');
            
            // Explicitly reset only the properties we animated (not clearProps)
            gsap.set('body', { 
              x: 0, 
              y: 0, 
              rotation: 0, 
              filter: 'none' 
            });
            gsap.set('.noise-overlay', { opacity: 0.06 });
            gsap.set(strikeTentacle, { top: '100vh' });

            if (targetUrl && targetUrl.startsWith('http')) {
              window.open(targetUrl, '_blank');
            } else {
              alert("The void consumes your request... (Chuyển trang đến: " + targetUrl + ")");
            }
          });
        }
      });
    });
  });
}
