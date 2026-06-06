import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  // 1. Hero Section Animation (Mờ ảo hiện ra)
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

  // 2. Background Shift (Bóng thở)
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

  // 3. Tentacle Scrollbar (ScrollTrigger)
  const tentaclePath = document.querySelector('.tentacle-path');
  if (tentaclePath) {
    const length = tentaclePath.getTotalLength();

    // Set initial state
    gsap.set(tentaclePath, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    // Animate based on scroll
    gsap.to(tentaclePath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5 // Smooth scrubbing
      }
    });
  }

  // 4. Intercept Click (Xúc tu đâm lên)
  const buttons = document.querySelectorAll('.game-btn');
  const strikeTentacle = document.querySelector('.strike-tentacle');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Chặn click

      const rect = btn.getBoundingClientRect();
      const targetName = btn.getAttribute('data-target');

      // Di chuyển xúc tu đến vị trí chính xác của con trỏ chuột
      gsap.set(strikeTentacle, {
        left: e.clientX - 30, // 30 là nửa chiều rộng (60px) của tentacle để căn giữa mũi nhọn
        top: window.innerHeight, // Bắt đầu ẩn tít dưới cùng màn hình
        opacity: 1
      });

      // Animation xúc tu đâm lên
      const tl = gsap.timeline();

      tl.to(strikeTentacle, {
        top: e.clientY, // Đâm thẳng lên đúng toạ độ Y của chuột
        duration: 0.3,
        ease: 'power4.in'
      })
        .to(btn, {
          scale: 0.9, // Nút bị lún xuống
          boxShadow: '0 0 40px rgba(215, 67, 67, 0.8)',
          duration: 0.1
        })
        .to(strikeTentacle, {
          top: window.innerHeight, // Xúc tu rút về dưới đáy màn hình
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.1
        })
        .to(btn, {
          scale: 1, // Nút đàn hồi lại
          boxShadow: '0 0 0px rgba(215, 67, 67, 0)',
          duration: 0.2
        }, '-=0.5')
        .call(() => {
          // Thực thi hành động thật sau khi xong animation
          if (targetName && targetName.startsWith('http')) {
            window.open(targetName, '_blank');
          } else {
            alert(`Bắt đầu khám phá: ${targetName.toUpperCase()}!`);
          }
        });
    });
  });
}
