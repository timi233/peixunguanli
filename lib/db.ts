import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 数据库初始化函数
export async function initDatabase() {
  try {
    await prisma.$connect();
    console.log('[Database] SQLite 数据库连接成功');
  } catch (error) {
    console.error('[Database] 数据库连接失败:', error);
    throw error;
  }
}

// 关闭数据库连接
export async function closeDatabase() {
  await prisma.$disconnect();
  console.log('[Database] 数据库连接已关闭');
}
