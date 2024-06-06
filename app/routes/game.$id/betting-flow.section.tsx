import { Card, CardBody, CardHeader } from '@nextui-org/react';
import {
    Table,
    TableCell,
    TableRow,
    getColumns,
    mapStrongKey
} from '~/components/table';
import { Heading } from '~/components/typography/heading';
import { SectionWrapper } from '~/components/wrapper/section';

import type { GameViewModel } from '~/use-cases/games/functions';

const tableColumns = getColumns({ 'current bettors': 'current bettors' });

export const BettingFlowSection = (
    props: Pick<GameViewModel, 'currentOdds' | 'playerIds'>
) => {
    const pick1 = props.currentOdds[0];
    const pick2 = props.currentOdds[1];

    return (
        <SectionWrapper>
            <Heading>Betting flow</Heading>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="sm"
            >
                <CardHeader className="flex flex-col items-start">
                    <Heading as="h3">Current odds</Heading>
                    <div>
                        <span>{pick1[0]} </span>
                        <span className="font-bold">{`(${pick1[1]})`}</span>
                        <span> vs </span>
                        <span className="font-bold">{`(${pick2[1]})`}</span>
                        <span> {pick2[0]}</span>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table
                        aria-label="Available games list"
                        columns={tableColumns}
                        items={mapStrongKey(props.playerIds)}
                        emptyContent={'No current bettors.'}
                        autoSize={props.playerIds?.length < 15}
                    >
                        {item => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.content}</TableCell>
                                </TableRow>
                            );
                        }}
                    </Table>
                </CardBody>
            </Card>
        </SectionWrapper>
    );
};
