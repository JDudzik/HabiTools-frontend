import {
  Button,
  Stack,
} from '@mui/material';
import { L } from 'components';


export const TitleControls = ({ text, disabled, acknowledgeAllMessages }) => {
  return (
    <Stack
      direction={{ sm: 'column', hmd: 'row' }}
      justifyContent="center"
      alignItems="center"
      width="100%"
      position="relative"
    >
      <L.h2 color="text.white" textAlign="center">{text}</L.h2>

      <Button
        sx={{
          borderWidth: 2,
          position: { hmd: 'absolute' },
          right: 0,
          mt: { xxs: 2, xs: 0 },
        }}
        size="small"
        disabled={ disabled }
        variant="contained"
        color="secondary"
        onClick={ () => acknowledgeAllMessages() }
      >Mark All as Read</Button>
    </Stack>

  );
};