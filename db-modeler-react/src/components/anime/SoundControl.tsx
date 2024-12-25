import React from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { bounceAnimation, pulseAnimation } from './Animations';
import { SoundOutlined, SoundFilled } from '@ant-design/icons';
import { useSound } from '../../hooks/useSound';

const SoundButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary};
  border-color: ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 1000;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    border-color: ${props => props.theme.colors.secondary};
    animation: ${bounceAnimation} 0.5s ease;
  }

  .anticon {
    font-size: 20px;
    color: white;
    animation: ${pulseAnimation} 2s ease infinite;
  }
`;

const SoundControl: React.FC = () => {
  const [isMuted, setIsMuted] = React.useState(false);
  const { playClick } = useSound();

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playClick();
  };

  return (
    <Tooltip title={isMuted ? "开启音效" : "关闭音效"} placement="left">
      <SoundButton onClick={toggleMute} type="primary">
        {isMuted ? <SoundOutlined /> : <SoundFilled />}
      </SoundButton>
    </Tooltip>
  );
};

export default SoundControl; 