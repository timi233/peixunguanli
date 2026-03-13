import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 字段映射：英文 -> 中文
function mapTask(task: any) {
  return {
    record_id: task.record_id,
    '关联员工': task.employeeId,
    '关联培训计划': task.project,
    '关联课程': task.courseId,
    '任务说明': task.description,
    '截止日期': task.dueDate,
    '任务状态': task.status,
    '学习进度': task.progress,
    '学习开始时间': task.startedAt,
    '学习完成时间': task.completedAt,
    '考核结果': task.result,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    const where: any = {};
    if (employeeId) {
      where.employeeId = employeeId;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: tasks.map(mapTask),
    });
  } catch (error: any) {
    console.error('[Tasks API] 获取任务失败:', error);
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const task = await prisma.task.create({
      data: {
        record_id: body.record_id || `task_${Date.now()}`,
        employeeId: body['关联员工'],
        project: body['关联培训计划'],
        courseId: body['关联课程'],
        description: body['任务说明'],
        dueDate: body['截止日期'] ? new Date(body['截止日期']) : null,
        status: body['任务状态'] || '未开始',
        progress: body['学习进度'] || 0,
        startedAt: body['学习开始时间'] ? new Date(body['学习开始时间']) : null,
        completedAt: body['学习完成时间'] ? new Date(body['学习完成时间']) : null,
        result: body['考核结果'] || '',
      },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: mapTask(task),
    });
  } catch (error: any) {
    console.error('[Tasks API] 创建任务失败:', error);
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
