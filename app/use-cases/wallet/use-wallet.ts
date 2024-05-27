import { useEffect, useRef, useState } from 'react';

export type WalletStatus =
    | 'disconnected'
    | 'connected'
    | 'pending'
    | 'success'
    | 'error';

type WalletData = {
    address: string | null;
    error: any;
    status: WalletStatus;
};
type AddressChangeHandler = (address: string) => Promise<void>;
type WalletDisconnectHandler = () => Promise<void>;

type WalletDispatch = {
    connectWallet: (handler?: {
        onAddressChange?: AddressChangeHandler;
        onDisconnectWallet?: WalletDisconnectHandler;
    }) => Promise<string>;
    disconnectWallet: (
        provider?: typeof window.ethereum,
        handler?: WalletDisconnectHandler
    ) => Promise<void>;
};

const initialData: WalletData = {
    status: 'disconnected',
    address: null,
    error: null
};

export function useWallet(): [WalletData, WalletDispatch] {
    const addressChangeListenerRef =
        useRef<(accounts: string[]) => Promise<void>>();
    const chainDisconnectListenerRef = useRef<(err: any) => Promise<void>>();
    const [data, setData] = useState<WalletData>(() => initialData);
    const errorFallback = 'Please connect to MetaMask.';

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

                if (accounts[0] !== prev.address)
                    return {
                        ...prev,
                        address: accounts[0],
                        status:
                            prev.status === 'connected'
                                ? prev.status
                                : 'connected'
                    };

                return prev;
            });
        };

        providerFallback
            .request({ method: 'eth_accounts' })
            .then(addressChangeListenerRef.current)
            .catch((err: any) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available, eth_accounts returns an
                // empty array.
                console.error(err);
            });
        providerFallback.on(
            'accountsChanged',
            addressChangeListenerRef.current
        );
    };
    const onChainDisconnect = (provider?: typeof window.ethereum) => {
        const providerFallback = provider ?? window.ethereum;
        chainDisconnectListenerRef.current = async (err: any) => {
            console.error('chain disconnected ->', err);
        };
        providerFallback.on('disconnect', chainDisconnectListenerRef.current);
    };

    const connectWallet: WalletDispatch['connectWallet'] = handler => {
        setData(prev => ({ ...prev, status: 'pending' }));
        const provider = window.ethereum;

        if (provider?.isConnected?.()) {
            return provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => {
                    setAddressChange(provider, handler);
                    onChainDisconnect(provider);

                    return accounts[0];
                })
                .catch((err: any) => {
                    const errFallback = err.code === 4001 ? errorFallback : err;
                    setData(prev => ({
                        ...prev,
                        error: errFallback,
                        status: 'error'
                    }));
                    throw errFallback;
                });
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

        return providerFallback
            .request({
                method: 'wallet_revokePermissions',
                params: [
                    {
                        eth_accounts: {}
                    }
                ]
            })
            .finally((e: any) => {
                console.log('finally disconnect ->', e);
                handler?.();
                setData(initialData);
            });
    };
    console.log('data.address ->', data.address);
    useEffect(() => {
        return () => {
            if (!data.address) {
                const provider = window.ethereum;
                if (addressChangeListenerRef.current) {
                    provider.removeListener(
                        'accountsChanged',
                        addressChangeListenerRef.current
                    );
                    console.info('addressChangeListener removed ->');
                }
                if (chainDisconnectListenerRef.current) {
                    provider.removeListener(
                        'disconnect',
                        chainDisconnectListenerRef.current
                    );
                    console.info('chainDisconnectListener removed ->');
                }
            }
        };
    }, [data.address]);

    return [data, { connectWallet, disconnectWallet }];
}
