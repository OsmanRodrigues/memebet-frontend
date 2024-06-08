import type { GetWalletResponse } from './wallet/type';

export const preActionWithAuth = async <FormData = any>(
    request: Request,
    walletHandler: (
        request?: Request,
        address?: string
    ) => Promise<GetWalletResponse>
): Promise<{
    wallet?: GetWalletResponse;
    formData?: FormData;
    error?: any;
    status?: number;
}> => {
    const wallet = await walletHandler(request);

    if (wallet.address) {
        const formData = Object.fromEntries(await request.formData());
        return { wallet, formData: formData as any };
    }

    return { error: 'User not authenticated!', status: 401 };
};
