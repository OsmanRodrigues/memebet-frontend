import { useState } from 'react';

type WalletData = Record<'accounts' | 'error', any>;
type WalletDispatch = {
    getAccount: () => Promise<WalletData['accounts']>;
};

export function useWallet(): [WalletData, WalletDispatch] {
    const [data, setData] = useState<WalletData>({
        accounts: null,
        error: null
    });

    const getAccount = () => {
        const provider = window.ethereum;

        if (provider.isConnected()) {
            return provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: any) => {
                    setData(prev => ({ ...prev, accounts: accounts }));
                    return accounts;
                })
                .catch((err: any) => {
                    const errFallback =
                        err.code === 4001 ? 'Please connect to MetaMask.' : err;
                    setData(prev => ({
                        ...prev,
                        error: errFallback
                    }));
                    throw errFallback;
                });
        }
    };

    return [data, { getAccount }];
}
