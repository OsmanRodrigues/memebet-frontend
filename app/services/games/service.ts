import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './enpoint';
import type { Game } from './type';

export const getGamesList = () =>
    requestBuilder.url(endpoint.getGamesList).inspect<Game[]>();
