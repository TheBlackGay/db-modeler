import React, { useCallback } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { Project, Table } from '../../types/models';
import { TableNode } from './nodes/TableNode';

const nodeTypes = {
  tableNode: TableNode,
};

interface ERDiagramProps {
  project: Project;
}

const Flow: React.FC<ERDiagramProps> = ({ project }) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

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
        },
      };
    });
  };

  // 创建边数据
  const createEdges = (tables: Table[]): Edge[] => {
    const edges: Edge[] = [];
    tables.forEach(table => {
      table.fields.forEach(field => {
        if (field.foreignKey) {
          edges.push({
            id: `${table.id}-${field.foreignKey.tableId}`,
            source: field.foreignKey.tableId,
            target: table.id,
            label: `${table.name}.${field.name} -> ${field.foreignKey.tableName}.${field.foreignKey.fieldName}`,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#1890ff',
            },
          });
        }
      });
    });
    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes(project.tables));
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges(project.tables));

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

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 250px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        <Panel position="top-right">
          <Space>
            <Tooltip title="放大">
              <Button 
                icon={<ZoomInOutlined />} 
                onClick={() => zoomIn()}
              />
            </Tooltip>
            <Tooltip title="缩小">
              <Button 
                icon={<ZoomOutOutlined />} 
                onClick={() => zoomOut()}
              />
            </Tooltip>
            <Tooltip title="重置视图">
              <Button 
                icon={<RedoOutlined />} 
                onClick={() => fitView()}
              />
            </Tooltip>
            <Tooltip title="导出图片">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
              />
            </Tooltip>
          </Space>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const ERDiagram: React.FC<ERDiagramProps> = (props) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default ERDiagram; 