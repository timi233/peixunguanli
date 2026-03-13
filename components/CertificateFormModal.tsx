'use client';

import { Modal, Form, Input, Select, Button, message, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface CertificateFormData {
  record_id?: string;
  employeeId: string;
  certificate: string;
  obtainedDate: string;
  expiryDate: string;
  status: string;
  retrainReq: string;
}

interface CertificateFormModalProps {
  open: boolean;
  certificate?: any | null;
  employees?: any[];
  onSubmit: (values: CertificateFormData) => Promise<void>;
  onCancel: () => void;
}

export function CertificateFormModal({ certificate, open, employees, onSubmit, onCancel }: CertificateFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && certificate) {
      const initialValues: any = {
        employeeId: certificate['关联人员'],
        certificate: certificate['证书'],
        obtainedDate: certificate['获得日期'] ? dayjs(certificate['获得日期']) : null,
        expiryDate: certificate['有效期至'] ? dayjs(certificate['有效期至']) : null,
        status: certificate['证书状态'],
        retrainReq: certificate['复训要求'],
      };
      form.setFieldsValue(initialValues);
    } else if (open && !certificate) {
      form.resetFields();
    }
  }, [open, certificate, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await onSubmit({
        ...values,
        obtainedDate: values.obtainedDate ? values.obtainedDate.format('YYYY-MM-DD') : null,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
      });
      
      message.success(certificate ? '证书已更新' : '证书已添加');
      form.resetFields();
    } catch (error: any) {
      if (error.message) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={certificate ? '编辑证书' : '添加证书'}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          form.resetFields();
          onCancel();
        }}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          确定
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: '有效',
        }}
      >
        <Form.Item
          label="关联人员"
          name="employeeId"
          rules={[{ required: true, message: '请选择人员' }]}
        >
          <Select placeholder="请选择人员" disabled={!!certificate}>
            {employees?.map((emp: any) => (
              <Select.Option key={emp.record_id} value={emp.record_id}>
                {emp.name} ({emp.department})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="证书名称"
          name="certificate"
          rules={[{ required: true, message: '请输入证书名称' }]}
        >
          <Input placeholder="例如：IP-guard 认证工程师" />
        </Form.Item>

        <Form.Item
          label="获得日期"
          name="obtainedDate"
          rules={[{ required: true, message: '请选择获得日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="有效期至"
          name="expiryDate"
          rules={[{ required: true, message: '请选择有效期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="证书状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="有效">有效</Select.Option>
            <Select.Option value="即将到期">即将到期</Select.Option>
            <Select.Option value="已过期">已过期</Select.Option>
            <Select.Option value="已冻结">已冻结</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="复训要求"
          name="retrainReq"
        >
          <Input placeholder="例如：每 2 年复训" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
