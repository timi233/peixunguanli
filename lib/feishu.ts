import { Course, Task, Employee, Certificate, TrainingProject } from '../types';

// 飞书 API 配置
const FEISHU_CONFIG = {
  appId: process.env.FEISHU_APP_ID || '',
  appSecret: process.env.FEISHU_APP_SECRET || '',
  appToken: process.env.FEISHU_APP_TOKEN || '',
  baseUrl: 'https://open.feishu.cn',
};

// 缓存 access token
let accessToken: string | null = null;
let tokenExpireTime: number = 0;

// 获取 access token
async function getAccessToken(): Promise<string> {
  // 检查缓存是否有效
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken;
  }

  const response = await fetch(`${FEISHU_CONFIG.baseUrl}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: FEISHU_CONFIG.appId,
      app_secret: FEISHU_CONFIG.appSecret,
    }),
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`获取 access token 失败：${data.msg}`);
  }

  accessToken = data.tenant_access_token;
  // token 过期时间提前 100 秒刷新
  tokenExpireTime = Date.now() + (data.expire - 100) * 1000;

  return accessToken;
}

// 通用请求方法
async function request(path: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json; charset=utf-8',
  };

  const response = await fetch(`${FEISHU_CONFIG.baseUrl}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`API 请求失败：${data.msg}`);
  }

  return data;
}

// 获取课程列表
export async function getCourses(filters?: {
  所属产品?: string;
  课程难度?: string;
  可见性?: string;
}): Promise<Course[]> {
  const tableId = 'tblEpl78PNqK5kAQ'; // 课程库表 ID
  const filter: any = {
    conjunction: 'and',
    conditions: [] as any[],
  };

  if (filters?.所属产品) {
    filter.conditions.push({
      field_name: '所属产品',
      operator: 'is',
      value: [filters.所属产品],
    });
  }

  if (filters?.可见性) {
    filter.conditions.push({
      field_name: '可见性',
      operator: 'is',
      value: [filters.可见性],
    });
  }

  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'GET',
      body: JSON.stringify({ filter }),
    }
  );

  return data.data.items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取学习任务列表（支持跨表关联）
export async function getTasksWithDetails(employeeId?: string): Promise<any[]> {
  const tableId = 'tblBuDZZgLeZEJQY'; // 学习与考核记录表 ID
  const filter: any = {
    conjunction: 'and',
    conditions: [] as any[],
  };

  if (employeeId) {
    filter.conditions.push({
      field_name: '关联员工',
      operator: 'is',
      value: [employeeId],
    });
  }

  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'GET',
      body: JSON.stringify({ filter }),
    }
  );

  // 获取所有任务
  const tasks = data.data.items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));

  // TODO: 跨表关联查询（需要并行获取课程和员工信息）
  // 这里返回原始数据，前端再处理关联

  return tasks;
}

// 创建记录
export async function createRecord(
  tableId: string,
  fields: Record<string, any>
) {
  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }
  );

  return data.data.record;
}

// 更新记录
export async function updateRecord(
  tableId: string,
  recordId: string,
  fields: Record<string, any>
) {
  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records/${recordId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ fields }),
    }
  );

  return data.data.record;
}

// 获取员工列表
export async function getEmployees() {
  const tableId = 'tblvmApfCBYVWvJf'; // 员工档案表 ID
  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'GET',
    }
  );

  return data.data.items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取培训项目列表
export async function getTrainingProjects() {
  const tableId = 'tblBCc0vtO7IpRll'; // 培训项目管理表 ID
  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'GET',
    }
  );

  return data.data.items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取证书列表
export async function getCertificates() {
  const tableId = 'tbl8Dy2d1tlgNkXr'; // 证书管理表 ID
  const data = await request(
    `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`,
    {
      method: 'GET',
    }
  );

  return data.data.items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取证书类型列表
export async function getCertificateTypes() {
  // TODO: 创建证书类型表后替换为实际表 ID
  // 当前返回空数组
  return [];
}

// 创建证书
export async function createCertificate(fields: Record<string, any>) {
  const tableId = 'tbl8Dy2d1tlgNkXr'; // 证书管理表 ID
  return createRecord(tableId, fields);
}
