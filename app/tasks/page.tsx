'use client';

import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { TaskTable } from '@/components/TaskTable';
import { Task } from '@/types';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // TODO: 从 API 获取任务数据
    setTimeout(() => {
      setTasks([
        {
          record_id: '1',
          关联员工:'ou_xxx1',
          关联培训计划:'IP-guard 入职培训',
          关联课程:'IP-guard 产品了解',
          学习进度:100,
          学习开始时间: '2026-03-01',
          学习完成时间: '2026-03-05',
          考核结果:'95 分',
          截止日期:'2026-03-10',
          任务状态:'已完成',
        },
        {
          record_id: '2',
          关联员工:'ou_xxx2',
          关联培训计划:'IP-guard 入职培训',
          关联课程:'IP-guard 加密系统切换方案 2024',
          学习进度:60,
          学习开始时间: '2026-03-08',
          学习完成时间: '',
          考核结果:'',
          截止日期:'2026-03-20',
          任务状态:'进行中',
        },
      ]);
      setLoading(false);
    }, 500);
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
