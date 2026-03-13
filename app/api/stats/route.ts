import { NextResponse } from 'next/server';
import { getCourses, getTasksWithDetails, getEmployees } from '@/lib/feishu';

export async function GET() {
  console.log('[Stats API] 开始获取统计数据');
  
  try {
    // 并行获取数据，单独处理每个请求的错误
    const [coursesResult, tasksResult, employeesResult] = await Promise.all([
      getCourses().catch(err => {
        console.error('[Stats API] 获取课程失败:', err.message);
        return [];
      }),
      getTasksWithDetails().catch(err => {
        console.error('[Stats API] 获取任务失败:', err.message);
        return [];
      }),
      getEmployees().catch(err => {
        console.error('[Stats API] 获取员工失败:', err.message);
        return [];
      }),
    ]);

    console.log('[Stats API] 数据获取成功', {
      courses: coursesResult.length,
      tasks: tasksResult.length,
      employees: employeesResult.length,
    });

    const stats = {
      totalCourses: coursesResult.length,
      publicCourses: coursesResult.filter((c: any) => c.可见性 === '公开').length,
      authorizedCourses: coursesResult.filter((c: any) => c.可见性 === '需授权').length,
      totalTasks: tasksResult.length,
      completedTasks: tasksResult.filter((t: any) => t.任务状态 === '已完成').length,
      totalEmployees: employeesResult.length,
    };

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: stats,
    });
  } catch (error: any) {
    console.error('[Stats API] 未知错误:', error);
    return NextResponse.json(
      {
        code: -1,
        msg: error.message || '未知错误',
        data: null,
      },
      { status: 500 }
    );
  }
}
