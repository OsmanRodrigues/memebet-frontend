import { Heading } from '~/components/typography/heading';
import { SectionWrapper } from '~/components/wrapper/section';

export const FeaturesSection = () => (
    <SectionWrapper>
        <Heading as="h1">Features</Heading>
        <SubSectionWrapper title="🎲🆚 Create meme betting games">
            {`DAO members can create new betting games
            by submitting a game and defining the betting options (e.g., "Doge"
            vs "Pepe", Corinthians Vs Palmeiras; Real Madrid vs Barcelona;
            etc.).`}
        </SubSectionWrapper>
        <SubSectionWrapper title="💰🧐 Place bets">
            {`Participants can place bets on their preferred option
            using various cryptocurrencies, such as Ether (ETH) or ERC-20
            tokens.`}
        </SubSectionWrapper>
        <SubSectionWrapper title="🔍🤓 Decentralized governance">
            {`MemeBet is governed by a decentralized
            autonomous organization (DAO), ensuring fair and transparent
            decision-making processes.`}
        </SubSectionWrapper>
        <SubSectionWrapper title="✅⛔ Validator functions">
            {`Custom validator functions can be created and
            deployed to determine the winning meme option based on predefined
            criteria.`}
        </SubSectionWrapper>
        <SubSectionWrapper title="💸🤑 Secure payouts">
            {`Winning bets are automatically paid out to the
            respective participants, leveraging the security and transparency of
            the Cartesi blockchain.`}
        </SubSectionWrapper>
    </SectionWrapper>
);
const SubSectionWrapper = (props: { title: string; children: string }) => (
    <div className="flex items-start py-4 gap-6 mobile:flex-col">
        <div className="w-[30%] mobile:w-full">
            <Heading noPadding>{props.title}</Heading>
        </div>
        <div className="w-[70%] mobile:w-full">
            <p className="text-left">{props.children}</p>
        </div>
    </div>
);
