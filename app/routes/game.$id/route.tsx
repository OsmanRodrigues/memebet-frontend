import { type LoaderFunctionArgs, json } from '@remix-run/node';
import {
    isRouteErrorResponse,
    useLoaderData,
    useRouteError
} from '@remix-run/react';
import { ErrorFallback } from '~/components/error-fallback';
import * as gamesUseCase from '~/use-cases/games/functions.server';
import { logInfo } from '~/utils/logger';
import { GameInfosSection } from './game-infos.section';
import { BettingFlowSection } from './betting-flow.section';

import type { GetGameByIdResponse } from '~/use-cases/games/type';

export async function loader({ request, params }: LoaderFunctionArgs) {
    if (params.id) {
        const query = new URL(request.url).searchParams;

        if (query.has('refetch')) {
            logInfo(`refetching game ${params.id}...`);
            const useCaseRes = await gamesUseCase.getGameById(params.id);

            return new Response(JSON.stringify(useCaseRes), {
                status: 307,
                headers: {
                    Location: `/game/${params.id}`
                }
            });
        }

        const useCaseRes = await gamesUseCase.getGameById(params.id);

        if (useCaseRes.status === 404)
            throw new Response(useCaseRes.error, {
                status: useCaseRes.status
            });
        else if (useCaseRes.error)
            throw new Response(useCaseRes.error, {
                status: useCaseRes.status ?? 400
            });

        return json(useCaseRes);
    }
}

export default function Game() {
    const loaderData = useLoaderData<GetGameByIdResponse>();

    return (
        <>
            <GameInfosSection {...loaderData.game!} />
            <BettingFlowSection {...loaderData.game!} />
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError() as any;

    return (
        <ErrorFallback
            title="Game Page Error"
            error={error}
            isRouteError={isRouteErrorResponse(error)}
        />
    );
}
