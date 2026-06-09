import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  gsap.to('.hero-title', {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 2.5,
    ease: 'power3.out',
    delay: 0.5
  });

  gsap.to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 2,
    ease: 'power2.out',
    delay: 1.5
  });

  gsap.to('.blob-1', {
    x: '20vw',
    y: '10vh',
    scale: 1.2,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.blob-2', {
    x: '-15vw',
    y: '-15vh',
    scale: 0.8,
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1
  });

  const tentaclePath = document.querySelector('.tentacle-path');
  if (tentaclePath) {
    const length = tentaclePath.getTotalLength();

    gsap.set(tentaclePath, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    gsap.to(tentaclePath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    });
  }

  const buttons = document.querySelectorAll('.game-btn');
  const strikeTentacle = document.querySelector('.strike-tentacle');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const rect = btn.getBoundingClientRect();
      const targetName = btn.getAttribute('data-target');

      gsap.set(strikeTentacle, {
        left: e.clientX - 30,
        top: window.innerHeight,
        opacity: 1
      });

      const tl = gsap.timeline();

      tl.to(strikeTentacle, {
        top: e.clientY,
        duration: 0.3,
        ease: 'power4.in'
      })
        .to(btn, {
          scale: 0.9,
          boxShadow: '0 0 40px rgba(215, 67, 67, 0.8)',
          duration: 0.1
        })
        .to(strikeTentacle, {
          top: window.innerHeight,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.1
        })
        .to(btn, {
          scale: 1,
          boxShadow: '0 0 0px rgba(215, 67, 67, 0)',
          duration: 0.2
        }, '-=0.5')
        .call(() => {
          if (targetName && targetName.startsWith('http')) {
            window.open(targetName, '_blank');
          } else {
            alert(`Bắt đầu khám phá: ${targetName.toUpperCase()}!`);
          }
        });
    });
  });
}
