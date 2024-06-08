import { useCallback } from 'react';
import { useFetcher } from '@remix-run/react';
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
import { AuthFetcherKey } from '~/components/header/auth.item';
import { getDateStr } from '~/utils/date';
import { transformBalanceStrIntoNum } from '~/utils/transformer';
import { PlaceABetModal } from './place-a-bet.modal';
import toast from 'react-hot-toast';

import type { GameViewModel } from '~/use-cases/games/type';
import type { WalletData } from '~/use-cases/wallet/type';

export const GameInfosSection = (
    props: Omit<GameViewModel, 'currentOdds' | 'playerIds'>
) => {
    const fetcher = useFetcher<Partial<WalletData>>({
        key: AuthFetcherKey
    });
    const placeABetModal = useDisclosure();
    const ethBalance = fetcher.data?.ethBalance ?? '';
    const balance = transformBalanceStrIntoNum(ethBalance);

    const onClickToPlaceABet = useCallback(() => {
        if (!fetcher.data?.address)
            toast.error('You must be logged-in to place a bet!');
        else if (balance < 1) toast.error('Insufficient funds!');
        else placeABetModal.onOpen();
    }, [ethBalance]);
    const onPlaceABetSuccess = () => {
        fetcher.submit(null, {
            action: '/resource/auth',
            method: 'GET'
        });
    };

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
                    <Button color="secondary" onClick={onClickToPlaceABet}>
                        Place a bet
                    </Button>
                </CardFooter>
            </Card>
            <PlaceABetModal
                isOpen={placeABetModal.isOpen}
                onOpenChange={placeABetModal.onOpenChange}
                onSuccess={onPlaceABetSuccess}
                balance={balance}
                {...props}
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
