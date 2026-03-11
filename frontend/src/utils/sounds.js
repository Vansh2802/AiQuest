// Retro sound effects using Web Audio API
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playTone(frequency, duration, type = 'square', volume = 0.15) {
  if (!audioCtx) return;
  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playClick() {
  playTone(800, 0.08, 'square', 0.1);
}

export function playCorrect() {
  playTone(523, 0.12, 'square', 0.12);
  setTimeout(() => playTone(659, 0.12, 'square', 0.12), 100);
  setTimeout(() => playTone(784, 0.18, 'square', 0.12), 200);
}

export function playWrong() {
  playTone(200, 0.2, 'sawtooth', 0.1);
  setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.1), 150);
}

export function playLevelUp() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, 'square', 0.15), i * 120);
  });
}

export function playXP() {
  playTone(1200, 0.06, 'sine', 0.08);
  setTimeout(() => playTone(1400, 0.06, 'sine', 0.08), 60);
}
