import { useLoaderData, useNavigate } from '@remix-run/react';
import { SectionWrapper } from '~/components/wrapper/section';
import { Heading } from '~/components/typography/heading';
import { Table, TableCell, TableRow, getColumns } from '~/components/table';
import { textShortener, getDateStr } from '~/utils';

import type {
    GameListViewModel,
    GetGamesListResponse
} from '~/use-cases/games/type';
import type { SectionWrapperProps } from '~/components/wrapper/section';

const tableColumns = getColumns({
    picks: 'picks',
    start: 'start',
    end: 'end',
    token: 'token',
    funds: 'funds'
});

export type GamesListSectionProps = Pick<SectionWrapperProps, 'isFirstOfPage'>;

export const GamesListSection = ({ isFirstOfPage }: GamesListSectionProps) => {
    const loaderData = useLoaderData<GetGamesListResponse>();
    const navigate = useNavigate();

    return (
        <SectionWrapper isFirstOfPage={isFirstOfPage}>
            <Heading>Available games</Heading>
            <Table
                aria-label="Available games list"
                onRowAction={itemKey => navigate(`/game/${itemKey}`)}
                columns={tableColumns}
                items={loaderData.gamesList}
                emptyContent={loaderData.message ?? 'No games available.'}
            >
                {(item: GameListViewModel) => (
                    <TableRow key={item.id}>
                        {columnKey => {
                            switch (columnKey) {
                                case 'picks':
                                    return (
                                        <TableCell>
                                            {`${item.picks[0]} vs ${item.picks[1]}`}
                                        </TableCell>
                                    );
                                case 'start': {
                                    return (
                                        <TableCell>
                                            {getDateStr(item.startTime)}
                                        </TableCell>
                                    );
                                }
                                case 'end': {
                                    return (
                                        <TableCell>
                                            {getDateStr(item.endTime)}
                                        </TableCell>
                                    );
                                }
                                case 'token':
                                    return (
                                        <TableCell>
                                            {textShortener(
                                                item.betPool.tokenAddress
                                            )}
                                        </TableCell>
                                    );
                                case 'funds':
                                    return (
                                        <TableCell>
                                            {item.betPool.fundsLocked}
                                        </TableCell>
                                    );
                                default:
                                    return <TableCell>empty</TableCell>;
                            }
                        }}
                    </TableRow>
                )}
            </Table>
        </SectionWrapper>
    );
};
