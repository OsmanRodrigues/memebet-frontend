import * as gamesService from '~/services/games/service';
import { validateFormData } from '../governance/helpers';

import type { PlaceABetArgs } from '~/services/games/type';

export const submitPlaceABet = async (args: PlaceABetArgs) => {
    validateFormData(args);

    const placeABetRes = await gamesService.placeABet(args);

    if (!placeABetRes.ok)
        return {
            error:
                placeABetRes.error ?? 'An error occurried while place the bet.'
        };

    return placeABetRes;
};
