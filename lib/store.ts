'use client';

import { create } from 'zustand';
import { Course, Task, Employee, UserRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

interface AppState {
  // 用户状态
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // 租户
  currentTenant: string;
  setCurrentTenant: (tenantId: string) => void;
  
  // 数据缓存
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  
  // 权限检查
  canViewCourse: (course: Course) => boolean;
  canManageCourse: (course: Course) => boolean;
  isAdmin: () => boolean;
  isInstructor: () => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  currentTenant: '总部',
  setCurrentTenant: (tenantId) => set({ currentTenant: tenantId }),
  
  courses: [],
  setCourses: (courses) => set({ courses }),
  
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  
  employees: [],
  setEmployees: (employees) => set({ employees }),
  
  // 权限检查
  canViewCourse: (course) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    
    // 管理员和讲师可以看所有课程
    if (currentUser.role === 'admin' || currentUser.role === 'instructor') {
      return true;
    }
    
    // 普通员工只能看公开课程或被授权的课程
    if (course.可见性 === '公开') {
      return true;
    }
    
    // TODO: 检查是否被授权访问此课程
    return false;
  },
  
  canManageCourse: (course) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    
    // 管理员可以管理所有课程
    if (currentUser.role === 'admin') {
      return true;
    }
    
    // 讲师只能管理自己创建的课程
    if (currentUser.role === 'instructor') {
      return course.创建人 === currentUser.id;
    }
    
    return false;
  },
  
  isAdmin: () => {
    const { currentUser } = get();
    return currentUser?.role === 'admin';
  },
  
  isInstructor: () => {
    const { currentUser } = get();
    return currentUser?.role === 'instructor';
  },
}));
