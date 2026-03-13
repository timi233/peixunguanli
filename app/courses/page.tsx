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
    // TODO: 从 API 获取课程数据
    // 这里先使用模拟数据
    setTimeout(() => {
      setCourses([
        {
          record_id: '1',
          课程名称:'IP-guard 产品了解',
          所属产品:'IP-guard',
          课程类型:'理论课',
          课程时长:120,
          导师:'许广波',
          课程难度:'初级',
          课程状态:'已上线',
          可见性:'公开',
          适用岗位:['IP-guard 工程师'],
          考核类型:'在线考试',
          课程介绍:'IP-guard 终端安全管理系统产品介绍',
          创建人:'admin',
        },
        {
          record_id: '2',
          课程名称:'IP-guard 加密系统切换方案 2024',
          所属产品:'IP-guard',
          课程类型:'实操课',
          课程时长:240,
          导师:'许广波',
          课程难度:'高级',
          课程状态:'已上线',
          可见性:'需授权',
          适用岗位:['IP-guard 工程师'],
          考核类型:'实操考核',
          课程介绍:'从其他加密系统切换到 IP-guard 的完整方案',
          创建人:'admin',
        },
      ]);
      setLoading(false);
    }, 500);
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
