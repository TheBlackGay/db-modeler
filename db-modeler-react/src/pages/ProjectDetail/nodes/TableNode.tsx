import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: var(--anime-card-background);
  border: 2px solid var(--anime-primary);
  min-width: 200px;
  
  &:hover {
    box-shadow: var(--anime-shadow);
  }
`;

const NodeHeader = styled.div`
  padding: 8px;
  background: var(--anime-header-background);
  border-radius: 4px 4px 0 0;
  margin: -10px -10px 10px -10px;
  border-bottom: 2px solid var(--anime-primary);

  h3 {
    margin: 0;
    color: var(--anime-text);
    font-size: 14px;
    font-weight: bold;
  }

  p {
    margin: 4px 0 0;
    color: var(--anime-text-secondary);
    font-size: 12px;
  }
`;

const FieldList = styled.div`
  font-size: 12px;
`;

const Field = styled.div<{ isPrimary?: boolean; isForeign?: boolean }>`
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 4px;
  background: ${props => 
    props.isPrimary ? 'var(--anime-primary-light)' : 
    props.isForeign ? 'var(--anime-secondary-light)' : 
    'transparent'
  };
  color: var(--anime-text);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: var(--anime-hover-background);
  }

  .icons {
    margin-right: 4px;
  }
`;

interface TableNodeProps {
  data: {
    label: string;
    description?: string;
    fields: Array<{
      name: string;
      type: string;
      length?: number;
      icons: string;
      isPrimaryKey: boolean;
      isForeignKey: boolean;
    }>;
    isSimpleMode?: boolean;
  };
}

const TableNode: React.FC<TableNodeProps> = memo(({ data }) => {
  const { label, description, fields, isSimpleMode } = data;

  return (
    <NodeContainer>
      <Handle type="target" position={Position.Left} />
      <NodeHeader>
        <h3>{label}</h3>
        {description && <p>{description}</p>}
      </NodeHeader>
      <FieldList>
        {fields.map((field, index) => (
          <Field
            key={index}
            isPrimary={field.isPrimaryKey}
            isForeign={field.isForeignKey}
          >
            <span className="icons">{field.icons}</span>
            {isSimpleMode ? (
              <span>{field.name}</span>
            ) : (
              <>
                <span>{field.name}</span>
                <span style={{ color: 'var(--anime-text-secondary)' }}>
                  : {field.type}
                  {field.length && `(${field.length})`}
                </span>
              </>
            )}
          </Field>
        ))}
      </FieldList>
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
});

TableNode.displayName = 'TableNode';

export { TableNode }; 