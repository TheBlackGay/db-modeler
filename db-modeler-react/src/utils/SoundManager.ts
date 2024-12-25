import { useCallback } from 'react';

const clickSound = new Audio('/sounds/click.mp3');
const hoverSound = new Audio('/sounds/hover.mp3');

let volume = 0.5;
let isMuted = false;

export const setVolume = (value: number) => {
  volume = value;
  if (!isMuted) {
    clickSound.volume = value;
    hoverSound.volume = value;
  }
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  clickSound.volume = muted ? 0 : volume;
  hoverSound.volume = muted ? 0 : volume;
};

export const useSound = () => {
  const playClick = useCallback(() => {
    if (!isMuted) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }, []);

  const playHover = useCallback(() => {
    if (!isMuted) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    }
  }, []);

  return {
    playClick,
    playHover,
  };
}; 