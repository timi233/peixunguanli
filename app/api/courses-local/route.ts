import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: courses,
    });
  } catch (error: any) {
    console.error('[Courses API] 获取课程失败:', error);
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
    
    const course = await prisma.course.create({
      data: {
        record_id: body.record_id || `course_${Date.now()}`,
        课程名称：body.课程名称，
        所属产品：body.所属产品，
        课程类型：body.课程类型，
        课程时长：body.课程时长，
        导师：body.导师，
        课程难度：body.课程难度，
        课程状态：body.课程状态，
        可见性：body.可见性，
        适用岗位：body.适用岗位，
        考核类型：body.考核类型，
        课程介绍：body.课程介绍，
        创建人：body.创建人，
      },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: course,
    });
  } catch (error: any) {
    console.error('[Courses API] 创建课程失败:', error);
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
