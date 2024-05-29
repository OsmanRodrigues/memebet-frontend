import * as walletService from '~/services/wallet/service';
import * as governanceService from '~/services/governance/service';
import { WalletKey } from './constants';
import { getWalletCookie, walletCookieStore } from './cookies';

export type WalletData = {
    address?: string;
    ethBalance?: string;
    isDAOMember?: boolean;
};

export const getWallet = async (
    request?: Request,
    address?: string
): Promise<WalletData> => {
    const addressFallback =
        address ??
        (request ? (await getWalletCookie(request!))?.address : undefined);

    if (addressFallback) {
        const { balance } = await walletService.getEthBalance(addressFallback);
        const DAOMemberList = await governanceService.getDAOMembersList();
        const isDAOMember =
            !!DAOMemberList.length &&
            DAOMemberList.some(
                memberAddress => memberAddress === addressFallback
            );

        return { address, isDAOMember, ethBalance: balance };
    }

    return {
        address
    };
};

export const handleSubmitWalletAddress = async (request: Request) => {
    const walletCookie = await getWalletCookie(request);
    const formData = await request.formData();

    if (formData.has('logout')) {
        return {
            cookie: { address: undefined },
            serializedCookie:
                'wallet=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        };
    }

    const address = formData.get(WalletKey.address) as string;
    walletCookie.address = !address ? undefined : address;
    const serializedCookie = await walletCookieStore.serialize(walletCookie);

    return {
        cookie: walletCookie,
        serializedCookie: serializedCookie
    };
};
