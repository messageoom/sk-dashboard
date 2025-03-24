import React from 'react';
import { Card, Table, Image } from 'antd';

interface FloorPriceItem {
  level: string;
  name: string;
  low_price: number;
  previewImage?: string;
  purchaseLink?: string;
}

interface TopProductsTableProps {
  data?: FloorPriceItem[];
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Card style={{ margin: '10px 0', background: 'transparent', textAlign: 'center' }}>
        <p style={{ color: '#fff' }}>暂无数据</p>
      </Card>
    );
  }

  const getImageUrl = (name: string): string => {
    const encodedName = encodeURIComponent(name);
    return `/images/${encodedName}.jpg`;
  };

  const columns = [
    {
      title: '藏品预览图',
      dataIndex: 'name',
      key: 'previewImage',
      render: (name: string) => {
        const imageUrl = getImageUrl(name);
        return (
          <Image
            src={imageUrl}
            alt={name}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            preview={false} // 禁用预览
            placeholder={<div style={{ width: 50, height: 50, background: '#ccc', borderRadius: '4px' }}>加载中...</div>}
            fallback="/images/placeholder.jpg"
          />
        );
      },
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (text: string) => (
        <span style={{ fontWeight: 'bold', color: text === 'SSR' ? '#FF7043' : text === 'SR' ? '#4CAF50' : '#40C4FF' }}>
          {text}
        </span>
      ),
    },
    {
      title: '藏品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地板价',
      dataIndex: 'low_price',
      key: 'low_price',
      render: (value: number) => (
        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '购买入口',
      dataIndex: 'purchaseLink',
      key: 'purchaseLink',
      render: () => <span>TODO...</span>,
    },
  ];

  return (
    <Card
      title="当前地板价藏品"
      style={{ margin: '10px 0', background: 'transparent' }}
      className="top-products-table-card"
    >
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey="level"
        size="small"
        className="top-products-table"
        rowClassName={() => 'table-row-animated'}
      />
    </Card>
  );
};

export default TopProductsTable;