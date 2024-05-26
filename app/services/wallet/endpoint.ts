const inspectBaseUrl = 'http://localhost:8080/inspect';

export const endpoint = {
    getBalance: {
        getUrl: (address: string) => `${inspectBaseUrl}/wallet/ether/${address}`
    }
};
