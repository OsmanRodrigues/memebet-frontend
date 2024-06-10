import { validateSchema } from '~/utils/validator';
import { number, setLocale, string } from 'yup';

import type { ValidationError } from 'yup';
import type { PlaceABetArgs } from '~/services/games/type';

setLocale({
    mixed: {
        default: 'data is invalid'
    },
    number: {
        integer: '${path} must be a integer',
        positive: '${path} must be positive'
    },
    string: {
        min: '${path} must be ${min} in length',
        matches: '${path} must be a 0x(...) token address'
    }
});

export const validateSubmitPlaceABetData = async (
    data: Pick<PlaceABetArgs, 'amount' | 'gameId' | 'pick' | 'token'>
): Promise<{ error?: any; message?: string } | undefined> =>
    validateSchema(
        {
            amount: number().integer().positive().min(1).required(),
            gameId: string().required(),
            pick: string().min(3).required(),
            token: string().min(3).matches(/^0x/).required()
        },
        data
    )
        .then(() => undefined)
        .catch((err: ValidationError) => ({
            error: err.name,
            message: `Invalid place a bet data: ${err.errors[0]}`
        }));
