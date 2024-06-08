import { json } from '@remix-run/node';
import * as walletUseCaseServer from '~/use-cases/wallet/functions.server';
import * as walletUseCaseClient from '~/use-cases/wallet/functions.client';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type {
    GetWalletResponse,
    SubmitTokenDepositData
} from '~/use-cases/wallet/type';

type ServerActionResponse = {
    wallet: GetWalletResponse;
    formData: SubmitTokenDepositData;
};

export async function action({ request }: ActionFunctionArgs) {
    const useCaseRes = await walletUseCaseServer.walletPreAction(request);

    if (useCaseRes.error)
        throw new Response(useCaseRes.error, {
            status: useCaseRes.status ?? 500
        });

    return json(useCaseRes);
}

export async function clientAction({
    request,
    serverAction
}: ClientActionFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;

    if (searchParams.has('deposit')) {
        const serverActionRes = await serverAction<ServerActionResponse>();

        const { formData, wallet } = serverActionRes;

        const useCaseRes = await walletUseCaseClient.handleSubmitTokenDeposit({
            provider: window.ethereum,
            signerAddress: wallet.address!,
            amount: formData.amount
        });

        if (!useCaseRes.ok) return useCaseRes;

        return {
            ok: useCaseRes.ok,
            transactionHash: useCaseRes.transactionHash
        };
    }
}
