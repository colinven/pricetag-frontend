import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref and a boolean indicating whether the element has
 * entered the viewport. Once true, stays true (fires once).
 *
 * @param {object} options
 * @param {string} options.threshold - fraction of element visible before triggering (0–1, default 0.15)
 * @param {string} options.rootMargin - margin around the viewport (default "0px 0px -60px 0px" — triggers slightly before full entry)
 */
export default function useInView({ threshold = 0.15, rootMargin = "0px 0px -60px 0px" } = {}) {
    const ref = useRef(null);
    const [hasBeenSeen, setHasBeenSeen] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || hasBeenSeen) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasBeenSeen(true);
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [hasBeenSeen, threshold, rootMargin]);

    return [ref, hasBeenSeen];
}