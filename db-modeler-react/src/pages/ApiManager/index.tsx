import React, { useState } from "react";
import { Layout, Card, Button, Table, Space, Modal, Form, Input, message, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addApi, updateApi, deleteApi, setCurrentApi } from "../../store/apiSlice";
import type { RootState } from "../../main";
import type { Api } from "../../store/apiSlice";
import { v4 as uuidv4 } from "uuid";

const { Content } = Layout;
const { Title } = Typography;

export const ApiManager: React.FC = () => {
  const dispatch = useDispatch();
  const apis = useSelector((state: RootState) => state.api.apis);
  const loading = useSelector((state: RootState) => state.api.loading);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const columns = [
    {
      title: "接口名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "请求路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "请求方法",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Api) => (
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

  const handleEdit = (record: Api) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个接口吗？",
      onOk() {
        dispatch(deleteApi(id));
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
          updateApi({
            ...values,
            id: editingId,
            updatedAt: now,
          })
        );
        message.success("更新成功");
      } else {
        const newApi: Api = {
          ...values,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          requestParameters: [],
          responseParameters: [],
        };
        dispatch(addApi(newApi));
        message.success("创建成功");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  const handleRowClick = (record: Api) => {
    dispatch(setCurrentApi(record.id));
  };

  return (
    <Content style={{ padding: "24px" }}>
      <Card>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0 }}>接口列表</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建接口
          </Button>
        </div>
        <Table<Api>
          columns={columns}
          dataSource={apis}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Card>

      <Modal
        title={editingId ? "编辑接口" : "新建接口"}
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
            label="接口名称"
            rules={[{ required: true, message: "请输入接口名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="path"
            label="请求路径"
            rules={[{ required: true, message: "请输入请求路径" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
            rules={[{ required: true, message: "请输入请求方法" }]}
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
    </Content>
  );
}; 