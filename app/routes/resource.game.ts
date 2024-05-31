import { json } from '@remix-run/node';
import { getWalletCookie } from '~/use-cases/wallet/cookies';
import {
    createGame,
    createValidationFunction
} from '~/services/governance/service';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { CreateGameFetcherData } from './games/create-game.section';

export async function action({ request }: ActionFunctionArgs) {
    const wallet = await getWalletCookie(request);

    if (wallet.address) {
        const formData = Object.fromEntries(await request.formData());

        return json({ wallet, formData });
    }

    throw new Response('User not authenticated!', {
        status: 401
    });
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
    try {
        const serverRes = await serverAction<{
            wallet: { address: string };
            formData: CreateGameFetcherData;
        }>();
        const { formData, wallet } = serverRes;
        await createValidationFunction({
            provider: window.ethereum,
            signerAddress: wallet.address,
            functionName: formData.functionName,
            functionCode: formData.functionCode
        });
        await createGame({
            provider: window.ethereum,
            signerAddress: wallet.address,
            home: formData.home,
            away: formData.away,
            token: formData.token,
            start: new Date(formData.start).getTime(),
            end: new Date(formData.end).getTime(),
            validatorFunctionName: formData.functionName
        });

        return json({ ok: true, status: 201 });
    } catch (err: any) {
        throw new Response(
            err.message ?? 'An error occurried while create a game.',
            {
                status: 500
            }
        );
    }
}
