import { Table, Thead, Tbody, Tr, Th, Td, chakra, Text } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useTable, useSortBy } from 'react-table';
import React, { useEffect, useState } from 'react';

function DynamicTable(props) {
    // parse the output from the back end into a table
    /* expected data format:

  const data = {
    columns: [
      { Header: 'Coin', accessor: 'Coin' },
      { Header: 'Number of Coins', accessor: 'Number of Coins' },
      { Header: 'Value in GBP', accessor: 'Value in GBP' },
      { Header: 'Profit in GBP', accessor: 'Profit in GBP' },
    ],
    output: [
      {
        'Coin': 'ACH',
        'Number of Coins': 1,
        'Value in GBP': 532,
        'Profit in GBP': 1,
      },
      {
        'Coin': 'ADA',
        'Number of Coins': 16,
        'Value in GBP': 99224,
        'Profit in GBP': -793506776,
      },
      {
        'Coin': 'ALGO',
        'Number of Coins': 0.05,
        'Value in GBP': 467975388,
        'Profit in GBP': 967975388,
      }
    ],
  };
    */

    const data = props.data;
    console.log(data)
    if (data.length===0) {
        return <Text>Loading...</Text>;
    }
    const columns = data.columns;
    const output = data.output;

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: output,
        },
        useSortBy
    );
    return (
        <Table {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th {...column.getHeaderProps(column.getSortByToggleProps())} isNumeric={column.isNumeric}>
                                {column.render("Header")}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                    {cell.render("Cell")}
                                </Td>
                            ))}
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
}
export default DynamicTable;
