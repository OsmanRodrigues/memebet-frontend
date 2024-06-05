import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './enpoint';
import type { Game } from './type';

export const getGameById = (id: string) =>
    requestBuilder.url(endpoint.getGameById.getUrl(id)).inspect<Game>();
export const getGamesList = () =>
    requestBuilder.url(endpoint.getGamesList).inspect<Game[]>();
