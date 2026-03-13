import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 同步飞书数据到本地 SQLite
 */
export async function syncFromFeishu() {
  console.log('[Sync] 开始同步飞书数据...');
  
  try {
    // 这里会调用飞书 API 获取数据
    // 然后写入 SQLite
    // TODO: 实现具体的同步逻辑
    
    await prisma.syncLog.create({
      data: {
        tableName: 'all',
        status: 'success',
        message: '同步完成',
      },
    });
    
    console.log('[Sync] 同步完成');
    return { success: true };
  } catch (error: any) {
    console.error('[Sync] 同步失败:', error);
    
    await prisma.syncLog.create({
      data: {
        tableName: 'all',
        status: 'failed',
        message: error.message,
      },
    });
    
    return { success: false, error: error.message };
  }
}

/**
 * 获取同步日志
 */
export async function getSyncLogs(limit: number = 10) {
  return prisma.syncLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
