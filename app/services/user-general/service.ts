import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './endpoint';
import type { GetBalanceResponse } from './types';

export const getBalance = (userAccountId: string) =>
    requestBuilder
        .url(endpoint.getBalance.getUrl(userAccountId))
        .inspect<GetBalanceResponse>();
