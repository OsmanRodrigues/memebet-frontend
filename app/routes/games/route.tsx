import {
    isRouteErrorResponse,
    useFetcher,
    useRouteError
} from '@remix-run/react';
import * as gamesUseCase from '~/use-cases/games/functions';
import { AuthFetcherKey } from '~/components/header';
import { CreateGameSection } from './create-game.section';
import { GamesListSection } from './games-list.section';
import type { LoaderFunctionArgs } from '@remix-run/node';
import type { WalletData } from '~/use-cases/wallet';
import { ErrorFallback } from '~/components/error-fallback';

export async function loader({ request, params }: LoaderFunctionArgs) {
    console.log('request.method, params ->', request.method, params);
    return await gamesUseCase.getGamesList();
}

export default function Games() {
    const wallet = useFetcher<WalletData>({ key: AuthFetcherKey });

    return (
        <>
            <h1>Games page</h1>
            {wallet.data?.isDAOMember && <CreateGameSection />}
            <GamesListSection />
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError() as any;

    return (
        <ErrorFallback
            title="Games List Page Error"
            error={error}
            isRouteError={isRouteErrorResponse(error)}
        />
    );
}
