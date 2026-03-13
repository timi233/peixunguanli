import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 中间件 - 权限认证
 * 
 * 注意：当前版本使用简化的认证逻辑
 * 生产环境需要实现飞书 OAuth 认证
 */

// 模拟用户数据（开发环境使用，生产环境应从飞书 OAuth 获取）
const MOCK_USERS: Record<string, any> = {
  'ou_9e782509bc704db45e5db09c5111f3b2': {
    id: 'ou_9e782509bc704db45e5db09c5111f3b2',
    name: 'zhangjian',
    email: 'zhangjian@example.com',
    role: 'admin',
    tenantId: 'headquarters', // 使用英文避免 header 错误
  },
};

// 不需要认证的路径
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/_next/static',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过公共路径
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 开发环境：使用模拟用户
  // 生产环境：应该从飞书 OAuth 获取用户信息
  const userId = request.headers.get('x-user-id') || 'ou_9e782509bc704db45e5db09c5111f3b2';
  const user = MOCK_USERS[userId] || MOCK_USERS['ou_9e782509bc704db45e5db09c5111f3b2'];

  // 注入用户信息到 request header
  // 注意：header 值必须是 ASCII 字符
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-tenant-id', user.tenantId);
  
  return response;
}

export const config = {
  matcher: [
    // 匹配所有请求路径，除了：
    // - api/auth (认证相关)
    // - _next/static (静态文件)
    // - favicon.ico
    '/((?!api/auth|_next/static|favicon.ico).*)',
  ],
};
