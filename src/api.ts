import axios from 'axios';

// 定义接口返回的数据结构
interface PriceData {
  level: string;
  name: string;
  low_price: number;
  itime: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: PriceData[];
  pagination: {
    current_page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

// 定义表格组件的数据结构
interface FloorPriceItem {
  level: string;
  name: string;
  low_price: number;
  previewImage?: string; // 藏品预览图，暂时标记为 TODO
  purchaseLink?: string; // 购买入口，暂时标记为 TODO
}

// 定义仪表板需要的数据结构
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
  currentFloorPriceItems: FloorPriceItem[]; // 已包含
}

const API_URL = 'http://localhost/:8000/api';

export const fetchDashboardData = async (page: number = 1, pageSize: number = 1): Promise<DashboardData> => {
  try {
    // 分别获取 R、SR、SSR 的数据
    const levels = ['R', 'SR', 'SSR'];
    const priceData: { [key: string]: PriceData[] } = {};
    const guestCounts: { [key: string]: number } = {
      R: 7000,
      SR: 2500,
      SSR: 500,
    };
    const categorySales: { name: string; value: number }[] = [];
    const currentFloorPriceItems: FloorPriceItem[] = [];

    for (const level of levels) {
      const response = await axios.get<ApiResponse>(API_URL, {
        params: { level, page, pagesize: pageSize },
      });
      priceData[level] = response.data.data;

      // 计算柱状图数据：low_price 乘以食客数量
      const lowPrice = response.data.data[0]?.low_price || 0;
      const value = lowPrice * guestCounts[level];
      console.log(`${level} low_price: ${lowPrice}, value: ${value}`);
      categorySales.push({
        name: `${level} 食客`,
        value: value,
      });

      // 构造表格组件数据
      if (response.data.data[0]) {
        currentFloorPriceItems.push({
          level: level,
          name: response.data.data[0].name,
          low_price: response.data.data[0].low_price,
          previewImage: 'TODO',
          purchaseLink: 'TODO',
        });
      }
    }

    // 构造仪表板数据
    const dashboardData: DashboardData = {
      totalSales: 3254789,
      totalOrders: 120,
      avgPrice: 27123,
      totalQuantity: 4568,
      priceData,
      categorySales,
      salesRatio: [
        { name: '旗舰', value: 35 },
        { name: '经典', value: 30 },
        { name: '入门', value: 20 },
        { name: '旧款', value: 15 },
      ],
      productSalesRatio: [
        { name: '旗舰系列Pro', value: 40 },
        { name: '旗舰系列', value: 25 },
        { name: '经典系列', value: 20 },
        { name: '入门系列', value: 15 },
      ],
      topProducts: [
        { rank: 1, name: '旗舰系列Pro', sales: 758320, quantity: 126, orders: 35 },
        { rank: 2, name: '旗舰系列', sales: 542680, quantity: 98, orders: 28 },
        { rank: 3, name: '经典系列', sales: 385480, quantity: 85, orders: 23 },
      ],
      currentFloorPriceItems,
    };

    return dashboardData;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};