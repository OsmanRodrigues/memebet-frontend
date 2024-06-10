import * as gamesService from '~/services/games/service';
import { validateSubmitPlaceABetData } from './validators';

import type { PlaceABetArgs } from '~/services/games/type';
import type { ActionUseCaseResponse } from '../shared-type';

export const submitPlaceABet = async ({
    provider,
    signerAddress,
    ...args
}: PlaceABetArgs): Promise<ActionUseCaseResponse> => {
    const validationRes = await validateSubmitPlaceABetData(args);

    if (validationRes?.error)
        return {
            ok: false,
            error: validationRes.message ?? validationRes.error
        };

    const placeABetRes = await gamesService.placeABet({
        signerAddress,
        provider,
        ...args
    });

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
