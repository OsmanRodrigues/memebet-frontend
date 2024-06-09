import * as gamesService from '~/services/games/service';

import type { PlaceABetArgs } from '~/services/games/type';
import type { ActionUseCaseResponse } from '../shared-type';

export const submitPlaceABet = async (
    args: PlaceABetArgs
): Promise<ActionUseCaseResponse> => {
    const placeABetRes = await gamesService.placeABet(args);

    if (!placeABetRes.ok)
        return {
            ...placeABetRes,
            error:
                placeABetRes.error ?? 'An error occurried while place the bet.'
        };

    return {
        ok: placeABetRes.ok,
        transactionHash: placeABetRes.data?.transactionHash
    };
};
