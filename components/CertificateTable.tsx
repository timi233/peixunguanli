import { Table, Tag, Button, Space, message } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface Certificate {
  record_id: string;
  关联人员：string;
  证书：string;
  获得日期：string;
  有效期至：string;
  证书状态：'有效' | '即将到期' | '已过期' | '已冻结';
}

interface CertificateTableProps {
  certificates: Certificate[];
  onAdd?: () => void;
  onView?: (cert: Certificate) => void;
}

export function CertificateTable({ certificates, onAdd, onView }: CertificateTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '有效':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case '即将到期':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case '已过期':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '有效': 'green',
      '即将到期': 'orange',
      '已过期': 'red',
      '已冻结': 'gray',
    };
    return colorMap[status] || 'default';
  };

  const columns = [
    {
      title: '证书名称',
      dataIndex: '证书',
      key: '证书',
    },
    {
      title: '关联人员',
      dataIndex: '关联人员',
      key: '关联人员',
    },
    {
      title: '获得日期',
      dataIndex: '获得日期',
      key: '获得日期',
      render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
    },
    {
      title: '有效期至',
      dataIndex: '有效期至',
      key: '有效期至',
      render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
    },
    {
      title: '状态',
      dataIndex: '证书状态',
      key: '证书状态',
      render: (value: string) => (
        <Tag icon={getStatusIcon(value)} color={getStatusColor(value)}>
          {value}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Certificate) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => onView?.(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={onAdd}>
          添加证书
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={certificates}
        rowKey="record_id"
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
