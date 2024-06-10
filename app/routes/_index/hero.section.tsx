import { useEffect } from 'react';
import { animate, motion, motionValue } from 'framer-motion';
import { SectionWrapper } from '~/components/wrapper/section';

export const HeroSection = () => {
    const zIndex1 = motionValue(10);
    const zIndex2 = motionValue(10);
    const zIndex3 = motionValue(10);
    const defaultTransition = {
        duration: 6,
        repeat: Infinity,
        ease: 'linear'
    };
    const transition2 = {
        ...defaultTransition,
        duration: 7
    };
    const transition3 = {
        ...defaultTransition,
        duration: 8
    };

    useEffect(() => {
        animate(zIndex1, 0, {
            duration: defaultTransition.duration,
            onUpdate: prev => {
                if (prev <= 3.5) zIndex1.set(0);
            },
            repeat: 10
        });
        animate(zIndex2, 0, {
            duration: transition2.duration,
            onUpdate: prev => {
                if (prev <= 3) zIndex2.set(0);
            },
            repeat: 10
        });
        animate(zIndex3, 0, {
            duration: transition3.duration,
            onUpdate: prev => {
                if (prev <= 2.5) zIndex3.set(0);
            },
            repeat: 10
        });
    }, []);

    return (
        <SectionWrapper isFirstOfPage>
            <div className="w-full flex justify-center">
                <div className="w-52 h-52 relative">
                    <motion.span
                        layoutId="emoji1"
                        className="text-4xl absolute top-0 right-0"
                        style={{ zIndex: zIndex3 }}
                        animate={{
                            x: [0, -144, 0],
                            y: [0, 144, 0]
                        }}
                        transition={transition3}
                    >
                        😂
                    </motion.span>
                    <motion.span
                        layoutId="emoji2"
                        className="text-4xl absolute top-0 left-0"
                        style={{ zIndex: zIndex2 }}
                        animate={{
                            x: [10, 144, 10],
                            y: [0, 144, 0]
                        }}
                        transition={transition2}
                    >
                        😐
                    </motion.span>
                    <motion.span
                        layoutId="emoji3"
                        className="absolute top-0 left-20 text-4xl"
                        style={{ zIndex: zIndex1 }}
                        animate={{
                            y: [0, 160, 0]
                        }}
                        transition={defaultTransition}
                    >
                        🤑
                    </motion.span>
                    <motion.span
                        layoutId="emojiMain"
                        className="absolute top-14 right-10 text-8xl"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            ...defaultTransition,
                            ease: 'linear'
                        }}
                    >
                        🪙
                    </motion.span>
                </div>
            </div>
        </SectionWrapper>
    );
};
