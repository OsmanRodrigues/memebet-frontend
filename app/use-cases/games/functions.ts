import * as gamesService from '~/services/games/service';
import type { Game } from '~/services/games/type';

export type GameViewModel = Pick<
    Game,
    'id' | 'picks' | 'startTime' | 'endTime' | 'betPool'
>;
export type GetGamesListResponse = {
    gamesList?: GameViewModel[];
    message?: string;
    error?: any;
    status?: number;
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
