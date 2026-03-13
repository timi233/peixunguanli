'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Statistic, Row, Col } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [expiringCerts, setExpiringCerts] = useState<any[]>([]);

  useEffect(() => {
    // 使用本地 SQLite API
    Promise.all([
      fetch('/api/courses-local').then(res => res.json()),
      fetch('/api/tasks').then(res => res.json()),
      fetch('/api/certificates').then(res => res.json()),
    ])
      .then(([coursesRes, tasksRes, certsRes]) => {
        const courses = coursesRes.code === 0 ? coursesRes.data : [];
        const tasks = tasksRes.code === 0 ? tasksRes.data : [];
        const certs = certsRes.code === 0 ? certsRes.data : [];

        setStats({
          totalCourses: courses.length,
          publicCourses: courses.filter((c: any) => c.visibility === '公开').length,
          authorizedCourses: courses.filter((c: any) => c.visibility === '需授权').length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t: any) => t.status === '已完成').length,
          totalEmployees: 3, // TODO: 添加员工 API
        });

        // 即将到期的证书（30 天内）
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiring = certs.filter((c: any) => {
          const expiry = new Date(c.expiryDate);
          return expiry <= thirtyDaysLater && expiry >= now;
        });
        setExpiringCerts(expiring);

        setLoading(false);
      })
      .catch((err) => {
        console.error('加载数据失败:', err);
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
          <Statistic
            title="总课程数"
            value={stats.totalCourses}
            suffix="门"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="公开课程"
            value={stats.publicCourses}
            suffix="门"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="学习任务"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="即将到期证书"
            value={expiringCerts.length}
            suffix="个"
            valueStyle={{ color: expiringCerts.length > 0 ? '#faad14' : '#52c41a' }}
            prefix={expiringCerts.length > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
          />
        </Col>
      </Row>

      {expiringCerts.length > 0 && (
        <Card 
          title="⚠️ 证书到期预警" 
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '12px 24px' }}
        >
          <div>
            {expiringCerts.map((cert: any) => (
              <div key={cert.record_id} style={{ marginBottom: 8 }}>
                <strong>{cert.证书}</strong> - {cert.关联人员} - 到期:{new Date(cert.有效期至).toLocaleDateString('zh-CN')}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="系统状态" style={{ marginBottom: 24 }}>
        <p>✅ 系统运行正常</p>
        <p>📊 数据来源:飞书多维表格</p>
        <p>👥 员工总数:{stats.totalEmployees}</p>
      </Card>
    </div>
  );
}
