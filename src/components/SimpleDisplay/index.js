import {
  Stack,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

export const SimpleDisplay = (props) => {
  return (
    <>
      <Stack sx={ props.sx }>
        <Card sx={ props?.cardSx }>
          <CardHeader
            sx={{ pb: 0, ...props.headerSx }}
            subheaderTypographyProps={{ color: props.color || undefined }}
            subheader={ props.title }
            { ...props.headerProps }
          />
          <CardContent className={ props.sensitive ? 'sensitive' : '' } sx={{ pt: 0, ...props.contentSx }} { ...props.contentProps }>
            { props.children }
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};
