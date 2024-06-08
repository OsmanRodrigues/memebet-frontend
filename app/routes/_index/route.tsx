import { useFetcher } from '@remix-run/react';
import type { WalletData } from '~/use-cases/wallet/type';

export default function Home() {
    const fetcher = useFetcher<WalletData>({ key: 'auth-fetcher' });

    return (
        <>
            <h1>
                Hello world! Private key:
                {fetcher.data?.address ?? 'not provided'}
            </h1>
            <h1>
                Current balance: {fetcher.data?.ethBalance ?? 'not informed'}
            </h1>
        </>
    );
}
