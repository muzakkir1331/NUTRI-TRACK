import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899']
    });
  } catch {
    // Fail-safe jika canvas tidak disokong
  }
}

export function fireSchoolPrideConfetti() {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#10b981', '#38bdf8', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  } catch {
    // Fail-safe
  }
}
