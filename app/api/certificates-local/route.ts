import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 字段映射：英文 -> 中文
function mapCertificate(cert: any) {
  return {
    record_id: cert.record_id,
    '关联人员': cert.employeeId,
    '证书': cert.certificate,
    '获得日期': cert.obtainedDate,
    '有效期至': cert.expiryDate,
    '证书状态': cert.status,
    '复训要求': cert.retrainReq,
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

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: certificates.map(mapCertificate),
    });
  } catch (error: any) {
    console.error('[Certificates API] 获取证书失败:', error);
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
    
    const cert = await prisma.certificate.create({
      data: {
        record_id: body.record_id || `cert_${Date.now()}`,
        employeeId: body['关联人员'],
        certificate: body['证书'],
        obtainedDate: body['获得日期'] ? new Date(body['获得日期']) : null,
        expiryDate: body['有效期至'] ? new Date(body['有效期至']) : null,
        status: body['证书状态'] || '有效',
        retrainReq: body['复训要求'] || '',
      },
    });

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: mapCertificate(cert),
    });
  } catch (error: any) {
    console.error('[Certificates API] 创建证书失败:', error);
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
