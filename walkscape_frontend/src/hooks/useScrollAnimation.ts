'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        setHasTriggered(true);
                    }
                } else if (!triggerOnce && !hasTriggered) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, hasTriggered]);

    const animationClasses = isVisible || hasTriggered
        ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out'
        : 'opacity-0 translate-y-8';

    return { ref: elementRef, isVisible: isVisible || hasTriggered, animationClasses };
}

export function useStaggeredScrollAnimation(itemCount: number, delay = 100) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Stagger the animation of items
                    visibleItems.forEach((_, index) => {
                        setTimeout(() => {
                            setVisibleItems(prev => {
                                const newVisible = [...prev];
                                newVisible[index] = true;
                                return newVisible;
                            });
                        }, index * delay);
                    });
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        );

        observer.observe(container);

        return () => {
            observer.unobserve(container);
        };
    }, [itemCount, delay, visibleItems]);

    const getItemClasses = (index: number) => {
        return visibleItems[index]
            ? 'animate-in slide-in-from-bottom-6 fade-in duration-500 ease-out'
            : 'opacity-0 translate-y-6';
    };

    return { containerRef, getItemClasses, visibleItems };
}
