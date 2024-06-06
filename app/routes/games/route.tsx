import {
    isRouteErrorResponse,
    useFetcher,
    useRouteError
} from '@remix-run/react';
import { json } from '@remix-run/node';
import * as gamesUseCase from '~/use-cases/games/functions';
import { AuthFetcherKey } from '~/components/header';
import { ErrorFallback } from '~/components/error-fallback';
import { CreateGameSection } from './create-game.section';
import { GamesListSection } from './games-list.section';
import { logInfo } from '~/utils';

import type { WalletData } from '~/use-cases/wallet';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
    const query = new URL(request.url).searchParams;

    if (query.has('refetch')) {
        logInfo(`refetching games list...`);
        const gamesListRes = await gamesUseCase.getGamesList();

        return new Response(JSON.stringify(gamesListRes), {
            status: 307,
            headers: {
                Location: '/games'
            }
        });
    }

    const gamesListRes = await gamesUseCase.getGamesList();

    if (gamesListRes.gamesList) return json(gamesListRes);

    return json({ ...gamesListRes, gamesList: [] });
}

export default function Games() {
    const wallet = useFetcher<WalletData>({ key: AuthFetcherKey });

    return (
        <>
            {wallet.data?.isDAOMember && <CreateGameSection />}
            <GamesListSection isFirstOfPage={!wallet.data?.isDAOMember} />
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
