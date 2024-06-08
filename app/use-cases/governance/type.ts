import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';
import type { PlaceABet } from '../games/type';

export type CreateFunctionData = Omit<
    CreateValidationFunctionArgs,
    'signerAddress' | 'provider'
>;
export type CreateGameData = Omit<CreateGameArgs, 'signerAddress' | 'provider'>;
export type GovernanceFormData = CreateFunctionData &
    CreateGameData &
    PlaceABet;
