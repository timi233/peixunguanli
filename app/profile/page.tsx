'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Descriptions, Tag } from 'antd';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'employee';
  tenantId: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setUser(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Alert message="未登录" description="请先登录" type="warning" showIcon />;
  }

  const getRoleTag = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: 'red',
      instructor: 'blue',
      employee: 'green',
    };
    return <Tag color={colorMap[role]}>{role}</Tag>;
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>个人中心</h1>
      <Card title="个人信息">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="角色">{getRoleTag(user.role)}</Descriptions.Item>
          <Descriptions.Item label="所属组织">{user.tenantId}</Descriptions.Item>
          <Descriptions.Item label="用户 ID" span={2}>{user.id}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
