import { forwardRef, useMemo } from 'react';
import {
  Stack,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';


const virtualTableElements = {
  TableContainer: ({ sx, fillColor, ...remProps }) => {
    return (
      <TableContainer
        sx={{
          border: '0.5px solid',
          borderColor: fillColor || 'primary.main',
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          ...sx,
        }}
        component={ Paper }
        { ...remProps }
      />
    );
  },
  Table: ({ sx, size, ...remProps }) => (
    <Table
      size={ size }
      aria-label="Table of items"
      sx={{
        borderCollapse: 'separate',
        tableLayout: 'fixed',
        '& th': { px: { xxs: 1, hmd: 2 }},
        '& td': { px: { xxs: 1, hmd: 2 }},
      }}
      { ...remProps }
    />
  ),
  TableHead: props => <TableHead { ...props } />,
  TableBody: props => <TableBody { ...props } />,
  TableBodyRow: (props) => {
    const row = props?.item;
    return (
      <TableRow
        sx={{ cursor: row?.onClick ? 'pointer' : 'default' }}
        hover={ !!row?.onClick }
        onClick={ row?.onClick }
        { ...props }
      />
    );
  },
};


const fixedHeaderContent = (props) => {
  return (
    <TableRow sx={{ '& th': { fontWeight: 'bold' }}}>
      {props?.headers?.map?.(header => (
        <TableCell
          key={ header?.key }
          sx={{ backgroundColor: 'white', width: header?.width }}
          variant="head"
          align={ header?.align || 'left' }
        >{ header?.label }</TableCell>
      ))}
    </TableRow>
  );
};


const rowContent = (_index, row ) => {
  return (
    <>
      {row?.columns.map(column => (
        <TableCell
          key={ column.key }
          align={ column?.align || 'left' }
        >
          { column.element }
        </TableCell>
      ))}
    </>
  );
};

// Note: To help eliminate confusion around each of these components, the mockup structure of this table will look like this:
// const ExampleTable = () => (
//   <TableContainer {/* AKA: Scroller */}>
//     <TableHead>
//       {fixedHeaderContent() => (
//         <TableRow>
//           { map of <TableCell />}
//         </TableRow>
//       )}
//     </TableHead>
//     <TableBody>
//       <TableBodyRow>
//         {rowContent() => (
//           { map of <TableCell />}
//         )}
//       </TableBodyRow>
//     </TableBody>
//   </TableContainer>
// );


export const VirtualizedTableBase = (props) => {
  const VirtuosoTableComponents = useMemo(() => {
    const TableComponents = {
      Scroller: forwardRef((innerProps, ref) => (
        <virtualTableElements.TableContainer
          sx={ props?.sx?.container }
          fillColor={ props?.fillColor }
          { ...innerProps }
          ref={ ref }
        />
      )),
      Table: innerProps => (
        <virtualTableElements.Table
          sx={ props?.sx?.table }
          size={ props?.size }
          { ...innerProps }
        />
      ),
      TableHead: forwardRef((innerProps, ref) => <virtualTableElements.TableHead { ...innerProps } ref={ ref } />),
      TableBody: forwardRef((innerProps, ref) => <virtualTableElements.TableBody { ...innerProps } ref={ ref } />),
      TableRow: forwardRef((innerProps, ref) => <virtualTableElements.TableBodyRow { ...innerProps } ref={ ref } />),
    };
    TableComponents.Scroller.displayName = 'VirtTableContainer';
    TableComponents.Table.displayName = 'VirtTable';
    TableComponents.TableHead.displayName = 'VirtTableHead';
    TableComponents.TableBody.displayName = 'VirtTableBody';
    TableComponents.TableRow.displayName = 'VirtTableBodyRow';
    return TableComponents;
  }, [ props?.fillColor, props?.size, props?.sx?.container, props?.sx?.table ]);


  return (
    <>
      <Stack sx={{ height: props?.height || '300px', width: '100%' }}>
        <TableVirtuoso
          data={ props?.rows }
          components={ VirtuosoTableComponents }
          fixedHeaderContent={ () => fixedHeaderContent({ headers: props?.headers }) }
          itemContent={ (index, row) => rowContent(index, row) }
        />
      </Stack>
    </>
  );
};