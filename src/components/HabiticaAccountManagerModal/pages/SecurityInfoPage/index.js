import { Stack, Button } from '@mui/material';
import { MarkdownMui } from 'components';
import howWeSecure from 'lib/data/howWeSecure.md';


export const SecurityInfoPage = ({ onNavigate }) => {
  return (
    <Stack spacing={ 3 }>
      <MarkdownMui.Markdown>
        { howWeSecure }
      </MarkdownMui.Markdown>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-start">
        <Button
          variant="outlined"
          onClick={ () => onNavigate() }
        >
          Back
        </Button>
      </Stack>
    </Stack>
  );
};
