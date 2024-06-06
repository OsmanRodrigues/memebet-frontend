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
    | 'tokenAddress'
>;
type GamesUseCaseBaseResponse = {
    message?: string;
    error?: any;
    status?: number;
};
export type GetGameByIdResponse = GamesUseCaseBaseResponse & {
    game?: GameViewModel;
};
export type GetGamesListResponse = GamesUseCaseBaseResponse & {
    gamesList?: GameListViewModel[];
};

export const getGameById = async (
    gameId: string
): Promise<GetGameByIdResponse> => {
    const gamesServiceRes = await gamesService.getGameById(gameId);

    if (!gamesServiceRes.ok) {
        return {
            message: `Oops! An error occurred on get game "${gameId}".`,
            error: gamesServiceRes.error,
            status: 400
        };
    } else if (gamesServiceRes.message)
        return {
            message: gamesServiceRes.message,
            ...(gamesServiceRes.message.toLowerCase().includes('not found')
                ? {
                      status: 404,
                      error: gamesServiceRes.data
                  }
                : null)
        };
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
    else if (gamesServiceRes.message) return gamesServiceRes;

    return {};
};
