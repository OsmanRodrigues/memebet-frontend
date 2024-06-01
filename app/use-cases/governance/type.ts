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
