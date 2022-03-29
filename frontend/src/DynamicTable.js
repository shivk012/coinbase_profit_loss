import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

function DynamicTable(props) {
  console.log(props);
  // parse the output from the back end into a table
  /* expected data format:
    {
        "amount.currency":
            {"0":"ACH","1":"ADA","2":"ALGO"},
        "native_amount.amount":
            {"0":16.71,"1":160.2,"2":0.07},
        "Current Value":
            {"0":29.4048018955,"1":98.802128368,"2":101.932923662},
        "profit_loss":
            {"0":12.6948018955,"1":-61.397871632,"2":101.862923662}
    }
    */

  
  const data = props.data;
  if (data.length === 0) {
    return <div>No data</div>;
  }
  const headings = Object.keys(data);
  const table_headings = headings.map(heading => (
    <Th key={heading}>{heading}</Th>
  ));

  const columns = Object.values(data).map(Object.values);
  const rows = columns[0].map((_, colIndex) =>
    columns.map(row => row[colIndex])
  );
  const table_rows = rows.map((row, rowIndex) => (
    <Tr key={rowIndex}>
      {row.map((cell, cellIndex) => (
        <Td key={cellIndex}>{cell}</Td>
      ))}
    </Tr>
  ));
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>{table_headings}</Tr>
        </Thead>

        <Tbody>{table_rows}</Tbody>
      </Table>
    </TableContainer>
  );
}
export default DynamicTable;
