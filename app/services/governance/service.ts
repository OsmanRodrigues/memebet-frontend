import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './endpoint';

export const getDAOMembersList = () =>
    requestBuilder.url(endpoint.listDAOMembers).inspect<string[]>();
