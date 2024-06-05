import { inspectBaseUrl } from '../shared-constants';

export const endpoint = {
    getGameById: {
        getUrl: (id: string) => `${inspectBaseUrl}/games/getGame/${id}`
    },
    getGamesList: `${inspectBaseUrl}/games/currentGames`
};
