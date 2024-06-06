import { useEffect } from 'react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { ActionModal } from '~/components/portal/action-modal';
import { useTransactionsObserver } from '~/utils/transactions-observer';
import toast from 'react-hot-toast';

import type { ActionModalProps } from '~/components/portal/action-modal';
import type {
    GameViewModel,
    PlaceABet,
    PlaceABetResponse
} from '~/use-cases/games/type';

type PlaceABetModalProps = Pick<ActionModalProps, 'isOpen' | 'onOpenChange'> &
    Pick<GameViewModel, 'id' | 'picks' | 'tokenAddress'> & {
        balance: number;
    };

const PlaceABetModalFetcherKey = 'place-a-bet-fetcher';
const placeABetFetcherFormKey: Record<keyof PlaceABet, keyof PlaceABet> = {
    gameId: 'gameId',
    pick: 'pick',
    token: 'token',
    amount: 'amount'
};

const mapPicksOptions = (
    picks?: [string, string]
): { key: string; label: string }[] =>
    !picks ? [] : picks.map(pick => ({ key: pick, label: pick }));

export const PlaceABetModal = (props: PlaceABetModalProps) => {
    const fetcher = useFetcher<PlaceABetResponse>({
        key: PlaceABetModalFetcherKey
    });
    const transactionsObserver = useTransactionsObserver();

    useEffect(() => {
        if (fetcher.data?.ok) {
            transactionsObserver?.notify?.(
                fetcher.data.transactionHash!,
                async () => {
                    toast.success('Bet placed successfully!');
                }
            );
            fetcher.submit(null, {
                action: '/resource/game?reset=true',
                method: 'POST'
            });
            toast.success('Place a bet request sent!');
            props.onOpenChange?.(false);
        } else if (fetcher.data?.error) toast.error(fetcher.data.error);
    }, [fetcher.data]);

    return (
        <ActionModal
            title="Place a bet"
            action="/resource/game"
            method="POST"
            fetcherForm={fetcher.Form}
            isPending={fetcher.state !== 'idle'}
            actionLabel={fetcher.state === 'submitting' ? 'Sending...' : 'Send'}
            {...props}
        >
            <Input
                name={placeABetFetcherFormKey.gameId}
                value={props.id?.toString?.()}
                label="Game id"
                variant="bordered"
                isReadOnly
                readOnly
            />
            <Select
                isRequired
                required
                name={placeABetFetcherFormKey.pick}
                autoFocus
                items={mapPicksOptions(props.picks)}
                label="Your pick"
                placeholder="Enter your selected pick"
                variant="bordered"
            >
                {pick => <SelectItem key={pick.key}>{pick.label}</SelectItem>}
            </Select>
            <Input
                name={placeABetFetcherFormKey.token}
                value={props.tokenAddress}
                label="Token"
                variant="bordered"
                isReadOnly
                readOnly
            />
            <Input
                isRequired
                required
                name={placeABetFetcherFormKey.amount}
                label="Amount"
                placeholder="Enter the amount of tokens you want to spend"
                variant="bordered"
                type="number"
                min={1}
                max={props.balance}
            />
        </ActionModal>
    );
};
