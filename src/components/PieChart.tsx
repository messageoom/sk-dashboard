import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { EChartsOption } from 'echarts';

interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
  const colors = ['#40C4FF', '#4CAF50', '#FF7043'];

  const isMobile = window.innerWidth <= 768;
  const radius = isMobile ? ['25%', '55%'] : ['30%', '60%'];
  const labelFontSize = isMobile ? 8 : 10;
  const labelDistance = isMobile ? 10 : 20; // 小屏幕上减小标签距离
  const labelLineLength = isMobile ? 15 : 17.5; // 小屏幕上进一步缩短折线

  // 监听图表事件，仅用于日志
  const onEvents = {
    init: () => {
      console.log('Chart initialized');
    },
    finished: () => {
      console.log('Chart rendering finished');
    },
    click: () => {
      console.log('Chart clicked');
    },
    legendselectchanged: () => {
      console.log('Legend selection changed');
    },
  };

  // 检查数据有效性
  const isDataValid = data && Array.isArray(data) && data.length > 0;

  // 定义 ECharts 配置
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowBlur: 2,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: data.map(item => item.name),
      itemGap: 30,
      itemWidth: 20,
      itemHeight: 14,
      textStyle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowBlur: 1,
      },
      padding: [0, 0, 10, 0],
    },
    series: [
      {
        name: title,
        type: 'pie' as const,
        radius: radius,
        center: ['50%', '50%'],
        data: data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length],
            borderWidth: 2,
            borderColor: '#fff',
          },
        })),
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)',
          fontSize: labelFontSize,
          color: '#fff',
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowBlur: 1,
          position: 'outside',
          distance: labelDistance, // 动态调整标签距离
        },
        labelLine: {
          show: true,
          length: labelLineLength, // 缩短 50%，从 35 到 17.5，小屏幕上进一步缩短到 15
          length2: labelLineLength, // 缩短 50%，从 35 到 17.5，小屏幕上进一步缩短到 15
          lineStyle: {
            color: '#fff',
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        animation: true,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000,
      },
    ],
  };

  // 如果数据无效，返回错误提示
  if (!isDataValid) {
    console.error('Invalid data for PieChart:', data);
    return (
      <Card style={{ margin: '10px 0', background: 'transparent' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          无法渲染饼图：数据无效
        </div>
      </Card>
    );
  }

  console.log('PieChart rendering with data:', data);
  console.log('Is mobile:', isMobile);
  console.log('Label line length:', labelLineLength);

  return (
    <Card style={{ margin: '10px 0', background: 'transparent' }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: 400, margin: '0 auto', display: 'block' }}
        className="pie-chart"
        onEvents={onEvents}
        opts={{ renderer: 'canvas' }} // 明确指定渲染器
      />
    </Card>
  );
};

export default PieChart;