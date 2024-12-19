import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Space, Empty, Typography, Tag, Spin } from 'antd';
import { 
  PlusOutlined, 
  TableOutlined, 
  DatabaseOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { RootState } from '../../store';
import { setCurrentProject } from '../../store/projectsSlice';

const { Title, Text } = Typography;

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const project = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );
  const loading = useSelector((state: RootState) => state.projects.loading);

  useEffect(() => {
    if (projectId) {
      dispatch(setCurrentProject(projectId));
    }
  }, [projectId, dispatch]);

  const handleCreateTable = () => {
    if (project?.id) {
      navigate(`/project/${project.id}/tables/new`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin>
          <div className="p-12">
            <Card loading={true} />
          </div>
        </Spin>
      </div>
    );
  }

  if (!project) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="项目不存在或已被删除"
        >
          <Button type="primary" onClick={() => navigate('/')}>
            返回项目列表
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="m-0">{project.name}</Title>
            {project.description && (
              <Text type="secondary" className="mt-2">
                {project.description}
              </Text>
            )}
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateTable}
          >
            新建表
          </Button>
        </div>

        <div className="mb-6">
          <Space size={[16, 16]} wrap>
            <Tag icon={<TableOutlined />} color="blue">
              {project.tables?.length || 0} 张表
            </Tag>
            <Tag icon={<DatabaseOutlined />} color="green">
              {project.connections?.length || 0} 个连接
            </Tag>
            <Tag icon={<SettingOutlined />} color="orange">
              已配置
            </Tag>
          </Space>
        </div>

        {(!project.tables || project.tables.length === 0) ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <span>暂无数据表</span>
                <span className="text-gray-400">点击下方按钮添加第一个表</span>
              </Space>
            }
          >
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTable}
            >
              立即创建
            </Button>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.tables.map(table => (
              <Card
                key={table.id}
                hoverable
                onClick={() => navigate(`/project/${project.id}/tables/${table.id}`)}
              >
                <Card.Meta
                  avatar={<TableOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                  title={table.name}
                  description={
                    <Space direction="vertical" size={2}>
                      {table.comment && (
                        <Text type="secondary" ellipsis={{ tooltip: table.comment }}>
                          {table.comment}
                        </Text>
                      )}
                      <Text type="secondary" className="text-xs">
                        {table.fields?.length || 0} 个字段
                      </Text>
                    </Space>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectDetail; 