import { useState } from 'react';

type WalletData = {
    accounts: string[] | null;
    error: any;
    status: 'idle' | 'pending' | 'success' | 'error';
};
type AccountChangeHandler = (accounts: string[]) => Promise<void>;

type WalletDispatch = {
    connectWallet: (handler?: {
        onAccountsChange?: AccountChangeHandler;
    }) => Promise<string[]>;
};

export function useWallet(): [WalletData, WalletDispatch] {
    const [data, setData] = useState<WalletData>({
        status: 'idle',
        accounts: null,
        error: null
    });
    const errorFallback = 'Please connect to MetaMask.';

    const setAccountChange = (
        provider?: typeof window.ethereum,
        handler?: AccountChangeHandler
    ) => {
        const providerFallback = provider ?? window.ethereum;

        const handleAccountsChanged = async (accounts: string[]) => {
            await handler?.(accounts);
            setData(prev =>
                accounts[0] !== prev.accounts?.[0]
                    ? {
                          ...prev,
                          accounts: accounts,
                          status: 'success'
                      }
                    : prev
            );
        };

        providerFallback
            .request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err: any) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available, eth_accounts returns an
                // empty array.
                console.error(err);
            });
        providerFallback.on('accountsChanged', handleAccountsChanged);
    };
    // const onDisconnect = (provider?: typeof window.ethereum) => {
    //     const providerFallback = provider ?? window.ethereum;
    //     providerFallback.removeListener(
    //         'accountsChanged',
    //         handleAccountsChanged
    //     );
    //     providerFallback.on('disconnect', (err: any) => {
    //         console.log('disconnected ->', err);
    //     });
    // };

    const connectWallet: WalletDispatch['connectWallet'] = handler => {
        setData(prev => ({ ...prev, status: 'pending' }));
        const provider = window.ethereum;

        if (provider?.isConnected?.()) {
            return provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => {
                    setAccountChange(provider, handler?.onAccountsChange);
                    // onDisconnect(provider);
                    setData(prev => ({
                        ...prev,
                        accounts: accounts,
                        status: 'success'
                    }));

                    return accounts;
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

    return [data, { connectWallet }];
}
