import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    json
} from '@remix-run/node';
import * as walletUseCase from '~/use-cases/wallet/functions';

export async function loader({ request }: LoaderFunctionArgs) {
    const wallet = await walletUseCase.getWallet(request);

    return json(wallet);
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