import type { RequestBuilderInitArgs } from '~/utils/request-builder';

//TODO better typing 'unknown' typed properties below
export type GameLinkedWallet = {
    [key: string]: {
        ether: string;
        erc20: unknown;
        erc721: unknown;
        erc1155: unknown;
    };
};
export type Game = {
    id: number;
    picks: [string, string];
    currentOdds: [string, string][];
    playerIds: string[];
    playersBets: unknown;
    fees: number;
    startTime: string;
    endTime: string;
    verifyFun: {
        _function: number;
        checkers: unknown;
    };
    betPool: {
        poolAddress: string;
        tokenAddress: string;
        fundsLocked: string;
        picksBets: unknown;
        effectiveBets: unknown;
        wallet: {
            wallets: GameLinkedWallet;
        };
    };
    wallet: {
        wallets: GameLinkedWallet;
    };
    tokenAddress?: string;
};
export type PlaceABetArgs = Pick<
    RequestBuilderInitArgs,
    'provider' | 'signerAddress'
> & {
    gameId: string;
    pick: string;
    token: string;
    amount: number;
};
