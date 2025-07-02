import { ConfigProvider } from 'antd';

function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#317943',
                    colorPrimaryHover: '#1e7c3f',
                    colorPrimaryActive: '#125226',

                    colorPrimaryBorder: '#166534',
                    colorPrimaryBorderHover: '#1e7c3f',
                    colorPrimaryBg: '#e6f4ec',
                    colorPrimaryBgHover: '#d4eddc',

                    colorTextLightSolid: '#ffffff',
                },
                components: {
                    Menu: {
                        controlItemBgActive: '#D5F3DE',
                        itemSelectedColor: '#166534',
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}

export default AntdProvider;
