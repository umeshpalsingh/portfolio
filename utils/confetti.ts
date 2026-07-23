const colors = ['#2FA84F', '#FFD400', '#DFF4CC', '#1F7A3B'];

export function burstConfettiAt(cx: number, cy: number, count: number = 14) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    
    for (let i = 0; i < count; i++) {
        const bit = document.createElement('div');
        bit.className = 'confetti-bit';
        bit.style.left = cx + 'px';
        bit.style.top = cy + 'px';
        bit.style.background = colors[i % colors.length];
        document.body.appendChild(bit);
        
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 60 + Math.random() * 50;
        
        requestAnimationFrame(() => {
            bit.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${Math.random() * 180}deg)`;
            bit.style.opacity = '0';
        });
        
        setTimeout(() => {
            bit.remove();
        }, 750);
    }
}
