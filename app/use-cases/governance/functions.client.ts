import { validateFormData } from './helpers';
import * as governanceService from '~/services/governance/service';
import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';

export const handleSubmitCreateValidationFunction = async (
    args: CreateValidationFunctionArgs
) => {
    validateFormData(args);

    const createValidationFunctionRes =
        await governanceService.createValidationFunction(args);

    if (!createValidationFunctionRes.ok)
        return {
            error:
                createValidationFunctionRes.error ??
                'An error occurried while create the function.'
        };

    return createValidationFunctionRes;
};
export const handleSubmitCreateGame = async (args: CreateGameArgs) => {
    validateFormData(args);

    const createGameRes = await governanceService.createGame({
        ...args,
        start: new Date(args.start).getTime(),
        end: new Date(args.end).getTime()
    });

    if (!createGameRes.ok)
        return {
            error:
                createGameRes.error ??
                'An error occurried while create the game.'
        };

    return createGameRes;
};
