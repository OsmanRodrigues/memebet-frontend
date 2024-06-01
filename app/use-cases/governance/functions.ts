import { getWalletCookie } from '../wallet/cookies';
import { validateFormData } from './helpers';
import * as governanceService from '~/services/governance/service';
import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';

export type CreateFunctionData = Omit<
    CreateValidationFunctionArgs,
    'signerAddress' | 'provider'
>;
export type CreateGameData = Omit<CreateGameArgs, 'signerAddress' | 'provider'>;

export type PreActionResponse = {
    wallet?: { address?: string };
    formData?: CreateFunctionData & CreateGameData;
    error?: string;
    status?: number;
};

export const preAction = async (
    request: Request
): Promise<PreActionResponse> => {
    const wallet = await getWalletCookie(request);

    if (wallet.address) {
        const formData = Object.fromEntries(await request.formData());
        return { wallet, formData: formData as any };
    }

    return { error: 'User not authenticated!', status: 401 };
};
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
export const handleSubmitCreateGameFunction = async (args: CreateGameArgs) => {
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
