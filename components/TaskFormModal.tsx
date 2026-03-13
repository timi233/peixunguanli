'use client';

import { Modal, Form, Input, InputNumber, Select, Button, message, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface TaskFormData {
  record_id?: string;
  employeeId: string;
  project: string;
  courseId: string;
  description: string;
  dueDate: string;
  status: string;
  progress: number;
  startedAt: string;
  completedAt: string;
  result: string;
}

interface TaskFormModalProps {
  open: boolean;
  task?: any | null;
  courses?: any[];
  employees?: any[];
  onSubmit: (values: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

export function TaskFormModal({ open, task, courses, employees, onSubmit, onCancel }: TaskFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && task) {
      const initialValues: any = {
        employeeId: task['关联员工'],
        project: task['关联培训计划'],
        courseId: task['关联课程'],
        description: task['任务说明'],
        dueDate: task['截止日期'] ? dayjs(task['截止日期']) : null,
        status: task['任务状态'],
        progress: task['学习进度'],
        startedAt: task['学习开始时间'] ? dayjs(task['学习开始时间']) : null,
        completedAt: task['学习完成时间'] ? dayjs(task['学习完成时间']) : null,
        result: task['考核结果'],
      };
      form.setFieldsValue(initialValues);
    } else if (open && !task) {
      form.resetFields();
    }
  }, [open, task, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await onSubmit({
        ...values,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
        startedAt: values.startedAt ? values.startedAt.format('YYYY-MM-DD') : null,
        completedAt: values.completedAt ? values.completedAt.format('YYYY-MM-DD') : null,
      });
      
      message.success(task ? '任务已更新' : '任务已创建');
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
      title={task ? '编辑任务' : '新建任务'}
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
          status: '未开始',
          progress: 0,
        }}
      >
        <Form.Item
          label="学员"
          name="employeeId"
          rules={[{ required: true, message: '请选择学员' }]}
        >
          <Select placeholder="请选择学员" disabled={!!task}>
            {employees?.map((emp: any) => (
              <Select.Option key={emp.record_id} value={emp.record_id}>
                {emp.name} ({emp.department})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="培训项目"
          name="project"
          rules={[{ required: true, message: '请输入培训项目' }]}
        >
          <Input placeholder="例如：IP-guard 入职培训" />
        </Form.Item>

        <Form.Item
          label="关联课程"
          name="courseId"
          rules={[{ required: true, message: '请选择课程' }]}
        >
          <Select placeholder="请选择课程" disabled={!!task}>
            {courses?.map((course: any) => (
              <Select.Option key={course.record_id} value={course.record_id}>
                {course['课程名称']}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="任务说明"
          name="description"
        >
          <Input.TextArea rows={3} placeholder="任务详细说明" />
        </Form.Item>

        <Form.Item
          label="截止日期"
          name="dueDate"
          rules={[{ required: true, message: '请选择截止日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="任务状态"
          name="status"
          rules={[{ required: true, message: '请选择任务状态' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="未开始">未开始</Select.Option>
            <Select.Option value="进行中">进行中</Select.Option>
            <Select.Option value="已完成">已完成</Select.Option>
            <Select.Option value="已逾期">已逾期</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="学习进度（%）"
          name="progress"
          rules={[{ required: true, message: '请输入学习进度' }]}
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="开始时间"
          name="startedAt"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="完成时间"
          name="completedAt"
        >
          <DatePicker style={{ width: '100%' }} disabled={form.getFieldValue('status') !== '已完成'} />
        </Form.Item>

        <Form.Item
          label="考核结果"
          name="result"
        >
          <Input placeholder="例如：95 分、优秀" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
