import { json } from '@remix-run/node';
import * as governanceUseCase from '~/use-cases/governance/functions';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';

export async function action({ request }: ActionFunctionArgs) {
    const preActionRes = await governanceUseCase.preAction(request);

    if (preActionRes.error)
        throw new Response(preActionRes.error, {
            status: preActionRes.status
        });

    return json(preActionRes);
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
    const serverRes =
        await serverAction<Required<governanceUseCase.PreActionResponse>>();
    const { formData, wallet } = serverRes;

    const { functionName, functionCode, ...leftovers } = formData;

    if (functionName && functionCode) {
        return await governanceUseCase.handleSubmitCreateValidationFunction({
            provider: window.ethereum,
            signerAddress: wallet.address!,
            functionName,
            functionCode
        });
    } else {
        return await governanceUseCase.handleSubmitCreateGameFunction({
            provider: window.ethereum,
            signerAddress: wallet.address!,
            ...leftovers
        });
    }
}
