'use client';

import { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { DashboardOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StatsCard } from '@/components/StatsCard';

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: colorBgContainer,
          padding: '0 24px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px' }}>📚 公司培训管理系统</h1>
      </Header>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: colorBgContainer }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[pathname]}
            items={[
              {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: <Link href="/dashboard">仪表盘</Link>,
              },
              {
                key: '/courses',
                icon: <BookOutlined />,
                label: <Link href="/courses">课程管理</Link>,
              },
              {
                key: '/tasks',
                icon: <FileTextOutlined />,
                label: <Link href="/tasks">学习任务</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
