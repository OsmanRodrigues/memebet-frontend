import * as walletService from '~/services/wallet/service';
import * as governanceService from '~/services/governance/service';
import { WalletKey } from './constants';
import { getWalletCookie, walletCookieStore } from './cookies';
import { preActionWithAuth } from '../shared-helper';

import type { GetWalletResponse, WalletFormData } from './type';

export const getWallet = async (
    request?: Request,
    address?: string
): Promise<GetWalletResponse> => {
    const addressFallback =
        address ??
        (request ? (await getWalletCookie(request!))?.address : undefined);

    if (addressFallback) {
        const getBalanceRes =
            await walletService.getEthBalance(addressFallback);
        const getMembersRes = await governanceService.getDAOMembersList();

        if (!getBalanceRes.ok || !getMembersRes.ok)
            return {
                error:
                    (getBalanceRes.message || getBalanceRes.error) ??
                    (getMembersRes.message || getMembersRes.error)
            };

        const isDAOMember =
            !!getMembersRes.data?.length &&
            getMembersRes.data.some(
                memberAddress => memberAddress === addressFallback
            );

        return {
            isDAOMember,
            address: addressFallback,
            ethBalance: getBalanceRes.data?.balance
        };
    }

    return {
        address: addressFallback
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
export const walletPreAction = (request: Request) =>
    preActionWithAuth<WalletFormData>(request, getWallet);
