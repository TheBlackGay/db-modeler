import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProject, updateProject } from "../../store/projectSlice";
import { v4 as uuidv4 } from "uuid";
import type { RootState } from "../../main";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const { Title } = Typography;

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const loading = useSelector((state: RootState) => state.projects.loading);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Project) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Project) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个项目吗？",
      onOk() {
        // dispatch(deleteProject(id));
        message.success("删除成功");
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      if (editingId) {
        dispatch(
          updateProject({
            ...values,
            id: editingId,
            updatedAt: now,
          })
        );
        message.success("更新成功");
      } else {
        dispatch(
          addProject({
            ...values,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          })
        );
        message.success("创建成功");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0 }}>项目列表</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建项目
          </Button>
        </div>
        <Table<Project>
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => navigate(`/project/${record.id}`),
          })}
        />
      </Card>

      <Modal
        title={editingId ? "编辑项目" : "新建项目"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 