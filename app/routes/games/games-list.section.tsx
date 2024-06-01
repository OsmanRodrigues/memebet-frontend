import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';
import { useLoaderData } from '@remix-run/react';
import { SectionWrapper } from '~/components/section';
import { Heading } from '~/components/typography/heading';
import type { GetGamesListResponse } from '~/use-cases/games/functions';
import type { SectionWrapperProps } from '~/components/section';

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

    return (
        <SectionWrapper isFirstOfPage={isFirstOfPage}>
            <Heading>Available games</Heading>
            <Table removeWrapper aria-label="Example static collection table">
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
                                        const startDateFallback = Number.isNaN(
                                            +item.startTime
                                        )
                                            ? 'invalid date'
                                            : new Date(
                                                  +item.startTime
                                              ).toUTCString();
                                        return (
                                            <TableCell>
                                                {startDateFallback}
                                            </TableCell>
                                        );
                                    }
                                    case 'end': {
                                        const endDateFallback = Number.isNaN(
                                            +item.endTime
                                        )
                                            ? 'invalid date'
                                            : new Date(
                                                  +item.endTime
                                              ).toUTCString();
                                        return (
                                            <TableCell>
                                                {endDateFallback}
                                            </TableCell>
                                        );
                                    }
                                    case 'token':
                                        return (
                                            <TableCell>
                                                {item.betPool.tokenAddress}
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
