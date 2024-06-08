import { json } from '@remix-run/node';
import * as walletUseCaseServer from '~/use-cases/wallet/functions.server';
import * as walletUseCaseClient from '~/use-cases/wallet/functions.client';
import { HttpStatus } from '~/utils/http';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type {
    GetWalletResponse,
    SubmitTokenDepositData
} from '~/use-cases/wallet/type';

type ServerActionResponse = {
    wallet: GetWalletResponse;
    formData: SubmitTokenDepositData;
    status?: number;
};

export async function action({ request }: ActionFunctionArgs) {
    if (new URL(request.url).searchParams.has('reset'))
        return json({ status: HttpStatus.ResetContent }); //HTTP RESET STATUS

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
    const serverActionRes = await serverAction<ServerActionResponse>();

    if (serverActionRes.status === HttpStatus.ResetContent) return {};

    const searchParams = new URL(request.url).searchParams;

    if (searchParams.has('deposit')) {
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

    return null;
}
