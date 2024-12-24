import React from 'react';
import type { Project } from '../../types/models';

interface ERDiagramProps {
  project: Project;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ project }) => {
  return (
    <div>
      <h2>ER图</h2>
      <p>项目: {project.name}</p>
      {/* TODO: 实现 ER 图的渲染 */}
    </div>
  );
};

export default ERDiagram; 