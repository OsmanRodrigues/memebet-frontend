const inspectBaseUrl = 'http://localhost:8080/inspect';

export const endpoint = {
    getBalance: {
        getUrl: (id: string) => `${inspectBaseUrl}/wallet/ether/${id}`
    }
};
