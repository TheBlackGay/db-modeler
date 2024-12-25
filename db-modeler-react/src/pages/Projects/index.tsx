import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Space, Row, Col, Empty, Spin } from 'antd';
import { PlusOutlined, HeartOutlined, HeartFilled, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { KawaiiButton, KawaiiCard } from '../../components/anime/AnimeComponents';
import { RootState } from '../../store';
import { loadProjects, addProject, updateProject } from '../../store/projectsSlice';
import { Project } from '../../types/models';
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

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const ProjectGrid = styled.div<{ $isGrid: boolean }>`
  display: ${props => props.$isGrid ? 'grid' : 'flex'};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  flex-direction: ${props => props.$isGrid ? 'unset' : 'column'};
`;

const ProjectCard = styled(KawaiiCard)<{ $isGrid: boolean }>`
  height: ${props => props.$isGrid ? '200px' : 'auto'};
  cursor: pointer;
  
  .favorite-icon {
    font-size: 20px;
    color: ${props => props.theme.colors.primary};
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: projects = [], loading } = useSelector((state: RootState) => state.projects);
  const [isGrid, setIsGrid] = useState(true);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    dispatch(loadProjects());
  }, [dispatch]);

  const handleCreateProject = () => {
    playClick();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '新项目',
      description: '这是一个新项目',
      tables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('Creating new project:', newProject);
    dispatch(addProject(newProject));
    console.log('Navigating to project:', newProject.id);
    navigate(`/project/${newProject.id}`);
  };

  const handleToggleFavorite = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    dispatch(updateProject({
      ...project,
      isFavorite: !project.isFavorite,
    }));
  };

  const handleProjectClick = (projectId: string) => {
    playClick();
    console.log('Navigating to project:', projectId);
    navigate(`/project/${projectId}`);
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

  return (
    <PageContainer>
      <Header>
        <Title>我的项目</Title>
        <Space>
          <ViewToggle>
            <KawaiiButton
              type={isGrid ? 'primary' : 'text'}
              icon={<AppstoreOutlined />}
              onClick={() => {
                playClick();
                setIsGrid(true);
              }}
              onMouseEnter={playHover}
            />
            <KawaiiButton
              type={!isGrid ? 'primary' : 'text'}
              icon={<UnorderedListOutlined />}
              onClick={() => {
                playClick();
                setIsGrid(false);
              }}
              onMouseEnter={playHover}
            />
          </ViewToggle>
          <KawaiiButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
            onMouseEnter={playHover}
          >
            创建项目
          </KawaiiButton>
        </Space>
      </Header>

      {!projects || projects.length === 0 ? (
        <Empty description="还没有项目，快来创建一个吧！" />
      ) : (
        <ProjectGrid $isGrid={isGrid}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              $isGrid={isGrid}
              title={project.name}
              extra={
                <div
                  onClick={(e) => handleToggleFavorite(project, e)}
                  className="favorite-icon"
                >
                  {project.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </div>
              }
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={playHover}
            >
              <p>{project.description}</p>
              <p>创建时间：{new Date(project.createdAt).toLocaleString()}</p>
              <p>表格数量：{project.tables?.length || 0}</p>
            </ProjectCard>
          ))}
        </ProjectGrid>
      )}
    </PageContainer>
  );
};

export default Projects; 