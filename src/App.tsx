import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Home from './pages/Home';
import GuestMap from './pages/GuestMap';
import Game from './pages/Game';
import QA from './pages/QA';
import './App.css';

const { Sider, Content } = Layout;

// 定义一个组件来处理 Menu 的选中状态
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // 获取当前路由路径

  // 动态设置 --vh 单位，解决移动端视口高度问题
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // 响应式处理侧边栏折叠
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 定义菜单项数据
  const menuItems = [
    {
      key: '1',
      label: <Link to="/">项目概览</Link>,
    },
    {
      key: '2',
      label: <Link to="/guest-map">食客图谱</Link>,
    },
    {
      key: '3',
      label: <Link to="/game">食客小游戏</Link>,
    },
    {
      key: '4',
      label: <Link to="/qa">Q&A</Link>,
    },
  ];

  // 根据当前路径设置选中项
  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/':
        return '1';
      case '/guest-map':
        return '2';
      case '/game':
        return '3';
      case '/qa':
        return '4';
      default:
        return '1'; // 默认选中首页
    }
  };

  return (
    <Layout
      className="app-layout"
      style={{
        '--background-image': `url(${process.env.PUBLIC_URL}/background-image/background-image.jpg)`,
      } as React.CSSProperties}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: '#001529', position: 'fixed', height: '100vh' }}
        width={100}
        collapsedWidth={0}
        breakpoint="md"
        className="custom-sider"
      >
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[getSelectedKey()]} // 动态设置选中项
          className="vertical-center-menu"
          items={menuItems}
        />
      </Sider>

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guest-map" element={<GuestMap />} />
          <Route path="/game" element={<Game />} />
          <Route path="/qa" element={<QA />} />
        </Routes>
      </Content>
    </Layout>
  );
};

// 包装 App 组件以使用 Router 和 useLocation
const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;