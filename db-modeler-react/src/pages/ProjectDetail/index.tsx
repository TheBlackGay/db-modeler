import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Tabs, Spin, Result } from 'antd';
import { KawaiiButton } from '../../components/anime/AnimeComponents';
import { RootState } from '../../store';
import { loadProjects, setCurrentProject } from '../../store/projectsSlice';
import TableEditor from './TableEditor';
import FieldEditor from './FieldEditor';
import ERDiagram from './ERDiagram';
import { useSound } from '../../hooks/useSound';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  margin: 0;
  font-family: ${props => props.theme.fonts.kawaii};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin: 8px 0 0;
`;

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: projects, currentProject, loading, error } = useSelector((state: RootState) => state.projects);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    if (!projects.length) {
      dispatch(loadProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (projectId && (!currentProject || currentProject.id !== projectId)) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        dispatch(setCurrentProject(project));
      }
    }
  }, [dispatch, projectId, projects, currentProject]);

  const handleBack = () => {
    playClick();
    dispatch(setCurrentProject(null));
    navigate('/projects');
  };

  const handleTableClick = (tableId: string) => {
    playClick();
    setActiveTableId(tableId);
  };

  const handleBackToTables = () => {
    playClick();
    setActiveTableId(null);
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!currentProject) {
    return (
      <PageContainer>
        <Result
          status="error"
          title="加载失败"
          subTitle="项目不存在"
          extra={
            <KawaiiButton
              type="primary"
              onClick={handleBack}
              onMouseEnter={playHover}
            >
              返回项目列表
            </KawaiiButton>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>{currentProject.name}</Title>
          <Description>{currentProject.description}</Description>
        </div>
        <KawaiiButton
          onClick={handleBack}
          onMouseEnter={playHover}
        >
          返回项目列表
        </KawaiiButton>
      </Header>

      {activeTableId ? (
        <FieldEditor
          projectId={currentProject.id}
          tableId={activeTableId}
          onBack={handleBackToTables}
        />
      ) : (
        <Tabs
          defaultActiveKey="tables"
          items={[
            {
              key: 'tables',
              label: '表管理',
              children: (
                <TableEditor
                  projectId={currentProject.id}
                  tables={currentProject.tables}
                  onTableClick={handleTableClick}
                />
              ),
            },
            {
              key: 'er',
              label: 'ER图',
              children: <ERDiagram />,
            },
          ]}
        />
      )}
    </PageContainer>
  );
};

export default ProjectDetail; 