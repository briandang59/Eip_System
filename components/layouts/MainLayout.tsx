'use client';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { menuItems } from '@/utils/constants/ui/menu-items';
import { handleMenuClick } from '@/utils/handlers/menu-handlers';
import SwitchLanguages from '../common/SwitchLanguages';
import SwitchLocation from '../common/SwitchLocation';
import Clock from '../common/Clock';
import { LocationProvider } from '@/utils/contexts/LocationContext';
import ClientOnly from '../common/ClientOnly';
import svgs from '@/assets/svgs';
import Image from 'next/image';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onMenuClick = ({ key }: { key: string }) => {
        handleMenuClick(key, router);
    };

    return (
        <LocationProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    theme="light"
                    width={300}
                    className="border-r border-gray-200"
                >
                    <div
                        className={clsx(
                            'p-6 border-b border-gray-200',
                            collapsed ? 'h-25' : 'block',
                        )}
                    >
                        <h2
                            className={clsx(
                                'text-[24px] font-bold bg-gradient-to-t from-red-500 to-blue-700 text-transparent bg-clip-text',
                                collapsed ? 'hidden' : 'block',
                            )}
                        >
                            EIP Huge Bamboo
                        </h2>
                        <h3
                            className={clsx(
                                'text-[16px] font-medium',
                                collapsed ? 'hidden' : 'block',
                            )}
                        >
                            Đặng Việt Quang - B25098
                        </h3>
                    </div>
                    <Menu
                        theme="light"
                        defaultSelectedKeys={['/']}
                        mode="inline"
                        items={menuItems}
                        onClick={onMenuClick}
                    />
                </Sider>
                <Layout className="relative">
                    <Header
                        style={{
                            padding: '10px 16px',
                            background: colorBgContainer,
                            height: '100px',
                            borderBottom: '1px solid #e0e0e0',
                            borderLeft: '1px solid #e0e0e0',
                        }}
                        className="sticky top-0 z-10 flex items-center justify-between"
                    >
                        <div className="flex items-center justify-center">
                            <Image src={svgs.logo} alt="logo" width={250} height={200} />
                        </div>
                        <ClientOnly>
                            <div className="flex items-center gap-4">
                                <Clock />
                                <SwitchLocation />
                                <SwitchLanguages />
                            </div>
                        </ClientOnly>
                    </Header>
                    <Content className="p-4">
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                            className="min-h-screen"
                        >
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </LocationProvider>
    );
};

export default MainLayout;
