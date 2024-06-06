import type { Game, PlaceABetArgs } from '~/services/games/type';
import type { RequestBuilderResponse } from '~/utils';

export type GameListViewModel = Pick<
    Game,
    'id' | 'picks' | 'startTime' | 'endTime' | 'betPool'
>;
export type GameViewModel = Pick<
    Game,
    | 'id'
    | 'picks'
    | 'startTime'
    | 'endTime'
    | 'fees'
    | 'playerIds'
    | 'currentOdds'
    | 'tokenAddress'
>;
type GamesUseCaseBaseResponse = {
    message?: string;
    error?: any;
    status?: number;
};
export type GetGameByIdResponse = GamesUseCaseBaseResponse & {
    game?: GameViewModel;
};
export type GetGamesListResponse = GamesUseCaseBaseResponse & {
    gamesList?: GameListViewModel[];
};
export type PlaceABet = Omit<PlaceABetArgs, 'provider' | 'signerAddress'>;
export type PlaceABetResponse = Omit<RequestBuilderResponse, 'data'> & {
    transactionHash?: string;
};
