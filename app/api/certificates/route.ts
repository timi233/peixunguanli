import { NextResponse } from 'next/server';
import { getCertificates, getCertificateTypes, createCertificate } from '@/lib/feishu';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const certificates = await getCertificates();
    
    // 筛选状态
    let filtered = certificates;
    if (status) {
      filtered = certificates.filter((c: any) => c.证书状态 === status);
    }

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: filtered,
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
    const record = await createCertificate(body);
    
    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: record,
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
