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

const ApiManager: React.FC = () => {
  return (
    <PageContainer>
      <Title>API 管理</Title>
      <KawaiiCard title="开发中">
        <p>API 管理功能正在开发中，敬请期待！</p>
      </KawaiiCard>
    </PageContainer>
  );
};

export default ApiManager; 