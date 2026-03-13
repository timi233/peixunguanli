'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CourseTable } from '@/components/CourseTable';
import { Course } from '@/types';

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // 从本地 SQLite API 获取课程数据
    fetch('/api/courses-local')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          setCourses(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('加载课程失败:', err);
        setLoading(false);
      });
  }, []);

  const handleEdit = (course: Course) => {
    console.log('编辑课程:', course);
    // TODO: 打开编辑对话框
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>课程管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建课程
        </Button>
      </div>

      <Card>
        <CourseTable courses={courses} onEdit={handleEdit} />
      </Card>
    </div>
  );
}
