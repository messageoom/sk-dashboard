import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 全局注册 ECharts 组件
echarts.use([LineChart, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);