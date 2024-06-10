import { Spacer } from '@nextui-org/react';
import { Heading } from '~/components/typography/heading';
import { SectionWrapper } from '~/components/wrapper/section';

export const HowItWorksSection = () => (
    <SectionWrapper>
        <div className="min-h-96 relative">
            <div className="absolute right-[51%] mobile:right-auto z-10">
                <Heading as="h1">How it works</Heading>
                <p className="text-justify">
                    Memebet is a decentralized application (DApp) built on the{' '}
                    <strong> Cartesi platform</strong>, enabling users to create
                    and participate in meme-based betting games.
                </p>
                <Spacer y={8} />
                <p className="text-justify">
                    With Memebet, you can <strong>create betting pools</strong>{' '}
                    around popular memes, place bets using cryptocurrencies, and
                    earn rewards based on the outcome of the bets.
                </p>
            </div>

            <div className="absolute top-0 bottom-0 right-0 left-[51%] mobile:left-0 rounded-md opacity-50 mobile:opacity-10 bg-clip-border bg-cover bg-center bg-[url('/app/assets/images/emojis-bg.jpg')] from-white to-warning" />
        </div>
    </SectionWrapper>
);
