import { json } from '@remix-run/node';
import * as governanceUseCase from '~/use-cases/governance/functions.server';
import * as governanceUseCaseClient from '~/use-cases/governance/functions.client';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import type { PreActionResponse } from '~/use-cases/governance/type';

export async function action({ request }: ActionFunctionArgs) {
    const preActionRes = await governanceUseCase.preAction(request);
    if (preActionRes.error)
        throw new Response(preActionRes.error, {
            status: preActionRes.status
        });

    return json(preActionRes);
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
    const serverRes = await serverAction<Required<PreActionResponse>>();
    const { formData, wallet } = serverRes;

    const { functionName, functionCode, ...leftovers } = formData;

    if (functionName && functionCode) {
        return await governanceUseCaseClient.handleSubmitCreateValidationFunction(
            {
                provider: window.ethereum,
                signerAddress: wallet.address!,
                functionName,
                functionCode
            }
        );
    } else {
        return await governanceUseCaseClient.handleSubmitCreateGame({
            provider: window.ethereum,
            signerAddress: wallet.address!,
            ...leftovers
        });
    }
}
