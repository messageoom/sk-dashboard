import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faCoins } from '@fortawesome/free-solid-svg-icons';

interface StatsCardProps {
  title: string;
  value: number | string;
  width?: string; // 新增 width 属性，允许动态设置宽度
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, width }) => {
  const icon = title === '总量' ? faLayerGroup : faCoins;

  const formattedValue = typeof value === 'string' ? value : value.toLocaleString();
  const cleanedValue = title === '总量' ? formattedValue.replace(' 枚', '枚') : formattedValue;
  const numericValue = cleanedValue.replace(/[¥￥]/g, '');

  console.log('StatsCard title:', title);
  console.log('StatsCard value:', value);
  console.log('StatsCard formattedValue:', formattedValue);
  console.log('StatsCard cleanedValue:', cleanedValue);
  console.log('StatsCard numericValue:', numericValue);

  return (
    <Card
      style={{
        margin: '35px 0 0 0', // 移除 auto，避免影响宽度
        width: '100%', // 占满父容器
        maxWidth: '100%', // 防止溢出
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))',
        height: 168,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        boxSizing: 'border-box',
      }}
      className="stats-card"
      hoverable
    >
      <p className="stats-card-title">{title}</p>
      <div className="stats-card-value-container">
        <FontAwesomeIcon icon={icon} className="stats-card-icon" />
        <h3 className="stats-card-value">
          {title === '总市值' ? (
            <span className="value-text">{numericValue}</span>
          ) : (
            cleanedValue
          )}
        </h3>
      </div>
    </Card>
  );
};

export default StatsCard;