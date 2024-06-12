import { validateSchema } from '~/utils/validator';
import { number, setLocale, string } from 'yup';

import type { ValidationError } from 'yup';
import type {
    CreateValidationFunctionArgs,
    CreateGameArgs
} from '~/services/governance/type';

const functionNameSize = 4;

export const validateSubmitCreateValidationFunctionData = async (
    data: Pick<CreateValidationFunctionArgs, 'functionCode' | 'functionName'>
): Promise<{ error?: any; message?: string } | undefined> => {
    setLocale({
        mixed: {
            default: 'data is invalid'
        },
        string: {
            min: '${path} must be ${min} in length',
            matches:
                '${path} must be an arrow function | anonymous function (eg.: "const myfn = (...) => ...|(...) =>...") or a regular function statement'
        }
    });

    return validateSchema(
        {
            functionName: string().min(functionNameSize).required(),
            functionCode: string()
                .min(15)
                .matches(
                    /((const\s[A-z0-9_]+\s{0,1}=\s{0,1}){0,1}\([\sA-z0-9,:_.]*\)\s{0,1}=>|function)/
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
};
export const validateSubmitCreateGameData = async (
    data: Pick<
        CreateGameArgs,
        'away' | 'end' | 'home' | 'start' | 'token' | 'validatorFunctionName'
    >
): Promise<{ error?: any; message?: string } | undefined> => {
    setLocale({
        mixed: {
            default: 'data is invalid'
        },
        string: {
            min: '${path} must be ${min} in length',
            matches: '${path} must be a 0x(...) token address'
        },
        number: {
            min: ({ path }) =>
                path === 'end'
                    ? `the ${path} must be a future date and time than the start.`
                    : `the ${path} must be a future date and time than now.`
        }
    });

    return validateSchema(
        {
            away: string().min(3).required(),
            end: number().integer().min(data.start).required(),
            home: string().min(3).required(),
            start: number().integer().min(Date.now()).required(),
            token: string().min(3).matches(/^0x/).required(),
            validatorFunctionName: string().min(functionNameSize).required()
        },
        data
    )
        .then(() => undefined)
        .catch((err: ValidationError) => ({
            error: err.name,
            message: `Invalid create game data: ${err.errors[0]}`
        }));
};
