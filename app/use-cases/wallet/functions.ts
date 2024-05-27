import * as walletService from '~/services/wallet/service';
import { WalletKey } from './constants';
import { getWalletCookie, walletCookieStore } from './cookies';

export type WalletData = {
    address?: string;
    ethBalance?: string;
};

export const getWallet = async (request: Request): Promise<WalletData> => {
    const { address } = await getWalletCookie(request);

    if (address) {
        const { balance } = await walletService.getEthBalance(address);

        return { address, ethBalance: balance };
    }

    return {
        address
    };
};

export const handleSubmitWalletAddress = async (request: Request) => {
    const walletCookie = await getWalletCookie(request);
    const formData = await request.formData();
    const address = formData.get(WalletKey.address) as string;
    walletCookie.address = !address ? undefined : address;
    const serializedCookie = await walletCookieStore.serialize(walletCookie);

    return {
        cookie: walletCookie,
        serializedCookie: serializedCookie
    };
};
