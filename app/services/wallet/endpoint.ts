import { inspectBaseUrl } from '../shared-constants';

export const endpoint = {
    getBalance: {
        getUrl: (address: string) => `${inspectBaseUrl}/wallet/ether/${address}`
    }
};
