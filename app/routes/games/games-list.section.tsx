import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { SectionWrapper } from '~/components/wrapper/section';
import { Heading } from '~/components/typography/heading';
import { textShortener, getDateStr } from '~/utils';

import type { GetGamesListResponse } from '~/use-cases/games/functions';
import type { SectionWrapperProps } from '~/components/wrapper/section';

const gameTableColumnKey = {
    picks: 'picks',
    start: 'start',
    end: 'end',
    token: 'token',
    funds: 'funds'
};
const tableColumns = Object.keys(gameTableColumnKey).map(key => ({
    key,
    label: key.toUpperCase()
}));

export type GamesListSectionProps = Pick<SectionWrapperProps, 'isFirstOfPage'>;

export const GamesListSection = ({ isFirstOfPage }: GamesListSectionProps) => {
    const loaderData = useLoaderData<GetGamesListResponse>();
    const navigate = useNavigate();

    return (
        <SectionWrapper isFirstOfPage={isFirstOfPage}>
            <Heading>Available games</Heading>
            <Table
                classNames={{
                    base: 'max-h-[312px] overflow-auto',
                    table: 'min-h-[296px]'
                }}
                aria-label="Available games list"
                selectionBehavior="toggle"
                selectionMode="single"
                onRowAction={itemKey => navigate(`/game/${itemKey}`)}
                removeWrapper
                isHeaderSticky
            >
                <TableHeader columns={tableColumns}>
                    {column => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={loaderData.gamesList}
                    emptyContent={loaderData.message ?? 'No games available.'}
                >
                    {item => (
                        <TableRow key={item.id}>
                            {columnKey => {
                                const typedColumnKey =
                                    columnKey as keyof typeof gameTableColumnKey;

                                switch (typedColumnKey) {
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
                                }
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </SectionWrapper>
    );
};
