import { Table as DefaultTable } from "@radix-ui/themes";
import { ReactNode } from "react";
import { styled } from "styled-components";

interface IColumn {
  key: string;
  label: ReactNode;
}

interface ITable {
  columns: IColumn[];
  children?: ReactNode;
}

export const TableCell = styled(DefaultTable.Cell)<{ maxwidth?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${(props) => props.maxwidth}px;
`;

export const TableRowHeaderCell = styled(DefaultTable.RowHeaderCell)<{
  maxwidth?: number;
}>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${(props) => props.maxwidth}px;
`;

export default function Table(props: ITable) {
  return (
    <>
      <DefaultTable.Root>
        <DefaultTable.Header>
          <DefaultTable.Row>
            {props.columns.map((column) => (
              <DefaultTable.ColumnHeaderCell key={column.key}>
                {column.label}
              </DefaultTable.ColumnHeaderCell>
            ))}
          </DefaultTable.Row>
        </DefaultTable.Header>
        <DefaultTable.Body>{props.children}</DefaultTable.Body>
      </DefaultTable.Root>
    </>
  );
}
