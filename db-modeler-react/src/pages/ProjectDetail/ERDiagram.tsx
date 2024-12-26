import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  Panel,
  useReactFlow,
  NodeChange,
  EdgeChange,
  Connection,
  MarkerType,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Handle,
  ConnectionMode,
} from 'reactflow';
import { 
  Button, 
  Tooltip, 
  Badge, 
  Space, 
  Dropdown, 
  Input, 
  Modal,
  Select,
  message,
  Tabs,
  Form,
  Radio,
  Switch,
} from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  LayoutOutlined,
  SearchOutlined,
  DownloadOutlined,
  MenuOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { toPng, toSvg } from 'html-to-image';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { RootState } from '../../store';
import { Table, Field } from '../../types/models';

const ERContainer = styled.div`
  height: 600px;
  background: var(--anime-background-light);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  // 隐藏 React Flow 水印
  .react-flow__attribution {
    display: none;
  }
`;

const TableNodeWrapper = styled.div<{ selected?: boolean }>`
  padding: 10px;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? '#1890ff' : '#91d5ff'};
  background: white;
  min-width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
  }
`;

const TableHeader = styled.div`
  border-bottom: 2px solid #f0f0f0;
  padding: 8px;
  margin-bottom: 8px;
  font-weight: bold;
  text-align: center;
  background: #fafafa;
  border-radius: 4px 4px 0 0;
`;

const TableDescription = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
  padding: 0 8px 8px;
  border-bottom: 1px dashed #f0f0f0;
  margin-bottom: 8px;
`;

const FieldRow = styled.div<{ isPrimary?: boolean; isForeign?: boolean }>`
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.isPrimary ? '#e6f7ff' : props.isForeign ? '#f6ffed' : 'transparent'};
  
  &:hover {
    background: ${props => props.isPrimary ? '#bae7ff' : props.isForeign ? '#d9f7be' : '#f5f5f5'};
  }
`;

const FieldName = styled.span`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FieldType = styled.span`
  color: #666;
  font-size: 12px;
`;

interface TableNodeData {
  label: string;
  fields: Field[];
  description?: string;
  showFields: boolean;
}

const TableNode: React.FC<{ data: TableNodeData; selected: boolean }> = ({ data, selected }) => (
  <TableNodeWrapper selected={selected}>
    <Handle 
      type="target" 
      position={Position.Left} 
      style={{ background: '#91d5ff' }} 
    />
    <Handle 
      type="source" 
      position={Position.Right} 
      style={{ background: '#91d5ff' }} 
    />
    <TableHeader>
      {data.label}
    </TableHeader>
    {data.description && (
      <TableDescription>
        {data.description}
      </TableDescription>
    )}
    {data.showFields && (
      <div>
        {data.fields.map((field) => (
          <FieldRow
            key={field.id}
            isPrimary={field.isPrimaryKey}
            isForeign={field.isForeignKey}
          >
            <FieldName>
              {field.isPrimaryKey && <Badge status="processing" />}
              {field.isForeignKey && <Badge status="success" />}
              {field.name}
            </FieldName>
            <FieldType>{field.type}</FieldType>
          </FieldRow>
        ))}
      </div>
    )}
  </TableNodeWrapper>
);

const nodeTypes = {
  tableNode: TableNode,
};

// 添加新的样式组件
const SearchPanel = styled(Panel)`
  left: 10px;
  top: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const ToolPanel = styled(Panel)`
  right: 10px;
  top: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const EdgeToolPanel = styled(Panel)`
  right: 10px;
  bottom: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

// 添加右键菜单样式组件
const ContextMenu = styled.div`
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

// 布局类型
type LayoutType = 'circular' | 'dagre-tb' | 'dagre-lr';

// 添加边的样式类型
type EdgeStyle = {
  type: 'default' | 'straight' | 'step' | 'smoothstep' | 'bezier';
  animated: boolean;
  strokeWidth: number;
  strokeColor: string;
};

// 修改 Edge 的数据类型
interface EdgeData {
  relationType?: RelationType;
  field?: Field;
  style?: EdgeStyle;
}

// 布局函数
const getLayoutedElements = (nodes: Node[], edges: Edge[], layout: LayoutType) => {
  if (layout === 'circular') {
    const count = nodes.length;
    const radius = Math.max(count * 100, 300);
    const centerX = radius + 100;
    const centerY = radius + 100;

    return {
      nodes: nodes.map((node, index) => {
        const angle = (index / count) * 2 * Math.PI;
        return {
          ...node,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
        };
      }),
      edges,
    };
  } else {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
      rankdir: layout === 'dagre-tb' ? 'TB' : 'LR',
      nodesep: 80,
      ranksep: 100,
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 250, height: 150 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
      nodes: nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - 125,
            y: nodeWithPosition.y - 75,
          },
        };
      }),
      edges,
    };
  }
};

// 定义关系类型
type RelationType = '1-1' | '1-n' | 'n-1' | 'n-n';

const ERDiagramInner: React.FC = () => {
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const { fitView, zoomIn, zoomOut, getNodes } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [layoutType, setLayoutType] = useState<LayoutType>('circular');
  const [showFields, setShowFields] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const flowRef = useRef<HTMLDivElement>(null);
  const [isAddTableModalVisible, setIsAddTableModalVisible] = useState(false);
  const [selectedExistingTable, setSelectedExistingTable] = useState<string>('');
  const [form] = Form.useForm();
  const [selectedRelationType, setSelectedRelationType] = useState<RelationType>('1-1');
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>({
    type: 'smoothstep',
    animated: true,
    strokeWidth: 2,
    strokeColor: '#91d5ff',
  });
  const [isEdgeStyleModalVisible, setIsEdgeStyleModalVisible] = useState(false);
  const [isEdgeEditModalVisible, setIsEdgeEditModalVisible] = useState(false);
  const [currentEditingEdge, setCurrentEditingEdge] = useState<Edge<EdgeData> | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    edge: Edge<EdgeData> | null;
  } | null>(null);

  // 添加边的样式函数
  const getEdgeStyle = useCallback((edge: Edge<EdgeData>) => {
    const isSelected = edge.id === selectedEdge;
    const edgeCustomStyle = edge.data?.style || edgeStyle;
    
    return {
      stroke: isSelected ? '#1890ff' : edgeCustomStyle.strokeColor,
      strokeWidth: isSelected ? edgeCustomStyle.strokeWidth + 1 : edgeCustomStyle.strokeWidth,
      opacity: isSelected ? 1 : 0.8,
    };
  }, [selectedEdge, edgeStyle]);

  // 添加边的标签样式函数
  const getEdgeLabelStyle = useCallback((edge: Edge) => {
    const isSelected = edge.id === selectedEdge;
    return {
      fill: isSelected ? '#1890ff' : '#666',
      fontSize: 12,
      fontWeight: isSelected ? 'bold' : 'normal',
    };
  }, [selectedEdge]);

  // 初始化节点和边
  const initialElements = useMemo(() => {
    if (!currentProject) return { nodes: [], edges: [] };

    const nodes: Node[] = currentProject.tables.map((table) => ({
      id: table.id,
      type: 'tableNode',
      position: { x: 0, y: 0 },
      data: {
        label: table.name,
        fields: table.fields,
        description: table.description,
        showFields,
      },
    }));

    const edges: Edge[] = currentProject.tables.reduce<Edge[]>((acc, table) => {
      const relations = table.fields.filter(
        (field) => field.isForeignKey && field.referencedTable
      );
      const tableEdges = relations.map((field) => ({
        id: `${table.id}-${field.id}`,
        source: table.id,
        target: field.referencedTable!,
        label: field.name,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#91d5ff', strokeWidth: 2 },
        labelStyle: { fill: '#666', fontSize: 12 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#91d5ff',
        },
        data: { field }, // 添加字段信息到边的数据中
      }));
      return [...acc, ...tableEdges];
    }, []);

    return getLayoutedElements(nodes, edges, layoutType);
  }, [currentProject, layoutType, showFields]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialElements.edges);

  // 修改边的点击处理函数
  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdge(prevSelected => prevSelected === edge.id ? null : edge.id);
  }, []);

  // 修改背景点击处理函数
  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    // 只有当点击的是背景时才清除选择
    if ((event.target as Element).classList.contains('react-flow__pane')) {
      setSelectedEdge(null);
      setContextMenu(null);
    }
  }, []);

  // 添加编辑按钮的处理函数
  const handleEditEdge = useCallback(() => {
    if (!selectedEdge) return;
    const edge = edges.find(e => e.id === selectedEdge);
    if (edge) {
      setCurrentEditingEdge(edge);
      setIsEdgeEditModalVisible(true);
    }
  }, [selectedEdge, edges]);

  // 处理布局变更
  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      newLayout
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setLayoutType(newLayout);
    setTimeout(() => fitView(), 50);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    const searchLower = value.toLowerCase();
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: value
            ? node.data.label.toLowerCase().includes(searchLower) ||
              node.data.fields.some(
                (f: Field) =>
                  f.name.toLowerCase().includes(searchLower) ||
                  f.type.toLowerCase().includes(searchLower)
              )
              ? 1
              : 0.2
            : 1,
        },
      }))
    );
  }, [setNodes]);

  // 获取当前项目中未显示的表
  const getUnusedTables = useMemo(() => {
    if (!currentProject) return [];
    const usedTableIds = new Set(nodes.map(node => node.id));
    return currentProject.tables.filter(table => !usedTableIds.has(table.id));
  }, [currentProject, nodes]);

  // 处理连接
  const handleConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const newEdge: Edge<EdgeData> = {
        id: `${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
        type: edgeStyle.type,
        animated: edgeStyle.animated,
        label: selectedRelationType,
        style: { stroke: edgeStyle.strokeColor, strokeWidth: edgeStyle.strokeWidth },
        labelStyle: { fill: '#666', fontSize: 12 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStyle.strokeColor,
        },
        data: {
          relationType: selectedRelationType,
          style: { ...edgeStyle },
        },
      };

      setEdges((eds) => [...eds, newEdge]);
      setSelectedEdge(newEdge.id); // 选中新创建的边
    },
    [selectedRelationType, setEdges]
  );

  const layoutOptions = [
    { label: '圆形布局', value: 'circular' },
    { label: '自上而下', value: 'dagre-tb' },
    { label: '从左到右', value: 'dagre-lr' },
  ];

  // 添加表格的处理函数
  const handleAddTable = useCallback(() => {
    if (!selectedExistingTable || !currentProject) return;

    const existingTable = currentProject.tables.find(
      table => table.id === selectedExistingTable
    );

    if (!existingTable) return;

    // 创建已有表节点
    const newNode: Node = {
      id: existingTable.id,
      type: 'tableNode',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: existingTable.name,
        fields: existingTable.fields,
        description: existingTable.description,
        showFields,
      },
    };

    // 添加新节点
    const updatedNodes = [...nodes, newNode];
    
    // 更新边
    let updatedEdges = [...edges];
    // 为已有表添加关联的边
    const newEdges = existingTable.fields
      .filter(field => field.isForeignKey && field.referencedTable)
      .map(field => ({
        id: `${existingTable.id}-${field.id}`,
        source: existingTable.id,
        target: field.referencedTable!,
        label: field.name,
        type: 'smoothstep' as const,
        animated: true,
        style: { stroke: '#91d5ff', strokeWidth: 2 },
        labelStyle: { fill: '#666', fontSize: 12 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#91d5ff',
        },
      }));
    updatedEdges = [...updatedEdges, ...newEdges];

    // 重新应用布局
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes,
      updatedEdges,
      layoutType
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // 重置表单
    setSelectedExistingTable('');
    setIsAddTableModalVisible(false);
    
    // 调整视图以显示所有节点
    setTimeout(() => fitView(), 50);
  }, [
    selectedExistingTable,
    currentProject,
    nodes,
    edges,
    layoutType,
    showFields,
    setNodes,
    setEdges,
    fitView,
  ]);

  // 导出功能
  const handleExport = useCallback(async (format: 'png' | 'svg') => {
    if (!flowRef.current) return;

    try {
      // 时隐藏控制面板
      setShowControls(false);
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 100));

      const options = {
        backgroundColor: '#fff',
        filter: (node: Element) => {
          // 过滤掉控制面板和小地图等元素
          const className = node instanceof HTMLElement ? node.className : '';
          return !String(className).includes('react-flow__panel') && 
                 !String(className).includes('react-flow__minimap') &&
                 !String(className).includes('react-flow__controls');
        },
        style: {
          '.react-flow__edge-path': {
            stroke: '#91d5ff',
            strokeWidth: '2px',
          },
          '.react-flow__node': {
            border: '2px solid #91d5ff',
            borderRadius: '8px',
            background: '#fff',
          },
        },
      };

      const dataUrl = await (format === 'png'
        ? toPng(flowRef.current, options)
        : toSvg(flowRef.current, options));

      const link = document.createElement('a');
      link.download = `er-diagram.${format}`;
      link.href = dataUrl;
      link.click();
      message.success(`已导出为 ${format.toUpperCase()} 格式`);
    } catch (error) {
      message.error('导出失败');
      console.error('Export failed:', error);
    } finally {
      // 恢复控制面板
      setShowControls(true);
    }
  }, [setShowControls]);

  // 修改边样式更新函数
  const handleEdgeStyleUpdate = useCallback((newStyle: Partial<EdgeStyle>) => {
    if (!currentEditingEdge) return;

    setEdges(eds => eds.map(edge => {
      if (edge.id === currentEditingEdge.id) {
        const updatedStyle = {
          ...(edge.data?.style || edgeStyle),
          ...newStyle,
        };
        return {
          ...edge,
          type: updatedStyle.type,
          animated: updatedStyle.animated,
          style: {
            stroke: updatedStyle.strokeColor,
            strokeWidth: updatedStyle.strokeWidth,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: updatedStyle.strokeColor,
          },
          data: {
            ...edge.data,
            style: updatedStyle,
          },
        };
      }
      return edge;
    }));
  }, [currentEditingEdge, edgeStyle, setEdges]);

  // 修改全局边样式更新函数
  const handleEdgeStyleChange = useCallback((newStyle: Partial<EdgeStyle>) => {
    setEdgeStyle(prev => {
      const updatedStyle = { ...prev, ...newStyle };
      // 更新所有使用默认样式的边
      setEdges(eds => eds.map(edge => {
        if (!edge.data?.style) {
          return {
            ...edge,
            type: updatedStyle.type,
            animated: updatedStyle.animated,
            style: {
              stroke: updatedStyle.strokeColor,
              strokeWidth: updatedStyle.strokeWidth,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: updatedStyle.strokeColor,
            },
          };
        }
        return edge;
      }));
      return updatedStyle;
    });
  }, [setEdges]);

  // 修改边的点击处理函数，添加右键菜单
  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edge: edge as Edge<EdgeData>,
      });
    },
    []
  );

  // 添加全局点击事件监听，用于关闭右键菜单
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!currentProject) {
    return null;
  }

  return (
    <ERContainer ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          style: getEdgeStyle(edge as Edge<EdgeData>),
          labelStyle: getEdgeLabelStyle(edge),
          type: edge.data?.style?.type || edgeStyle.type,
          animated: edge.data?.style?.animated || edgeStyle.animated,
          focusable: true,
          selected: edge.id === selectedEdge,
          interactionWidth: 20, // 增加交互区域宽度
        }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: edgeStyle.type,
          animated: edgeStyle.animated,
          focusable: true,
          interactionWidth: 20,
        }}
        connectionMode={ConnectionMode.Loose}
        selectNodesOnDrag={false}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        edgesFocusable={true}
        edgesUpdatable={true}
        onEdgeContextMenu={handleEdgeContextMenu}
      >
        <Background color="#aaa" gap={16} />
        {showControls && (
          <>
            <Controls />
            <MiniMap
              nodeColor={(node) => (node.selected ? '#1890ff' : '#91d5ff')}
              nodeStrokeWidth={3}
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.1)"
              pannable
              zoomable
            />
            
            <SearchPanel position="top-left">
              <Space direction="vertical">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="搜索表或字段..."
                  allowClear
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 200 }}
                />
              </Space>
            </SearchPanel>

            <ToolPanel position="top-right">
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddTableModalVisible(true)}
                >
                  添加表
                </Button>
                <Select
                  value={selectedRelationType}
                  onChange={setSelectedRelationType}
                  options={[
                    { label: '一对一', value: '1-1' },
                    { label: '一对多', value: '1-n' },
                    { label: '多对一', value: 'n-1' },
                    { label: '多对多', value: 'n-n' },
                  ]}
                  style={{ width: 100 }}
                />
                <Select
                  value={layoutType}
                  onChange={handleLayoutChange}
                  options={layoutOptions}
                  style={{ width: 120 }}
                />
                <Tooltip title="显示/隐藏字段">
                  <Button
                    icon={showFields ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => setShowFields(!showFields)}
                  />
                </Tooltip>
                <Tooltip title="放大">
                  <Button icon={<ZoomInOutlined />} onClick={() => zoomIn()} />
                </Tooltip>
                <Tooltip title="缩小">
                  <Button icon={<ZoomOutOutlined />} onClick={() => zoomOut()} />
                </Tooltip>
                <Tooltip title="重置视图">
                  <Button icon={<FullscreenOutlined />} onClick={() => fitView()} />
                </Tooltip>
                <Tooltip title="连接线样式">
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setIsEdgeStyleModalVisible(true)}
                  />
                </Tooltip>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'png',
                        label: '导出为PNG',
                        onClick: () => handleExport('png'),
                      },
                      {
                        key: 'svg',
                        label: '导出为SVG',
                        onClick: () => handleExport('svg'),
                      },
                    ],
                  }}
                >
                  <Button icon={<DownloadOutlined />} />
                </Dropdown>
              </Space>
            </ToolPanel>
          </>
        )}
        {showControls && selectedEdge && (
          <EdgeToolPanel position="bottom-right">
            <Space>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={handleEditEdge}
              >
                编辑连接线
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setEdges(eds => eds.filter(e => e.id !== selectedEdge));
                  setSelectedEdge(null);
                }}
              >
                删除连接线
              </Button>
            </Space>
          </EdgeToolPanel>
        )}
        {contextMenu && (
          <ContextMenu
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <MenuItem
              onClick={() => {
                if (contextMenu.edge) {
                  setCurrentEditingEdge(contextMenu.edge);
                  setIsEdgeEditModalVisible(true);
                }
                setContextMenu(null);
              }}
            >
              <SettingOutlined />
              修改连接线样式
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (contextMenu.edge) {
                  setEdges(eds => eds.filter(e => e.id !== contextMenu.edge!.id));
                }
                setContextMenu(null);
              }}
              style={{ color: '#ff4d4f' }}
            >
              <DeleteOutlined />
              删除连接线
            </MenuItem>
          </ContextMenu>
        )}
      </ReactFlow>

      <Modal
        title="添加表"
        open={isAddTableModalVisible}
        onOk={handleAddTable}
        onCancel={() => {
          setIsAddTableModalVisible(false);
          setSelectedExistingTable('');
        }}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="选择表"
            required
            rules={[{ required: true, message: '请选择一个表' }]}
          >
            <Select
              placeholder="请选择要添加的表"
              value={selectedExistingTable}
              onChange={setSelectedExistingTable}
              style={{ width: '100%' }}
              options={getUnusedTables.map(table => ({
                label: (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <span>{table.name}</span>
                    {table.description && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {table.description}
                      </span>
                    )}
                  </Space>
                ),
                value: table.id,
                disabled: nodes.some(node => node.id === table.id),
              }))}
              optionRender={(option) => (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <span>{option.data.label.props.children[0].props.children}</span>
                    <Badge 
                      count={currentProject?.tables.find(t => t.id === option.value)?.fields.length || 0}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </Space>
                  {option.data.label.props.children[1] && (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {option.data.label.props.children[1].props.children}
                    </span>
                  )}
                </Space>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="连接线样式设置"
        open={isEdgeStyleModalVisible}
        onOk={() => setIsEdgeStyleModalVisible(false)}
        onCancel={() => setIsEdgeStyleModalVisible(false)}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="线条类型">
            <Select
              value={edgeStyle.type}
              onChange={(value) => handleEdgeStyleChange({ type: value })}
              options={[
                { label: '默认', value: 'default' },
                { label: '直线', value: 'straight' },
                { label: '阶梯', value: 'step' },
                { label: '平滑阶梯', value: 'smoothstep' },
                { label: '贝塞尔曲线', value: 'bezier' },
              ]}
            />
          </Form.Item>
          <Form.Item label="线条颜色">
            <Select
              value={edgeStyle.strokeColor}
              onChange={(value) => handleEdgeStyleChange({ strokeColor: value })}
              options={[
                { label: '蓝色', value: '#91d5ff' },
                { label: '绿色', value: '#b7eb8f' },
                { label: '紫色', value: '#d3adf7' },
                { label: '红色', value: '#ffa39e' },
                { label: '橙色', value: '#ffd591' },
              ]}
            />
          </Form.Item>
          <Form.Item label="线条宽度">
            <Select
              value={edgeStyle.strokeWidth}
              onChange={(value) => handleEdgeStyleChange({ strokeWidth: value })}
              options={[
                { label: '细', value: 1 },
                { label: '中等', value: 2 },
                { label: '粗', value: 3 },
              ]}
            />
          </Form.Item>
          <Form.Item label="动画效果">
            <Switch
              checked={edgeStyle.animated}
              onChange={(checked) => handleEdgeStyleChange({ animated: checked })}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑连接线样式"
        open={isEdgeEditModalVisible}
        onOk={() => setIsEdgeEditModalVisible(false)}
        onCancel={() => {
          setIsEdgeEditModalVisible(false);
          setCurrentEditingEdge(null);
        }}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="关系类型">
            <Select
              value={currentEditingEdge?.data?.relationType || '1-1'}
              onChange={(value) => {
                setEdges(eds => eds.map(edge => {
                  if (edge.id === currentEditingEdge?.id) {
                    return {
                      ...edge,
                      label: value,
                      data: { ...edge.data, relationType: value },
                    };
                  }
                  return edge;
                }));
              }}
              options={[
                { label: '一对一', value: '1-1' },
                { label: '一对多', value: '1-n' },
                { label: '多对一', value: 'n-1' },
                { label: '多对多', value: 'n-n' },
              ]}
            />
          </Form.Item>
          <Form.Item label="线条类型">
            <Select
              value={currentEditingEdge?.data?.style?.type || edgeStyle.type}
              onChange={(value) => handleEdgeStyleUpdate({ type: value })}
              options={[
                { label: '默认', value: 'default' },
                { label: '直线', value: 'straight' },
                { label: '阶梯', value: 'step' },
                { label: '平滑阶梯', value: 'smoothstep' },
                { label: '贝塞尔曲线', value: 'bezier' },
              ]}
            />
          </Form.Item>
          <Form.Item label="线条颜色">
            <Select
              value={currentEditingEdge?.data?.style?.strokeColor || edgeStyle.strokeColor}
              onChange={(value) => handleEdgeStyleUpdate({ strokeColor: value })}
              options={[
                { label: '蓝色', value: '#91d5ff' },
                { label: '绿色', value: '#b7eb8f' },
                { label: '紫色', value: '#d3adf7' },
                { label: '红色', value: '#ffa39e' },
                { label: '橙色', value: '#ffd591' },
              ]}
            />
          </Form.Item>
          <Form.Item label="线条宽度">
            <Select
              value={currentEditingEdge?.data?.style?.strokeWidth || edgeStyle.strokeWidth}
              onChange={(value) => handleEdgeStyleUpdate({ strokeWidth: value })}
              options={[
                { label: '细', value: 1 },
                { label: '中等', value: 2 },
                { label: '粗', value: 3 },
              ]}
            />
          </Form.Item>
          <Form.Item label="动画效果">
            <Switch
              checked={currentEditingEdge?.data?.style?.animated || edgeStyle.animated}
              onChange={(checked) => handleEdgeStyleUpdate({ animated: checked })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ERContainer>
  );
};

const ERDiagram: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ERDiagramInner />
    </ReactFlowProvider>
  );
};

export default ERDiagram; 