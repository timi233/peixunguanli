import { Course } from '../types';
import { Table, Tag } from 'antd';

interface CourseTableProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
}

export function CourseTable({ courses, onEdit }: CourseTableProps) {
  const columns = [
    {
      title: '课程名称',
      dataIndex: '课程名称',
      key: '课程名称',
      fixed: 'left',
    },
    {
      title: '所属产品',
      dataIndex: '所属产品',
      key: '所属产品',
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          'IP-guard': 'blue',
          '爱数': 'green',
          '安恒': 'purple',
          '通用技能': 'gray',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: '课程类型',
      dataIndex: '课程类型',
      key: '课程类型',
    },
    {
      title: '难度',
      dataIndex: '课程难度',
      key: '课程难度',
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '初级': 'green',
          '中级': 'orange',
          '高级': 'red',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: '时长',
      dataIndex: '课程时长',
      key: '课程时长',
      render: (value: number) => `${value}分钟`,
    },
    {
      title: '可见性',
      dataIndex: '可见性',
      key: '可见性',
      render: (value: string) => {
        const isPublic = value === '公开';
        return (
          <Tag color={isPublic ? 'green' : 'orange'}>
            {isPublic ? '公开' : '需授权'}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: '课程状态',
      key: '课程状态',
      render: (value: string) => (
        <Tag color={value === '已上线' ? 'green' : 'default'}>
          {value}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Course) => (
        <a onClick={() => onEdit?.(record)}>编辑</a>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={courses}
      rowKey="record_id"
      scroll={{ x: 1200 }}
      pagination={{ pageSize: 20 }}
    />
  );
}
