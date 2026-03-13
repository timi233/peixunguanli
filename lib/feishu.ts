import { Course, Task, Employee, Certificate, TrainingProject } from '../types';

// 飞书 API 配置
const FEISHU_CONFIG = {
  appId: process.env.FEISHU_APP_ID || '',
  appSecret: process.env.FEISHU_APP_SECRET || '',
  appToken: process.env.FEISHU_APP_TOKEN || '',
  baseUrl: 'https://open.feishu.cn',
};

// 配置常量
const API_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 秒
  timeout: 30000, // 30 秒
};

// 缓存 access token
let accessToken: string | null = null;
let tokenExpireTime: number = 0;

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 日志工具
 */
function log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[FeishuAPI][${timestamp}][${level.toUpperCase()}]`;
  
  if (level === 'error') {
    console.error(prefix, message, data || '');
  } else if (level === 'warn') {
    console.warn(prefix, message, data || '');
  } else {
    console.log(prefix, message, data || '');
  }
}

/**
 * 带重试机制的 fetch 请求
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = API_CONFIG.maxRetries
): Promise<any> {
  const lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log('info', `请求 ${url} (尝试 ${attempt}/${retries})`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // 处理 HTTP 错误
      if (!response.ok) {
        throw new Error(`HTTP 错误：${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error: any) {
      const isRetryable = 
        error.name === 'AbortError' || // 超时
        error.message.includes('ECONNRESET') || // 连接重置
        error.message.includes('ETIMEDOUT') || // 超时
        error.message.includes('ECONNREFUSED'); // 连接拒绝
      
      log('warn', `请求失败：${error.message}`, { attempt, isRetryable });
      
      // 如果不是可重试的错误，或者已经是最后一次尝试，直接抛出
      if (!isRetryable || attempt === retries) {
        throw error;
      }
      
      // 指数退避
      const delayMs = API_CONFIG.baseDelay * Math.pow(2, attempt - 1);
      log('info', `${delayMs}ms 后重试...`);
      await delay(delayMs);
    }
  }
  
  throw lastError || new Error('请求失败，已达最大重试次数');
}

/**
 * 获取 access token（带缓存和重试）
 */
async function getAccessToken(): Promise<string> {
  // 检查缓存是否有效
  if (accessToken && Date.now() < tokenExpireTime) {
    log('info', '使用缓存的 access token');
    return accessToken;
  }

  log('info', '获取新的 access token');
  
  const data = await fetchWithRetry(
    `${FEISHU_CONFIG.baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: FEISHU_CONFIG.appId,
        app_secret: FEISHU_CONFIG.appSecret,
      }),
    }
  );
  
  if (data.code !== 0) {
    log('error', '获取 access token 失败', { code: data.code, msg: data.msg });
    throw new Error(`获取 access token 失败：${data.msg}`);
  }

  accessToken = data.tenant_access_token;
  // token 过期时间提前 100 秒刷新
  tokenExpireTime = Date.now() + (data.expire - 100) * 1000;
  
  log('info', `access token 获取成功，过期时间：${new Date(tokenExpireTime).toISOString()}`);

  return accessToken;
}

/**
 * 通用请求方法（带错误处理）
 */
async function request(path: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json; charset=utf-8',
  };

  const url = `${FEISHU_CONFIG.baseUrl}${path}`;
  log('info', `请求飞书 API: ${path}`);

  const data = await fetchWithRetry(url, { ...options, headers });
  
  // 检查飞书 API 返回码
  if (data.code !== 0) {
    log('error', '飞书 API 返回错误', { code: data.code, msg: data.msg, path });
    throw new Error(`API 请求失败：${data.msg} (code: ${data.code})`);
  }
  
  log('info', `API 请求成功：${path}`);
  return data;
}

/**
 * 批量获取记录（处理分页）
 */
async function getAllRecords(
  tableId: string,
  params?: {
    fieldNames?: string[];
    filter?: any;
    pageSize?: number;
  }
): Promise<any[]> {
  const allItems: any[] = [];
  let pageToken: string | undefined;
  
  do {
    const queryParams = new URLSearchParams();
    if (params?.pageSize) queryParams.append('page_size', String(params.pageSize));
    if (pageToken) queryParams.append('page_token', pageToken);
    if (params?.filter) queryParams.append('filter', JSON.stringify(params.filter));
    
    const data = await request(
      `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records?${queryParams}`
    );
    
    allItems.push(...data.data.items);
    pageToken = data.data.page_token;
    
    log('info', `获取分页数据，当前页 ${allItems.length} 条记录`);
  } while (pageToken);
  
  return allItems;
}

// 获取课程列表（支持分页）
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

  if (filters?.课程难度) {
    filter.conditions.push({
      field_name: '课程难度',
      operator: 'is',
      value: [filters.课程难度],
    });
  }

  if (filters?.可见性) {
    filter.conditions.push({
      field_name: '可见性',
      operator: 'is',
      value: [filters.可见性],
    });
  }

  const items = await getAllRecords(tableId, { filter });
  
  return items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取学习任务列表（支持分页和筛选）
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

  const items = await getAllRecords(tableId, { filter });
  
  return items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
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

// 获取员工列表（支持分页）
export async function getEmployees() {
  const tableId = 'tblvmApfCBYVWvJf'; // 员工档案表 ID
  const items = await getAllRecords(tableId);
  
  return items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取培训项目列表（支持分页）
export async function getTrainingProjects() {
  const tableId = 'tblBCc0vtO7IpRll'; // 培训项目管理表 ID
  const items = await getAllRecords(tableId);
  
  return items.map((item: any) => ({
    record_id: item.record_id,
    ...item.fields,
  }));
}

// 获取证书列表（支持分页）
export async function getCertificates() {
  const tableId = 'tbl8Dy2d1tlgNkXr'; // 证书管理表 ID
  const items = await getAllRecords(tableId);
  
  return items.map((item: any) => ({
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
