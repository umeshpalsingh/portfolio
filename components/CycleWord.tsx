'use client';

import { useEffect, useState } from 'react';

const words = ['a developer.', 'a dreamer.', 'forever curious.', 'a collector of half-finished hobbies.', 'always up for chai.'];

export default function CycleWord() {
    const [index, setIndex] = useState(0);
    const [swapClass, setSwapClass] = useState('');

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        const interval = setInterval(() => {
            setSwapClass('swap');
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
                setSwapClass('');
            }, 400);
        }, 2600);

        return () => clearInterval(interval);
    }, []);

    return <span className={`cycle-word ${swapClass}`} id="cycleWord">{words[index]}</span>;
}
