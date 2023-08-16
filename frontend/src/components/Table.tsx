import { Table as DefaultTable } from "@radix-ui/themes";
import { ReactNode } from "react";
import { styled } from "styled-components";
import Loading from "./Loading";

interface IColumn {
  key: string;
  label: ReactNode;
}

interface ITable {
  columns: IColumn[];
  children?: ReactNode;
  isLoading?: boolean;
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
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
      {props.isLoading && (
        <Wrapper>
          <Loading visible={props.isLoading}>加载中</Loading>
        </Wrapper>
      )}
    </>
  );
}
