import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { EChartsOption } from 'echarts';

interface PriceData {
  level: string;
  name: string;
  low_price: number;
  itime: string;
}

interface LineChartProps {
  data: { [key: string]: PriceData[] };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const allTimes = new Set<string>();
  Object.values(data).forEach(levelData => {
    levelData.forEach(item => allTimes.add(item.itime));
  });
  const xAxisData = Array.from(allTimes).sort();

  const selectedTimes: string[] = [];
  if (xAxisData.length > 0) {
    const first = xAxisData[0];
    const last = xAxisData[xAxisData.length - 1];
    const middleIndex = Math.floor(xAxisData.length / 2);
    const middle = xAxisData[middleIndex];
    if (first === middle && middle === last) {
      selectedTimes.push(first);
    } else if (first === middle) {
      selectedTimes.push(first, last);
    } else {
      selectedTimes.push(first, middle, last);
    }
  }

  const seriesData = ['R', 'SR', 'SSR'].map((level, index) => {
    const levelData = data[level] || [];
    const priceMap = new Map<string, number>();
    levelData.forEach(item => {
      priceMap.set(item.itime, item.low_price);
    });
    const values = xAxisData.map(time => priceMap.get(time) ?? null);
    return {
      name: level,
      type: 'line' as const,
      smooth: true,
      data: values,
      lineStyle: {
        color: ['#1890ff', '#00ff00', '#ffa500'][index],
        type: 'solid' as const,
        width: 2,
      },
      itemStyle: {
        color: ['#1890ff', '#00ff00', '#ffa500'][index],
        borderWidth: 2,
      },
      symbolSize: 8,
      showSymbol: false,
    };
  });

  const isMobile = window.innerWidth <= 768;
  const gridLeft = isMobile ? '5%' : '3%'; // 手机设备上增加左侧边距
  const gridRight = isMobile ? '5%' : '10%'; // 手机设备上减少右侧边距，但仍保留一定空间

  const option: EChartsOption = {
    title: {
      text: '月度趋势',
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      data: ['R', 'SR', 'SSR'],
      textStyle: {
        color: '#fff',
      },
      top: 'bottom',
    },
    grid: {
      left: gridLeft,
      right: gridRight,
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: xAxisData,
      axisLabel: {
        interval: (index: number) => selectedTimes.includes(xAxisData[index]),
        rotate: 0,
        formatter: (value: string) => value.split(' ')[0].slice(5),
        color: '#fff',
      },
      axisLine: {
        lineStyle: { color: '#fff' },
      },
    },
    yAxis: {
      type: 'value' as const,
      name: '金额 (¥)',
      nameTextStyle: {
        color: '#fff',
      },
      axisLabel: {
        color: '#fff',
      },
      axisLine: {
        lineStyle: { color: '#fff' },
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    series: seriesData,
  };

  return (
    <Card style={{ margin: '10px 0', background: 'transparent' }}>
      <ReactECharts
        option={option}
        style={{ height: 380 }}
        className="line-chart"
      />
    </Card>
  );
};

export default LineChart;