import { validateSubmitCreateValidationFunctionData } from './validators';
import { validateFormData } from './helpers';
import * as governanceService from '~/services/governance/service';

import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';
import type { ActionUseCaseResponse } from '../shared-type';

export const handleSubmitCreateValidationFunction = async ({
    provider,
    signerAddress,
    ...args
}: CreateValidationFunctionArgs): Promise<ActionUseCaseResponse> => {
    const validationRes =
        await validateSubmitCreateValidationFunctionData(args);

    if (validationRes?.error)
        return {
            ok: false,
            error: validationRes.message ?? validationRes.error
        };

    const createValidationFunctionRes =
        await governanceService.createValidationFunction({
            signerAddress,
            provider,
            ...args
        });

    if (!createValidationFunctionRes.ok)
        return {
            ok: false,
            error:
                createValidationFunctionRes.error ??
                'An error occurried while create the function.'
        };

    return createValidationFunctionRes;
};
export const handleSubmitCreateGame = async (
    args: CreateGameArgs
): Promise<ActionUseCaseResponse> => {
    validateFormData(args);

    const createGameRes = await governanceService.createGame({
        ...args,
        start: new Date(args.start).getTime(),
        end: new Date(args.end).getTime()
    });

    if (!createGameRes.ok)
        return {
            ok: false,
            error:
                createGameRes.error ??
                'An error occurried while create the game.'
        };

    return createGameRes;
};
