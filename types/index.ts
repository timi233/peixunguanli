// 课程类型
export interface Course {
  record_id: string;
  课程名称：string;
  所属产品：'IP-guard' | '爱数' | '安恒' | '通用技能';
  课程类型：'理论课' | '实操课' | '认证备考课';
  课程时长：number;
  导师：string;
  课程难度：'初级' | '中级' | '高级';
  课程状态：'已上线' | '未上线';
  可见性：'公开' | '需授权';
  适用岗位：string[];
  考核类型：'在线考试' | '实操考核' | '情景模拟' | '阶段测试';
  课程介绍：string;
  创建人：string;
}

// 员工类型
export interface Employee {
  record_id: string;
  姓名：string;
  部门：string;
  岗位：string;
  入职时间：string;
  所属组织：string;
  在职状态：'在职' | '离职' | '试用期';
}

// 学习任务类型
export interface Task {
  record_id: string;
  关联员工：string;
  关联培训计划：string;
  关联课程：string;
  学习进度：number;
  学习开始时间：string;
  学习完成时间：string;
  考核结果：string;
  截止日期：string;
  任务状态：'进行中' | '已完成' | '已延期';
}

// 证书类型
export interface Certificate {
  record_id: string;
  关联人员：string;
  证书：string;
  获得日期：string;
  有效期至：string;
  证书状态：'有效' | '即将到期' | '已过期' | '已冻结';
}

// 证书类型
export interface CertificateType {
  record_id: string;
  证书名称：string;
  发证机构：string;
  有效期：number;
  复训要求：string;
}

// 培训项目类型
export interface TrainingProject {
  record_id: string;
  培训项目名称：string;
  培训类型：'岗位技能' | '厂家认证';
  培训状态：'未开始' | '进行中' | '已结束';
  培训形式：'线上' | '线下' | '混合式';
  培训周期：string;
  参与对象：string[];
  导师：string[];
  负责人：string;
  描述：string;
}

// 用户角色
export type UserRole = 'admin' | 'instructor' | 'employee';

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}
