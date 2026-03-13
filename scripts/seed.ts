import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('📦 开始添加测试数据...');

  // 1. 添加员工
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        record_id: 'emp_001',
        name: '张健',
        department: '技术部',
        position: 'IP-guard 工程师',
        joinDate: new Date('2026-01-01'),
        organization: '总部',
        employmentStatus: '在职',
      },
    }),
    prisma.employee.create({
      data: {
        record_id: 'emp_002',
        name: '许广波',
        department: '技术部',
        position: 'IP-guard 工程师',
        joinDate: new Date('2026-01-01'),
        organization: '总部',
        employmentStatus: '在职',
      },
    }),
    prisma.employee.create({
      data: {
        record_id: 'emp_003',
        name: '张海泉',
        department: '技术部',
        position: '安全技术工程师',
        joinDate: new Date('2026-01-15'),
        organization: '总部',
        employmentStatus: '在职',
      },
    }),
  ]);

  console.log(`✅ 添加 ${employees.length} 名员工`);

  // 2. 添加课程
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        record_id: 'course_001',
        name: 'IP-guard 产品了解',
        product: 'IP-guard',
        type: '理论课',
        duration: 120,
        instructor: '许广波',
        level: '初级',
        status: '已上线',
        visibility: '公开',
        positions: 'IP-guard 工程师',
        examType: '在线考试',
        description: 'IP-guard 终端安全管理系统产品介绍',
        creator: 'admin',
      },
    }),
    prisma.course.create({
      data: {
        record_id: 'course_002',
        name: 'IP-guard 加密系统切换方案 2024',
        product: 'IP-guard',
        type: '实操课',
        duration: 240,
        instructor: '许广波',
        level: '高级',
        status: '已上线',
        visibility: '需授权',
        positions: 'IP-guard 工程师',
        examType: '实操考核',
        description: '从其他加密系统切换到 IP-guard 的完整方案',
        creator: 'admin',
      },
    }),
    prisma.course.create({
      data: {
        record_id: 'course_003',
        name: '网络安全基础',
        product: '通用技能',
        type: '理论课',
        duration: 180,
        instructor: '张海泉',
        level: '初级',
        status: '已上线',
        visibility: '公开',
        positions: '安全技术工程师',
        examType: '在线考试',
        description: '网络安全基础知识培训',
        creator: 'admin',
      },
    }),
    prisma.course.create({
      data: {
        record_id: 'course_004',
        name: 'IP-guard 安装部署 2023',
        product: 'IP-guard',
        type: '实操课',
        duration: 180,
        instructor: '许广波',
        level: '初级',
        status: '已上线',
        visibility: '公开',
        positions: 'IP-guard 工程师',
        examType: '实操考核',
        description: 'IP-guard 服务器安装部署全流程',
        creator: 'admin',
      },
    }),
    prisma.course.create({
      data: {
        record_id: 'course_005',
        name: 'IP-guard 高级售后培训',
        product: 'IP-guard',
        type: '认证备考课',
        duration: 480,
        instructor: '许广波',
        level: '高级',
        status: '已上线',
        visibility: '需授权',
        positions: 'IP-guard 工程师',
        examType: '实操考核',
        description: '高级售后技术能力培训',
        creator: 'admin',
      },
    }),
  ]);

  console.log(`✅ 添加 ${courses.length} 门课程`);

  // 3. 添加学习任务
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        record_id: 'task_001',
        employeeId: 'emp_001',
        project: 'IP-guard 入职培训',
        courseId: 'course_001',
        progress: 100,
        startedAt: new Date('2026-03-01'),
        completedAt: new Date('2026-03-05'),
        result: '95 分',
        dueDate: new Date('2026-03-10'),
        status: '已完成',
      },
    }),
    prisma.task.create({
      data: {
        record_id: 'task_002',
        employeeId: 'emp_001',
        project: 'IP-guard 入职培训',
        courseId: 'course_002',
        progress: 60,
        startedAt: new Date('2026-03-08'),
        completedAt: null,
        result: '',
        dueDate: new Date('2026-03-20'),
        status: '进行中',
      },
    }),
    prisma.task.create({
      data: {
        record_id: 'task_003',
        employeeId: 'emp_003',
        project: '网络安全培训',
        courseId: 'course_003',
        progress: 100,
        startedAt: new Date('2026-03-01'),
        completedAt: new Date('2026-03-03'),
        result: '优秀',
        dueDate: new Date('2026-03-10'),
        status: '已完成',
      },
    }),
  ]);

  console.log(`✅ 添加 ${tasks.length} 个学习任务`);

  // 4. 添加证书
  const certificates = await Promise.all([
    prisma.certificate.create({
      data: {
        record_id: 'cert_001',
        employeeId: 'emp_001',
        certificate: 'IP-guard 认证工程师',
        obtainedDate: new Date('2026-01-15'),
        expiryDate: new Date('2028-01-15'),
        status: '有效',
        retrainReq: '每 2 年复训',
      },
    }),
    prisma.certificate.create({
      data: {
        record_id: 'cert_002',
        employeeId: 'emp_002',
        certificate: 'IP-guard 认证工程师',
        obtainedDate: new Date('2026-01-15'),
        expiryDate: new Date('2028-01-15'),
        status: '有效',
        retrainReq: '每 2 年复训',
      },
    }),
    prisma.certificate.create({
      data: {
        record_id: 'cert_003',
        employeeId: 'emp_001',
        certificate: 'CCIE 路由交换专家',
        obtainedDate: new Date('2025-06-01'),
        expiryDate: new Date('2026-04-01'), // 即将到期
        status: '即将到期',
        retrainReq: '每 3 年重认证',
      },
    }),
  ]);

  console.log(`✅ 添加 ${certificates.length} 个证书`);

  console.log('\n🎉 测试数据添加完成！');
  console.log('\n数据汇总:');
  console.log(`  - 员工：${employees.length} 名`);
  console.log(`  - 课程：${courses.length} 门`);
  console.log(`  - 任务：${tasks.length} 个`);
  console.log(`  - 证书：${certificates.length} 个`);
}

seed()
  .catch((e) => {
    console.error('❌ 添加测试数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
