import Cookies from 'js-cookie';

const CHILD_ORIGIN = 'http://10.2.1.159:8085';

export const sendTokenToChild = (targetWin?: Window | null) => {
    const token = Cookies.get('auth_token') ?? '';
    const win =
        targetWin ??
        (document.getElementById('child-iframe') as HTMLIFrameElement | null)?.contentWindow;

    if (!win) {
        console.error('Parent: Child iframe window not found');
        return;
    }
    win.postMessage({ type: 'token', token }, CHILD_ORIGIN);
    console.log('Parent: token sent to child');
};

export const setupTokenRequestHandler = () => {
    const handleChildMessage = (event: MessageEvent) => {
        if (event.origin !== CHILD_ORIGIN) return;

        const { type } = event.data ?? {};
        if (type === 'requestToken') {
            console.log('Parent: Child requested token → sending back…');
            sendTokenToChild(event.source as Window | null);
        }
    };

    window.addEventListener('message', handleChildMessage);
    console.log('Parent: Token request handler ON');

    return () => window.removeEventListener('message', handleChildMessage);
};
