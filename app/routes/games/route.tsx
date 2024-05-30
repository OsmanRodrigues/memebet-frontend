import { useFetcher } from '@remix-run/react';
import { AuthFetcherKey } from '~/components/header';
import type { WalletData } from '~/use-cases/wallet';
import { CreateGameSection } from './create-game.section';

export default function Games() {
    const wallet = useFetcher<WalletData>({ key: AuthFetcherKey });

    return (
        <>
            {wallet.data?.isDAOMember && <CreateGameSection />}
            <h1>Games page</h1>
            <p className="font-body">Simple body</p>
        </>
    );
}
