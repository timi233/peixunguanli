import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 字段映射：英文 -> 中文
function mapCourse(course: any) {
  return {
    record_id: course.record_id,
    '课程名称': course.name,
    '所属产品': course.product,
    '课程类型': course.type,
    '课程时长': course.duration,
    '导师': course.instructor,
    '课程难度': course.level,
    '课程状态': course.status,
    '可见性': course.visibility,
    '适用岗位': course.positions ? course.positions.split(',') : [],
    '考核类型': course.examType,
    '课程介绍': course.description,
    '创建人': course.creator,
  };
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: courses.map(mapCourse),
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.record_id) {
      return NextResponse.json(
        { code: -1, msg: '缺少 record_id', data: null },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { record_id: body.record_id },
      data: {
        name: body.name || body['课程名称'],
        product: body.product || body['所属产品'],
        type: body.type || body['课程类型'],
        duration: body.duration || body['课程时长'],
        instructor: body.instructor || body['导师'],
        level: body.level || body['课程难度'],
        status: body.status || body['课程状态'],
        visibility: body.visibility || body['可见性'],
        positions: body.positions ? (Array.isArray(body.positions) ? body.positions.join(',') : body.positions) : (body['适用岗位'] || ''),
        examType: body.examType || body['考核类型'],
        description: body.description || body['课程介绍'],
        creator: body.creator || body['创建人'],
      },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: mapCourse(course),
    });
  } catch (error: any) {
    console.error('[Courses API] 更新课程失败:', error);
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
    
    // 支持中文和英文字段名
    const course = await prisma.course.create({
      data: {
        record_id: body.record_id || `course_${Date.now()}`,
        name: body.name || body['课程名称'],
        product: body.product || body['所属产品'],
        type: body.type || body['课程类型'],
        duration: body.duration || body['课程时长'],
        instructor: body.instructor || body['导师'],
        level: body.level || body['课程难度'],
        status: body.status || body['课程状态'],
        visibility: body.visibility || body['可见性'],
        positions: body.positions ? (Array.isArray(body.positions) ? body.positions.join(',') : body.positions) : (body['适用岗位'] || ''),
        examType: body.examType || body['考核类型'],
        description: body.description || body['课程介绍'],
        creator: body.creator || body['创建人'],
      },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: mapCourse(course),
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
