import { Button, Stack } from '@mui/material';


export const SubtitleControls = ({ activeTab, setActiveTab }) => {
  return (
    <Stack mt={ 2 } direction="row" spacing={ 1 } justifyContent="center" width="100%">
      <Button
        sx={{ borderRadius: 0 }}
        variant="contained"
        disabled={ activeTab === 'groups' }
        color="secondary"
        onClick={ () => setActiveTab('groups') }
      >Groups</Button>
      <Button
        sx={{ borderRadius: 0 }}
        variant="contained"
        disabled={ activeTab === 'permissions' }
        color="secondary"
        onClick={ () => setActiveTab('permissions') }
      >Permissions</Button>
    </Stack>
  );
};
