import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Space, Row, Col, Empty, Spin, Button, Checkbox, Popconfirm, message } from 'antd';
import { PlusOutlined, HeartOutlined, HeartFilled, AppstoreOutlined, UnorderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import { KawaiiButton, KawaiiCard } from '../../components/anime/AnimeComponents';
import { RootState } from '../../store';
import { loadProjects, addProject, updateProject, deleteProject } from '../../store/projectsSlice';
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

const ProjectCard = styled(KawaiiCard)<{ $isGrid: boolean; $isSelected?: boolean }>`
  height: ${props => props.$isGrid ? '200px' : 'auto'};
  cursor: default;
  background: ${props => props.theme.colors.cardBackground || '#f8f9fa'};
  border: 2px solid ${props => props.$isSelected ? 'var(--ant-color-primary)' : '#e1e4e8'};
  box-shadow: ${props => props.$isSelected 
    ? '0 0 12px rgba(255, 105, 180, 0.35)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isSelected 
      ? '0 0 16px rgba(255, 105, 180, 0.4)' 
      : '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)'};
  }
  
  .favorite-icon {
    font-size: 20px;
    color: ${props => props.theme.colors.primary};
    transition: all 0.3s ease;
    padding: 4px;
    border-radius: 50%;

    &:hover {
      transform: scale(1.2);
      background: rgba(255, 192, 203, 0.1);
    }
  }

  .card-top {
    cursor: pointer;
    padding: 16px;
    background: ${props => props.$isSelected ? 'rgba(255, 105, 180, 0.05)' : 'transparent'};
    border-bottom: 1px solid #e1e4e8;
    font-weight: 500;
    font-size: 16px;
    color: ${props => props.theme.colors.text || '#2f3542'};
    transition: background-color 0.3s ease;

    &:hover {
      background: rgba(255, 192, 203, 0.08);
    }
  }

  .card-content {
    padding: 16px;
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary || '#666'};
    
    p {
      margin-bottom: 8px;
      line-height: 1.5;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: projects = [], loading } = useSelector((state: RootState) => state.projects);
  const [isGrid, setIsGrid] = useState(true);
  const { playClick, playHover } = useSound();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

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

  const toggleSelection = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setSelectedKeys(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    playClick();
    setSelectedKeys(prev => 
      prev.length === projects.length ? [] : projects.map(p => p.id)
    );
  };

  const handleBatchDelete = () => {
    playClick();
    selectedKeys.forEach(id => {
      dispatch(deleteProject(id));
    });
    setSelectedKeys([]);
    message.success(`已删除 ${selectedKeys.length} 个项目`);
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
          {selectedKeys.length > 0 ? (
            <Space>
              <span>已选择 {selectedKeys.length} 个项目</span>
              <Button onClick={handleSelectAll}>
                {selectedKeys.length === projects.length ? '取消全选' : '全选'}
              </Button>
              <Popconfirm
                title={`确定要删除选中的 ${selectedKeys.length} 个项目吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          ) : (
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
          )}
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
              $isSelected={selectedKeys.includes(project.id)}
              title={
                <div className="card-top" onClick={(e) => toggleSelection(project.id, e)}>
                  {project.name}
                </div>
              }
              extra={
                <div
                  onClick={(e) => handleToggleFavorite(project, e)}
                  className="favorite-icon"
                >
                  {project.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </div>
              }
              onMouseEnter={playHover}
            >
              <div className="card-content" onClick={() => handleProjectClick(project.id)}>
                <p>{project.description}</p>
                <p>创建时间：{new Date(project.createdAt).toLocaleString()}</p>
                <p>表格数量：{project.tables?.length || 0}</p>
              </div>
            </ProjectCard>
          ))}
        </ProjectGrid>
      )}
    </PageContainer>
  );
};

export default Projects; 