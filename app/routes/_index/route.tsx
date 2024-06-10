import { Spacer } from '@nextui-org/react';
import { HeroSection } from './hero.section';
import { HowItWorksSection } from './how-it-works.section';
import { FeaturesSection } from './features.section';

export default function Home() {
    return (
        <>
            <HeroSection />
            <Spacer y={12} />
            <HowItWorksSection />
            <Spacer y={12} />
            <FeaturesSection />
        </>
    );
}
