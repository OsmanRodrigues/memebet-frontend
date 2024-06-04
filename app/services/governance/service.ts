import { requestBuilder } from '~/utils/request-builder';
import { endpoint } from './endpoint';
import { advanceABI } from '../shared-constants';
import { transformUTF8toHex } from '~/utils/transformer';
import type { CreateGameArgs, CreateValidationFunctionArgs } from './type';

export const getDAOMembersList = () =>
    requestBuilder.url(endpoint.listDAOMembers).inspect<string[]>();
export const createValidationFunction = ({
    functionCode,
    functionName,
    provider,
    signerAddress
}: CreateValidationFunctionArgs) =>
    requestBuilder
        .config({ provider, signerAddress })
        .send(advanceABI.addValidationFunction.name, [
            transformUTF8toHex(functionName),
            transformUTF8toHex(functionCode)
        ]);

export const createGame = ({
    home,
    away,
    token,
    start,
    end,
    validatorFunctionName,
    provider,
    signerAddress
}: CreateGameArgs) =>
    requestBuilder
        .config({ provider, signerAddress })
        .send(advanceABI.createGame.name, [
            transformUTF8toHex(home),
            transformUTF8toHex(away),
            token,
            start,
            end,
            transformUTF8toHex(validatorFunctionName)
        ]);
