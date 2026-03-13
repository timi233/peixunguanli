'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Alert } from 'antd';
import { StatsCard } from '@/components/StatsCard';

interface Stats {
  totalCourses: number;
  publicCourses: number;
  authorizedCourses: number;
  totalTasks: number;
  completedTasks: number;
  totalEmployees: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setStats(data.data);
        } else {
          setError(data.msg);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
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

  if (error || !stats) {
    return (
      <Alert
        message="加载失败"
        description={error || '未知错误'}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatsCard
            title="总课程数"
            value={stats.totalCourses}
            suffix="门"
            color="#1890ff"
          />
        </Col>
        <Col span={6}>
          <StatsCard
            title="公开课程"
            value={stats.publicCourses}
            suffix="门"
            color="#52c41a"
          />
        </Col>
        <Col span={6}>
          <StatsCard
            title="授权课程"
            value={stats.authorizedCourses}
            suffix="门"
            color="#faad14"
          />
        </Col>
        <Col span={6}>
          <StatsCard
            title="学习任务"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            suffix="个"
            color="#722ed1"
          />
        </Col>
      </Row>

      <Card title="系统状态" style={{ marginBottom: 24 }}>
        <p>✅ 系统运行正常</p>
        <p>📊 数据来源：飞书多维表格</p>
        <p>👥 员工总数：{stats.totalEmployees}</p>
      </Card>
    </div>
  );
}
