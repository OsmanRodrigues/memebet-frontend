import {
    Table as NXUTable,
    TableBody as NXUTableBody,
    TableColumn as NXUTableColumn,
    TableHeader as NXUTableHeader,
    TableRow as NXUTableRow,
    TableCell as NXUTableCell
} from '@nextui-org/react';

import type {
    TableProps as NXUTableProps,
    TableHeaderProps,
    TableBodyProps
} from '@nextui-org/react';

type TableProps = Pick<NXUTableProps, 'aria-label' | 'onRowAction'> &
    Pick<TableHeaderProps<any>, 'columns'> &
    Pick<TableBodyProps<any>, 'items' | 'emptyContent' | 'children'>;

export const TableRow = NXUTableRow;
export const TableCell = NXUTableCell;
export const Table = (props: TableProps) => {
    return (
        <NXUTable
            aria-label={props['aria-label']}
            onRowAction={props.onRowAction}
            classNames={{
                base: 'max-h-[312px] overflow-auto',
                table: 'min-h-[296px]'
            }}
            selectionBehavior="toggle"
            selectionMode="single"
            removeWrapper
            isHeaderSticky
        >
            <NXUTableHeader columns={props.columns}>
                {column => (
                    <NXUTableColumn key={column.key}>
                        {column.label}
                    </NXUTableColumn>
                )}
            </NXUTableHeader>
            <NXUTableBody items={props.items} emptyContent={props.emptyContent}>
                {props.children}
            </NXUTableBody>
        </NXUTable>
    );
};
