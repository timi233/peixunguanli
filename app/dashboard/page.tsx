'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag } from 'antd';
import { StatsCard } from '@/components/StatsCard';
import { CourseTable } from '@/components/CourseTable';
import { Course } from '@/types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publicCourses: 0,
    authorizedCourses: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    // TODO: 从 API 获取数据
    // 模拟数据
    setTimeout(() => {
      setStats({
        totalCourses: 20,
        publicCourses: 5,
        authorizedCourses: 15,
        totalTasks: 50,
      });
      setLoading(false);
    }, 500);
  }, []);

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
            value={stats.totalTasks}
            suffix="个"
            color="#722ed1"
          />
        </Col>
      </Row>

      <Card title="最近动态" style={{ marginBottom: 24 }}>
        <p>欢迎使用公司培训管理系统！</p>
        <p>系统功能：</p>
        <ul>
          <li>✅ 课程管理（公开/授权二级权限）</li>
          <li>✅ 学习任务管理</li>
          <li>✅ 跨表关联查询</li>
          <li>✅ 多租户支持</li>
          <li>✅ 证书管理（到期预警）</li>
        </ul>
      </Card>
    </div>
  );
}
