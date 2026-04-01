import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { L } from 'components';


export const TitleControls = ({ activeTab, onCreate, disabled, showCreateButton = true }) => {
  return (
    <Stack
      direction={{ sm: 'column', hmd: 'row' }}
      justifyContent="center"
      alignItems="center"
      width="100%"
      position="relative"
    >
      <L.h3 color="text.white" textAlign="center">
        Groups & Permissions
      </L.h3>

      {showCreateButton && (
        <Button
          sx={{
            borderWidth: 2,
            position: { hmd: 'absolute' },
            right: 0,
            mt: { xxs: 2, xs: 0 },
          }}
          size="small"
          variant="contained"
          color="secondary"
          startIcon={ <AddIcon /> }
          disabled={ disabled }
          onClick={ () => onCreate() }
        >
          {activeTab === 'groups' ? 'Create Group' : 'Create Permission'}
        </Button>
      )}
    </Stack>
  );
};
