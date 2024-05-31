import { json } from '@remix-run/node';
import { getWalletCookie } from '~/use-cases/wallet/cookies';
import {
    createGame,
    createValidationFunction
} from '~/services/governance/service';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type {
    CreateFunctionFetcherData,
    CreateGameFetcherData
} from './games/create-game.section';

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
    const serverRes = await serverAction<{
        wallet: { address: string };
        formData: CreateFunctionFetcherData & CreateGameFetcherData;
    }>();
    const { formData, wallet } = serverRes;
    const validateFormData = (formData: Partial<typeof serverRes.formData>) => {
        if (Object.values(formData).some(value => !value))
            throw new Response(
                'Create form data must be filled with all required fields.',
                {
                    status: 500
                }
            );
    };
    const { functionName, functionCode, ...leftovers } = formData;

    if (functionName && functionCode) {
        const createValidationFunctionRes = await createValidationFunction({
            provider: window.ethereum,
            signerAddress: wallet.address,
            functionName: formData.functionName,
            functionCode: formData.functionCode
        });

        if (!createValidationFunctionRes.ok)
            throw new Response(
                createValidationFunctionRes.error ??
                    'An error occurried while create the function.',
                {
                    status: 500
                }
            );

        return createValidationFunctionRes;
    } else {
        validateFormData(leftovers);

        const createGameRes = await createGame({
            provider: window.ethereum,
            signerAddress: wallet.address,
            home: formData.home,
            away: formData.away,
            token: formData.token,
            start: new Date(formData.start).getTime(),
            end: new Date(formData.end).getTime(),
            validatorFunctionName: formData.validatorFunctionName
        });

        if (!createGameRes.ok)
            throw new Response(
                createGameRes.error ??
                    'An error occurried while create the game.',
                {
                    status: 500
                }
            );

        return createGameRes;
    }
}
