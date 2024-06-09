import { json } from '@remix-run/node';
import * as walletUseCase from '~/use-cases/wallet/functions.server';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { WalletData } from '~/use-cases/wallet/type';

export async function loader({ request }: LoaderFunctionArgs) {
    const getWalletRes = await walletUseCase.getWallet(request);

    if (getWalletRes.error)
        throw new Response(
            `An error occurred on try authenticate user: ${getWalletRes.error}`,
            {
                status: 500
            }
        );

    return json(getWalletRes);
}

export async function action({ request }: ActionFunctionArgs) {
    const { cookie, serializedCookie } =
        await walletUseCase.handleSubmitWalletAddress(request);
    let wallet: (WalletData & { error?: any }) | null = null;

    if (cookie.address) {
        wallet = await walletUseCase.getWallet(undefined, cookie.address);
    }

    if (wallet?.error)
        throw new Response(wallet.error, {
            status: 500
        });

    const payloadFallback = wallet ?? cookie;

    return json(
        { ...payloadFallback, submitted: 'ok' },
        {
            headers: { 'Set-Cookie': serializedCookie }
        }
    );
}
