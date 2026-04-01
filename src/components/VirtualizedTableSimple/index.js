import {
  Stack,
} from '@mui/material';
import { L } from 'components';
import Paper from '@mui/material/Paper';
import ViewListIcon from '@mui/icons-material/ViewList';
import { LoadingElement } from '../LoadingElement';
import { VirtualizedTableBase } from '../VirtualizedTableBase';


export const VirtualizedTableSimple = (props) => {
  const NoDataIcon = props?.noDataIcon || ViewListIcon;

  return (
    <Stack width="100%">
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
            <L.h1 color={ props?.textColor || 'text.white' } textAlign="center">{ props?.title }</L.h1>
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
        <VirtualizedTableBase
          sx={ props?.sx }
          size={ props?.size }
          height={ props?.height }
          headers={ props?.headers }
          rows={ props?.rows }
        />
      )}

      {props?.rows?.length <= 0 && !props?.isLoading && (
        <Stack
          component={ Paper }
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            height: props?.height || '300px',
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
            height: props?.height || '300px',
            border: '0.5px solid',
            borderColor: props?.fillColor || 'primary.main',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            position: 'relative',
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