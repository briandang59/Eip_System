'use client';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Button, Layout, Menu, Popover, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { useFilteredMenuItems } from '@/utils/hooks/useFilteredMenuItems';
import { handleMenuClick } from '@/utils/handlers/menu-handlers';
import SwitchLanguages from '../common/SwitchLanguages';
import SwitchLocation from '../common/SwitchLocation';
import Clock from '../common/Clock';
import { LocationProvider } from '@/utils/contexts/LocationContext';
import ClientOnly from '../common/ClientOnly';
import svgs from '@/assets/svgs';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import LanguageHydration from '../common/LanguageHydration';
import { getInfomation } from '@/utils/functions/getInfomation';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const userInfo = getInfomation();
    const router = useRouter();
    const menuItems = useFilteredMenuItems();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onMenuClick = ({ key }: { key: string }) => {
        handleMenuClick(key, router);
    };

    return (
        <LocationProvider>
            <LanguageHydration />
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    theme="light"
                    width={250}
                    className="border-r border-gray-200"
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        left: 0,
                        overflow: 'auto',
                    }}
                >
                    <div className={clsx('p-6', collapsed ? 'h-25' : 'block')}>
                        <h2
                            className={clsx(
                                'text-[20px] font-bold bg-gradient-to-b from-green-700 to-blue-700 text-transparent bg-clip-text',
                                collapsed ? 'hidden' : 'block',
                            )}
                        >
                            EIP Huge Bamboo
                        </h2>
                        <ClientOnly>
                            <h3
                                className={clsx(
                                    'text-[14px] font-medium',
                                    collapsed ? 'hidden' : 'block',
                                )}
                            >
                                {userInfo?.fullname} - {userInfo?.card_number}
                            </h3>
                        </ClientOnly>
                    </div>
                    <Menu
                        theme="light"
                        defaultSelectedKeys={['/']}
                        mode="inline"
                        items={menuItems}
                        onClick={onMenuClick}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: '10px 16px',
                            background: colorBgContainer,
                            height: '100px',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                        className="sticky top-0 z-10 flex items-center justify-between"
                    >
                        <div className="flex items-center justify-center">
                            <Image src={svgs.logo} alt="logo" width={250} height={200} />
                        </div>
                        <ClientOnly>
                            <div className="flex items-center gap-4">
                                <Clock />
                                <Popover content={<div>Content</div>} trigger="click">
                                    <Button
                                        className="rounded-full bg-gray-100 border-none hover:bg-gray-200"
                                        type="text"
                                        size="large"
                                    >
                                        <Bell className="w-6 h-6" strokeWidth={1.5} />
                                    </Button>
                                </Popover>
                                <SwitchLocation />
                                <SwitchLanguages />
                            </div>
                        </ClientOnly>
                    </Header>
                    <Content className="p-2">
                        <div
                            style={{
                                padding: 10,
                                minHeight: 'calc(100vh - 100px)',
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
