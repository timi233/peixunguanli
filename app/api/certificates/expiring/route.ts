import { NextResponse } from 'next/server';
import { getCertificates } from '@/lib/feishu';

export async function GET() {
  try {
    const certificates = await getCertificates();
    
    // 筛选即将到期的证书（30 天内）
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const expiring = certificates.filter((c: any) => {
      const expiryDate = new Date(c.有效期至);
      return expiryDate <= thirtyDaysLater && expiryDate >= now;
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: expiring,
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
