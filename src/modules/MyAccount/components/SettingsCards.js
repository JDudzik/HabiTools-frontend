import {
  Stack,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, L } from 'components';


export const SettingsCards = (props) => {
  const { accountSettingPages } = props;

  return (
    <Stack spacing={ 2 }>
      {accountSettingPages.map(setting => (
        <Card
          key={ setting.title }
          variant="outlined"
          sx={{
            borderColor: setting.isDangerous ? 'warning.light' : 'divider',
          }}
        >
          <CardContent>
            <Stack
              spacing={ 1.5 }
              direction={{ xss: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xss: 'flex-start', sm: 'center' }}
            >
              <Stack spacing={ 1 }>
                <Stack direction="row" spacing={ 1 } alignItems="center" flexWrap="wrap">
                  <L.h5 color={ setting.isDangerous ? 'warning.dark' : 'primary' }>
                    { setting.title }
                  </L.h5>
                </Stack>
                <L.p color="text.secondary">
                  { setting.description }
                </L.p>
              </Stack>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            { setting?.href ? (
              <Link href={ setting.href }>
                <Button
                  variant={ setting.isDangerous ? 'outlined' : 'contained' }
                  color={ setting.isDangerous ? 'warning' : 'primary' }
                  endIcon={ <ArrowForwardIcon /> }
                  { ...(setting?.buttonProps || {}) }
                >{ setting?.buttonProps?.label || 'Edit' }</Button>
              </Link>
            ) : (
              <Button
                variant={ setting.isDangerous ? 'outlined' : 'contained' }
                color={ setting.isDangerous ? 'warning' : 'primary' }
                endIcon={ <ArrowForwardIcon /> }
                { ...(setting?.buttonProps || {}) }
              >{ setting?.buttonProps?.label || 'Edit' }</Button>
            )}
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
};