import { NextResponse } from 'next/server';
import { getCourses, getTasksWithDetails, getEmployees, getTrainingProjects } from '@/lib/feishu';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const 所属产品 = searchParams.get('所属产品');
    const 可见性 = searchParams.get('可见性');

    const courses = await getCourses({
      所属产品：所属产品 || undefined,
      可见性：可见性 || undefined,
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: courses,
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
    // TODO: 实现创建课程的逻辑
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
