'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Tabs, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CertificateTable } from '@/components/CertificateTable';
import { CertificateFormModal } from '@/components/CertificateFormModal';
import { message } from 'antd';

interface Certificate {
  record_id: string;
  关联人员: string;
  证书: string;
  获得日期: string;
  有效期至: string;
  证书状态: '有效' | '即将到期' | '已过期' | '已冻结';
}

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  useEffect(() => {
    // 从本地 SQLite API 获取证书数据
    fetch('/api/certificates-local')
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

    // 加载员工列表
    setEmployees([
      { record_id: 'emp_001', name: '张健', department: '技术部' },
      { record_id: 'emp_002', name: '许广波', department: '技术部' },
      { record_id: 'emp_003', name: '张海泉', department: '技术部' },
    ]);
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

  const handleCreate = () => {
    setEditingCert(null);
    setModalOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const body: any = {
      '关联人员': values.employeeId,
      '证书': values.certificate,
      '获得日期': values.obtainedDate,
      '有效期至': values.expiryDate,
      '证书状态': values.status,
      '复训要求': values.retrainReq,
    };

    if (editingCert) {
      body.record_id = editingCert.record_id;
    }

    const url = '/api/certificates-local';
    const method = editingCert ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.code !== 0) {
      throw new Error(data.msg || '操作失败');
    }

    setModalOpen(false);
    // 重新加载数据
    fetch('/api/certificates-local')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setCertificates(data.data);
        }
      });
  };

  const items = [
    {
      key: 'all',
      label: `全部 (${certificates.length})`,
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              添加证书
            </Button>
          </div>
          <CertificateTable certificates={certificates} onView={handleEdit} />
        </>
      ),
    },
    {
      key: 'valid',
      label: `有效 (${validCerts.length})`,
      children: <CertificateTable certificates={validCerts} onView={handleEdit} />,
    },
    {
      key: 'expiring',
      label: `即将到期 (${expiringCerts.length})`,
      children: <CertificateTable certificates={expiringCerts} onView={handleEdit} />,
    },
    {
      key: 'expired',
      label: `已过期 (${expiredCerts.length})`,
      children: <CertificateTable certificates={expiredCerts} onView={handleEdit} />,
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>证书管理</h1>

      <Card>
        <Tabs items={items} />
      </Card>

      <CertificateFormModal
        open={modalOpen}
        certificate={editingCert}
        employees={employees}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
