'use client';

import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

interface CourseFormData {
  record_id?: string;
  name: string;
  product: string;
  type: string;
  duration: number;
  instructor: string;
  level: string;
  status: string;
  visibility: string;
  positions: string[];
  examType: string;
  description: string;
  creator: string;
}

interface CourseFormModalProps {
  open: boolean;
  course?: any | null;
  onSubmit: (values: CourseFormData) => Promise<void>;
  onCancel: () => void;
}

export function CourseFormModal({ open, course, onSubmit, onCancel }: CourseFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 当弹窗打开且有关联课程数据时，填充表单
  useEffect(() => {
    if (open && course) {
      // 将中文字段映射为英文字段
      const initialValues: any = {
        name: course['课程名称'],
        product: course['所属产品'],
        type: course['课程类型'],
        duration: course['课程时长'],
        instructor: course['导师'],
        level: course['课程难度'],
        status: course['课程状态'],
        visibility: course['可见性'],
        positions: course['适用岗位'],
        examType: course['考核类型'],
        description: course['课程介绍'],
        creator: course['创建人'],
      };
      form.setFieldsValue(initialValues);
    } else if (open && !course) {
      form.resetFields();
    }
  }, [open, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await onSubmit(values);
      
      message.success(course ? '课程已更新' : '课程已创建');
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
      title={course ? '编辑课程' : '新建课程'}
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
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: '已上线',
          visibility: '公开',
          level: '初级',
          type: '理论课',
          creator: 'admin',
        }}
      >
        <Form.Item
          label="课程名称"
          name="name"
          rules={[{ required: true, message: '请输入课程名称' }]}
        >
          <Input placeholder="例如：IP-guard 产品了解" />
        </Form.Item>

        <Form.Item
          label="所属产品"
          name="product"
          rules={[{ required: true, message: '请选择所属产品' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="IP-guard">IP-guard</Select.Option>
            <Select.Option value="爱数">爱数</Select.Option>
            <Select.Option value="安恒">安恒</Select.Option>
            <Select.Option value="通用技能">通用技能</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="课程类型"
          name="type"
          rules={[{ required: true, message: '请选择课程类型' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="理论课">理论课</Select.Option>
            <Select.Option value="实操课">实操课</Select.Option>
            <Select.Option value="认证备考课">认证备考课</Select.Option>
            <Select.Option value="安全培训">安全培训</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="课程时长（分钟）"
          name="duration"
          rules={[{ required: true, message: '请输入课程时长' }]}
        >
          <InputNumber min={30} max={1440} style={{ width: '100%' }} placeholder="例如：120" />
        </Form.Item>

        <Form.Item
          label="导师"
          name="instructor"
          rules={[{ required: true, message: '请输入导师姓名' }]}
        >
          <Input placeholder="例如：许广波" />
        </Form.Item>

        <Form.Item
          label="课程难度"
          name="level"
          rules={[{ required: true, message: '请选择课程难度' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="初级">初级</Select.Option>
            <Select.Option value="中级">中级</Select.Option>
            <Select.Option value="高级">高级</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="课程状态"
          name="status"
          rules={[{ required: true, message: '请选择课程状态' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="已上线">已上线</Select.Option>
            <Select.Option value="开发中">开发中</Select.Option>
            <Select.Option value="已下线">已下线</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="可见性"
          name="visibility"
          rules={[{ required: true, message: '请选择可见性' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="公开">公开（登录即可见）</Select.Option>
            <Select.Option value="需授权">需授权（分配后可见）</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="适用岗位"
          name="positions"
          rules={[{ required: true, message: '请选择适用岗位' }]}
        >
          <Select mode="tags" placeholder="输入后回车添加">
            <Select.Option value="IP-guard 工程师">IP-guard 工程师</Select.Option>
            <Select.Option value="安全技术工程师">安全技术工程师</Select.Option>
            <Select.Option value="售后工程师">售后工程师</Select.Option>
            <Select.Option value="实施工程师">实施工程师</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="考核类型"
          name="examType"
          rules={[{ required: true, message: '请选择考核类型' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="在线考试">在线考试</Select.Option>
            <Select.Option value="实操考核">实操考核</Select.Option>
            <Select.Option value="论文评审">论文评审</Select.Option>
            <Select.Option value="无需考核">无需考核</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="课程介绍"
          name="description"
          rules={[{ required: true, message: '请输入课程介绍' }]}
        >
          <TextArea rows={4} placeholder="请描述课程内容和目标" />
        </Form.Item>

        <Form.Item
          label="创建人"
          name="creator"
          rules={[{ required: true, message: '请输入创建人' }]}
        >
          <Input placeholder="例如：admin" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
