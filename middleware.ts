import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // 获取用户信息（从 cookie 或 header）
  const userId = request.headers.get('x-user-id') || 'ou_9e782509bc704db45e5db09c5111f3b2';
  const user = MOCK_USERS[userId] || MOCK_USERS['ou_9e782509bc704db45e5db09c5111f3b2'];

  // API 路径的权限检查
  if (pathname.startsWith('/api/')) {
    // 管理员可以访问所有 API
    if (user.role === 'admin') {
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-role', user.role);
      response.headers.set('x-tenant-id', user.tenantId);
      return response;
    }

    // 非管理员访问限制检查
    // TODO: 根据具体 API 路径进行权限控制
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-tenant-id', user.tenantId);
    return response;
  }

  // 页面访问权限检查
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-tenant-id', user.tenantId);
  return response;
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下路径：
     * - api/auth (认证相关)
     * - _next/static (静态文件)
     * - favicon.ico (favicon 文件)
     */
    '/((?!api/auth|_next/static|favicon.ico).*)',
  ],
};
