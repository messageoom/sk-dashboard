import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { EChartsOption } from 'echarts';

interface BarChartProps {
  data: { name: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const values = data.map(item => item.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);

  const colors = ['#188cff', '#18ff93', '#ff5218'];

  const isMobile = window.innerWidth <= 768;
  const gridLeft = isMobile ? '5%' : '5%'; // 手机设备上保持左侧边距
  const gridRight = isMobile ? '5%' : '5%'; // 手机设备上保持右侧边距

  const option: EChartsOption = {
    title: {
      text: '市值分布',
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: gridLeft,
      right: gridRight,
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: data.map(item => item.name),
      axisLabel: {
        rotate: 45,
        color: '#fff',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: { color: '#fff' },
      },
    },
    yAxis: {
      type: 'value' as const,
      name: '金额 (¥)',
      min: minValue,
      max: maxValue * 1.1,
      nameTextStyle: {
        color: '#fff',
      },
      axisLabel: {
        formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`,
        color: '#fff',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: { color: '#fff' },
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    series: [
      {
        name: '市值',
        type: 'bar' as const,
        data: data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: colors[index],
          },
        })),
        barWidth: '60%',
      },
    ],
  };

  return (
    <Card style={{ margin: '10px 0', background: 'transparent' }}>
      <ReactECharts
        option={option}
        style={{ height: 380 }}
        className="bar-chart"
      />
    </Card>
  );
};

export default BarChart;