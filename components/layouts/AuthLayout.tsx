'use client';
import images from '@/assets/images';
import { Layout } from 'antd';

const { Content } = Layout;

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            <Content
                className="flex items-center justify-center h-screen"
                style={{
                    backgroundImage: `url(${images.loginImage.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="w-full max-w-xl p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-t from-red-500 to-blue-700 text-transparent bg-clip-text">
                        EIP System Management
                    </h1>
                    {children}
                </div>
            </Content>
        </Layout>
    );
}

export default AuthLayout;
