import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // 模拟用户数据（实际应该从飞书获取）
    const MOCK_USERS: Record<string, any> = {
      'ou_9e782509bc704db45e5db09c5111f3b2': {
        id: 'ou_9e782509bc704db45e5db09c5111f3b2',
        name: '张健',
        email: 'zhangjian@example.com',
        role: 'admin',
        tenantId: '总部',
      },
      'ou_instructor1': {
        id: 'ou_instructor1',
        name: '许广波',
        email: 'xuguangbo@example.com',
        role: 'instructor',
        tenantId: '总部',
      },
      'ou_employee1': {
        id: 'ou_employee1',
        name: '张海泉',
        email: 'zanghaiquan@example.com',
        role: 'employee',
        tenantId: '总部',
      },
    };

    const user = MOCK_USERS[userId || 'ou_9e782509bc704db45e5db09c5111f3b2'];

    if (!user) {
      return NextResponse.json(
        {
          code: -1,
          msg: '用户不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: user,
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
