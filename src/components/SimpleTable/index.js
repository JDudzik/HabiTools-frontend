import { useMemo } from 'react';
import {
  Stack,
} from '@mui/material';
import { L } from 'components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ViewListIcon from '@mui/icons-material/ViewList';
import { LoadingElement } from '../LoadingElement';

// Note: To make this component fast, make sure the "rows" prop is memoized from the parent of this component.

const MemoizedBody = (props) => {
  const rows = useMemo(() => {
    return (
      <TableBody>
        {props.rows?.map?.(row => (
          <TableRow
            key={ row?.columns?.[0]?.key || row?.columns?.[0]?.element }
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: row?.onClick ? 'pointer' : 'default' }}
            hover={ !!row?.onClick }
            onClick={ row?.onClick }
          >
            {row?.columns?.[0] && (
              <TableCell component="th" scope="row">
                { row?.columns[0].element }
              </TableCell>
            )}
            {row?.columns?.slice(1).map?.(({ key, element }) => (
              <TableCell key={ key || element } align="right">{ element }</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }, [ props.rows ]);

  return (
    <>{ rows }</>
  );
};

export const SimpleTable = (props) => {
  const NoDataIcon = props?.noDataIcon || ViewListIcon;

  return (
    <Stack sx={ props.sx }>
      {(props?.title || props?.subtitle) && (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor={ props?.fillColor || 'primary.main' }
          border="0.5px solid"
          borderColor={ props?.fillColor || 'primary.main' }
          padding={ 1 }
          paddingX={ 2 }
          sx={{
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          }}
        >
          {props?.title && typeof props?.title === 'string' ? (
            <L.h2 color={ props?.textColor || 'text.white' } textAlign="center">{ props?.title }</L.h2>
          ) : (
            props?.title
          )}
          {props?.subtitle && typeof props?.subtitle === 'string' ? (
            <L.p color={ props?.textColor || 'text.white' } textAlign="center">{ props?.subtitle }</L.p>
          ) : (
            props?.subtitle
          )}
        </Stack>
      )}
      {props?.rows?.length > 0 && !props?.isLoading && (
        <TableContainer
          sx={{
            border: '0.5px solid',
            borderColor: props?.fillColor || 'primary.main',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
          }}
          component={ Paper }
        > 
          <Table
            size={ props?.size }
            aria-label="Table of items"
            sx={{ '& th': { px: { xxs: 1, hmd: 2 }}, '& td': { px: { xxs: 1, hmd: 2 }}}}
          >
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold' }}}>
                {props?.headers[0] && (
                  <TableCell>{ props?.headers[0] }</TableCell>
                )}
                {props?.headers?.slice(1).map?.(header => (
                  <TableCell key={ header } align="right">{ header }</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <MemoizedBody rows={ props?.rows } />
          </Table>
        </TableContainer>
      )}

      {props?.rows?.length <= 0 && !props?.isLoading && (
        <Stack
          component={ Paper }
          direction="row"
          alignItems="center"
          justifyContent="center"
          p={ 12 }
          sx={{
            border: '0.5px solid',
            borderColor: props?.fillColor || 'primary.main',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            position: 'relative',
          }}
        >
          <NoDataIcon
            sx={{
              color: 'text.offWhite',
              fontSize: '15rem',
              textAlign: 'center',
              mr: 1,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              opacity: 0.5,
            }}
          />
          <L.h2 textAlign="center" color="text.darkGrey" my={ 2 } zIndex="2" >
            { props?.noDataMessage || 'No data to display' }
          </L.h2>
        </Stack>
      )}

      {props?.isLoading && (
        <Stack
          component={ Paper }
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            border: '0.5px solid',
            borderColor: props?.fillColor || 'primary.main',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            position: 'relative',
            paddingY: 15,
          }}
        >
          <Stack sx={{ position: 'absolute', width: '100%', height: '100%' }}>
            <LoadingElement line height="100%" />
          </Stack>
          <LoadingElement circular size="7rem" thickness={ 4 } />
        </Stack>
      )}
      
    </Stack>
  );
};
