import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    env: {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID ? '✅ 已配置' : '❌ 未配置',
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET ? '✅ 已配置' : '❌ 未配置',
      FEISHU_APP_TOKEN: process.env.FEISHU_APP_TOKEN ? '✅ 已配置' : '❌ 未配置',
    },
    nodeVersion: process.version,
    platform: process.platform,
  };

  return NextResponse.json({
    code: 0,
    msg: 'success',
    data: checks,
  });
}
