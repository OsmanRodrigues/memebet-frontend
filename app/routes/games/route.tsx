import { useFetcher } from '@remix-run/react';
import { AuthFetcherKey } from '~/components/header';
import type { WalletData } from '~/use-cases/wallet';

export default function Games() {
    const wallet = useFetcher<WalletData>({ key: AuthFetcherKey });

    return (
        <>
            <h1>Games page</h1>
            <p className="font-body">Simple body</p>
            {wallet.data?.isDAOMember && (
                <p>{"You're a DAO member! Welcome!!!"}</p>
            )}
        </>
    );
}
