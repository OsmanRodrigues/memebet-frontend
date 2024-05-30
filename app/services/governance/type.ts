import type { RequestBuilderInitArgs } from '~/utils/request-builder';

export type CreateValidationFunctionArgs = Pick<
    RequestBuilderInitArgs,
    'provider' | 'signerAddress'
> & {
    functionName: string;
    functionCode: string;
};
export type CreateGameArgs = Pick<
    RequestBuilderInitArgs,
    'provider' | 'signerAddress'
> & {
    home: string;
    away: string;
    token: string;
    start: number;
    end: number;
    validatorFunctionName: string;
};
