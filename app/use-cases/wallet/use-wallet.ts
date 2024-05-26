import { useState } from 'react';

type WalletData = {
    accounts: string[] | null;
    error: any;
    status: 'idle' | 'pending' | 'success' | 'error';
};
type WalletDispatch = {
    getAccount: () => Promise<string[]>;
};

export function useWallet(): [WalletData, WalletDispatch] {
    const [data, setData] = useState<WalletData>({
        status: 'idle',
        accounts: null,
        error: null
    });

    const getAccount = () => {
        setData(prev => ({ ...prev, status: 'pending' }));
        const provider = window.ethereum;
        const errorFallback = 'Please connect to MetaMask.';

        if (provider?.isConnected?.()) {
            return provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => {
                    provider.on(
                        'accountsChanged',
                        (changedAccounts: typeof accounts) => {
                            if (!changedAccounts.length) throw errorFallback;
                            else
                                setData(prev =>
                                    changedAccounts[0] !== prev.accounts?.[0]
                                        ? {
                                              ...prev,
                                              accounts: changedAccounts,
                                              status: 'success'
                                          }
                                        : prev
                                );
                        }
                    );
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

    return [data, { getAccount }];
}
