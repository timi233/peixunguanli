'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CourseTable } from '@/components/CourseTable';
import { CourseFormModal } from '@/components/CourseFormModal';
import { Course } from '@/types';
import { message } from 'antd';

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const loadCourses = () => {
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
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    // 将英文字段映射回中文字段
    const body: any = {
      '课程名称': values.name,
      '所属产品': values.product,
      '课程类型': values.type,
      '课程时长': values.duration,
      '导师': values.instructor,
      '课程难度': values.level,
      '课程状态': values.status,
      '可见性': values.visibility,
      '适用岗位': Array.isArray(values.positions) ? values.positions.join(',') : values.positions,
      '考核类型': values.examType,
      '课程介绍': values.description,
      '创建人': values.creator,
    };

    // 如果是编辑，添加 record_id
    if (editingCourse) {
      body.record_id = editingCourse.record_id;
    }

    const url = '/api/courses-local';
    const method = editingCourse ? 'PUT' : 'POST';

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
    loadCourses();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>课程管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建课程
        </Button>
      </div>

      <Card>
        <CourseTable courses={courses} onEdit={handleEdit} />
      </Card>

      <CourseFormModal
        open={modalOpen}
        course={editingCourse}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
