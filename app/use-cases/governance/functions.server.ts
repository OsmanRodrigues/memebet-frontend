import { preActionWithAuth } from '../shared-helper';
import { getWallet } from '../wallet/functions.server';

import type { GovernanceFormData } from './type';

export const governancePreAction = async (request: Request) =>
    preActionWithAuth<GovernanceFormData>(request, getWallet);
