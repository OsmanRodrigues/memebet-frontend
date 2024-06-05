import * as gamesService from '~/services/games/service';
import type { Game } from '~/services/games/type';

export type GameListViewModel = Pick<
    Game,
    'id' | 'picks' | 'startTime' | 'endTime' | 'betPool'
>;
export type GameViewModel = Pick<
    Game,
    | 'id'
    | 'picks'
    | 'startTime'
    | 'endTime'
    | 'fees'
    | 'playerIds'
    | 'currentOdds'
>;
type GamesUseCaseBaseResponse = {
    message?: string;
    error?: any;
    status?: number;
};
export type GetGameByIdResponse = GamesUseCaseBaseResponse & {
    game?: GameListViewModel;
};
export type GetGamesListResponse = GamesUseCaseBaseResponse & {
    gamesList?: GameViewModel[];
};

export const getGameById = async (
    gameId: string
): Promise<GetGameByIdResponse> => {
    const gamesServiceRes = await gamesService.getGameById(gameId);

    if (!gamesServiceRes.ok) {
        return {
            message: `Oops! An error occurred on get game "${gameId}".`,
            error: gamesServiceRes.error,
            status: 404
        };
    } else if (typeof gamesServiceRes.data === 'string')
        return { message: gamesServiceRes.data };
    else if (gamesServiceRes.data) return { game: gamesServiceRes.data };

    return {};
};
export const getGamesList = async (): Promise<GetGamesListResponse> => {
    const gamesServiceRes = await gamesService.getGamesList();

    if (!gamesServiceRes.ok) {
        return {
            message: 'Oops! An error occurred on get games list.',
            error: gamesServiceRes.error,
            status: 400
        };
    } else if (Array.isArray(gamesServiceRes.data))
        return {
            gamesList: gamesServiceRes.data
        };
    else if (typeof gamesServiceRes.data === 'string')
        return { message: gamesServiceRes.data };

    return {};
};
