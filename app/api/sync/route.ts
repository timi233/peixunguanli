import { NextResponse } from 'next/server';
import { syncFromFeishu } from '@/lib/sync';

export async function POST() {
  try {
    const result = await syncFromFeishu();
    
    if (result.success) {
      return NextResponse.json({
        code: 0,
        msg: '同步成功',
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          code: -1,
          msg: result.error,
          data: null,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Sync API] 同步失败:', error);
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
