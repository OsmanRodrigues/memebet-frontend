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

type TableColumnProps<Key = string> = { key: Key; label: string };
type TableProps = Pick<NXUTableProps, 'aria-label' | 'onRowAction'> &
    Pick<TableHeaderProps<TableColumnProps>, 'columns'> &
    Pick<TableBodyProps<any>, 'items' | 'emptyContent' | 'children'> & {
        autoSize?: boolean;
    };

export const TableRow = NXUTableRow;
export const TableCell = NXUTableCell;
export const Table = (props: TableProps) => {
    const classNames = props.autoSize
        ? {}
        : {
              base: 'max-h-[312px] overflow-auto',
              table: 'min-h-[296px]'
          };
    return (
        <NXUTable
            aria-label={props['aria-label']}
            onRowAction={props.onRowAction}
            classNames={classNames}
            selectionBehavior={props.onRowAction ? 'toggle' : undefined}
            selectionMode={props.onRowAction ? 'single' : undefined}
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
export const getColumns = (
    columnMap: Record<string, string>
): TableColumnProps[] => {
    const tableColumns = Object.keys(columnMap).map(key => ({
        key: key as keyof typeof columnMap,
        label: key.toUpperCase()
    }));

    return tableColumns;
};
export const mapStrongKey = (list?: string[]) => {
    if (!list || !list.length) return [];

    return list.map(item => ({ id: item, content: item }));
};
