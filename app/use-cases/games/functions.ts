import * as gamesService from '~/services/games/service';

export const getGamesList = async () => {
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
};
