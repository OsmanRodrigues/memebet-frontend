import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './endpoint';

import type { DepositTokenArgs, GetEtherBalanceResponse } from './types';

export const depositToken = ({
    amount,
    provider,
    signerAddress
}: DepositTokenArgs) =>
    requestBuilder.config({ provider, signerAddress }).depositToken(amount);
export const getEthBalance = (walletAddress: string) =>
    requestBuilder
        .url(endpoint.getBalance.getUrl(walletAddress))
        .inspect<GetEtherBalanceResponse>();
