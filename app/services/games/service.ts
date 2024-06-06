import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './enpoint';
import { advanceABI } from '../shared-constants';
import { transformUTF8toHex } from '~/utils/transformer';

import type { Game, PlaceABetArgs } from './type';

export const getGameById = (id: string) =>
    requestBuilder.url(endpoint.getGameById.getUrl(id)).inspect<Game>();
export const getGamesList = () =>
    requestBuilder.url(endpoint.getGamesList).inspect<Game[]>();
export const placeABet = ({
    gameId,
    pick,
    token,
    amount,
    provider,
    signerAddress
}: PlaceABetArgs) =>
    requestBuilder
        .config({ provider, signerAddress })
        .send(advanceABI.placeBet.name, [
            transformUTF8toHex(gameId),
            transformUTF8toHex(pick),
            token,
            amount
        ]);
