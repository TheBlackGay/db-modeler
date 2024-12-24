import React, { useCallback, useState } from 'react';
import { Button, Space, Tooltip, Modal, Form, Select, message, Switch, Radio } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, DownloadOutlined, RedoOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { KawaiiButton } from '../../components/anime/AnimeComponents';

import type { Project, Table } from '../../types/models';
import type { RootState } from '../../store';
import { TableNode } from './nodes/TableNode';

const FlowContainer = styled.div`
  width: 100%;
  height: 600px;
  background: var(--anime-card-background);
  border-radius: 12px;
  box-shadow: var(--anime-shadow);
  overflow: hidden;

  .react-flow__node {
    border-radius: 8px;
    border: 2px solid var(--anime-primary);
    background: var(--anime-card-background);
    padding: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--anime-shadow);
    }
  }

  .react-flow__edge {
    path {
      stroke: var(--anime-primary);
      stroke-width: 2;
    }

    .react-flow__edge-text {
      fill: var(--anime-text);
      font-size: 12px;
    }
  }

  .react-flow__controls {
    background: var(--anime-card-background);
    border-radius: 8px;
    box-shadow: var(--anime-shadow);
    button {
      background: var(--anime-background);
      color: var(--anime-text);
      border: none;
      &:hover {
        background: var(--anime-hover-background);
      }
    }
  }

  .react-flow__minimap {
    background: var(--anime-card-background);
    border-radius: 8px;
    box-shadow: var(--anime-shadow);
  }

  .react-flow__background {
    background: var(--anime-background);
  }
`;

const StyledButton = styled(KawaiiButton)`
  margin-right: 8px;
`;

const nodeTypes = {
  tableNode: TableNode,
};

// 关系类型
type RelationType = '1:1' | '1:n' | 'n:1' | 'n:n';

interface EdgeData {
  relationType: RelationType;
  sourceField: string;
  targetField: string;
}

const Flow: React.FC = () => {
  const { projectId } = useParams();
  const project = useSelector((state: RootState) => 
    state.projects.items.find((p: Project) => p.id === projectId)
  );

  if (!project) {
    return <div>项目不存在</div>;
  }

  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [isAddExistingModalVisible, setIsAddExistingModalVisible] = useState(false);
  const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge<EdgeData> | null>(null);
  const [existingForm] = Form.useForm();
  const [edgeForm] = Form.useForm();
  const [addedTableIds, setAddedTableIds] = useState<Set<string>>(new Set());
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // 创建节点数据
  const createNodes = (tables: Table[]): Node[] => {
    return tables.map((table, index) => {
      const fields = table.fields.map(field => {
        const icons = [];
        if (field.isPrimaryKey) icons.push('🔑');
        if (field.isAutoIncrement) icons.push('🔄');
        if (field.unique) icons.push('🎯');
        if (field.index) icons.push('📇');
        
        return {
          name: field.name,
          type: field.type,
          length: field.length,
          icons: icons.join(''),
          isPrimaryKey: field.isPrimaryKey,
          isForeignKey: !!field.foreignKey,
        };
      });

      // 计算节点位置，使用网格布局
      const x = (index % 3) * 300 + 50;
      const y = Math.floor(index / 3) * 400 + 50;

      return {
        id: table.id,
        type: 'tableNode',
        position: { x, y },
        data: {
          label: table.name,
          description: table.description,
          fields,
          isSimpleMode,
        },
      };
    });
  };

  // 创建边数据
  const createEdges = (tables: Table[]): Edge<EdgeData>[] => {
    const edges: Edge<EdgeData>[] = [];
    tables.forEach(table => {
      table.fields.forEach(field => {
        if (field.foreignKey) {
          const relationType: RelationType = field.unique ? '1:1' : 'n:1';
          edges.push({
            id: `${table.id}-${field.foreignKey.tableId}`,
            source: table.id,
            target: field.foreignKey.tableId,
            data: {
              relationType,
              sourceField: field.name,
              targetField: field.foreignKey.fieldName,
            },
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
            style: {
              stroke: 'var(--anime-primary)',
              strokeWidth: 2,
            },
            label: `[${relationType}] ${table.name} -> ${field.foreignKey.tableName}`,
          });
        }
      });
    });
    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 初始化已添加的表 ID
  React.useEffect(() => {
    const initialTableIds = new Set(nodes.map(node => node.id));
    setAddedTableIds(initialTableIds);
  }, []);

  // 处理连接
  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    const sourceTable = project.tables.find((t: Table) => t.id === connection.source);
    const targetTable = project.tables.find((t: Table) => t.id === connection.target);
    
    if (!sourceTable || !targetTable) return;

    setEdges(edges => addEdge({
      ...connection,
      type: 'smoothstep',
      animated: true,
      data: {
        relationType: '1:n',
        sourceField: '',
        targetField: '',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        stroke: 'var(--anime-primary)',
        strokeWidth: 2,
      },
      label: `[1:n] ${sourceTable.name} -> ${targetTable.name}`,
    }, edges));
  }, [project.tables]);

  // 处理边点击
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    edgeForm.setFieldsValue({
      relationType: edge.data?.relationType || '1:n',
    });
    setIsEdgeModalVisible(true);
  }, [edgeForm]);

  // 导出图片
  const handleExport = useCallback(() => {
    const svg = document.querySelector('.react-flow') as HTMLElement;
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const data = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = svg.clientWidth;
        canvas.height = svg.clientHeight;
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'er-diagram.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
    }
  }, []);

  // 处理添加已有表
  const handleAddExistingTable = () => {
    setIsAddExistingModalVisible(true);
  };

  const handleAddExistingModalOk = () => {
    existingForm.validateFields().then(values => {
      const selectedTables = project.tables.filter(table => 
        values.tableIds.includes(table.id)
      );

      // 更新节点
      const newNodes = createNodes(selectedTables);
      setNodes(nodes => [...nodes, ...newNodes]);

      // 更新已添加的表 ID
      setAddedTableIds(prev => new Set([...prev, ...values.tableIds]));

      // 更新边
      const newEdges = createEdges(selectedTables);
      setEdges(edges => [...edges, ...newEdges]);

      // 关闭弹窗
      setIsAddExistingModalVisible(false);
      existingForm.resetFields();
      message.success('表添加成功');
    });
  };

  // 处理边样式修改
  const handleEdgeModalOk = () => {
    edgeForm.validateFields().then(values => {
      if (!selectedEdge) return;

      setEdges(edges => edges.map(edge => {
        if (edge.id === selectedEdge.id) {
          const sourceTable = project.tables.find(t => t.id === edge.source);
          const targetTable = project.tables.find(t => t.id === edge.target);
          
          if (!sourceTable || !targetTable) return edge;

          return {
            ...edge,
            data: {
              ...edge.data,
              relationType: values.relationType,
            },
            label: `[${values.relationType}] ${sourceTable.name} -> ${targetTable.name}`,
          };
        }
        return edge;
      }));

      setIsEdgeModalVisible(false);
      edgeForm.resetFields();
      setSelectedEdge(null);
      message.success('关系修改成功');
    });
  };

  // 切换简化模式
  const toggleSimpleMode = () => {
    setIsSimpleMode(!isSimpleMode);
    setNodes(nodes => nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isSimpleMode: !isSimpleMode,
      },
    })));
  };

  return (
    <FlowContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor="var(--anime-primary)"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background gap={12} size={1} />
        <Panel position="top-right">
          <Space>
            <StyledButton onClick={handleAddExistingTable}>
              添加表
            </StyledButton>
            <StyledButton 
              icon={isSimpleMode ? <ExpandOutlined /> : <CompressOutlined />}
              onClick={toggleSimpleMode}
            >
              {isSimpleMode ? "详细模式" : "简化模式"}
            </StyledButton>
            <StyledButton 
              icon={<ZoomInOutlined />} 
              onClick={() => zoomIn()}
            >
              放大
            </StyledButton>
            <StyledButton 
              icon={<ZoomOutOutlined />} 
              onClick={() => zoomOut()}
            >
              缩小
            </StyledButton>
            <StyledButton 
              icon={<RedoOutlined />} 
              onClick={() => fitView()}
            >
              重置视图
            </StyledButton>
            <StyledButton 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
            >
              导出图片
            </StyledButton>
          </Space>
        </Panel>
      </ReactFlow>

      <Modal
        title="添加已有表"
        open={isAddExistingModalVisible}
        onOk={handleAddExistingModalOk}
        onCancel={() => {
          setIsAddExistingModalVisible(false);
          existingForm.resetFields();
        }}
      >
        <Form form={existingForm} layout="vertical">
          <Form.Item
            name="tableIds"
            label="选择表"
            rules={[{ required: true, message: '请选择要添加的表' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择要添加的表"
              style={{ width: '100%' }}
              options={project.tables
                .filter(table => !addedTableIds.has(table.id))
                .map(table => ({
                  label: table.name,
                  value: table.id,
                }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改关系"
        open={isEdgeModalVisible}
        onOk={handleEdgeModalOk}
        onCancel={() => {
          setIsEdgeModalVisible(false);
          edgeForm.resetFields();
          setSelectedEdge(null);
        }}
      >
        <Form form={edgeForm} layout="vertical">
          <Form.Item
            name="relationType"
            label="关系类型"
            rules={[{ required: true, message: '请选择关系类型' }]}
          >
            <Radio.Group>
              <Radio.Button value="1:1">一对一</Radio.Button>
              <Radio.Button value="1:n">一对多</Radio.Button>
              <Radio.Button value="n:1">多对一</Radio.Button>
              <Radio.Button value="n:n">多对多</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </FlowContainer>
  );
};

const ERDiagram: React.FC = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default ERDiagram; 