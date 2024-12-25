import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table, Space, Switch, Tooltip, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HeartOutlined, HeartFilled, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { RootState } from '../../store';
import ProjectEditor from './ProjectEditor';
import type { Project } from '../../types/models';
import styled from 'styled-components';
import { KawaiiButton, KawaiiCard } from '../../components/anime/AnimeComponents';
import { useSound } from '../../utils/SoundManager';
import { bounceAnimation, fadeInAnimation, hoverAnimation } from '../../components/anime/Animations';
import { Mascot } from '../../components/anime/Mascot';

const PageContainer = styled.div`
  padding: 24px;
  background: var(--anime-background);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: var(--anime-text);
  font-size: 28px;
  margin: 0;
  ${bounceAnimation}
`;

const ViewSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  animation: ${fadeInAnimation} 0.5s ease;
`;

const ProjectCard = styled(KawaiiCard)<{ $isFavorite?: boolean }>`
  ${hoverAnimation}
  position: relative;
  
  .favorite-button {
    position: absolute;
    top: 12px;
    right: 12px;
    color: ${props => props.$isFavorite ? 'var(--anime-primary)' : 'var(--anime-text-secondary)'};
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }

  .project-stats {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    color: var(--anime-text-secondary);
    font-size: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: var(--anime-text-secondary);

  h3 {
    color: var(--anime-text);
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 24px;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: var(--anime-card-background);
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background: var(--anime-header-background);
    color: var(--anime-text);
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid var(--anime-border);
  }

  .ant-table-tbody > tr:hover > td {
    background: var(--anime-hover-background);
  }
`;

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const projects = useSelector((state: RootState) => state.projects.items);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 音效
  const { playSound } = useSound();

  const handleCreate = () => {
    playSound('click');
    setSelectedProject(null);
    setEditorVisible(true);
  };

  const handleEdit = (project: Project) => {
    playSound('click');
    setSelectedProject(project);
    setEditorVisible(true);
  };

  const handleView = (id: string) => {
    playSound('click');
    navigate(`/project/${id}`);
  };

  const toggleFavorite = (id: string) => {
    playSound('click');
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <Space>
          {favorites.has(record.id) && <HeartFilled style={{ color: 'var(--anime-primary)' }} />}
          <a onClick={() => handleView(record.id)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '表数量',
      key: 'tableCount',
      render: (text: string, record: Project) => (
        <Badge count={record.tables?.length || 0} style={{ backgroundColor: 'var(--anime-primary)' }} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: Project) => (
        <Space size="middle">
          <Tooltip title="编辑项目">
            <KawaiiButton
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </KawaiiButton>
          </Tooltip>
          <Tooltip title={favorites.has(record.id) ? '取消收藏' : '收藏项目'}>
            <KawaiiButton
              type="text"
              icon={favorites.has(record.id) ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => toggleFavorite(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderGridView = () => (
    <ProjectGrid>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          $isFavorite={favorites.has(project.id)}
          onClick={() => handleView(project.id)}
        >
          <div 
            className="favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(project.id);
            }}
          >
            {favorites.has(project.id) ? <HeartFilled /> : <HeartOutlined />}
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-stats">
            <span>表数量: {project.tables?.length || 0}</span>
            <span>创建时间: {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <Space style={{ marginTop: 16 }}>
            <KawaiiButton
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(project);
              }}
            >
              编辑
            </KawaiiButton>
          </Space>
        </ProjectCard>
      ))}
    </ProjectGrid>
  );

  const renderEmptyState = () => (
    <EmptyState>
      <Mascot type="happy" />
      <h3>还没有项目呢~</h3>
      <p>创建一个新项目，开始你的数据库建模之旅吧！</p>
      <KawaiiButton type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
        创建项目
      </KawaiiButton>
    </EmptyState>
  );

  return (
    <PageContainer>
      <Header>
        <Space align="center">
          <Title>项目列表</Title>
          <ViewSwitch>
            <Tooltip title={isGridView ? '切换到列表视图' : '切换到网格视图'}>
              <Switch
                checkedChildren={<AppstoreOutlined />}
                unCheckedChildren={<UnorderedListOutlined />}
                checked={isGridView}
                onChange={(checked) => {
                  playSound('click');
                  setIsGridView(checked);
                }}
              />
            </Tooltip>
          </ViewSwitch>
        </Space>
        <KawaiiButton type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建项目
        </KawaiiButton>
      </Header>

      {projects.length === 0 ? (
        renderEmptyState()
      ) : isGridView ? (
        renderGridView()
      ) : (
        <StyledTable
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      )}

      <ProjectEditor
        visible={editorVisible}
        project={selectedProject}
        onCancel={() => setEditorVisible(false)}
      />
    </PageContainer>
  );
};

export default ProjectList; 