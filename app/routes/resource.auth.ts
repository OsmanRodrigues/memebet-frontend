import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    json
} from '@remix-run/node';
import * as walletUseCase from '~/use-cases/wallet/functions';

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
    let wallet: walletUseCase.WalletData | null = null;

    if (cookie.address) {
        wallet = await walletUseCase.getWallet(undefined, cookie.address);
    }

    const payloadFallback = wallet ?? cookie;

    return json(
        { ...payloadFallback, submitted: 'ok' },
        {
            headers: { 'Set-Cookie': serializedCookie }
        }
    );
}
