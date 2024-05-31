import { type Address, Tikua } from '@doiim/tikua';
import { transformHexToUTF8 } from './transformer';
import { advanceABIMap, dappAddress } from '~/services/shared-constants';
import { logError, logSuccess } from './logger';

export type RequestBuilderInitArgs = {
    abi: string[] | null;
    appAddress: Address | null;
    appEndpoint: string | null;
    provider: typeof window.ethereum | null;
    signerAddress: string | null;
};
export type RequestBuilderResponse<Data = any, Error = any> = {
    ok: boolean;
    error?: Error;
    data?: Data;
};

class RequestBuilderSingleton {
    private requester: Tikua | null = null;

    private abi: RequestBuilderInitArgs['abi'] = null;
    private appAddress: RequestBuilderInitArgs['appAddress'] = null;
    private appEndpoint: RequestBuilderInitArgs['appEndpoint'] = null;
    private provider: RequestBuilderInitArgs['provider'] = null;
    private signerAddress: RequestBuilderInitArgs['signerAddress'] = null;

    private _url: string | null = null;

    config(args: Partial<RequestBuilderInitArgs>, overwrite?: boolean) {
        (Object.keys(args) as (keyof typeof args)[]).forEach(prop => {
            if (overwrite) this[prop] = args[prop];
            else if (!this[prop]) this[prop] = args[prop];
        });

        return this;
    }

    url(url: string) {
        this._url = url;
        return this;
    }

    async inspect<Result = any>(
        url?: string
    ): Promise<RequestBuilderResponse<Result>> {
        try {
            const urlFallback = url ?? this._url;

            if (!urlFallback) throw new Error('An url must be provided.');

            const res = await fetch(urlFallback, { method: 'GET' });
            const resJSON = await res.json();
            const hexPayload = resJSON?.reports[0]?.payload;
            const payload = hexPayload
                ? JSON.parse(transformHexToUTF8(hexPayload))
                : {};

            return { ok: true, data: payload };
        } catch (err: any) {
            throw { ok: false, error: err.message ?? err };
        }
    }
    async send<Result = any>(
        actionName: string,
        args?: (string | number)[]
    ): Promise<RequestBuilderResponse<Result>> {
        try {
            if (
                this.abi?.length &&
                this.appAddress &&
                this.provider &&
                this.signerAddress
            ) {
                this.requester = new Tikua({
                    abi: this.abi,
                    appAddress: this.appAddress,
                    provider: this.provider,
                    signerAddress: this.signerAddress as Address
                });
                const transactionHash = await this.requester.sendInput(
                    actionName,
                    args ?? []
                );

                logSuccess(
                    `Input sent successfully!-> transaction hash:${transactionHash} | ${new Date().toISOString()}`
                );

                return { ok: true };
            } else {
                throw new Error(
                    'At least one dapp address, one provider, one signer address and one abi must be provided.'
                );
            }
        } catch (err: any) {
            logError(`Error on sent input-> ${err.message ?? String(err)}`);

            throw { ok: false, error: err.message ?? err };
        }
    }
}

const requestBuilder = new RequestBuilderSingleton();
requestBuilder.config({
    appAddress: dappAddress,
    abi: advanceABIMap
});

export { requestBuilder };
