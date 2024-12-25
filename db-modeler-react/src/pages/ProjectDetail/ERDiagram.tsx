import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import * as G6 from '@antv/g6';
import { RootState } from '../../store';
import { Table, Field } from '../../types/models';

const ERContainer = styled.div`
  height: 600px;
  background: var(--anime-background-light);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

interface GraphData {
  nodes: {
    id: string;
    label: string;
    x: number;
    y: number;
  }[];
  edges: {
    source: string;
    target: string;
    label: string;
  }[];
}

const ERDiagram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  useEffect(() => {
    if (!containerRef.current || !currentProject) return;

    const container = containerRef.current;
    const width = container.scrollWidth;
    const height = container.scrollHeight || 600;

    if (!graphRef.current) {
      graphRef.current = new G6.Graph({
        container,
        width,
        height,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 200,
          nodeStrength: -30,
          edgeStrength: 0.1,
        },
        defaultNode: {
          type: 'rect',
          size: [120, 40],
          style: {
            fill: '#fff',
            stroke: '#91d5ff',
            radius: 4,
          },
          labelCfg: {
            style: {
              fill: '#333',
              fontSize: 12,
            },
          },
        },
        defaultEdge: {
          type: 'line',
          style: {
            stroke: '#91d5ff',
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#91d5ff',
            },
          },
          labelCfg: {
            style: {
              fill: '#666',
              fontSize: 12,
            },
          },
        },
      } as any);
    }

    const graph = graphRef.current;

    // 构建图数据
    const graphData: GraphData = {
      nodes: currentProject.tables.map((table: Table) => ({
        id: table.id,
        label: table.name,
        x: Math.random() * width,
        y: Math.random() * height,
      })),
      edges: currentProject.tables.reduce((acc: any[], table: Table) => {
        const relations = (table.fields || []).filter((field: Field) => field.foreignKey);
        const tableEdges = relations.map((field: Field) => ({
          source: table.id,
          target: field.foreignKey?.tableId || '',
          label: `${field.name} -> ${field.foreignKey?.fieldName || ''}`,
        }));
        return [...acc, ...tableEdges];
      }, []),
    };

    graph.data(graphData);
    graph.render();

    const handleResize = () => {
      if (container && graph) {
        const width = container.scrollWidth;
        const height = container.scrollHeight || 600;
        graph.changeSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentProject]);

  if (!currentProject) {
    return null;
  }

  return <ERContainer ref={containerRef} />;
};

export default ERDiagram; 