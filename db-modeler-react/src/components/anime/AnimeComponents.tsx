import React from 'react';
import styled from 'styled-components';
import { Button, Card } from 'antd';
import {
  pulseAnimation,
  hoverAnimation,
  buttonAnimation,
  cardAnimation,
  sparkleEffect
} from './Animations';

export const KawaiiButton = styled(Button)`
  ${buttonAnimation}
  border-radius: 20px;
  font-family: ${props => props.theme.fonts.kawaii};
  
  &.ant-btn-primary {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    
    &:hover {
      background: ${props => props.theme.colors.secondary};
      border-color: ${props => props.theme.colors.secondary};
    }
  }
`;

export const KawaiiCard = styled(Card)`
  ${cardAnimation}
  border-radius: ${props => props.theme.borderRadius.large};
  border-color: ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundLight};
  
  .ant-card-head {
    background: ${props => props.theme.colors.background};
    border-top-left-radius: ${props => props.theme.borderRadius.large};
    border-top-right-radius: ${props => props.theme.borderRadius.large};
  }
  
  .ant-card-head-title {
    font-family: ${props => props.theme.fonts.kawaii};
    color: ${props => props.theme.colors.primary};
  }
`;

export const KawaiiContainer = styled.div`
  ${sparkleEffect}
  padding: ${props => props.theme.spacing.large};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
`;

export const KawaiiTitle = styled.h1`
  font-family: ${props => props.theme.fonts.kawaii};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.large};
  ${hoverAnimation}
`;

export const KawaiiText = styled.p`
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.primary};
  line-height: 1.6;
`;

export const KawaiiIcon = styled.span`
  display: inline-block;
  animation: ${pulseAnimation} 2s ease infinite;
  color: ${props => props.theme.colors.primary};
`; 