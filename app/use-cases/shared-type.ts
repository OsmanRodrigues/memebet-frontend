import type { RequestBuilderResponse } from '~/utils/request-builder';

export type ActionUseCaseResponse = Omit<RequestBuilderResponse, 'data'> & {
    transactionHash?: string;
};
