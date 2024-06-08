import { useEffect, useRef, useState } from 'react';
import * as logger from '~/utils/logger';

export type WalletStatus =
    | 'disconnected'
    | 'disconnect_imperative'
    | 'connected'
    | 'pending'
    | 'success'
    | 'error';

export type UseWalletData = {
    address: string | null;
    error: any;
    status: WalletStatus;
};
type AddressChangeHandler = (address: string) => Promise<void>;
type WalletDisconnectHandler = () => Promise<void>;

type WalletDispatch = {
    connectWallet: (
        handler?: {
            onAddressChange?: AddressChangeHandler;
            onDisconnectWallet?: WalletDisconnectHandler;
        },
        provider?: typeof window.ethereum
    ) => Promise<string>;
    disconnectWallet: (
        provider?: typeof window.ethereum,
        handler?: WalletDisconnectHandler
    ) => Promise<null>;
};

const initialData: UseWalletData = {
    status: 'disconnected',
    address: null,
    error: null
};

export function useWallet(
    defaultAddress?: UseWalletData['address'],
    defaultHandler?: {
        onAddressChange?: AddressChangeHandler;
        onDisconnectWallet?: WalletDisconnectHandler;
    }
): [UseWalletData, WalletDispatch] {
    const addressChangeListenerRef =
        useRef<(accounts: `0x${string}`[]) => Promise<void>>();
    const chainDisconnectListenerRef = useRef<(err: any) => Promise<void>>();
    const [data, setData] = useState<UseWalletData>(initialData);
    const errorFallback = 'Please connect to MetaMask.';

    const removeAddressChangeListener = (provider?: typeof window.ethereum) => {
        const providerFallback = provider ?? window.ethereum;
        providerFallback!.removeListener(
            'accountsChanged',
            addressChangeListenerRef.current!
        );
        logger.logInfo('addressChangeListener removed ->');
    };
    const removeChainDisconnectListener = (
        provider?: typeof window.ethereum
    ) => {
        const providerFallback = provider ?? window.ethereum;
        providerFallback!.removeListener(
            'disconnect',
            chainDisconnectListenerRef.current!
        );
        logger.logInfo('chainDisconnectListener removed ->');
    };

    const setAddressChange = (
        provider?: typeof window.ethereum,
        handler?: {
            onAddressChange?: AddressChangeHandler;
            onDisconnectWallet?: WalletDisconnectHandler;
        }
    ) => {
        const providerFallback = provider ?? window.ethereum;

        addressChangeListenerRef.current = async (accounts: string[]) => {
            await handler?.onAddressChange?.(accounts[0]);

            setData(prev => {
                if (!accounts.length && !!prev.address)
                    disconnectWallet(
                        providerFallback,
                        handler?.onDisconnectWallet
                    );

                if (
                    accounts[0] !== prev.address ||
                    accounts[0] === defaultAddress
                )
                    return {
                        ...prev,
                        address: accounts[0],
                        status: 'connected'
                    };

                return prev;
            });
        };

        providerFallback!
            .request({ method: 'eth_accounts' })
            .then(addressChangeListenerRef.current)
            .catch((err: any) => {
                //TODO impl better request account error handling
                logger.logError(err.message ?? err.toString());
            });
        providerFallback!.on(
            'accountsChanged',
            addressChangeListenerRef.current
        );
    };
    const onChainDisconnect = (provider?: typeof window.ethereum) => {
        const providerFallback = provider ?? window.ethereum;
        chainDisconnectListenerRef.current = async (err: any) => {
            //TODO impl better chain disconnect error handling
            logger.logError(
                `'chain disconnected ->', ${err.message ?? err.toString()}`
            );
        };
        providerFallback!.on('disconnect', chainDisconnectListenerRef.current);
    };
    const onConnectError = (err: any) => {
        const errFallback = err.code === 4001 ? errorFallback : err;
        setData(prev => ({
            ...prev,
            error: errFallback,
            status: 'error'
        }));
        throw errFallback;
    };

    const connectWallet: WalletDispatch['connectWallet'] = (
        handler,
        provider
    ) => {
        setData(prev => ({ ...prev, status: 'pending' }));
        const providerFallback = provider ?? window.ethereum;
        const handlerFallback = handler ?? defaultHandler;

        if (providerFallback?.isConnected?.()) {
            return providerFallback
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => {
                    setAddressChange(providerFallback, handlerFallback);
                    onChainDisconnect(providerFallback);

                    return accounts[0];
                })
                .catch((err: any) => onConnectError(err));
        } else {
            throw errorFallback;
        }
    };
    const disconnectWallet: WalletDispatch['disconnectWallet'] = (
        provider,
        handler
    ) => {
        setData(prev => ({ ...prev, status: 'pending' }));
        const providerFallback = provider ?? window.ethereum;

        return providerFallback!
            .request({
                method: 'wallet_revokePermissions',
                params: [
                    {
                        eth_accounts: {}
                    }
                ]
            })
            .finally(() => {
                logger.logInfo('wallet disconnected succesfully ->');
                removeAddressChangeListener(provider);
                removeChainDisconnectListener(provider);
                handler?.();
                setData({ ...initialData, status: 'disconnect_imperative' });
            });
    };

    useEffect(() => {
        if (data.status === 'disconnected' && defaultAddress) {
            setData(prev => ({
                ...prev,
                status: 'pending',
                address: defaultAddress
            }));
            const provider = window.ethereum;
            provider
                ?.request?.({
                    method: 'wallet_requestPermissions',
                    params: [
                        {
                            eth_accounts: {
                                id: data.address
                            }
                        }
                    ]
                })
                ?.then?.(() => {
                    logger.logInfo('Wallet auto-connected successfully ->');
                    connectWallet(defaultHandler, provider);
                })
                ?.catch(err => onConnectError(err));
        }

        return () => {
            if (data.status === 'disconnected') {
                const provider = window.ethereum;
                if (addressChangeListenerRef.current)
                    removeAddressChangeListener(provider);
                if (chainDisconnectListenerRef.current)
                    removeChainDisconnectListener(provider);
            }
        };
    }, [defaultAddress, data.status]);

    return [data, { connectWallet, disconnectWallet }];
}
