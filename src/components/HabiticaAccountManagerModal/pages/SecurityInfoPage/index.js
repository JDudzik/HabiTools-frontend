import { Stack, Button } from '@mui/material';
import { MarkdownMui } from 'components';
import markdownHowWeSecure from 'lib/data/markdownHowWeSecure.md';


export const SecurityInfoPage = ({ onNavigate }) => {
  return (
    <Stack spacing={ 3 }>
      <MarkdownMui.Markdown>
        { markdownHowWeSecure }
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
