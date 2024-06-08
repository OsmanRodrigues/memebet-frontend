import { validateSchema } from '~/utils/validator';
import { number, setLocale } from 'yup';

import type { SubmitTokenDepositData } from './type';
import type { ValidationError } from 'yup';

setLocale({
    mixed: {
        default: 'data is invalid'
    },
    number: {
        integer: '${path} must be a integer',
        positive: '${path} must be positive'
    }
});

export const validateSubmitTokenDepositData = async (
    data: SubmitTokenDepositData
): Promise<{ error?: any; message?: string } | undefined> =>
    validateSchema(
        {
            amount: number().integer().positive().required()
        },
        data
    )
        .then(() => undefined)
        .catch((err: ValidationError) => ({
            error: err.name,
            message: `Invalid token deposit data: ${err.errors[0]}`
        }));
