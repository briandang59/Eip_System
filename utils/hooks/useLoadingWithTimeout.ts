import { useState, useCallback, useRef, useEffect } from 'react';

interface Options {
    /** Thời gian hiển thị tối thiểu (mặc định 300 ms) */
    minDelayMs?: number;
    /** Thời gian chờ tối đa trước khi ép tắt (mặc định 8000 ms) */
    timeoutMs?: number;
}

/**
 * Quản lý isLoading: spinner bật ngay, đảm bảo hiển thị ≥ minDelayMs,
 * và tự tắt sau timeoutMs nếu nhiệm vụ quá lâu.
 */
export function useLoadingWithDelay({ minDelayMs = 300, timeoutMs = 8000 }: Options = {}) {
    const [isLoading, setIsLoading] = useState(false);

    const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Dọn dẹp khi component unmount
    useEffect(
        () => () => {
            if (fallbackRef.current) clearTimeout(fallbackRef.current);
            if (finishRef.current) clearTimeout(finishRef.current);
        },
        [],
    );

    const run = useCallback(
        async <T>(task: () => Promise<T>): Promise<T | null> => {
            const start = Date.now();
            setIsLoading(true);

            // Fallback: ép tắt sau timeoutMs
            fallbackRef.current = setTimeout(() => {
                setIsLoading(false);
            }, timeoutMs);

            try {
                return await task();
            } catch (err) {
                console.error(err);
                return null;
            } finally {
                // Đã xong → dọn fallback
                if (fallbackRef.current) clearTimeout(fallbackRef.current);

                // Tính thời gian đã hiển thị
                const elapsed = Date.now() - start;
                const remain = Math.max(minDelayMs - elapsed, 0);

                // Giữ spinner thêm `remain` ms (nếu >0)
                finishRef.current = setTimeout(() => setIsLoading(false), remain);
            }
        },
        [minDelayMs, timeoutMs],
    );

    return { isLoading, run };
}
