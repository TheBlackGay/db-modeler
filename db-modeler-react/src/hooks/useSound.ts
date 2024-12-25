import { useCallback } from 'react';

const clickSound = new Audio('/sounds/click.mp3');
const hoverSound = new Audio('/sounds/hover.mp3');

export const useSound = () => {
  const playClick = useCallback(() => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }, []);

  const playHover = useCallback(() => {
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {});
  }, []);

  return {
    playClick,
    playHover,
  };
}; 