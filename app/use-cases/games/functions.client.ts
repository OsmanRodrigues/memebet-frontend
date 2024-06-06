import * as gamesService from '~/services/games/service';
import { validateFormData } from '../governance/helpers';

import type { PlaceABetArgs } from '~/services/games/type';
import type { PlaceABetResponse } from './type';

export const submitPlaceABet = async (
    args: PlaceABetArgs
): Promise<PlaceABetResponse> => {
    validateFormData(args);

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
