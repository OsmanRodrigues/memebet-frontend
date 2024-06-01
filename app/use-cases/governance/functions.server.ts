import { getWalletCookie } from '../wallet/cookies';
import type { PreActionResponse } from './type';

export const preAction = async (
    request: Request
): Promise<PreActionResponse> => {
    const wallet = await getWalletCookie(request);

    if (wallet.address) {
        const formData = Object.fromEntries(await request.formData());
        return { wallet, formData: formData as any };
    }

    return { error: 'User not authenticated!', status: 401 };
};
