import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import {
    Avatar,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    NavbarItem,
    useDisclosure
} from '@nextui-org/react';
import { useTransactionsObserver } from '~/utils/transactions-observer';
import { ActionModal, ActionModalProps } from '../portal/action-modal';
import { AuthFetcherKey } from './auth.item';
import toast from 'react-hot-toast';
import ethIcon from '~/assets/images/eth-icon.svg';

import type { SubmitTokenDepositData } from '~/use-cases/wallet/type';
import type { UseWalletData } from '~/use-cases/wallet/use-wallet';
import type { ActionUseCaseResponse } from '~/use-cases/shared-type';
import type { AuthData } from './auth.item';

export const WalletFetcherKey = 'wallet-fetcher-key';
const depositTokenFormKey: Record<
    keyof SubmitTokenDepositData,
    keyof SubmitTokenDepositData
> = {
    amount: 'amount'
};

export const WalletItem = (props: { walletState: UseWalletData['status'] }) => {
    const fetcher = useFetcher<AuthData>({
        key: AuthFetcherKey
    });
    const depositTokenModal = useDisclosure();
    const balance = fetcher.data?.ethBalance;

    const onDepositSuccess = () => {
        fetcher.submit(null, {
            action: '/resource/auth',
            method: 'GET'
        });
    };

    if (props.walletState === 'connected' && balance) {
        return (
            <>
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger>
                            <Chip
                                className="cursor-pointer"
                                color="warning"
                                variant="shadow"
                                avatar={<Avatar name="$" src={ethIcon} />}
                            >
                                {balance}
                            </Chip>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="deposit"
                                onClick={depositTokenModal.onOpen}
                            >
                                Deposit token
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
                <DepositTokenModal
                    onSubmitSuccess={onDepositSuccess}
                    isOpen={depositTokenModal.isOpen}
                    onOpenChange={depositTokenModal.onOpenChange}
                />
            </>
        );
    }

    return null;
};
const DepositTokenModal = (
    props: Pick<ActionModalProps, 'isOpen' | 'onOpenChange'> & {
        onSubmitSuccess: () => void;
    }
) => {
    const fetcher = useFetcher<ActionUseCaseResponse>({
        key: WalletFetcherKey
    });
    const transactionsObserver = useTransactionsObserver();

    //TODO componentize this fetcher submit logic
    useEffect(() => {
        if (fetcher.data?.ok) {
            transactionsObserver?.notify?.(
                fetcher.data.transactionHash!,
                async () => {
                    toast.success('Token deposited successfully!');
                    props.onSubmitSuccess();
                }
            );
            fetcher.submit(null, {
                action: '/resource/wallet?reset=true',
                method: 'POST'
            });
            toast.success('Place a bet request sent!');
            props.onOpenChange?.(false);
        } else if (fetcher.data?.error) toast.error(fetcher.data.error);
    }, [fetcher.data]);

    return (
        <ActionModal
            title="Deposit token"
            action="/resource/wallet?deposit=true"
            method="POST"
            fetcherForm={fetcher.Form}
            actionLabel={
                fetcher.state === 'submitting' ? 'Depositing...' : 'Deposit'
            }
            isPending={fetcher.state !== 'idle'}
            {...props}
        >
            <Input
                isRequired
                required
                name={depositTokenFormKey.amount}
                label="Amount"
                placeholder="Enter the amount of tokens you want to deposit"
                variant="bordered"
                type="number"
                min={1}
            />
        </ActionModal>
    );
};
