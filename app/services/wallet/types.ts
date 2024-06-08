import type { RequestBuilderInitArgs } from '~/utils/request-builder';

export type DepositTokenArgs = Pick<
    RequestBuilderInitArgs,
    'provider' | 'signerAddress'
> & {
    amount: bigint;
};
export type GetEtherBalanceResponse = {
    balance: string;
};
