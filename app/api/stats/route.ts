import { NextResponse } from 'next/server';
import { getCourses, getTasksWithDetails, getEmployees } from '@/lib/feishu';

export async function GET() {
  try {
    // 并行获取数据
    const [courses, tasks, employees] = await Promise.all([
      getCourses(),
      getTasksWithDetails(),
      getEmployees(),
    ]);

    const stats = {
      totalCourses: courses.length,
      publicCourses: courses.filter((c: any) => c.可见性 === '公开').length,
      authorizedCourses: courses.filter((c: any) => c.可见性 === '需授权').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t: any) => t.任务状态 === '已完成').length,
      totalEmployees: employees.length,
    };

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        code: -1,
        msg: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
