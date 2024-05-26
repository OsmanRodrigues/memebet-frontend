import { useState } from 'react';

type WalletData = {
    address: string | null;
    error: any;
    status: 'idle' | 'pending' | 'success' | 'error';
};
type AddressChangeHandler = (address: string) => Promise<void>;

type WalletDispatch = {
    connectWallet: (handler?: {
        onAddressChange?: AddressChangeHandler;
    }) => Promise<string>;
};

export function useWallet(): [WalletData, WalletDispatch] {
    const [data, setData] = useState<WalletData>({
        status: 'idle',
        address: null,
        error: null
    });
    const errorFallback = 'Please connect to MetaMask.';

    const setAddressChange = (
        provider?: typeof window.ethereum,
        handler?: AddressChangeHandler
    ) => {
        const providerFallback = provider ?? window.ethereum;

        const handleAccountsChanged = async (accounts: string[]) => {
            await handler?.(accounts[0]);
            setData(prev =>
                accounts[0] !== prev.address
                    ? {
                          ...prev,
                          accounts: accounts[0],
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
                    setAddressChange(provider, handler?.onAddressChange);
                    // onDisconnect(provider);

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

    return [data, { connectWallet }];
}
