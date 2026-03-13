'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Tabs } from 'antd';
import { CertificateTable } from '@/components/CertificateTable';

interface Certificate {
  record_id: string;
  关联人员:string;
  证书:string;
  获得日期:string;
  有效期至:string;
  证书状态:'有效' | '即将到期' | '已过期' | '已冻结';
}

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetch('/api/certificates')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setCertificates(data.data);
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

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // 按状态分类
  const validCerts = certificates.filter(c => c.证书状态 === '有效');
  const expiringCerts = certificates.filter(c => c.证书状态 === '即将到期');
  const expiredCerts = certificates.filter(c => c.证书状态 === '已过期');

  const items = [
    {
      key: 'all',
      label: `全部 (${certificates.length})`,
      children: <CertificateTable certificates={certificates} />,
    },
    {
      key: 'valid',
      label: `有效 (${validCerts.length})`,
      children: <CertificateTable certificates={validCerts} />,
    },
    {
      key: 'expiring',
      label: `即将到期 (${expiringCerts.length})`,
      children: <CertificateTable certificates={expiringCerts} />,
    },
    {
      key: 'expired',
      label: `已过期 (${expiredCerts.length})`,
      children: <CertificateTable certificates={expiredCerts} />,
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>证书管理</h1>
      <Card>
        <Tabs defaultActiveKey="all" items={items} />
      </Card>
    </div>
  );
}
