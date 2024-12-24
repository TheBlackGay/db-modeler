import React, { useState } from 'react';
import styled from 'styled-components';
import { soundManager } from '../../utils/SoundManager';
import { bounce } from './Animations';

const SoundControlContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SoundButton = styled.button<{ $isMuted?: boolean }>`
  background: white;
  border: 2px solid var(--anime-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
  
  &:hover {
    transform: scale(1.1);
    animation: ${bounce} 0.5s ease;
  }

  &::before {
    content: ${props => props.$isMuted ? '"🔇"' : '"🔊"'};
    font-size: 20px;
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 80px;
  height: 4px;
  background: var(--anime-secondary);
  border-radius: 2px;
  outline: none;
  opacity: 0;
  transition: all 0.3s ease;
  transform: rotate(-90deg);
  transform-origin: 40px 40px;
  position: absolute;
  bottom: 40px;
  left: -20px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--anime-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  ${SoundControlContainer}:hover & {
    opacity: 1;
  }
`;

const SoundControl: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());
  const [volume, setVolume] = useState(0.5);

  const handleToggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(soundManager.isSoundMuted());
    soundManager.play('click');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
    soundManager.play('pop');
  };

  return (
    <SoundControlContainer>
      <VolumeSlider
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
      />
      <SoundButton
        $isMuted={isMuted}
        onClick={handleToggleMute}
        title={isMuted ? "开启音效" : "关闭音效"}
      />
    </SoundControlContainer>
  );
};

export default SoundControl; 