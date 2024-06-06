import { type LoaderFunctionArgs, json } from '@remix-run/node';
import {
    isRouteErrorResponse,
    useLoaderData,
    useRouteError
} from '@remix-run/react';
import { ErrorFallback } from '~/components/error-fallback';
import * as gamesUseCase from '~/use-cases/games/functions';
import { GameInfosSection } from './game-infos.section';
import { BettingFlowSection } from './betting-flow.section';

export async function loader({ params }: LoaderFunctionArgs) {
    if (params.id) {
        const useCaseRes = await gamesUseCase.getGameById(params.id);

        if (useCaseRes.status === 404)
            throw new Response(useCaseRes.error, {
                status: useCaseRes.status
            });

        return json(useCaseRes);
    }
}

export default function Game() {
    const loaderData = useLoaderData<gamesUseCase.GetGameByIdResponse>();

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
