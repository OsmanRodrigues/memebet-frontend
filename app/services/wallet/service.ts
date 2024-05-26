import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './endpoint';
import type { GetEtherBalanceResponse } from './types';

export const getEthBalance = (walletAddress: string) =>
    requestBuilder
        .url(endpoint.getBalance.getUrl(walletAddress))
        .inspect<GetEtherBalanceResponse>();
