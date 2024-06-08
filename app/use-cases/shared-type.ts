import type { RequestBuilderResponse } from '~/utils/request-builder';

export type UseCaseResponse = Omit<RequestBuilderResponse, 'data'> & {
    transactionHash?: string;
};
