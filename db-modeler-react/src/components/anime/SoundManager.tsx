import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Slider, Space } from 'antd';
import { SoundOutlined, SoundFilled } from '@ant-design/icons';
import { setVolume, setMuted } from '../../utils/SoundManager';

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const VolumeControl = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SoundManager: React.FC = () => {
  const [volume, setVolumeState] = useState(50);
  const [muted, setMutedState] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const handleVolumeChange = (value: number) => {
    setVolumeState(value);
    setMutedState(value === 0);
    setVolume(value / 100);
  };

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMutedState(newMuted);
    setMuted(newMuted);
  };

  return (
    <Container>
      {showVolume && (
        <VolumeControl>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>音效音量</div>
            <Slider
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              tooltipVisible={false}
            />
          </Space>
        </VolumeControl>
      )}
      <Button
        type="primary"
        shape="circle"
        icon={muted ? <SoundOutlined /> : <SoundFilled />}
        onClick={handleMuteToggle}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      />
    </Container>
  );
};

export default SoundManager; 