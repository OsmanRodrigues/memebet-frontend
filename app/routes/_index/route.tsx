import { Spacer } from '@nextui-org/react';
import { HeroSection } from './hero.section';
import { HowItWorksSection } from './how-it-works.section';

export default function Home() {
    return (
        <>
            <HeroSection />
            <Spacer y={12} />
            <HowItWorksSection />
        </>
    );
}
