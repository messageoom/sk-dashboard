import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Card } from 'antd';
import StatsCard from '../components/StatsCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import TopProductsTable from '../components/TopProductsTable';
import { fetchDashboardData } from '../api';

// 防抖函数
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };
  return debounced;
}

interface PriceData {
  level: string;
  name: string;
  low_price: number;
  itime: string;
}

interface FloorPriceItem {
  level: string;
  name: string;
  low_price: number;
  previewImage?: string;
  purchaseLink?: string;
}

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  avgPrice: number;
  totalQuantity: number;
  priceData: { [key: string]: PriceData[] };
  categorySales: { name: string; value: number }[];
  salesRatio: { name: string; value: number }[];
  productSalesRatio: { name: string; value: number }[];
  topProducts: { rank: number; name: string; sales: number; quantity: number; orders: number }[];
  currentFloorPriceItems: FloorPriceItem[];
}

const Home: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerticalLayout, setIsVerticalLayout] = useState<boolean>(() => {
    const isVertical = window.innerWidth < window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    return isVertical || isMobile;
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      const isVertical = window.innerWidth < window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const newLayout = isVertical || isMobile;
      setIsVerticalLayout(prev => {
        if (prev !== newLayout) {
          console.log('Layout changed to:', newLayout ? 'vertical' : 'horizontal');
          return newLayout;
        }
        return prev;
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDashboardData(1, 100);
        const normalizedData: DashboardData = {
          totalSales: result.totalSales || 0,
          totalOrders: result.totalOrders || 0,
          avgPrice: result.avgPrice || 0,
          totalQuantity: result.totalQuantity || 0,
          priceData: result.priceData || {},
          categorySales: result.categorySales || [],
          salesRatio: [
            { name: 'R 食客', value: 7000 },
            { name: 'SR 食客', value: 2500 },
            { name: 'SSR 食客', value: 500 },
          ],
          productSalesRatio: result.productSalesRatio || [],
          topProducts: result.topProducts || [],
          currentFloorPriceItems: result.currentFloorPriceItems || [],
        };
        const stableData: DashboardData = JSON.parse(JSON.stringify(normalizedData));
        setData(stableData);
        console.log('Data loaded:', stableData);
      } catch (error: any) {
        console.error('加载数据失败:', error);
        setError('无法加载数据，请检查后端服务是否正常运行');
      }
    };
    loadData();
  }, []);

  const salesRatio = useMemo(() => {
    const ratio = data?.salesRatio && Array.isArray(data.salesRatio) ? data.salesRatio : [];
    console.log('Sales ratio computed:', ratio);
    return ratio;
  }, [data?.salesRatio]);

  const totalMarketValue = useMemo(() => {
    const value = data?.categorySales && Array.isArray(data.categorySales)
      ? data.categorySales.reduce((sum, item) => sum + (item.value || 0), 0)
      : 0;
    console.log('Total market value computed:', value);
    return value;
  }, [data?.categorySales]);

  if (error) return <div className="error-message">{error}</div>;
  if (!data) return <div className="loading-message">加载中...</div>;

  const colSpan = isVerticalLayout ? 24 : 12;

  const headerWrapperStyle = {
    padding: isVerticalLayout ? '0 5px' : '0 20px', // 手机设备上减少 header 的左右 padding
  };

  const appContainerPadding = isVerticalLayout ? 5 : 20; // 手机设备上减少 app-container 的 padding
  const contentWrapperPadding = isVerticalLayout ? 0 : 20;
  const totalPadding = appContainerPadding * 2 + contentWrapperPadding * 2;
  const contentWrapperStyle = {
    padding: isVerticalLayout ? '0' : '0 20px',
    maxWidth: isVerticalLayout ? `calc(100% - ${totalPadding}px)` : 'none',
    margin: '0 auto',
  };

  const maxContentWidth = 1200;
  const gutter = 16;
  const componentWidth = isVerticalLayout
    ? `calc(100% - ${totalPadding}px)`
    : `${(maxContentWidth - totalPadding - gutter) / 2}px`;

  const statsCardWidth = isVerticalLayout ? `calc(100% - ${totalPadding}px)` : componentWidth;

  const statsRowGutter: [number, number] = isVerticalLayout ? [0, 16] : [16, 16];
  const outerRowGutter: [number, number] = isVerticalLayout ? [0, 16] : [16, 16];

  const colStyle = {
    padding: 0,
    width: '100%',
    maxWidth: componentWidth,
    margin: '0 auto',
  };

  return (
    <div className="app-container">
      <div style={headerWrapperStyle}>
        <div className="header-container">
          <h1 className="page-title">疯狂食客PFP数据概览</h1>
          <p className="page-description">数据仅供参考，无任何实际价值</p>
        </div>
      </div>

      <div style={contentWrapperStyle}>
        <Row gutter={outerRowGutter} justify="center">
          <Col span={colSpan} style={colStyle}>
            <Row gutter={statsRowGutter} justify="center">
              <Col span={24}>
                <StatsCard title="总量" value="10,000 枚" width={statsCardWidth} />
              </Col>
              <Col span={24}>
                <StatsCard title="总市值" value={totalMarketValue.toLocaleString()} width={statsCardWidth} />
              </Col>
            </Row>
          </Col>
          <Col span={colSpan} style={colStyle}>
            {salesRatio.length > 0 ? (
              <PieChart title="食客分布" data={salesRatio} />
            ) : (
              <div className="error-message">食客分布数据不可用</div>
            )}
          </Col>
        </Row>

        <Row gutter={outerRowGutter} justify="center">
          <Col span={colSpan} className="chart-container" style={colStyle}>
            {data.priceData && typeof data.priceData === 'object' ? (
              <LineChart data={data.priceData} />
            ) : (
              <div className="error-message">价格数据不可用</div>
            )}
          </Col>
          <Col span={colSpan} className="chart-container" style={colStyle}>
            {data.categorySales && Array.isArray(data.categorySales) ? (
              <BarChart data={data.categorySales} />
            ) : (
              <div className="error-message">分类销售数据不可用</div>
            )}
          </Col>
        </Row>

        {data.currentFloorPriceItems && Array.isArray(data.currentFloorPriceItems) ? (
          <TopProductsTable data={data.currentFloorPriceItems} />
        ) : (
          <div className="error-message">热门产品数据不可用</div>
        )}

        <Card title="免责声明" className="disclaimer-card" style={{ margin: '50px 0 10px 0' }}>
          <p className="disclaimer-text">
            本网站所展示的数据来源于[ 疯狂食客俱乐部公众号/唯一艺术官网/疯狂食客PFP藏家]。本网站力求提供准确信息，但不对其准确性、完整性或及时性做出任何保证。用户在使用本网站/应用提供的数据时，应自行承担所有风险。本网站提供的数据仅供参考，不构成任何投资或其他专业建议。本网站所展示的数据版权归[疯狂食客PFP藏家/ 疯狂食客项目方]所有。本网站可能包含指向第三方网站的链接，我们不对这些网站的内容负责。如有任何疑问，请咨询相关专业人士。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;