import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (isLocked) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                const scrollY = parseInt(document.body.style.top || '0');
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, Math.abs(scrollY));
            };
        }
    }, [isLocked]);
};
