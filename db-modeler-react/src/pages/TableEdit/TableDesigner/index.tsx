import React from 'react';
import { useParams } from 'react-router-dom';

export const TableEdit: React.FC = () => {
  const { projectId, tableId } = useParams();

  return (
    <div>
      <h1>Table Designer</h1>
      <p>Project ID: {projectId}</p>
      <p>Table ID: {tableId}</p>
      {/* TODO: 实现表设计器功能 */}
    </div>
  );
}; 