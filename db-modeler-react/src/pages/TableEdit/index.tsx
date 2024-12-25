import React from 'react';
import { useParams } from 'react-router-dom';
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

const TableEdit: React.FC = () => {
  const { projectId, tableId } = useParams<{ projectId: string; tableId: string }>();

  return (
    <PageContainer>
      <Title>表格编辑</Title>
      <KawaiiCard title="开发中">
        <p>表格编辑功能正在开发中，敬请期待！</p>
        <p>项目 ID: {projectId}</p>
        <p>表格 ID: {tableId}</p>
      </KawaiiCard>
    </PageContainer>
  );
};

export default TableEdit; 