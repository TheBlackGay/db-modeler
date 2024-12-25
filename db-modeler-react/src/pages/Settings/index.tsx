import React from 'react';
import styled from 'styled-components';
import { KawaiiCard } from '../../components/anime/AnimeComponents';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: var(--anime-background);
`;

const Title = styled.h1`
  color: var(--anime-text);
  font-size: 24px;
  margin-bottom: 24px;
`;

const Settings: React.FC = () => {
  return (
    <PageContainer>
      <Title>系统设置</Title>
      <KawaiiCard title="开发中">
        <p>系统设置功能正在开发中，敬请期待！</p>
      </KawaiiCard>
    </PageContainer>
  );
};

export default Settings; 