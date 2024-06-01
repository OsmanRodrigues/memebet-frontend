import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './enpoint';

export const getGamesList = () =>
    requestBuilder.url(endpoint.getGamesList).inspect();
