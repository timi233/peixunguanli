import { Task } from '../types';
import { Table, Tag, Progress } from 'antd';

interface TaskTableProps {
  tasks: Task[];
  courseMap?: Record<string, any>;
  employeeMap?: Record<string, any>;
  onEdit?: (task: Task) => void;
}

export function TaskTable({ tasks, courseMap, employeeMap, onEdit }: TaskTableProps) {
  const columns = [
    {
      title: '任务名称',
      dataIndex: '关联课程',
      key: '关联课程',
      render: (value: string, record: Task) => {
        const course = courseMap?.[value];
        return course?.课程名称 || value;
      },
    },
    {
      title: '学员',
      dataIndex: '关联员工',
      key: '关联员工',
      render: (value: string) => {
        const employee = employeeMap?.[value];
        return employee?.姓名 || value;
      },
    },
    {
      title: '进度',
      dataIndex: '学习进度',
      key: '学习进度',
      render: (value: number) => (
        <Progress percent={value} strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }} />
      ),
    },
    {
      title: '状态',
      dataIndex: '任务状态',
      key: '任务状态',
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '进行中': 'processing',
          '已完成': 'success',
          '已延期': 'error',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: '截止日期',
      dataIndex: '截止日期',
      key: '截止日期',
      render: (value: string) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('zh-CN');
      },
    },
    {
      title: '考核结果',
      dataIndex: '考核结果',
      key: '考核结果',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Task) => (
        <a onClick={() => onEdit?.(record)}>详情</a>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="record_id"
      scroll={{ x: 1000 }}
      pagination={{ pageSize: 20 }}
    />
  );
}
