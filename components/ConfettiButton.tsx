'use client';

import { burstConfettiAt } from '../utils/confetti';
import MagneticButton from './MagneticButton';

export default function ConfettiButton({ href, className, children, id }: { href: string, className: string, children: React.ReactNode, id?: string }) {
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        burstConfettiAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    return (
        <MagneticButton href={href} className={className} id={id} onClick={handleClick}>
            {children}
        </MagneticButton>
    );
}
