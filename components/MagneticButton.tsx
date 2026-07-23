'use client';

import { useState } from 'react';

export default function MagneticButton({
    href,
    className,
    children,
    id,
    onClick
}: {
    href?: string,
    className?: string,
    children: React.ReactNode,
    id?: string,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) {
    const [transform, setTransform] = useState('translate(0,0)');

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        const btn = e.currentTarget;
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setTransform(`translate(${x * 10}px, ${y * 10}px)`);
    };

    const handleMouseLeave = () => {
        setTransform('translate(0,0)');
    };

    const commonProps = {
        id,
        className: `${className} magnetic`,
        style: { transform },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onClick
    };

    if (href) {
        return <a href={href} {...commonProps}>{children}</a>;
    }
    return <button {...commonProps}>{children}</button>;
}
