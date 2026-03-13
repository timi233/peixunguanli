'use client';

import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { TaskTable } from '@/components/TaskTable';
import { Task } from '@/types';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // 从本地 SQLite API 获取任务数据
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
  }, []);

  const handleEdit = (task: Task) => {
    console.log('查看详情:', task);
    // TODO: 打开详情对话框
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>学习任务</h1>

      <Card>
        <TaskTable tasks={tasks} onEdit={handleEdit} />
      </Card>
    </div>
  );
}
