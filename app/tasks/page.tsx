'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskTable } from '@/components/TaskTable';
import { TaskFormModal } from '@/components/TaskFormModal';
import { Task } from '@/types';
import { message } from 'antd';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = () => {
    fetch('/api/tasks-local')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setTasks(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('加载任务失败:', err);
        setLoading(false);
      });
  };

  const loadCourses = () => {
    fetch('/api/courses-local')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setCourses(data.data);
        }
      })
      .catch(console.error);
  };

  const loadEmployees = () => {
    // TODO: 实现员工 API
    setEmployees([
      { record_id: 'emp_001', name: '张健', department: '技术部' },
      { record_id: 'emp_002', name: '许广波', department: '技术部' },
      { record_id: 'emp_003', name: '张海泉', department: '技术部' },
    ]);
  };

  useEffect(() => {
    loadTasks();
    loadCourses();
    loadEmployees();
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const body: any = {
      '关联员工': values.employeeId,
      '关联培训计划': values.project,
      '关联课程': values.courseId,
      '任务说明': values.description,
      '截止日期': values.dueDate,
      '任务状态': values.status,
      '学习进度': values.progress,
      '学习开始时间': values.startedAt,
      '学习完成时间': values.completedAt,
      '考核结果': values.result,
    };

    if (editingTask) {
      body.record_id = editingTask.record_id;
    }

    const url = '/api/tasks-local';
    const method = editingTask ? 'PUT' : 'POST';

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
    loadTasks();
  };

  // 构建课程映射
  const courseMap = courses.reduce((acc, course) => {
    acc[course.record_id] = course;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>学习任务</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建任务
        </Button>
      </div>

      <Card>
        <TaskTable tasks={tasks} courseMap={courseMap} onEdit={handleEdit} />
      </Card>

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        courses={courses}
        employees={employees}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
