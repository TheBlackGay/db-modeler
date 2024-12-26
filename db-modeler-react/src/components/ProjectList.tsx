import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Popconfirm, message, Card, Checkbox, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { RootState } from '../store';
import { deleteProject, batchDeleteProjects } from '../store/projectsSlice';
import { Project } from '../types/models';
import styled from 'styled-components';

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const ProjectCard = styled(Card)<{ $isSelected: boolean }>`
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$isSelected ? 'var(--ant-color-primary)' : 'transparent'};
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(255, 105, 180, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)'};
  padding: 0;

  .ant-card-body {
    padding: 0;
  }
`;

const CardTop = styled.div`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors?.background || '#fff'};
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 192, 203, 0.1);
  }

  .project-title-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .favorite-button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #ff69b4;
    font-size: 20px;
    padding: 4px;
    display: flex;
    align-items: center;
  }
`;

const CardBottom = styled.div`
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 192, 203, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .selection-info {
    color: #666;
    font-size: 14px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
`;

const ProjectTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ProjectInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ProjectActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ProjectList: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { items: projects, loading } = useSelector((state: RootState) => state.projects);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
    message.success('项目已删除');
  };

  const handleBatchDelete = () => {
    if (selectedKeys.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    dispatch(batchDeleteProjects(selectedKeys));
    setSelectedKeys([]);
    message.success(`已删除 ${selectedKeys.length} 个项目`);
  };

  const toggleSelection = (id: string) => {
    setSelectedKeys(prev => 
      prev.includes(id) 
        ? prev.filter(key => key !== id)
        : [...prev, id]
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id)
        ? prev.filter(key => key !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedKeys.length === projects.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(projects.map(p => p.id));
    }
  };

  const handleProjectClick = (project: Project) => {
    window.location.href = `/project/${project.id}`;
  };

  return (
    <div>
      <Header>
        <div className="action-buttons">
          <Button
            onClick={handleSelectAll}
          >
            {selectedKeys.length === projects.length ? '取消全选' : '全选'}
          </Button>
          {selectedKeys.length > 0 && (
            <Popconfirm
              title={`确定要删除选中的 ${selectedKeys.length} 个项目吗？`}
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
              >
                批量删除
              </Button>
            </Popconfirm>
          )}
        </div>
        <div className="selection-info">
          {selectedKeys.length > 0 ? 
            `已选择 ${selectedKeys.length} 个项目` : 
            '可以选择多个项目进行批量操作'
          }
        </div>
      </Header>

      <ProjectGrid>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            $isSelected={selectedKeys.includes(project.id)}
          >
            <CardTop
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSelection(project.id);
              }}
            >
              <div className="project-title-wrapper">
                <Checkbox
                  checked={selectedKeys.includes(project.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelection(project.id);
                  }}
                />
                <ProjectTitle>{project.name}</ProjectTitle>
              </div>
              <button
                className="favorite-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
              >
                {favorites.includes(project.id) ? <HeartFilled /> : <HeartOutlined />}
              </button>
            </CardTop>

            <CardBottom
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleProjectClick(project);
              }}
            >
              <ProjectInfo>创建时间：{new Date(project.createdAt).toLocaleString()}</ProjectInfo>
              <ProjectInfo>表格数量：{project.tables.length}</ProjectInfo>
              <ProjectActions>
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    /* 编辑功能 */
                  }}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确定要删除这个项目吗？"
                  onConfirm={(e) => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    handleDelete(project.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </ProjectActions>
            </CardBottom>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </div>
  );
};

export default ProjectList; 