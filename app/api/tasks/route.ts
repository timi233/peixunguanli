import { NextResponse } from 'next/server';
import { getTasksWithDetails } from '@/lib/feishu';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const expand = searchParams.get('expand');

    const tasks = await getTasksWithDetails(employeeId || undefined);

    // 如果需要跨表关联数据
    if (expand === 'true') {
      // TODO: 实现跨表关联查询
      // 需要并行获取课程和员工信息
    }

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: tasks,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: 实现创建任务的逻辑
    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: body,
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
