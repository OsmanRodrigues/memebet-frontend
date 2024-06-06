import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    useDisclosure
} from '@nextui-org/react';
import { Heading } from '~/components/typography/heading';
import { SectionWrapper } from '~/components/wrapper/section';
import { getDateStr } from '~/utils/date';
import { PlaceABetModal } from './place-a-bet.modal';

import type { GameViewModel } from '~/use-cases/games/type';

export const GameInfosSection = (
    props: Omit<GameViewModel, 'currentOdds' | 'playerIds'>
) => {
    const placeABetModal = useDisclosure();

    return (
        <SectionWrapper isFirstOfPage>
            <Heading>Game infos</Heading>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="sm"
            >
                <CardHeader className="justify-between">
                    <Heading as="h3">{`Game ${props.id}`}</Heading>
                    <Heading as="h3">
                        {props.picks
                            ? `${props.picks[0]} vs ${props.picks[1]}`
                            : 'Game picks info not available'}
                    </Heading>
                </CardHeader>
                <CardBody>
                    <DataDisplay
                        title="Starts at"
                        display={getDateStr(props.startTime)}
                    />
                    <DataDisplay
                        title="Deadline"
                        display={getDateStr(props.endTime)}
                    />
                    <DataDisplay
                        title="Token address"
                        display={props.tokenAddress}
                    />
                    <DataDisplay
                        title="DAO fee"
                        display={`${props.fees.toFixed(2)}%`}
                    />
                </CardBody>
                <CardFooter className="flex justify-end">
                    <Button color="secondary" onClick={placeABetModal.onOpen}>
                        Place a bet
                    </Button>
                </CardFooter>
            </Card>
            <PlaceABetModal
                isOpen={placeABetModal.isOpen}
                onOpenChange={placeABetModal.onOpenChange}
            />
        </SectionWrapper>
    );
};
const DataDisplay = (props: { title: string; display?: string }) => (
    <dl className="flex justify-between">
        <dt className="font-bold">{props.title}: </dt>
        <dd>{props.display ?? 'no data'}</dd>
    </dl>
);
