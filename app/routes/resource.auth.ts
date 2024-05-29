import { type ActionFunctionArgs, json } from '@remix-run/node';
import * as walletUseCase from '~/use-cases/wallet/functions';

export async function action({ request }: ActionFunctionArgs) {
    const { cookie, serializedCookie } =
        await walletUseCase.handleSubmitWalletAddress(request);

    return json(cookie, {
        headers: { 'Set-Cookie': serializedCookie }
    });
}
