import React from 'react';
import { Table, Button, Tag, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import type { MockRuleListProps, MockRule } from '../../types/api.types';
import styles from './MockRuleList.module.scss';

interface DragableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: DragableBodyRowProps) => {
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'DragableBodyRow',
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });

  const [, drag] = useDrag({
    type: 'DragableBodyRow',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(restProps.ref));

  return (
    <tr
      {...restProps}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
    />
  );
};

const MockRuleList: React.FC<MockRuleListProps> = ({
  rules,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const dragRow = rules[dragIndex];
    const newRules = update(rules, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    onReorder(newRules.map(rule => rule.id));
  };

  const columns = [
    {
      title: '字段名称',
      dataIndex: 'field',
      key: 'field',
      width: '20%',
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Mock规则',
      dataIndex: 'rule',
      key: 'rule',
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (rule: string) => (
        <Tooltip placement="topLeft" title={rule}>
          <code className={styles.codeBlock}>{rule}</code>
        </Tooltip>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '18%',
      render: (_: any, record: MockRule) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.mockRuleList}>
        <div className={styles.toolbar}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            添加规则
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          pagination={false}
          size="middle"
          className={styles.table}
          components={{
            body: {
              row: DragableBodyRow,
            },
          }}
          onRow={(_, index) => ({
            index,
            moveRow,
          })}
        />
      </div>
    </DndProvider>
  );
};

export default MockRuleList; 