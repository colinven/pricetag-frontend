import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiOverlay({ fire }) {
    useEffect(() => {
        if (!fire) return;
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
        });
        return () => {
            confetti.reset();
        };
    }, [fire]);

    return null;
}
