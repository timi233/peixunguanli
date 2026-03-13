import { Card, Statistic } from 'antd';

interface StatsCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export function StatsCard({ title, value, prefix, suffix, color }: StatsCardProps) {
  return (
    <Card bordered={false}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color }}
      />
    </Card>
  );
}
