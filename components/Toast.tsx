'use client';

import { useEffect, useState } from 'react';

export function showToast(msg: string) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
    }
}

export default function Toast() {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleToast = (e: any) => {
            setMessage(e.detail);
            setVisible(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setVisible(false);
            }, 2200);
        };

        window.addEventListener('show-toast', handleToast);
        return () => {
            window.removeEventListener('show-toast', handleToast);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`toast ${visible ? 'show' : ''}`} id="toast" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
            </svg>
            <span id="toastMsg">{message}</span>
        </div>
    );
}
