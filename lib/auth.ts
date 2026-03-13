// 用户角色类型
export type UserRole = 'admin' | 'instructor' | 'employee';

// 权限类型
export type Permission = 
  | 'course:view'
  | 'course:create'
  | 'course:edit'
  | 'course:delete'
  | 'course:authorize'
  | 'task:view'
  | 'task:create'
  | 'task:edit'
  | 'certificate:view'
  | 'certificate:create'
  | 'certificate:edit';

// 角色权限映射
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'course:view',
    'course:create',
    'course:edit',
    'course:delete',
    'course:authorize',
    'task:view',
    'task:create',
    'task:edit',
    'certificate:view',
    'certificate:create',
    'certificate:edit',
  ],
  instructor: [
    'course:view',
    'course:create',
    'course:edit',
    'course:authorize',
    'task:view',
    'task:create',
    'task:edit',
    'certificate:view',
    'certificate:create',
  ],
  employee: [
    'course:view',
    'task:view',
    'certificate:view',
  ],
};

// 用户接口
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

// 检查用户是否有指定权限
export function hasPermission(user: User, permission: Permission): boolean {
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
}

// 检查用户是否为管理员
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

// 检查用户是否为讲师
export function isInstructor(user: User): boolean {
  return user.role === 'instructor';
}

// 检查用户是否可以查看课程
export function canViewCourse(user: User, course: any): boolean {
  // 管理员和讲师可以查看所有课程
  if (isAdmin(user) || isInstructor(user)) {
    return true;
  }
  
  // 普通员工只能查看公开课程
  if (course.可见性 === '公开') {
    return true;
  }
  
  // TODO: 检查是否被授权访问此课程
  return false;
}

// 检查用户是否可以管理课程
export function canManageCourse(user: User, course: any): boolean {
  // 管理员可以管理所有课程
  if (isAdmin(user)) {
    return true;
  }
  
  // 讲师只能管理自己创建的课程
  if (isInstructor(user)) {
    return course.创建人 === user.id;
  }
  
  return false;
}

// 检查用户是否可以查看证书
export function canViewCertificate(user: User, certificate: any): boolean {
  // 管理员和讲师可以查看所有证书
  if (isAdmin(user) || isInstructor(user)) {
    return true;
  }
  
  // 普通员工只能查看自己的证书
  return certificate.关联人员 === user.id;
}

// 验证请求权限
export function verifyPermission(
  user: User,
  resource: string,
  action: string
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(user, permission);
}
