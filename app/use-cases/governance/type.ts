import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';
import type { WalletData } from '../wallet';
import type { PlaceABet } from '../games/type';

export type CreateFunctionData = Omit<
    CreateValidationFunctionArgs,
    'signerAddress' | 'provider'
>;
export type CreateGameData = Omit<CreateGameArgs, 'signerAddress' | 'provider'>;
export type PreActionResponse = {
    wallet?: WalletData;
    formData?: CreateFunctionData & CreateGameData & PlaceABet;
    error?: string;
    status?: number;
};
