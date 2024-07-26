import type { Game, PlaceABetArgs } from '~/services/games/type';

export type GameListViewModel = Pick<
    Game,
    'title' | 'id' | 'picks' | 'startTime' | 'endTime' | 'betPool'
>;
export type GameViewModel = Pick<
    Game,
    | 'title'
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
