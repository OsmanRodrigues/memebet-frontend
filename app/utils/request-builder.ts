import { type Address, Tikua } from '@doiim/tikua';
import { transformHexToUTF8 } from './transformer';

export type RequestBuilderInitArgs = {
    abi: string[] | null;
    appAddress: Address | null;
    appEndpoint: string | null;
    provider: any | null;
    signerAddress: Address | null;
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

    async inspect<Result = any>(url?: string): Promise<Result> {
        const urlFallback = url ?? this._url;

        if (!urlFallback) throw new Error('An url must be provided.');

        const res = await fetch(urlFallback, { method: 'GET' });
        const resJSON = await res.json();
        const hexPayload = resJSON?.reports[0]?.payload;
        const payload = hexPayload
            ? JSON.parse(transformHexToUTF8(hexPayload))
            : {};

        return payload;
    }
    send(actionName: string, args?: string[]) {
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
                signerAddress: this.signerAddress
            });

            return this.requester.sendInput(actionName, args ?? []);
        } else {
            throw new Error(
                'At least one dapp address, one provider, one signer address and one abi must be provided.'
            );
        }
    }
}

export const requestBuilder = new RequestBuilderSingleton();
