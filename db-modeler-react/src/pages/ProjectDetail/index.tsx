import React from "react";
import { Layout, Card, Descriptions, Button, Space, Typography, Divider, Table, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject, setCurrentProject } from "../../store/projectSlice";
import type { RootState } from "../../main";
import type { DatabaseConnection } from "../../store/projectSlice";

const { Content } = Layout;
const { Title } = Typography;

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  React.useEffect(() => {
    if (projectId) {
      dispatch(setCurrentProject(projectId));
    }
  }, [projectId, dispatch]);

  const handleEdit = () => {
    navigate(`/project/edit/${projectId}`);
  };

  const handleDelete = () => {
    if (!currentProject) return;

    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个项目吗？删除后无法恢复。",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch(deleteProject(currentProject.id));
        message.success("项目已删除");
        navigate("/project/list");
      },
    });
  };

  const handleBack = () => {
    navigate("/project/list");
  };

  const connectionColumns = [
    {
      title: "连接名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "主机",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
    },
    {
      title: "数据库",
      dataIndex: "database",
      key: "database",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
  ];

  if (!currentProject) {
    return (
      <Content style={{ padding: "24px" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Title level={4}>项目不存在或已被删除</Title>
            <Button type="primary" onClick={handleBack}>
              返回项目列表
            </Button>
          </div>
        </Card>
      </Content>
    );
  }

  return (
    <Content style={{ padding: "24px" }}>
      <Card>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>项目详情</Title>
          </Space>
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        </div>

        <Descriptions title="基本信息" bordered>
          <Descriptions.Item label="项目名称" span={3}>
            {currentProject.name}
          </Descriptions.Item>
          <Descriptions.Item label="项目描述" span={3}>
            {currentProject.description || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {currentProject.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {currentProject.updatedAt}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={5}>数据库连接</Title>
        <Table<DatabaseConnection>
          columns={connectionColumns}
          dataSource={currentProject.connections}
          rowKey="id"
        />
      </Card>
    </Content>
  );
}; 