import { json } from '@remix-run/node';
import * as governanceUseCase from '~/use-cases/governance/functions.server';
import * as governanceUseCaseClient from '~/use-cases/governance/functions.client';
import * as gameUseCaseCliente from '~/use-cases/games/functions.client';
import { HttpStatus } from '~/utils/http';

import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { GovernanceFormData } from '~/use-cases/governance/type';
import type { GetWalletResponse } from '~/use-cases/wallet/type';

type ServerActionResponse = {
    wallet?: GetWalletResponse;
    formData?: GovernanceFormData;
    status?: number;
};

export async function action({ request }: ActionFunctionArgs) {
    if (new URL(request.url).searchParams.has('reset'))
        return json({ status: HttpStatus.ResetContent }); //HTTP RESET STATUS

    const preActionRes = await governanceUseCase.governancePreAction(request);

    if (preActionRes.error)
        throw new Response(preActionRes.error, {
            status: preActionRes.status
        });

    return json(preActionRes);
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
    const serverRes = await serverAction<ServerActionResponse>();

    if (serverRes.status === HttpStatus.ResetContent) return {};

    const { formData, wallet } = serverRes;

    if (formData && wallet) {
        const {
            functionName,
            functionCode,
            gameId,
            validatorFunctionName,
            ...leftovers
        } = formData;

        if (wallet.isDAOMember && functionName && functionCode) {
            return await governanceUseCaseClient.handleSubmitCreateValidationFunction(
                {
                    provider: window.ethereum,
                    signerAddress: wallet.address!,
                    functionName,
                    functionCode
                }
            );
        } else if (wallet.isDAOMember && validatorFunctionName) {
            return {
                ...(await governanceUseCaseClient.handleSubmitCreateGame({
                    provider: window.ethereum,
                    signerAddress: wallet.address!,
                    validatorFunctionName,
                    ...leftovers
                })),
                refetch: true
            };
        } else if (gameId) {
            return await gameUseCaseCliente.submitPlaceABet({
                provider: window.ethereum,
                signerAddress: wallet.address!,
                gameId,
                ...leftovers
            });
        }
    }

    return {
        ok: false,
        error: 'Neither wallet nor formData were provided.'
    };
}
