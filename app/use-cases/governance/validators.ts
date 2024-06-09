import { validateSchema } from '~/utils/validator';
import { setLocale, string } from 'yup';

import type { ValidationError } from 'yup';
import { CreateValidationFunctionArgs } from '~/services/governance/type';

setLocale({
    mixed: {
        default: 'data is invalid'
    },
    string: {
        min: '${path} must be ${min} in length',
        matches:
            '${path} be a whitespaced arrow function (eg.: "const myfn = (...) => ...") or a regular function statement'
    }
});

export const validateSubmitCreateValidationFunctionData = async (
    data: Pick<CreateValidationFunctionArgs, 'functionCode' | 'functionName'>
): Promise<{ error?: any; message?: string } | undefined> =>
    validateSchema(
        {
            functionName: string().min(4).required(),
            functionCode: string()
                .min(15)
                .matches(
                    /const\s[A-z]*\s=[\s\S]\([\sA-z0-9,:_]*\)\s=>|function/
                )
                .required()
        },
        data
    )
        .then(() => undefined)
        .catch((err: ValidationError) => ({
            error: err.name,
            message: `Invalid create function data: ${err.errors[0]}`
        }));
