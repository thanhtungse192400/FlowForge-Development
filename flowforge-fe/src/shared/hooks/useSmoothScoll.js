import { useEffect, useRef } from 'react';
import Lenis from 'lenis'; // BẮT BUỘC SÀI 'lenis'

export default function useSmoothScoll() {
    const lenisRef = useRef(null);

    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: 0.8, // Đã giảm từ 1.4 -> 0.8 để cuộn nhẹ và thanh thoát hơn, bớt cảm giác "nặng",
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical', 
            gestureDirection: 'vertical', 
            smooth: true, 
            mouseMultiplier: 1.2, // Tăng nhạy chuột lên một tí
            touchMultiplier: 2, // hệ số nhân với touch
            smoothTouch: false,
        });

        let reqId;
        // 2. Tạo hàm raf để cập nhật trạng thái của lenis
        function raf(time) {
            lenisRef.current?.raf(time);
            reqId = requestAnimationFrame(raf);
        }
        
        reqId = requestAnimationFrame(raf);

        // 3. Dọn dẹp (Cleanup) rất quan trọng để không bị lỗi lúc chuyển trang
        return () => {
            cancelAnimationFrame(reqId);
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);
}