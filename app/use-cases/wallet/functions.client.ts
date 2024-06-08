import * as walletService from '~/services/wallet/service';
import { validateSubmitTokenDepositData } from './validators';

import type { DepositTokenArgs } from '~/services/wallet/types';
import type { ActionUseCaseResponse } from '../shared-type';

export const handleSubmitTokenDeposit = async ({
    provider,
    signerAddress,
    ...data
}: DepositTokenArgs): Promise<ActionUseCaseResponse> => {
    const validationRes = await validateSubmitTokenDepositData(data);

    if (validationRes?.error) return { ok: false, ...validationRes };

    const depositTokenRes = await walletService.depositToken({
        signerAddress,
        provider,
        amount: data.amount
    });

    if (!depositTokenRes.ok)
        return {
            ok: false,
            error: depositTokenRes.error,
            message: 'An error occurred on deposit token.'
        };

    return {
        ok: true,
        transactionHash: depositTokenRes.data!.transactionHash
    };
};
